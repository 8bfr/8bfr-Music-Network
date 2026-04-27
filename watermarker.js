/* watermarker.js — 8BFR client-side beat watermarker (v2)
 * Direct buffer-level mixing (more reliable than OfflineAudioContext)
 */
(function () {
  'use strict';

  var TAG_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co/storage/v1/object/public/audio/watermark/8bfr-tag.mp3';
  var DEFAULT_OPTS = {
    interval: 30,
    tagVolume: 1.0,     // 0-1: max voice tag volume
    duckLevel: 0.45,    // beat drops to 15% during tag (very aggressive duck)
    tagBoost: 1.0,      // amplify the voice tag itself by 60% (with clipping protection)
    fadeMs: 150,
    bitrate: 192,
    firstTagAt: 8.0,      // first tag earlier
    onProgress: null
  };

  function fileToArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsArrayBuffer(file);
    });
  }

  function urlToArrayBuffer(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Failed to load tag: HTTP ' + r.status);
      return r.arrayBuffer();
    });
  }

  function decode(ctx, buf) {
    return new Promise(function (resolve, reject) {
      ctx.decodeAudioData(buf.slice(0), resolve, reject);
    });
  }

  /**
   * Direct buffer mixing — copies beat samples to output, then ADDS tag samples
   * at each insertion point with fade in/out.
   */
  function mixBuffersDirect(beatBuffer, tagBuffer, opts, onProgress) {
    var sampleRate = beatBuffer.sampleRate;
    var numChannels = Math.min(beatBuffer.numberOfChannels, 2);
    var totalSamples = beatBuffer.length;

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    var tempCtx = new AudioCtx();
    var output = tempCtx.createBuffer(numChannels, totalSamples, sampleRate);
    tempCtx.close();

    // Copy beat to output at full volume
    for (var ch = 0; ch < numChannels; ch++) {
      var srcCh = ch < beatBuffer.numberOfChannels ? ch : 0;
      output.getChannelData(ch).set(beatBuffer.getChannelData(srcCh));
    }

    if (onProgress) onProgress(35);

    // Mix tag at each insertion point
    var tagSamples = tagBuffer.length;
    var tagDuration = tagBuffer.duration;
    var fadeSamples = Math.floor((opts.fadeMs / 1000) * sampleRate);
    if (fadeSamples > tagSamples / 2) fadeSamples = Math.floor(tagSamples / 2);

    var insertSec = opts.firstTagAt;
    var insertions = 0;

    while (insertSec + tagDuration < beatBuffer.duration) {
      var insertSample = Math.floor(insertSec * sampleRate);

      for (var c = 0; c < numChannels; c++) {
        var outData = output.getChannelData(c);
        var tagSrcCh = c < tagBuffer.numberOfChannels ? c : 0;
        var tagData = tagBuffer.getChannelData(tagSrcCh);

        for (var i = 0; i < tagSamples; i++) {
          var outIdx = insertSample + i;
          if (outIdx >= totalSamples) break;

          // Tag fade envelope (0 -> tagVolume -> 0) with boost
          var tagEnv = opts.tagVolume * (opts.tagBoost || 1.0);
          if (i < fadeSamples) {
            tagEnv *= (i / fadeSamples);
          } else if (i > tagSamples - fadeSamples) {
            tagEnv *= ((tagSamples - i) / fadeSamples);
          }

          // Duck the beat dramatically during tag
          var beatGain = 1.0;
          var duckTarget = opts.duckLevel;
          if (i < fadeSamples) {
            beatGain = 1.0 - ((1.0 - duckTarget) * (i / fadeSamples));
          } else if (i > tagSamples - fadeSamples) {
            beatGain = duckTarget + ((1.0 - duckTarget) * ((fadeSamples - (tagSamples - i)) / fadeSamples));
          } else {
            beatGain = duckTarget;
          }

          var mixed = (outData[outIdx] * beatGain) + (tagData[i] * tagEnv);
          if (mixed > 1) mixed = 1;
          if (mixed < -1) mixed = -1;
          outData[outIdx] = mixed;
        }
      }

      insertions++;
      insertSec += opts.interval;
    }

    if (onProgress) onProgress(50);
    console.log('[watermarker] mixed', insertions, 'tags into', beatBuffer.duration.toFixed(1) + 's beat');
    return output;
  }

  function encodeMp3(audioBuffer, bitrate, onProgress) {
    if (typeof lamejs === 'undefined') {
      throw new Error('lamejs not loaded');
    }

    var sampleRate = audioBuffer.sampleRate;
    var numChannels = Math.min(audioBuffer.numberOfChannels, 2);
    var encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitrate);

    var leftChannel = audioBuffer.getChannelData(0);
    var rightChannel = numChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;
    var totalLength = leftChannel.length;
    var blockSize = 1152;
    var mp3Data = [];

    function f32ToI16(buffer) {
      var int16 = new Int16Array(buffer.length);
      for (var i = 0; i < buffer.length; i++) {
        var s = Math.max(-1, Math.min(1, buffer[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return int16;
    }

    var leftInt = f32ToI16(leftChannel);
    var rightInt = numChannels > 1 ? f32ToI16(rightChannel) : leftInt;

    for (var offset = 0; offset < totalLength; offset += blockSize) {
      var leftChunk = leftInt.subarray(offset, offset + blockSize);
      var rightChunk = rightInt.subarray(offset, offset + blockSize);
      var mp3buf;
      if (numChannels === 1) {
        mp3buf = encoder.encodeBuffer(leftChunk);
      } else {
        mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
      }
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
      if (onProgress && offset % (blockSize * 100) === 0) {
        onProgress(50 + Math.floor((offset / totalLength) * 45));
      }
    }

    var endBuf = encoder.flush();
    if (endBuf.length > 0) mp3Data.push(endBuf);

    return new Blob(mp3Data, { type: 'audio/mpeg' });
  }

  async function watermarkBeat(beatFile, opts) {
    opts = Object.assign({}, DEFAULT_OPTS, opts || {});
    var report = function (pct) {
      if (typeof opts.onProgress === 'function') opts.onProgress(pct);
    };

    report(5);

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported');
    var decodeCtx = new AudioCtx();

    report(10);

    var beatBufRaw, tagBufRaw;
    try {
      var pair = await Promise.all([
        fileToArrayBuffer(beatFile),
        urlToArrayBuffer(TAG_URL)
      ]);
      beatBufRaw = pair[0];
      tagBufRaw = pair[1];
    } catch (e) {
      decodeCtx.close();
      throw new Error('Could not load audio files: ' + e.message);
    }

    report(20);

    var beatBuffer, tagBuffer;
    try {
      beatBuffer = await decode(decodeCtx, beatBufRaw);
      tagBuffer = await decode(decodeCtx, tagBufRaw);
    } catch (e) {
      decodeCtx.close();
      throw new Error('Could not decode audio: ' + e.message);
    }

    decodeCtx.close();

    console.log('[watermarker] beat:', beatBuffer.duration.toFixed(1) + 's,',
                beatBuffer.numberOfChannels + 'ch,', beatBuffer.sampleRate + 'Hz');
    console.log('[watermarker] tag:', tagBuffer.duration.toFixed(1) + 's,',
                tagBuffer.numberOfChannels + 'ch,', tagBuffer.sampleRate + 'Hz');

    report(30);
    var mixed = mixBuffersDirect(beatBuffer, tagBuffer, opts, report);
    report(55);

    var blob = encodeMp3(mixed, opts.bitrate, report);
    report(100);
    console.log('[watermarker] done, output:', (blob.size / 1024).toFixed(0) + 'KB');
    return blob;
  }

  function tagCount(beatDurationSec, opts) {
    opts = Object.assign({}, DEFAULT_OPTS, opts || {});
    if (beatDurationSec <= opts.firstTagAt) return 0;
    return Math.floor((beatDurationSec - opts.firstTagAt) / opts.interval) + 1;
  }

  window.WM = {
    watermarkBeat: watermarkBeat,
    tagCount: tagCount,
    TAG_URL: TAG_URL,
    setTagUrl: function (newUrl) { TAG_URL = newUrl; }
  };

  console.log('[watermarker v2] ready');
})();

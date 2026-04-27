/* watermarker.js — 8BFR client-side beat watermarker
 *
 * Uses Web Audio API to mix a cached voice tag onto an uploaded beat
 * at regular intervals. Outputs MP3 (via lamejs) ready for upload.
 *
 * Usage in profile.html:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js"></script>
 *   <script src="watermarker.js" defer></script>
 *
 *   var beatFile = inputElement.files[0];
 *   var watermarked = await window.WM.watermarkBeat(beatFile, {
 *     interval: 30,    // tag every 30 seconds
 *     tagVolume: 0.55, // 55% volume
 *     onProgress: function(pct) { console.log(pct + '%'); }
 *   });
 *   // watermarked is a Blob you can upload to Supabase
 */

(function () {
  'use strict';

  var TAG_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co/storage/v1/object/public/audio/watermark/8bfr-tag.mp3';
  var DEFAULT_OPTS = {
    interval: 30,        // seconds between tags
    tagVolume: 0.55,     // 0-1, voice tag volume
    fadeMs: 150,         // fade in/out per tag to avoid pops
    bitrate: 192,        // MP3 output bitrate (kbps)
    firstTagAt: 12,      // first tag appears after this many seconds
    onProgress: null     // callback(percent)
  };

  // ─── HELPERS ───────────────────────────────────────────────────

  function fileToArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsArrayBuffer(file);
    });
  }

  function urlToArrayBuffer(url) {
    return fetch(url, { cache: 'force-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load tag: ' + r.status);
        return r.arrayBuffer();
      });
  }

  function decode(ctx, buf) {
    return new Promise(function (resolve, reject) {
      ctx.decodeAudioData(buf, resolve, reject);
    });
  }

  // Apply fade-in / fade-out envelope to AudioBuffer in place
  function applyFade(audioBuffer, fadeSec, sampleRate) {
    var fadeSamples = Math.floor(fadeSec * sampleRate);
    var totalSamples = audioBuffer.length;
    if (fadeSamples * 2 >= totalSamples) fadeSamples = Math.floor(totalSamples / 2);

    for (var ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      var data = audioBuffer.getChannelData(ch);
      // Fade in
      for (var i = 0; i < fadeSamples; i++) {
        data[i] *= (i / fadeSamples);
      }
      // Fade out
      for (var j = 0; j < fadeSamples; j++) {
        var idx = totalSamples - 1 - j;
        if (idx >= 0) data[idx] *= (j / fadeSamples);
      }
    }
  }

  // Mix tag onto beat: returns new AudioBuffer
  function mixBuffers(beatBuffer, tagBuffer, opts) {
    var sampleRate = beatBuffer.sampleRate;
    var numChannels = beatBuffer.numberOfChannels;
    var totalSamples = beatBuffer.length;
    var beatDurationSec = beatBuffer.duration;

    // Create empty output buffer same size as beat
    var ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      numChannels, totalSamples, sampleRate
    );

    // 1. Add the beat at full volume
    var beatSrc = ctx.createBufferSource();
    beatSrc.buffer = beatBuffer;
    beatSrc.connect(ctx.destination);
    beatSrc.start(0);

    // 2. Add the voice tag at intervals
    var tagDuration = tagBuffer.duration;
    var t = opts.firstTagAt;

    while (t + tagDuration < beatDurationSec) {
      var tagSrc = ctx.createBufferSource();
      tagSrc.buffer = tagBuffer;

      var gain = ctx.createGain();
      gain.gain.value = opts.tagVolume;

      // Fade in/out for this tag instance to prevent clicks
      var fadeSec = opts.fadeMs / 1000;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(opts.tagVolume, t + fadeSec);
      gain.gain.setValueAtTime(opts.tagVolume, t + tagDuration - fadeSec);
      gain.gain.linearRampToValueAtTime(0, t + tagDuration);

      tagSrc.connect(gain);
      gain.connect(ctx.destination);
      tagSrc.start(t);

      t += opts.interval;
    }

    return ctx.startRendering();
  }

  // Encode AudioBuffer to MP3 Blob using lamejs
  function encodeMp3(audioBuffer, bitrate, onProgress) {
    if (typeof lamejs === 'undefined') {
      throw new Error('lamejs not loaded - include <script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js"></script>');
    }

    var sampleRate = audioBuffer.sampleRate;
    var numChannels = Math.min(audioBuffer.numberOfChannels, 2); // MP3 supports max 2 channels
    var encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitrate);

    var leftChannel = audioBuffer.getChannelData(0);
    var rightChannel = numChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

    var totalLength = leftChannel.length;
    var blockSize = 1152; // standard MP3 frame size
    var mp3Data = [];

    // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
    function float32ToInt16(buffer) {
      var int16 = new Int16Array(buffer.length);
      for (var i = 0; i < buffer.length; i++) {
        var s = Math.max(-1, Math.min(1, buffer[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return int16;
    }

    var leftInt = float32ToInt16(leftChannel);
    var rightInt = numChannels > 1 ? float32ToInt16(rightChannel) : leftInt;

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
      if (onProgress && offset % (blockSize * 50) === 0) {
        onProgress(50 + Math.floor((offset / totalLength) * 45));
      }
    }

    var endBuf = encoder.flush();
    if (endBuf.length > 0) mp3Data.push(endBuf);

    return new Blob(mp3Data, { type: 'audio/mp3' });
  }

  // ─── PUBLIC API ────────────────────────────────────────────────

  /**
   * Watermark a beat audio file with the cached "8 B F R" voice tag.
   * @param {File|Blob} beatFile  The user's uploaded beat
   * @param {Object} [opts]       Options (interval, tagVolume, onProgress, etc.)
   * @returns {Promise<Blob>}     MP3 blob ready to upload
   */
  async function watermarkBeat(beatFile, opts) {
    opts = Object.assign({}, DEFAULT_OPTS, opts || {});
    var report = function (pct) {
      if (typeof opts.onProgress === 'function') opts.onProgress(pct);
    };

    report(5);

    // 1. Create audio context for decoding
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported in this browser');
    var decodeCtx = new AudioCtx();

    // 2. Load both files in parallel
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
      throw new Error('Could not load audio files: ' + e.message);
    }

    report(25);

    // 3. Decode both
    var beatBuffer, tagBuffer;
    try {
      var decoded = await Promise.all([
        decode(decodeCtx, beatBufRaw),
        decode(decodeCtx, tagBufRaw.slice(0)) // .slice copies because decode consumes
      ]);
      beatBuffer = decoded[0];
      tagBuffer = decoded[1];
    } catch (e) {
      throw new Error('Could not decode audio: ' + e.message);
    }

    decodeCtx.close();
    report(45);

    // 4. Mix
    var mixed = await mixBuffers(beatBuffer, tagBuffer, opts);
    report(50);

    // 5. Encode to MP3
    var blob = encodeMp3(mixed, opts.bitrate, report);
    report(100);

    return blob;
  }

  /**
   * Count how many tag insertions a beat will receive (for UI preview).
   */
  function tagCount(beatDurationSec, opts) {
    opts = Object.assign({}, DEFAULT_OPTS, opts || {});
    if (beatDurationSec <= opts.firstTagAt) return 0;
    return Math.floor((beatDurationSec - opts.firstTagAt) / opts.interval) + 1;
  }

  // Expose globally
  window.WM = {
    watermarkBeat: watermarkBeat,
    tagCount: tagCount,
    TAG_URL: TAG_URL,
    setTagUrl: function (newUrl) { TAG_URL = newUrl; }
  };

  console.log('[watermarker] ready - call window.WM.watermarkBeat(file, opts)');
})();

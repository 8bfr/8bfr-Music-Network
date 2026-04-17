// ═══════════════════════════════════════════════════════
// 8BFR PERSISTENT RADIO PLAYER (mini bar, survives navigation)
// ═══════════════════════════════════════════════════════
// Loads on every page (via scripts.js include). Uses sessionStorage
// to save playback state before unload and resume on next page.
//
// Usage from any page:
//   window.Radio.play(song)           - song = {id,title,artist,song_url,cover_art}
//   window.Radio.playQueue([s1,s2,s3], startIndex)
//   window.Radio.pause()
//   window.Radio.next() / prev()
//   window.Radio.stop()               - closes the bar
// ═══════════════════════════════════════════════════════

(function(){
  if (window.Radio) return; // Don't double-init

  var STATE_KEY = '8bfr_radio_state_v1';

  // Hide on pages where a mini player would conflict with full-screen UI
  var HIDE_ON = ['/feed.html','/chat.html','/dm.html','/story-viewer.html','/story-upload.html','/game-','/kids-games.html'];
  var path = (location.pathname || '').toLowerCase();
  for (var i = 0; i < HIDE_ON.length; i++) {
    if (path.indexOf(HIDE_ON[i]) !== -1) return;
  }

  // ────────── STATE ──────────
  var state = {
    queue: [],        // array of song objects
    index: 0,         // current index in queue
    position: 0,      // seconds into current track
    playing: false,
    volume: 1,
    shuffle: false,
    loop: false
  };

  // Load saved state from sessionStorage
  try {
    var saved = sessionStorage.getItem(STATE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        state.queue = Array.isArray(parsed.queue) ? parsed.queue : [];
        state.index = typeof parsed.index === 'number' ? parsed.index : 0;
        state.position = typeof parsed.position === 'number' ? parsed.position : 0;
        state.playing = !!parsed.playing;
        state.volume = typeof parsed.volume === 'number' ? parsed.volume : 1;
        state.shuffle = !!parsed.shuffle;
        state.loop = !!parsed.loop;
      }
    }
  } catch(e) {}

  function saveState() {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({
        queue: state.queue,
        index: state.index,
        position: audio ? audio.currentTime : state.position,
        playing: audio ? !audio.paused : state.playing,
        volume: audio ? audio.volume : state.volume,
        shuffle: state.shuffle,
        loop: state.loop
      }));
    } catch(e) {}
  }

  // ────────── BUILD UI ──────────
  var audio = null;
  var bar = null;

  function buildUI() {
    // Styles
    var style = document.createElement('style');
    style.textContent = '' +
      '#radioMiniBar{position:fixed;bottom:0;left:0;right:0;height:62px;background:rgba(12,6,24,0.97);backdrop-filter:blur(12px);border-top:1px solid rgba(124,58,237,0.5);display:none;align-items:center;gap:10px;padding:0 12px;z-index:9990;box-shadow:0 -4px 20px rgba(0,0,0,0.5);font-family:system-ui,-apple-system,sans-serif;}' +
      '#radioMiniBar.show{display:flex;}' +
      '#radioMiniBar.expanded{height:auto;min-height:62px;flex-wrap:wrap;}' +
      '#rmCover{width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;}' +
      '#rmCover img{width:100%;height:100%;object-fit:cover;}' +
      '#rmInfo{flex:1;min-width:0;cursor:pointer;}' +
      '#rmTitle{font-size:0.85rem;font-weight:700;color:#eae6ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '#rmArtist{font-size:0.72rem;color:#a855f7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.rm-btn{background:none;border:none;color:#eae6ff;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:background 0.15s;flex-shrink:0;}' +
      '.rm-btn:hover{background:rgba(124,58,237,0.2);}' +
      '.rm-btn.primary{background:#a855f7;color:#fff;}' +
      '.rm-btn.primary:hover{background:#9333ea;}' +
      '#rmClose{color:rgba(234,230,255,0.4);font-size:1.1rem;}' +
      '#rmProgress{position:absolute;top:0;left:0;right:0;height:3px;background:rgba(124,58,237,0.2);cursor:pointer;}' +
      '#rmProgressBar{height:100%;background:linear-gradient(90deg,#7c3aed,#a855f7);width:0%;transition:width 0.15s linear;}' +
      '@media(max-width:480px){#rmInfo{font-size:0.8rem;}.rm-btn.extra{display:none;}}' +
      '/* Add bottom padding to body so content isn\'t hidden behind bar */' +
      'body.radio-bar-visible{padding-bottom:62px!important;}';
    document.head.appendChild(style);

    // HTML
    bar = document.createElement('div');
    bar.id = 'radioMiniBar';
    bar.innerHTML =
      '<div id="rmProgress"><div id="rmProgressBar"></div></div>' +
      '<div id="rmCover" title="Open radio">🎵</div>' +
      '<div id="rmInfo" title="Open radio">' +
        '<div id="rmTitle">Nothing playing</div>' +
        '<div id="rmArtist">—</div>' +
      '</div>' +
      '<button class="rm-btn extra" id="rmPrev" title="Previous">⏮</button>' +
      '<button class="rm-btn primary" id="rmPlay" title="Play/Pause">▶</button>' +
      '<button class="rm-btn" id="rmNext" title="Next">⏭</button>' +
      '<button class="rm-btn" id="rmClose" title="Close player">✕</button>';
    document.body.appendChild(bar);

    // Hidden audio element
    audio = document.createElement('audio');
    audio.id = 'radioAudio';
    audio.preload = 'metadata';
    audio.style.display = 'none';
    document.body.appendChild(audio);

    // Wire events
    document.getElementById('rmPlay').onclick = togglePlay;
    document.getElementById('rmNext').onclick = next;
    document.getElementById('rmPrev').onclick = prev;
    document.getElementById('rmClose').onclick = stop;
    document.getElementById('rmCover').onclick = function(){ location.href='radio.html'; };
    document.getElementById('rmInfo').onclick = function(){ location.href='radio.html'; };
    document.getElementById('rmProgress').onclick = function(e){
      if (!audio.duration) return;
      var rect = this.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    };

    audio.addEventListener('timeupdate', function(){
      if (audio.duration) {
        document.getElementById('rmProgressBar').style.width = ((audio.currentTime/audio.duration)*100) + '%';
      }
      // Save state every few seconds so navigation picks up where we left off
      if (Math.floor(audio.currentTime) % 3 === 0) saveState();
    });
    audio.addEventListener('ended', function(){
      if (state.loop) { audio.currentTime = 0; audio.play(); }
      else next();
    });
    audio.addEventListener('play', function(){
      state.playing = true;
      document.getElementById('rmPlay').textContent = '❚❚';
      saveState();
    });
    audio.addEventListener('pause', function(){
      state.playing = false;
      document.getElementById('rmPlay').textContent = '▶';
      saveState();
    });

    // Save on navigation
    window.addEventListener('beforeunload', saveState);
    window.addEventListener('pagehide', saveState);
  }

  // ────────── PLAYBACK ──────────
  function render() {
    if (!bar) return;
    var song = state.queue[state.index];
    if (!song) {
      bar.classList.remove('show');
      document.body.classList.remove('radio-bar-visible');
      return;
    }
    bar.classList.add('show');
    document.body.classList.add('radio-bar-visible');

    // Cover
    var coverEl = document.getElementById('rmCover');
    var coverUrl = song.cover_art || song.cover_url;
    if (coverUrl) {
      coverEl.innerHTML = '<img src="'+coverUrl+'" alt="" onerror="this.outerHTML=\'🎵\';">';
    } else {
      coverEl.innerHTML = '🎵';
    }

    document.getElementById('rmTitle').textContent = song.title || 'Untitled';
    document.getElementById('rmArtist').textContent = song.artist || 'Unknown';
    document.getElementById('rmPlay').textContent = state.playing ? '❚❚' : '▶';
  }

  function loadCurrent(autoplay) {
    var song = state.queue[state.index];
    if (!song || !audio) return;
    var url = song.song_url || song.audio_url || song.url;
    if (!url) return;

    // Only reload src if it's a different track
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
      // Restore position if we have one (e.g. resumed from previous page)
      audio.addEventListener('loadedmetadata', function onMeta(){
        audio.removeEventListener('loadedmetadata', onMeta);
        if (state.position > 0 && state.position < (audio.duration || 1e9)) {
          audio.currentTime = state.position;
        }
        if (autoplay || state.playing) {
          var p = audio.play();
          if (p && p.catch) p.catch(function(){}); // ignore autoplay-denied
        }
      });
    }
    render();
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src) loadCurrent(true);
      else { var p = audio.play(); if (p && p.catch) p.catch(function(){}); }
    } else {
      audio.pause();
    }
  }

  function next() {
    if (!state.queue.length) return;
    if (state.shuffle) {
      state.index = Math.floor(Math.random() * state.queue.length);
    } else {
      state.index = (state.index + 1) % state.queue.length;
    }
    state.position = 0;
    loadCurrent(true);
    saveState();
  }

  function prev() {
    if (!state.queue.length) return;
    // If >3s into current track, restart it instead of going back
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    state.index = (state.index - 1 + state.queue.length) % state.queue.length;
    state.position = 0;
    loadCurrent(true);
    saveState();
  }

  function stop() {
    if (audio) { audio.pause(); audio.src=''; }
    state.queue = [];
    state.index = 0;
    state.position = 0;
    state.playing = false;
    saveState();
    if (bar) {
      bar.classList.remove('show');
      document.body.classList.remove('radio-bar-visible');
    }
  }

  // ────────── PUBLIC API ──────────
  window.Radio = {
    play: function(song) {
      if (!song) return;
      state.queue = [song];
      state.index = 0;
      state.position = 0;
      loadCurrent(true);
      saveState();
    },
    playQueue: function(songs, startIndex) {
      if (!Array.isArray(songs) || !songs.length) return;
      state.queue = songs;
      state.index = Math.max(0, Math.min(startIndex || 0, songs.length - 1));
      state.position = 0;
      loadCurrent(true);
      saveState();
    },
    pause: function(){ if (audio) audio.pause(); },
    resume: function(){ if (audio) { var p = audio.play(); if (p && p.catch) p.catch(function(){});} },
    toggle: togglePlay,
    next: next,
    prev: prev,
    stop: stop,
    toggleShuffle: function(){ state.shuffle = !state.shuffle; saveState(); return state.shuffle; },
    toggleLoop: function(){ state.loop = !state.loop; saveState(); return state.loop; },
    getState: function(){ return JSON.parse(JSON.stringify(state)); },
    isPlaying: function(){ return audio && !audio.paused; }
  };

  // ────────── INIT ──────────
  function init() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    buildUI();
    // Restore session: if there was a queue, load it (don't autoplay — browsers block it on cold navigation)
    if (state.queue.length) {
      loadCurrent(state.playing);
    }
  }
  init();
})();

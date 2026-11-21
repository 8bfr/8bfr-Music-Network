// =======================================================
// 8BFR EXPLICIT LYRICS AGE WARNING
// =======================================================
// Before a song flagged explicit can play, the listener
// sees a warning and must confirm they are 18 or older
// (8bfr.com membership is 18+ only). The agreement is
// remembered for the rest of the browser session
// (sessionStorage), so a member confirms once per
// session, not once per song. Non-explicit songs are
// never interrupted.
//
// EDIT THE WARNING WORDING HERE: title, body text and
// button labels all live in the TEXT object below.
//
// Player code uses it like this:
//   window.ExplicitGate.guard(song, function(){ play(); });
//   window.ExplicitGate.requireAgreement(onAgree, onCancel);
//   window.ExplicitGate.isAgreed();
//
// Native <audio controls> elements are covered on their
// own when the element carries data-explicit="1" (the
// song-list renderers add that attribute for explicit
// songs): the gate pauses the element the instant
// playback starts and only lets it continue after the
// listener confirms. The shared radio player
// (radio-player.js) calls guard() itself, so its audio
// element does not need the attribute.
// =======================================================

(function(){
  if (window.ExplicitGate) return; // Don't double-init

  var AGREE_KEY = '8bfr_explicit_agreed_v1';

  // ---- Warning wording (edit here) ----
  var TEXT = {
    title: 'Explicit Lyrics Warning',
    body: 'This song contains explicit lyrics. Please confirm that you are 18 years of age or older to listen.',
    agree: 'I am 18 or older - Play',
    cancel: 'Cancel'
  };

  function isAgreed() {
    try { return sessionStorage.getItem(AGREE_KEY) === '1'; } catch(e) { return false; }
  }

  function setAgreed() {
    try { sessionStorage.setItem(AGREE_KEY, '1'); } catch(e) {}
  }

  // ---- Dialog ----
  var pending = []; // [{ok:fn, no:fn}] waiting on the dialog
  var overlay = null;

  function buildUI() {
    if (overlay) return;
    var style = document.createElement('style');
    style.textContent = '' +
      '#explicitGateOverlay{position:fixed;inset:0;background:rgba(5,2,12,0.82);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;z-index:99999;padding:1rem;font-family:system-ui,-apple-system,sans-serif;}' +
      '#explicitGateOverlay.show{display:flex;}' +
      '#explicitGateBox{background:rgba(12,6,24,0.98);border:1px solid rgba(168,85,247,0.55);border-radius:14px;max-width:420px;width:100%;padding:1.5rem;box-shadow:0 12px 40px rgba(0,0,0,0.6);text-align:center;}' +
      '#explicitGateTitle{font-size:1.15rem;font-weight:800;color:#eae6ff;margin:0 0 0.6rem 0;}' +
      '#explicitGateBody{font-size:0.92rem;line-height:1.5;color:rgba(234,230,255,0.85);margin:0 0 1.25rem 0;}' +
      '#explicitGateBtns{display:flex;gap:0.6rem;flex-wrap:wrap;}' +
      '.explicit-gate-btn{flex:1;border-radius:9px;padding:0.7rem 0.5rem;font-size:0.9rem;font-weight:700;cursor:pointer;border:1px solid rgba(168,85,247,0.5);white-space:nowrap;}' +
      '#explicitGateAgree{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;}' +
      '#explicitGateAgree:hover{background:linear-gradient(135deg,#6d28d9,#9333ea);}' +
      '#explicitGateCancel{background:transparent;color:rgba(234,230,255,0.75);}' +
      '#explicitGateCancel:hover{background:rgba(124,58,237,0.18);}';
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.id = 'explicitGateOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div id="explicitGateBox">' +
        '<h2 id="explicitGateTitle"></h2>' +
        '<p id="explicitGateBody"></p>' +
        '<div id="explicitGateBtns">' +
          '<button type="button" class="explicit-gate-btn" id="explicitGateAgree"></button>' +
          '<button type="button" class="explicit-gate-btn" id="explicitGateCancel"></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('explicitGateTitle').textContent = TEXT.title;
    document.getElementById('explicitGateBody').textContent = TEXT.body;
    document.getElementById('explicitGateAgree').textContent = TEXT.agree;
    document.getElementById('explicitGateCancel').textContent = TEXT.cancel;

    document.getElementById('explicitGateAgree').onclick = onAgree;
    document.getElementById('explicitGateCancel').onclick = onCancel;
    overlay.addEventListener('click', function(e){ if (e.target === overlay) onCancel(); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && overlay.classList.contains('show')) onCancel();
    });
  }

  function show() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', show);
      return;
    }
    buildUI();
    overlay.classList.add('show');
  }

  function hide() {
    if (overlay) overlay.classList.remove('show');
  }

  function onAgree() {
    setAgreed();
    hide();
    var p = pending; pending = [];
    for (var i = 0; i < p.length; i++) {
      if (p[i].ok) { try { p[i].ok(); } catch(e) {} }
    }
  }

  function onCancel() {
    hide();
    var p = pending; pending = [];
    for (var i = 0; i < p.length; i++) {
      if (p[i].no) { try { p[i].no(); } catch(e) {} }
    }
  }

  // ---- Public API ----
  function requireAgreement(onAgree, onCancel) {
    if (isAgreed()) { if (onAgree) onAgree(); return; }
    pending.push({ ok: onAgree || null, no: onCancel || null });
    show();
  }

  function guard(song, onAgree, onCancel) {
    if (!song || !song.explicit) { if (onAgree) onAgree(); return; }
    requireAgreement(onAgree, onCancel);
  }

  window.ExplicitGate = {
    isAgreed: isAgreed,
    requireAgreement: requireAgreement,
    guard: guard,
    TEXT: TEXT
  };

  // ---- Native <audio controls> coverage ----
  // A play event on an audio element tagged data-explicit="1"
  // is paused immediately and routed through the warning.
  // The radio player's element is not tagged (radio-player.js
  // gates through guard() itself), and neither are the custom
  // players on song.html / playlist-details.html / charts.html,
  // which also call the gate in their own play functions.
  document.addEventListener('play', function(e){
    var el = e.target;
    if (!el || el.tagName !== 'AUDIO') return;
    if (isAgreed()) return;
    var explicit = el.getAttribute('data-explicit') === '1';
    if (!explicit && el.closest) {
      var wrap = el.closest('[data-explicit="1"]');
      if (wrap) explicit = true;
    }
    if (!explicit) return;
    el.pause();
    requireAgreement(function(){
      var p = el.play();
      if (p && p.catch) p.catch(function(){});
    }, null);
  }, true);
})();

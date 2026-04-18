// ═══════════════════════════════════════════════════════════
// 8BFR SHARE KIT
// ═══════════════════════════════════════════════════════════
// Universal share modal for any content type.
//
// USAGE from any page:
//   window.Share.open({
//     type: 'post' | 'song' | 'profile' | 'playlist' | 'page' | 'group' | 'custom',
//     id: '...',           // content ID
//     title: '...',        // display title
//     description: '...',  // preview text
//     image: '...',        // optional preview image URL
//     url: '...'           // optional - auto-built from type+id if omitted
//   });
//
// Auto-builds correct URL for each content type:
//   post     -> https://8bfr.com/post.html?id=<id>
//   song     -> https://8bfr.com/song.html?id=<id>
//   profile  -> https://8bfr.com/profile.html?id=<id>
//   playlist -> https://8bfr.com/playlist-details.html?id=<id>
//   page     -> https://8bfr.com/page.html?id=<id>
//   group    -> https://8bfr.com/group.html?id=<id>
// ═══════════════════════════════════════════════════════════

(function(){
  if (window.Share) return;

  // Direct 8bfr.com URLs - used only for in-app display (e.g. Copy Link shows clean URL)
  var DIRECT_BASE = 'https://8bfr.com';
  var DIRECT_MAP = {
    post:     '/post.html?id=',
    song:     '/song.html?id=',
    profile:  '/profile.html?id=',
    playlist: '/playlist-details.html?id=',
    page:     '/page.html?id=',
    group:    '/group.html?id='
  };

  // Vercel share endpoint - serves Open Graph tags to scrapers, redirects humans
  // This is the URL we ACTUALLY share because it gives proper previews.
  // post/song/profile/playlist are supported on Vercel; page/group fall back to direct.
  var SHARE_API = 'https://8bfr-api.vercel.app/api/share';
  var SHARE_API_TYPES = { post:1, song:1, profile:1, playlist:1 };

  function buildDirectUrl(opts) {
    if (opts.url) return opts.url;
    var path = DIRECT_MAP[opts.type];
    if (!path) return location.href;
    return DIRECT_BASE + path + encodeURIComponent(opts.id || '');
  }

  function buildShareUrl(opts) {
    // For post/song/profile/playlist -> use Vercel share API (gets OG previews)
    // For page/group/custom -> use direct URL (no preview API yet for those types)
    if (opts.url) return opts.url;
    if (SHARE_API_TYPES[opts.type] && opts.id) {
      return SHARE_API + '?type=' + opts.type + '&id=' + encodeURIComponent(opts.id);
    }
    return buildDirectUrl(opts);
  }

  // Kept for backward compatibility
  function buildUrl(opts) { return buildShareUrl(opts); }

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ────────── STYLES ──────────
  function injectStyles() {
    if (document.getElementById('8bfrShareStyles')) return;
    var style = document.createElement('style');
    style.id = '8bfrShareStyles';
    style.textContent = '' +
      '#shareModal{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.85);display:none;align-items:flex-end;justify-content:center;padding:0;animation:shareFadeIn .2s ease;}' +
      '#shareModal.show{display:flex;}' +
      '@keyframes shareFadeIn{from{opacity:0;}to{opacity:1;}}' +
      '@keyframes shareSlideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}' +
      '.share-sheet{background:rgba(12,6,24,0.98);border-top:1px solid rgba(124,58,237,0.5);border-radius:20px 20px 0 0;padding:1.25rem 1.25rem 2rem;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;animation:shareSlideUp .25s ease;-webkit-overflow-scrolling:touch;}' +
      '@media(min-width:640px){.share-sheet{margin-bottom:auto;margin-top:auto;border-radius:20px;max-height:90vh;}#shareModal{align-items:center;}}' +
      '.share-grip{width:40px;height:4px;background:rgba(168,85,247,0.4);border-radius:2px;margin:0 auto 1rem;}' +
      '.share-head{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid rgba(124,58,237,0.2);}' +
      '.share-preview-img{width:60px;height:60px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#a855f7);flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.5rem;}' +
      '.share-preview-img img{width:100%;height:100%;object-fit:cover;}' +
      '.share-preview-info{flex:1;min-width:0;}' +
      '.share-preview-title{font-weight:800;font-size:0.95rem;color:#eae6ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.share-preview-desc{font-size:0.78rem;color:rgba(168,85,247,0.75);margin-top:0.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.share-close{background:none;border:none;color:rgba(234,230,255,0.6);font-size:1.5rem;cursor:pointer;width:32px;height:32px;border-radius:50%;flex-shrink:0;transition:background 0.15s;}' +
      '.share-close:hover{background:rgba(124,58,237,0.2);color:#eae6ff;}' +
      '.share-url-row{display:flex;gap:0.5rem;margin-bottom:1.25rem;}' +
      '.share-url{flex:1;padding:0.6rem 0.85rem;background:rgba(0,0,0,0.4);border:1px solid rgba(124,58,237,0.35);border-radius:8px;color:#eae6ff;font-size:0.82rem;outline:none;font-family:ui-monospace,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
      '.share-copy-btn{background:#7c3aed;color:#fff;border:none;padding:0 1rem;border-radius:8px;font-weight:700;font-size:0.85rem;cursor:pointer;flex-shrink:0;transition:background 0.15s;}' +
      '.share-copy-btn:hover{background:#6d28d9;}' +
      '.share-copy-btn.copied{background:#059669;}' +
      '.share-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.25rem;}' +
      '@media(min-width:420px){.share-grid{grid-template-columns:repeat(5,1fr);}}' +
      '.share-btn{display:flex;flex-direction:column;align-items:center;gap:0.35rem;padding:0.6rem 0.25rem;border-radius:12px;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.25);cursor:pointer;text-decoration:none;color:#eae6ff;font-size:0.7rem;font-weight:600;transition:all 0.15s;}' +
      '.share-btn:hover{background:rgba(124,58,237,0.2);border-color:rgba(124,58,237,0.5);transform:translateY(-1px);}' +
      '.share-btn-icon{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;color:#fff;}' +
      '.si-native{background:linear-gradient(135deg,#7c3aed,#a855f7);}' +
      '.si-x{background:#000;}' +
      '.si-fb{background:#1877f2;}' +
      '.si-wa{background:#25d366;}' +
      '.si-msgr{background:linear-gradient(135deg,#0078ff,#00c6ff,#ff0099);}' +
      '.si-tg{background:#26a5e4;}' +
      '.si-sms{background:#34d399;}' +
      '.si-email{background:#ef4444;}' +
      '.si-reddit{background:#ff4500;}' +
      '.si-linkedin{background:#0a66c2;}' +
      '.si-qr{background:#eab308;color:#000 !important;}' +
      '.share-qr-modal{display:none;position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,0.92);align-items:center;justify-content:center;padding:1rem;}' +
      '.share-qr-modal.show{display:flex;}' +
      '.share-qr-box{background:#fff;padding:1.5rem;border-radius:16px;text-align:center;max-width:320px;width:100%;}' +
      '.share-qr-box h3{color:#0c0618;font-size:1rem;font-weight:800;margin-bottom:0.75rem;}' +
      '.share-qr-box img{width:100%;max-width:260px;height:auto;border-radius:8px;}' +
      '.share-qr-box p{color:#666;font-size:0.75rem;margin-top:0.5rem;word-break:break-all;}' +
      '.share-qr-close{margin-top:1rem;background:#7c3aed;color:#fff;border:none;padding:0.5rem 1.25rem;border-radius:8px;font-weight:700;cursor:pointer;}' +
      '.share-toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(52,211,153,0.95);color:#0c0618;padding:0.65rem 1.25rem;border-radius:10px;font-weight:700;font-size:0.85rem;z-index:1000001;opacity:0;transition:opacity 0.25s;pointer-events:none;}' +
      '.share-toast.show{opacity:1;}';
    document.head.appendChild(style);
  }

  // ────────── BUILD MODAL ──────────
  function buildModal() {
    if (document.getElementById('shareModal')) return;
    injectStyles();
    var modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.innerHTML =
      '<div class="share-sheet">' +
        '<div class="share-grip"></div>' +
        '<div class="share-head">' +
          '<div class="share-preview-img" id="sharePreviewImg">🔗</div>' +
          '<div class="share-preview-info">' +
            '<div class="share-preview-title" id="sharePreviewTitle">Share</div>' +
            '<div class="share-preview-desc" id="sharePreviewDesc"></div>' +
          '</div>' +
          '<button class="share-close" onclick="Share.close()">✕</button>' +
        '</div>' +
        '<div class="share-url-row">' +
          '<input class="share-url" id="shareUrl" readonly onclick="this.select();">' +
          '<button class="share-copy-btn" id="shareCopyBtn" onclick="Share.copyLink()">Copy</button>' +
        '</div>' +
        '<div class="share-grid" id="shareGrid"></div>' +
      '</div>';
    modal.addEventListener('click', function(e){ if (e.target === modal) Share.close(); });
    document.body.appendChild(modal);

    // QR modal
    var qr = document.createElement('div');
    qr.id = 'shareQrModal';
    qr.className = 'share-qr-modal';
    qr.innerHTML =
      '<div class="share-qr-box">' +
        '<h3>Scan to open</h3>' +
        '<img id="shareQrImg" alt="QR code">' +
        '<p id="shareQrUrl"></p>' +
        '<button class="share-qr-close" onclick="Share.closeQr()">Close</button>' +
      '</div>';
    qr.addEventListener('click', function(e){ if (e.target === qr) Share.closeQr(); });
    document.body.appendChild(qr);

    // Toast
    var toast = document.createElement('div');
    toast.id = 'shareToast';
    toast.className = 'share-toast';
    document.body.appendChild(toast);
  }

  function showToast(msg) {
    var t = document.getElementById('shareToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(function(){ t.classList.remove('show'); }, 2000);
  }

  // ────────── PLATFORM BUTTONS ──────────
  function buildButtons(opts, url, text) {
    var encUrl = encodeURIComponent(url);
    var encText = encodeURIComponent(text);
    var encTitle = encodeURIComponent(opts.title || '8BFR Music Network');

    var buttons = [];

    // Native share (if supported — mobile usually, desktop Safari)
    if (navigator.share) {
      buttons.push({
        label: 'Share', icon: 'si-native', content: '📤',
        onclick: 'Share.nativeShare()'
      });
    }

    buttons = buttons.concat([
      { label: 'X', icon: 'si-x', content: '𝕏',
        href: 'https://twitter.com/intent/tweet?text=' + encText + '&url=' + encUrl },
      { label: 'Facebook', icon: 'si-fb', content: 'f',
        href: 'https://www.facebook.com/sharer/sharer.php?u=' + encUrl },
      { label: 'WhatsApp', icon: 'si-wa', content: 'W',
        href: 'https://wa.me/?text=' + encText + '%20' + encUrl },
      { label: 'Messenger', icon: 'si-msgr', content: 'M',
        href: 'https://www.facebook.com/dialog/send?link=' + encUrl + '&app_id=8bfr&redirect_uri=' + encUrl },
      { label: 'Telegram', icon: 'si-tg', content: '✈',
        href: 'https://t.me/share/url?url=' + encUrl + '&text=' + encText },
      { label: 'SMS', icon: 'si-sms', content: '💬',
        href: 'sms:?body=' + encText + '%20' + encUrl },
      { label: 'Email', icon: 'si-email', content: '@',
        href: 'mailto:?subject=' + encTitle + '&body=' + encText + '%20' + encUrl },
      { label: 'Reddit', icon: 'si-reddit', content: 'R',
        href: 'https://reddit.com/submit?url=' + encUrl + '&title=' + encTitle },
      { label: 'LinkedIn', icon: 'si-linkedin', content: 'in',
        href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encUrl },
      { label: 'QR Code', icon: 'si-qr', content: '▦',
        onclick: 'Share.showQr()' }
    ]);

    var html = '';
    buttons.forEach(function(b){
      if (b.href) {
        html += '<a class="share-btn" href="' + b.href + '" target="_blank" rel="noopener">' +
                  '<div class="share-btn-icon ' + b.icon + '">' + b.content + '</div>' +
                  '<span>' + b.label + '</span>' +
                '</a>';
      } else {
        html += '<button class="share-btn" onclick="' + b.onclick + '">' +
                  '<div class="share-btn-icon ' + b.icon + '">' + b.content + '</div>' +
                  '<span>' + b.label + '</span>' +
                '</button>';
      }
    });
    document.getElementById('shareGrid').innerHTML = html;
  }

  // ────────── PUBLIC API ──────────
  var currentShare = null;

  window.Share = {
    open: function(opts) {
      opts = opts || {};
      buildModal();
      currentShare = opts;

      var shareUrl = buildShareUrl(opts);    // has OG previews (Vercel)
      var displayUrl = buildDirectUrl(opts);  // clean URL for Copy Link field
      var title = opts.title || '8BFR Music Network';
      var description = opts.description || 'Check this out on 8BFR!';
      var text = opts.shareText || ('🎵 ' + title);

      // Fill preview
      document.getElementById('sharePreviewTitle').textContent = title;
      document.getElementById('sharePreviewDesc').textContent = description.length > 80 ? description.substring(0,80)+'...' : description;

      var imgEl = document.getElementById('sharePreviewImg');
      if (opts.image) {
        imgEl.innerHTML = '<img src="' + esc(opts.image) + '" alt="" onerror="this.parentNode.innerHTML=\'🔗\';">';
      } else {
        var fallbackIcons = { post:'📰', song:'🎵', profile:'👤', playlist:'📀', page:'📄', group:'👥' };
        imgEl.innerHTML = fallbackIcons[opts.type] || '🔗';
      }

      // Display the CLEAN url but stash the PREVIEW url for social buttons
      document.getElementById('shareUrl').value = displayUrl;
      document.getElementById('shareUrl').dataset.shareUrl = shareUrl;
      document.getElementById('shareCopyBtn').textContent = 'Copy';
      document.getElementById('shareCopyBtn').classList.remove('copied');

      buildButtons(opts, shareUrl, text);

      document.getElementById('shareModal').classList.add('show');
    },

    close: function() {
      var m = document.getElementById('shareModal');
      if (m) m.classList.remove('show');
      currentShare = null;
    },

    copyLink: function() {
      var input = document.getElementById('shareUrl');
      var btn = document.getElementById('shareCopyBtn');
      if (!input) return;
      // Use the preview-enabled URL if we stashed one, else fall back to displayed
      var url = input.dataset.shareUrl || input.value;

      function success(){
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        showToast('📋 Link copied! Social previews will work when shared.');
        setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(success).catch(function(){
          // Fallback - temporarily swap displayed value to the share url
          var orig = input.value; input.value = url;
          input.select(); document.execCommand('copy'); success();
          input.value = orig;
        });
      } else {
        var orig = input.value; input.value = url;
        input.select(); document.execCommand('copy'); success();
        input.value = orig;
      }
    },

    nativeShare: function() {
      if (!currentShare || !navigator.share) return;
      var url = buildShareUrl(currentShare);
      var title = currentShare.title || '8BFR Music Network';
      var text = currentShare.description || ('Check this out on 8BFR!');
      navigator.share({ title: title, text: text, url: url }).then(function(){
        Share.close();
      }).catch(function(e){
        if (e.name !== 'AbortError') showToast('Share failed — try another option');
      });
    },

    showQr: function() {
      if (!currentShare) return;
      var url = buildShareUrl(currentShare);
      var qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(url) + '&bgcolor=ffffff&color=7c3aed&qzone=1';
      document.getElementById('shareQrImg').src = qrSrc;
      document.getElementById('shareQrUrl').textContent = url;
      document.getElementById('shareQrModal').classList.add('show');
    },

    closeQr: function() {
      document.getElementById('shareQrModal').classList.remove('show');
    },

    // Quick shortcuts for common types (fewer lines to write in calling code)
    post:     function(id, title, description, image){ Share.open({type:'post',     id:id, title:title, description:description, image:image}); },
    song:     function(id, title, description, image){ Share.open({type:'song',     id:id, title:title, description:description, image:image}); },
    profile:  function(id, title, description, image){ Share.open({type:'profile',  id:id, title:title, description:description, image:image}); },
    playlist: function(id, title, description, image){ Share.open({type:'playlist', id:id, title:title, description:description, image:image}); },
    page:     function(id, title, description, image){ Share.open({type:'page',     id:id, title:title, description:description, image:image}); },
    group:    function(id, title, description, image){ Share.open({type:'group',    id:id, title:title, description:description, image:image}); }
  };
})();

// ═══════════════════════════════════════════════════════════
// 8BFR GLOBAL NOTIFICATION SYSTEM
// Paste this block into scripts.js right AFTER the perks check
// (after the first })(); on ~line 69)
//
// Features:
//   - Notification bar at top of every page (bell icon + unread count)
//   - Popup toast when new notification arrives in real-time
//   - Click bell to see dropdown with recent notifications
//   - Click notification to navigate to its link
//   - Mark as read on click
//   - Option to enable/disable popup toasts via localStorage
// ═══════════════════════════════════════════════════════════

(function(){
  var SB_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0';
  var _ndb = null;
  var _nuid = null;
  var _unreadCount = 0;
  var _notifDropdownOpen = false;
  var _popupsEnabled = true;

  // Check user preference for popups
  try { _popupsEnabled = localStorage.getItem('8bfr_notif_popups') !== 'false'; } catch(e){}

  function initNotifications() {
    // Wait for supabase
    if (!window.supabase || !window.supabase.createClient) return;
    _ndb = window._8bfrSupabaseClient || window.supabase.createClient(SB_URL, SB_KEY);

    _ndb.auth.getSession().then(function(res) {
      var session = res.data && res.data.session;
      if (!session || !session.user) return;
      _nuid = session.user.id;

      injectNotifUI();
      loadUnreadCount();
      subscribeToNotifications();
    }).catch(function(){});
  }

  // ═══ INJECT UI ═══
  function injectNotifUI() {
    // Skip if already injected
    if (document.getElementById('8bfr-notif-bar')) return;

    // CSS
    var style = document.createElement('style');
    style.textContent = [
      '#_8bfr-notif-bar{position:fixed;top:0;left:0;right:0;height:42px;background:rgba(10,2,26,.95);border-bottom:1px solid rgba(124,58,237,.3);z-index:10000;display:flex;align-items:center;justify-content:flex-end;padding:0 12px;backdrop-filter:blur(10px);}',
      'body{padding-top:42px !important;}',
      '#_8bfr-notif-bell{position:relative;cursor:pointer;background:none;border:none;color:#eae6ff;font-size:1.2rem;padding:4px 8px;border-radius:6px;transition:background .15s;}',
      '#_8bfr-notif-bell:hover{background:rgba(124,58,237,.15);}',
      '#_8bfr-notif-badge{position:absolute;top:-2px;right:-2px;min-width:16px;height:16px;border-radius:8px;background:#ef4444;color:#fff;font-size:.6rem;font-weight:700;display:none;align-items:center;justify-content:center;padding:0 3px;line-height:1;}',
      '#_8bfr-notif-dropdown{position:fixed;top:42px;right:8px;width:min(360px,92vw);max-height:400px;overflow-y:auto;background:rgba(12,6,24,.98);border:1px solid rgba(124,58,237,.4);border-radius:0 0 12px 12px;box-shadow:0 8px 30px rgba(0,0,0,.6);z-index:10001;display:none;}',
      '#_8bfr-notif-dropdown.open{display:block;}',
      '._8nf-header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid rgba(124,58,237,.2);font-size:.82rem;font-weight:600;}',
      '._8nf-item{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(124,58,237,.08);cursor:pointer;transition:background .15s;text-decoration:none;color:#eae6ff;}',
      '._8nf-item:hover{background:rgba(124,58,237,.08);}',
      '._8nf-item.unread{background:rgba(124,58,237,.05);border-left:3px solid #7c3aed;}',
      '._8nf-icon{font-size:1.2rem;flex-shrink:0;margin-top:2px;}',
      '._8nf-body{flex:1;min-width:0;}',
      '._8nf-title{font-weight:600;font-size:.82rem;margin-bottom:1px;}',
      '._8nf-text{font-size:.75rem;color:#a855f7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '._8nf-time{font-size:.65rem;color:rgba(168,85,247,.35);margin-top:2px;}',
      '._8nf-empty{text-align:center;padding:24px;color:#a855f7;font-size:.85rem;}',
      '._8nf-toggle{display:flex;align-items:center;gap:6px;padding:8px 12px;font-size:.75rem;color:#a855f7;border-top:1px solid rgba(124,58,237,.15);}',
      '._8nf-toggle label{cursor:pointer;display:flex;align-items:center;gap:4px;}',
      // Toast popup
      '._8nf-toast{position:fixed;top:50px;right:12px;width:min(320px,88vw);background:rgba(12,6,24,.97);border:1px solid rgba(124,58,237,.5);border-radius:12px;padding:12px;z-index:10002;box-shadow:0 8px 25px rgba(0,0,0,.7);animation:_8nfSlideIn .3s ease;cursor:pointer;}',
      '._8nf-toast:hover{border-color:#7c3aed;}',
      '@keyframes _8nfSlideIn{from{transform:translateX(120%);opacity:0;}to{transform:translateX(0);opacity:1;}}',
      '@keyframes _8nfSlideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(120%);opacity:0;}}',
    ].join('\n');
    document.head.appendChild(style);

    // Bar
    var bar = document.createElement('div');
    bar.id = '_8bfr-notif-bar';
    bar.innerHTML = '<button id="_8bfr-notif-bell" onclick="window._8bfrToggleNotifDropdown()">🔔<span id="_8bfr-notif-badge">0</span></button>';
    document.body.appendChild(bar);

    // Dropdown
    var dropdown = document.createElement('div');
    dropdown.id = '_8bfr-notif-dropdown';
    dropdown.innerHTML = '<div class="_8nf-header"><span>🔔 Notifications</span><a href="notifications.html" style="color:#7c3aed;font-size:.75rem;text-decoration:none;">View All</a></div><div id="_8bfr-notif-list"><div class="_8nf-empty">Loading...</div></div><div class="_8nf-toggle"><label><input type="checkbox" id="_8bfr-popup-toggle" ' + (_popupsEnabled ? 'checked' : '') + ' onchange="window._8bfrTogglePopups(this.checked)"> Popup notifications</label></div>';
    document.body.appendChild(dropdown);

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (_notifDropdownOpen && !dropdown.contains(e.target) && e.target.id !== '_8bfr-notif-bell') {
        dropdown.classList.remove('open');
        _notifDropdownOpen = false;
      }
    });
  }

  // ═══ TOGGLE DROPDOWN ═══
  window._8bfrToggleNotifDropdown = function() {
    var dd = document.getElementById('_8bfr-notif-dropdown');
    if (!dd) return;
    _notifDropdownOpen = !_notifDropdownOpen;
    dd.classList.toggle('open', _notifDropdownOpen);
    if (_notifDropdownOpen) loadRecentNotifications();
  };

  // ═══ TOGGLE POPUPS ═══
  window._8bfrTogglePopups = function(enabled) {
    _popupsEnabled = enabled;
    try { localStorage.setItem('8bfr_notif_popups', enabled ? 'true' : 'false'); } catch(e){}
  };

  // ═══ LOAD UNREAD COUNT ═══
  async function loadUnreadCount() {
    try {
      var res = await _ndb.from('notifications').select('*', { count: 'exact', head: true }).eq('recipient_id', _nuid).eq('is_read', false);
      _unreadCount = res.count || 0;
      updateBadge();
    } catch(e) {}
  }

  function updateBadge() {
    var badge = document.getElementById('_8bfr-notif-badge');
    if (!badge) return;
    if (_unreadCount > 0) {
      badge.style.display = 'flex';
      badge.textContent = _unreadCount > 99 ? '99+' : _unreadCount;
    } else {
      badge.style.display = 'none';
    }
  }

  // ═══ LOAD RECENT NOTIFICATIONS ═══
  async function loadRecentNotifications() {
    var list = document.getElementById('_8bfr-notif-list');
    if (!list) return;

    try {
      var res = await _ndb.from('notifications').select('*').eq('recipient_id', _nuid).order('created_at', { ascending: false }).limit(15);
      var data = res.data || [];

      if (!data.length) {
        list.innerHTML = '<div class="_8nf-empty">No notifications yet</div>';
        return;
      }

      var icons = { follow: '👥', dm: '✉️', report: '🚩', like: '❤️', comment: '💬', parent_verify: '👨‍👩‍👧', parent_verify_result: '✅', mention: '📣' };

      list.innerHTML = data.map(function(n) {
        var meta = n.metadata || {};
        var title = meta.title || n.notif_type || 'Notification';
        var body = meta.body || '';
        var link = meta.link || 'notifications.html';
        var icon = icons[n.notif_type] || '🔔';
        var unread = !n.is_read ? ' unread' : '';
        var time = timeAgo(n.created_at);

        return '<a class="_8nf-item' + unread + '" href="' + link + '" onclick="window._8bfrMarkRead(\'' + n.id + '\')">' +
          '<div class="_8nf-icon">' + icon + '</div>' +
          '<div class="_8nf-body"><div class="_8nf-title">' + esc(title) + '</div><div class="_8nf-text">' + esc(body) + '</div><div class="_8nf-time">' + time + '</div></div></a>';
      }).join('');
    } catch(e) {
      list.innerHTML = '<div class="_8nf-empty">Error loading notifications</div>';
    }
  }

  // ═══ MARK AS READ ═══
  window._8bfrMarkRead = function(id) {
    if (!_ndb || !id) return;
    _ndb.from('notifications').update({ is_read: true }).eq('id', id).then(function() {
      _unreadCount = Math.max(0, _unreadCount - 1);
      updateBadge();
    }).catch(function(){});
  };

  // ═══ MARK ALL READ ═══
  window._8bfrMarkAllRead = function() {
    if (!_ndb || !_nuid) return;
    _ndb.from('notifications').update({ is_read: true }).eq('recipient_id', _nuid).eq('is_read', false).then(function() {
      _unreadCount = 0;
      updateBadge();
      loadRecentNotifications();
    }).catch(function(){});
  };

  // ═══ REALTIME SUBSCRIPTION ═══
  function subscribeToNotifications() {
    _ndb.channel('global-notif-' + _nuid)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: 'recipient_id=eq.' + _nuid
      }, function(payload) {
        _unreadCount++;
        updateBadge();

        // Show toast popup if enabled
        if (_popupsEnabled && payload.new) {
          showToast(payload.new);
        }

        // Refresh dropdown if open
        if (_notifDropdownOpen) {
          loadRecentNotifications();
        }
      })
      .subscribe();
  }

  // ═══ TOAST POPUP ═══
  function showToast(notif) {
    var meta = notif.metadata || {};
    var title = meta.title || notif.notif_type || 'New notification';
    var body = meta.body || '';
    var link = meta.link || 'notifications.html';
    var icons = { follow: '👥', dm: '✉️', report: '🚩', like: '❤️', comment: '💬', parent_verify: '👨‍👩‍👧', parent_verify_result: '✅' };
    var icon = icons[notif.notif_type] || '🔔';

    // Remove existing toast
    var existing = document.querySelector('._8nf-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = '_8nf-toast';
    toast.onclick = function() {
      window._8bfrMarkRead(notif.id);
      toast.remove();
      location.href = link;
    };
    toast.innerHTML = '<div style="display:flex;gap:8px;align-items:flex-start;">' +
      '<div style="font-size:1.5rem;">' + icon + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-weight:700;font-size:.88rem;margin-bottom:2px;">' + esc(title) + '</div>' +
        '<div style="font-size:.78rem;color:#a855f7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(body) + '</div>' +
      '</div>' +
      '<button onclick="event.stopPropagation();this.parentElement.parentElement.remove();" style="background:none;border:none;color:#a855f7;cursor:pointer;font-size:1rem;padding:0 2px;">✕</button>' +
    '</div>';

    document.body.appendChild(toast);

    // Auto-dismiss after 6 seconds
    setTimeout(function() {
      if (toast.parentElement) {
        toast.style.animation = '_8nfSlideOut .3s ease forwards';
        setTimeout(function() { if (toast.parentElement) toast.remove(); }, 300);
      }
    }, 6000);

    // Play notification sound (optional — uses a short beep via Web Audio)
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = 0.1;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  }

  // ═══ HELPERS ═══
  function timeAgo(d) {
    if (!d) return '';
    var s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ═══ INIT ═══
  // Skip on notifications.html itself (it has its own full UI)
  if (window.location.pathname.includes('notifications.html')) return;
  // Skip on login/signup
  var page = window.location.pathname.split('/').pop() || '';
  if (['login.html','signup.html','reset-password.html','index.html',''].includes(page)) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initNotifications, 500); });
  } else {
    setTimeout(initNotifications, 500);
  }
})();

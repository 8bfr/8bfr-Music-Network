// ═══════════════════════════════════════════════════════
// 8BFR GLOBAL PERKS CHECK
// ═══════════════════════════════════════════════════════
(function(){
  var OWNER_ID = 'cb556180-f032-4b21-9470-1d786f2664ab';
  var PERK_ROLES = ['owner','co-owner'];
  var ADMIN_ROLES = ['owner','co-owner','admin'];

  window._8bfr = {
    hasPerks: false,
    isOwner: false,
    isCoOwner: false,
    isAdmin: false,
    role: null,
    badges: [],
    userId: null,
    user: null,
    ready: null
  };

  window._8bfr.ready = new Promise(function(resolve){
    function check(){
      if(!window.supabase || !window.supabase.createClient){
        resolve(); return;
      }
      var db = window.supabase.createClient(
        'https://novbuvwpjnxwwvdekjhr.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0'
      );
      db.auth.getSession().then(function(res){
        var session = res.data && res.data.session;
        if(!session || !session.user){ resolve(); return; }
        window._8bfr.user = session.user;
        window._8bfr.userId = session.user.id;

        db.from('profiles').select('role,badges').eq('user_id', session.user.id).single()
          .then(function(pr){
            if(pr.data){
              var role = pr.data.role || 'fan';
              var badges = pr.data.badges || [];
              window._8bfr.role = role;
              window._8bfr.badges = badges;
              window._8bfr.isOwner = (role === 'owner' || session.user.id === OWNER_ID);
              window._8bfr.isCoOwner = (role === 'co-owner');
              window._8bfr.hasPerks = (PERK_ROLES.indexOf(role) !== -1 || session.user.id === OWNER_ID);
              window._8bfr.isAdmin = (ADMIN_ROLES.indexOf(role) !== -1 || session.user.id === OWNER_ID);
            }
            resolve();
          }).catch(function(){ resolve(); });
      }).catch(function(){ resolve(); });
    }

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', check);
    } else {
      check();
    }
  });
})();


// ========== FEATURED ADS + BUTTONS (index.html only, with swipe) ==========
(function () {
  if (window._8bfrInlineCarousel) return;
  var track = document.getElementById("adTrack");
  if (!track) return;

  var SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  var defaultAds = [
    { img: "assets/images/ad_banner_1.jpg", url: "ads.html#ad1" },
    { img: "assets/images/ad_banner_2.jpg", url: "ads.html#ad2" },
    { img: "assets/images/ad_banner_3.jpg", url: "ads.html#ad3" },
    { img: "assets/images/ad_banner_4.jpg", url: "ads.html#ad4" },
    { img: "assets/images/ad_banner_5.jpg", url: "ads.html#ad5" }
  ];

  var ads = defaultAds.slice();
  var prev = document.getElementById("adPrev");
  var next = document.getElementById("adNext");
  var pause = document.getElementById("adPause");
  var index = 0;
  var paused = false;
  var timer = null;

  function createSlide(i) {
    var data = ads[i];
    var a = document.createElement("a");
    a.className = "ad-slide";
    a.href = data.url || "#";
    a.target = "_blank";
    a.rel = "noopener";
    var img = new Image();
    img.src = data.img;
    img.alt = "Featured ad banner " + (i + 1);
    a.appendChild(img);
    return a;
  }

  function showSlide(nextIndex) {
    if (ads.length === 0) return;
    index = (nextIndex + ads.length) % ads.length;
    var oldSlide = track.querySelector(".ad-slide.show");
    var newSlide = createSlide(index);
    track.appendChild(newSlide);
    requestAnimationFrame(function() { newSlide.classList.add("show"); });
    if (oldSlide) { setTimeout(function() { oldSlide.remove(); }, 380); }
  }

  function schedule() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(function() { showSlide(index + 1); schedule(); }, 5000);
  }

  if (prev) { prev.addEventListener("click", function() { if (!paused && pause) { paused = true; pause.textContent = "Play"; } showSlide(index - 1); }); }
  if (next) { next.addEventListener("click", function() { if (!paused && pause) { paused = true; pause.textContent = "Play"; } showSlide(index + 1); }); }
  if (pause) { pause.addEventListener("click", function() { paused = !paused; pause.textContent = paused ? "Play" : "Pause"; if (!paused) schedule(); else clearTimeout(timer); }); }

  var startX = 0; var deltaX = 0; var dragging = false;
  track.addEventListener("touchstart", function(e) { dragging = true; startX = e.touches[0].clientX; deltaX = 0; clearTimeout(timer); }, { passive: true });
  track.addEventListener("touchmove", function(e) { if (!dragging) return; deltaX = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener("touchend", function() {
    if (!dragging) return; dragging = false;
    if (Math.abs(deltaX) > 40) { if (!paused && pause) { paused = true; pause.textContent = "Play"; } if (deltaX < 0) showSlide(index + 1); else showSlide(index - 1); }
    schedule();
  }, { passive: true });

  function loadFeaturedAds() {
    try {
      var client = null;
      if (window._8bfrSupabaseClient) { client = window._8bfrSupabaseClient; }
      else if (window.supabase && window.supabase.createClient) { client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
      if (!client) { showSlide(0); schedule(); return; }
      var now = new Date().toISOString();
      client.from("ads").select("*").eq("status","approved").eq("approved",true).eq("ad_type","featured").gte("expires_at",now).order("created_at",{ascending:false})
        .then(function(res) {
          if (res.data && res.data.length > 0) {
            var liveAds = res.data.map(function(ad) { return { img: ad.image_url || "assets/images/ad_banner_1.jpg", url: ad.link_url || "all-ads.html" }; });
            if (liveAds.length < defaultAds.length) { for (var i = liveAds.length; i < defaultAds.length; i++) { liveAds.push(defaultAds[i]); } }
            ads = liveAds;
          }
          showSlide(0); schedule();
        }).catch(function() { showSlide(0); schedule(); });
    } catch (e) { showSlide(0); schedule(); }
  }
  loadFeaturedAds();
})();

// ========== GLOBAL 8BFR UI (menu, bubbles, avatars, auth gate) ==========
(function () {
  var SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  function loadSupabaseClient(callback) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    if (window._8bfrSupabaseClient) { callback(window._8bfrSupabaseClient); return; }
    function init() {
      if (!window.supabase || !window.supabase.createClient) return;
      window._8bfrSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      callback(window._8bfrSupabaseClient);
    }
    if (window.supabase && window.supabase.createClient) { init(); }
    else {
      var existing = document.querySelector("script[data-8bfr-supabase]");
      if (!existing) {
        var s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.defer = true; s.dataset["8bfrSupabase"] = "1"; s.onload = init;
        document.head.appendChild(s);
      } else { existing.addEventListener("load", init, { once: true }); }
    }
  }

  function showAuthOverlay() {
    if (document.getElementById("authGateOverlay")) return;
    var overlay = document.createElement("div");
    overlay.id = "authGateOverlay";
    overlay.innerHTML = '<div id="authGateCard"><h2>&#x1F512; Login Required</h2><p>Sign in to access this page and join the 8BFR community.</p><div class="auth-buttons"><a href="login.html">Log In</a><a href="signup.html">Sign Up</a><a href="index.html">&#x2190; Back to Home</a></div></div>';
    document.body.appendChild(overlay);
  }

  function enforceAuthGate() {
    var publicPages = ["index.html","login.html","signup.html","reset-password.html","reset_password.html","logout.html","profile.html"];
    var path = window.location.pathname.split("/").pop();
    if (!path) path = "index.html";
    if (publicPages.indexOf(path) !== -1) return;
    var authTimeout = setTimeout(function() { showAuthOverlay(); }, 8000);
    loadSupabaseClient(function(client) {
      client.auth.getSession().then(function(res) {
        clearTimeout(authTimeout);
        if (!res.data || !res.data.session) { showAuthOverlay(); }
      }).catch(function() { clearTimeout(authTimeout); showAuthOverlay(); });
    });
  }

  function injectGlobalUI() {
    if (document.getElementById("fab")) { enforceAuthGate(); return; }
    var noCarrie = document.body && document.body.dataset.noGlobalCarrie === "true";
    var currentPage = window.location.pathname.split("/").pop() || "index.html";

    var css = document.createElement("style");
    css.textContent = '\
:root{ --ring:rgba(124,58,237,.65); --glass:rgba(12,6,24,.88); --chip-bg:rgba(18,3,39,.96); --chip-hover:rgba(55,9,90,1); }\
#menuStripe{ position:fixed; top:0; right:0; bottom:0; width:280px; background:radial-gradient(circle at 0 0,rgba(15,23,42,.95),rgba(24,0,48,.98)); border-left:1px solid rgba(124,58,237,.6); z-index:9991; display:none; }\
#menuStripeText{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-90deg); font-size:.75rem; letter-spacing:.35em; text-transform:uppercase; color:#a855f7; opacity:.9; }\
body.menu-open #menuStripe{ display:block; }\
body.menu-open #pageWrap{ margin-right:280px; }\
#fab{ position:fixed; top:10px; right:14px; z-index:9999; width:56px; height:56px; border-radius:9999px; display:grid; place-items:center; background:radial-gradient(120% 120% at 30% 20%,rgba(124,58,237,.60),rgba(10,10,20,.80)); border:1px solid rgba(124,58,237,.60); box-shadow:0 0 14px rgba(124,58,237,.40),0 0 18px rgba(0,217,255,.25) inset; cursor:pointer; transition:filter .2s ease; }\
#fab:hover{ filter:brightness(1.1); }\
#fab svg{ display:block; }\
#menu-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.25); backdrop-filter:blur(2px); z-index:9990; opacity:0; pointer-events:none; transition:opacity .2s ease; }\
#menu-backdrop.open{ opacity:1; pointer-events:auto; }\
#menu{ position:fixed; top:72px; right:0; width:min(92vw,280px); max-height:calc(100vh - 80px); overflow-y:scroll; overflow-x:hidden; z-index:9998; transform:translateX(115%); transition:transform .25s ease; backdrop-filter:blur(12px); background:var(--glass); border:1px solid var(--ring); border-radius:14px 0 0 14px; box-shadow:0 14px 32px rgba(0,0,0,.6); padding:8px 7px 60px; -webkit-overflow-scrolling:touch; }\
#menu.open{ transform:translateX(0); }\
#menu h2{ font-size:.85rem; text-transform:uppercase; letter-spacing:.12em; opacity:.9; margin:2px 6px 4px; }\
.menu-group{ margin:4px 0 6px; padding:4px 4px 6px; border-radius:10px; border:1px solid rgba(139,92,246,.48); background:rgba(10,2,26,.85); }\
.menu-group-title{ font-size:.78rem; font-weight:600; opacity:.9; margin-bottom:3px; cursor:pointer; display:flex; align-items:center; }\
.menu-group-title::after{ content:"\\25BE"; font-size:.65rem; opacity:.7; margin-left:6px; flex-shrink:0; transition:transform .2s ease; }\
.menu-group.collapsed .menu-group-title::after{ transform:rotate(-90deg); }\
.menu-links{ display:flex; flex-wrap:wrap; gap:4px; }\
.menu-group.collapsed .menu-links{ display:none; }\
.menu-chip{ display:inline-block; padding:3px 10px; border-radius:999px; font-size:.75rem; text-decoration:none; background:var(--chip-bg); border:1px solid rgba(129,140,248,.9); color:#eae6ff; white-space:nowrap; }\
.menu-chip:hover{ background:var(--chip-hover); }\
.menu-chip-network{ position:relative; overflow:hidden; }\
.menu-chip-network .menu-label-main,.menu-chip-network .menu-label-alt{ display:inline-block; transition:opacity .3s ease; }\
.menu-chip-network .menu-label-alt{ position:absolute; left:50%; transform:translateX(-50%); }\
.menu-chip-network .menu-label-main{ animation:networkLabelMain 3s ease-in-out infinite; }\
.menu-chip-network .menu-label-alt{ animation:networkLabelAlt 3s ease-in-out infinite; }\
@keyframes networkLabelMain{ 0%,45%{opacity:1;} 55%,100%{opacity:0;} }\
@keyframes networkLabelAlt{ 0%,45%{opacity:0;} 55%,100%{opacity:1;} }\
.menu-chip-ai{ background:linear-gradient(135deg,rgba(124,58,237,.4),rgba(0,217,255,.2)) !important; border-color:rgba(0,217,255,.6) !important; color:#00d9ff !important; font-weight:700 !important; }\
.menu-chip-ai:hover{ background:linear-gradient(135deg,rgba(124,58,237,.6),rgba(0,217,255,.35)) !important; box-shadow:0 0 12px rgba(0,217,255,.4); }\
#bubbleStack{ position:fixed; top:0; left:0; right:0; z-index:9989; display:flex; flex-direction:row; align-items:center; gap:4px; padding:6px 74px 6px 12px; background:rgba(10,2,26,.92); border-bottom:1px solid rgba(124,58,237,.4); backdrop-filter:blur(10px); overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; }\
body{ padding-top:52px !important; }\
#bubbleStack::-webkit-scrollbar{ display:none; }\
.bubble-row{ display:flex; flex-direction:column; align-items:center; gap:1px; flex-shrink:0; }\
.bubble-label{ font-size:.58rem; color:#fff; opacity:.85; white-space:nowrap; }\
#bubble-top-single{ position:fixed; right:16px; bottom:82px; z-index:9996; transition:right .25s ease; }\
body.menu-open #bubble-top-single,body.menu-open #carrieWrap{ right:340px; }\
.bubble{ width:34px; height:34px; border-radius:999px; display:grid; place-items:center; background:rgba(18,3,39,.94); border:1px solid rgba(129,140,248,.9); box-shadow:0 0 8px rgba(124,58,237,.35); cursor:pointer; transition:background .2s ease,transform .1s ease; font-size:.85rem; }\
.bubble:hover{ background:rgba(60,15,90,.95); transform:scale(1.08); }\
#carrieWrap{ position:fixed; right:16px; bottom:72px; z-index:9997; user-select:none; touch-action:none; transition:right .25s ease; }\
.global-avatar{ width:min(48vw,260px); object-fit:contain; background:transparent!important; display:none; filter:drop-shadow(0 14px 32px rgba(15,6,40,.9)) drop-shadow(0 0 18px rgba(124,58,237,.55)); }\
.global-avatar.active{ display:block; }\
#carrieBubble{ position:absolute; bottom:100%; right:40px; margin-bottom:4px; padding:3px 10px; border-radius:999px; font-size:.72rem; background:rgba(15,23,42,.95); color:#e5e7eb; border:1px solid rgba(129,140,248,.9); white-space:nowrap; }\
#carrieBubble::after{ content:""; position:absolute; top:100%; right:16px; border-width:6px 6px 0 6px; border-style:solid; border-color:rgba(15,23,42,.95) transparent transparent transparent; }\
#avatarSwitcher{ display:none; flex-direction:column; gap:4px; margin-bottom:6px; } #carrieWrap.switcher-open #avatarSwitcher{ display:flex; }\
.avatar-switcher-row{ display:flex; gap:3px; flex-wrap:wrap; }\
.avatar-char-btn,.avatar-style-btn{ padding:2px 8px; border-radius:999px; border:1px solid rgba(129,140,248,.6); background:rgba(15,23,42,.85); color:#e5e7eb; font-size:.62rem; cursor:pointer; white-space:nowrap; }\
.avatar-char-btn.active,.avatar-style-btn.active{ border-color:#a855f7; background:rgba(88,28,135,0.95); color:#fff; }\
#authGateOverlay{ position:fixed; inset:0; z-index:12000; background:radial-gradient(circle at 10% -10%,rgba(124,58,237,.45),rgba(3,0,10,.96)); display:flex; align-items:center; justify-content:center; }\
#authGateCard{ width:min(92vw,360px); border-radius:18px; border:1px solid rgba(129,140,248,.85); background:rgba(10,2,26,.96); box-shadow:0 20px 40px rgba(0,0,0,.85); padding:1.4rem 1.5rem; text-align:center; }\
#authGateCard h2{ font-size:1.05rem; font-weight:700; margin-bottom:.4rem; }\
#authGateCard p{ font-size:.8rem; opacity:.82; margin-bottom:.8rem; }\
#authGateCard .auth-buttons{ display:flex; flex-direction:column; gap:.4rem; }\
#authGateCard .auth-buttons a{ display:block; border-radius:.9rem; padding:.45rem .7rem; font-size:.8rem; text-decoration:none; border:1px solid rgba(129,140,248,.9); background:rgba(15,23,42,.9); color:#e5e7eb; }\
#authGateCard .auth-buttons a:first-child{ background:#7c3aed; border-color:#7c3aed; color:#fff; }\
@media(max-width:480px){ .global-avatar{ width:min(56vw,220px); } body.menu-open #bubble-top-single,body.menu-open #carrieWrap{ right:300px; } }\
';
    document.head.appendChild(css);

    var ui = document.createElement("div");
    var html = '\
<div id="menuStripe"><div id="menuStripeText">STREAM 8BFR ON SPOTIFY</div></div>\
<button id="fab" aria-label="Open navigation">\
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round">\
    <path d="M4 6h16M4 12h12M4 18h8"/>\
  </svg>\
</button>\
<div id="menu-backdrop"></div>\
<nav id="menu" aria-hidden="true">\
  <h2>8BFR Navigation</h2>\
  <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">\
    <a href="notifications.html" class="menu-chip" style="background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.5);color:#fca5a5;">&#x1F514; Notifications</a>\
    <a href="messages.html" class="menu-chip" style="background:rgba(0,217,255,.1);border-color:rgba(0,217,255,.5);color:#00d9ff;">&#x2709;&#xFE0F; Messages</a>\
    <a href="contact.html" class="menu-chip" style="background:rgba(251,191,36,.1);border-color:rgba(251,191,36,.5);color:#fbbf24;">&#x1F4EC; Contact</a>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Home &amp; Core</div>\
    <div class="menu-links">\
      <a href="index.html" class="menu-chip">&#x1F3E0; Home</a>\
      <a href="feed.html" class="menu-chip">&#x1F4F0; Community Feed</a>\
      <a href="stories.html" class="menu-chip">&#x1F4D6; Stories</a>\
      <a href="announcements.html" class="menu-chip">&#x1F4E3; Announcements</a>\
      <a href="blog.html" class="menu-chip">&#x270D;&#xFE0F; Blog</a>\
      <a href="stats.html" class="menu-chip">&#x1F4CA; Stats</a>\
      <a href="live.html" class="menu-chip">&#x1F4E1; Live</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Music &amp; Content</div>\
    <div class="menu-links">\
      <a href="song.html" class="menu-chip">&#x1F3B5; Songs</a>\
      <a href="singles.html" class="menu-chip">&#x1F4BF; Singles</a>\
      <a href="albums.html" class="menu-chip">&#x1F4C0; Albums</a>\
      <a href="beats.html" class="menu-chip">&#x1F941; Beats</a>\
      <a href="beats-store.html" class="menu-chip">&#x1F6D2; Beat Store</a>\
      <a href="playlists.html" class="menu-chip">&#x25B6;&#xFE0F; Playlists</a>\
      <a href="genres.html" class="menu-chip">&#x1F3BC; Genres</a>\
      <a href="charts.html" class="menu-chip">&#x1F4C8; Charts</a>\
      <a href="radio.html" class="menu-chip">&#x1F4FB; Radio</a>\
      <a href="featured-songs.html" class="menu-chip">&#x2B50; Featured Songs</a>\
      <a href="embed.html" class="menu-chip">&#x1F3A7; Embed Music</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Profile &amp; Community</div>\
    <div class="menu-links">\
      <a href="profile.html" class="menu-chip">&#x1F464; My Profile</a>\
      <a href="search.html" class="menu-chip menu-chip-network"><span class="menu-label-main">Network</span><span class="menu-label-alt">Search</span></a>\
      <a href="members.html" class="menu-chip">&#x1F465; Browse Members</a>\
      <a href="page.html" class="menu-chip">&#x1F4C4; Pages</a>\
      <a href="group.html" class="menu-chip">&#x1F465; Groups</a>\
      <a href="featured.html" class="menu-chip">&#x2B50; Featured Artists</a>\
      <a href="fan-zone.html" class="menu-chip">&#x1F3A4; Fan Zone</a>\
      <a href="author.html" class="menu-chip">&#x1F4DD; Authors</a>\
      <a href="chat.html" class="menu-chip">&#x1F4AC; Chat</a>\
      <a href="dm.html" class="menu-chip">&#x2709;&#xFE0F; DM</a>\
      <a href="integration.html" class="menu-chip">&#x1F517; Integrations</a>\
      <a href="referral.html" class="menu-chip">&#x1F381; Invite Friends</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F916; AI Tools</div>\
    <div class="menu-links">\
      <a href="ai-tools.html" class="menu-chip menu-chip-ai">&#x1F916; AI Tools</a>\
      <a href="https://8bfr.com/producer-ai/index.html" target="_blank" rel="noopener" class="menu-chip menu-chip-ai">&#x1F3B5; Producer AI</a>\
      <a href="author-hub.html" class="menu-chip menu-chip-ai">&#x1F4DA; Author Hub</a>\
      <a href="translate.html" class="menu-chip menu-chip-ai">&#x1F310; Translate</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F49D; Dedications</div>\
    <div class="menu-links">\
      <a href="dedications.html" class="menu-chip">&#x1F48C; Dedications</a>\
      <a href="dedication.html" class="menu-chip">&#x1F49C; Mom Thank You</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F3AE; Games</div>\
    <div class="menu-links">\
      <a href="games.html" class="menu-chip">&#x1F3AE; Play Games</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F6D2; Shop</div>\
    <div class="menu-links">\
      <a href="shop.html" class="menu-chip">&#x1F6D2; Shop</a>\
      <a href="shop-stickers.html" class="menu-chip">&#x1F3A8; Stickers</a>\
      <a href="shop-upgrades.html" class="menu-chip">&#x2B06;&#xFE0F; Shop Upgrades</a>\
      <a href="coinshop.html" class="menu-chip">&#x1FA99; Coin Shop</a>\
      <a href="game-coin-shop.html" class="menu-chip">&#x1F3AE; Game Coin Shop</a>\
      <a href="upgrades.html" class="menu-chip">&#x1F680; Upgrades</a>\
      <a href="pricing.html" class="menu-chip">&#x1F4B3; Pricing</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x2764;&#xFE0F; Donate</div>\
    <div class="menu-links">\
      <a href="donate.html" class="menu-chip">&#x2764;&#xFE0F; Donate</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F9F8; KidZone</div>\
    <div class="menu-links">\
      <a href="kid-zone.html" class="menu-chip">&#x1F9F8; KidZone</a>\
      <a href="kidzone-games.html" class="menu-chip">&#x1F3AE; Kids Games</a>\
      <a href="kids-stories.html" class="menu-chip">&#x1F4D6; Kids Stories</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">&#x1F517; Suggested Links</div>\
    <div class="menu-links">\
      <a href="suggested-links.html" class="menu-chip">&#x1F517; Suggested Links</a>\
      <a href="affiliates.html" class="menu-chip">&#x1F91D; Affiliates</a>\
      <a href="products.html" class="menu-chip">&#x1F6CD;&#xFE0F; 8BFR Products</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">My Account</div>\
    <div class="menu-links">\
      <a href="settings.html" class="menu-chip">&#x2699;&#xFE0F; Settings</a>\
      <a href="purchases.html" class="menu-chip">&#x1F6D2; My Purchases</a>\
      <a href="artist-payouts.html" class="menu-chip">&#x1F4B0; Earnings</a>\
      <a href="artist-discounts.html" class="menu-chip">&#x1F3F7;&#xFE0F; My Discounts</a>\
      <a href="reset-password.html" class="menu-chip">&#x1F511; Reset Password</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Carrie &amp; Fun</div>\
    <div class="menu-links">\
      <a href="carrie-chat.html" class="menu-chip">&#x1F916; Carrie Chat</a>\
      <a href="carrie-closet.html" class="menu-chip">&#x1F457; Carrie Closet</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Info &amp; Legal</div>\
    <div class="menu-links">\
      <a href="about.html" class="menu-chip">&#x2139;&#xFE0F; About</a>\
      <a href="algorithm-points.html" class="menu-chip">&#x1F4CA; Algorithm Points</a>\
      <a href="faq.html" class="menu-chip">&#x2753; FAQ</a>\
      <a href="help.html" class="menu-chip">&#x1F198; Help</a>\
      <a href="rules.html" class="menu-chip">&#x1F4CB; Rules</a>\
      <a href="privacy.html" class="menu-chip">&#x1F512; Privacy</a>\
      <a href="terms.html" class="menu-chip">&#x1F4C4; Terms</a>\
      <a href="credits.html" class="menu-chip">&#x1F64F; Credits</a>\
      <a href="press.html" class="menu-chip">&#x1F4F0; Press</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Admin / Mod / Owner</div>\
    <div class="menu-links">\
      <a href="owner-panel.html" class="menu-chip">&#x1F451; Owner Panel</a>\
      <a href="owner-studio.html" class="menu-chip">&#x1F3A8; Owner Studio</a>\
      <a href="owner-users.html" class="menu-chip">&#x1F465; Manage Users</a>\
      <a href="owner-verifications.html" class="menu-chip">&#x2705; Verifications</a>\
      <a href="owner-dm-monitor.html" class="menu-chip">&#x1F441; DM Monitor</a>\
      <a href="owner-kidzone.html" class="menu-chip">&#x1F9F8; KidZone Admin</a>\
      <a href="owner-monitor.html" class="menu-chip">&#x1F441; Site Monitor</a>\
      <a href="admin-panel.html" class="menu-chip">&#x2699;&#xFE0F; Admin Panel</a>\
      <a href="mod-panel.html" class="menu-chip">&#x1F6E1;&#xFE0F; Mod Panel</a>\
    </div>\
  </div>\
  <div class="menu-group collapsed">\
    <div class="menu-group-title">Login &amp; Auth</div>\
    <div class="menu-links">\
      <a href="login.html" class="menu-chip">&#x1F511; Log In</a>\
      <a href="signup.html" class="menu-chip">&#x2728; Sign Up</a>\
      <a href="logout.html" class="menu-chip">&#x1F6AA; Log Out</a>\
    </div>\
  </div>\
</nav>\
<div id="bubbleStack">\
  <div class="bubble-row"><button class="bubble" id="bubble-contact" title="Contact"><span>&#x2709;&#xFE0F;</span></button><span class="bubble-label">Contact</span></div>\
  <div class="bubble-row"><button class="bubble" id="bubble-donate" title="Donate"><span>&#x1F49C;</span></button><span class="bubble-label">Donate</span></div>\
  <div class="bubble-row"><button class="bubble" id="bubble-footer" title="Go to footer"><span>&#x2B07;&#xFE0F;</span></button><span class="bubble-label">Footer</span></div>\
  <div class="bubble-row"><button class="bubble" id="bubble-theme" title="Light / Dark"><span>&#x262F;&#xFE0F;</span></button><span class="bubble-label">Theme</span></div>\
  <div class="bubble-row"><button class="bubble" id="bubble-theme-random" title="Random theme"><span>&#x1F500;</span></button><span class="bubble-label">Random</span></div>\
  <div class="bubble-row"><button class="bubble" id="bubble-stream" title="Stream 8BFR"><span>&#x1F3A7;</span></button><span class="bubble-label">Stream</span></div>\
</div>\
<button class="bubble" id="bubble-top-single"><span>&#x2B06;&#xFE0F;</span></button>\
';

    if (!noCarrie) {
      html += '\
<div id="carrieWrap" title="Chat avatar (global)">\
  <div id="avatarSwitcher">\
    <div class="avatar-switcher-row">\
      <button class="avatar-char-btn active" data-char="carrie">Carrie</button>\
      <button class="avatar-char-btn" data-char="james">James</button>\
      <button class="avatar-char-btn" data-char="azreen">Azreen</button>\
    </div>\
    <div class="avatar-switcher-row">\
      <button class="avatar-style-btn active" data-style="business">Business</button>\
      <button class="avatar-style-btn" data-style="casual">Casual</button>\
      <button class="avatar-style-btn" data-style="partner">Partner</button>\
    </div>\
    <div class="avatar-switcher-row" style="margin-top:2px;">\
      <button id="avatarChatBtn" style="width:100%;padding:4px 8px;border-radius:999px;border:1px solid #a855f7;background:rgba(124,58,237,0.5);color:#fff;font-size:.68rem;font-weight:700;cursor:pointer;white-space:nowrap;">&#x1F4AC; Chat</button>\
    </div>\
  </div>\
  <div id="carrieBubble">Chat with me</div>\
  <video id="avatar-carrie-business" class="global-avatar active" src="assets/videos/carrie_business_animate.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-carrie-casual" class="global-avatar" src="assets/videos/Carrie_casual_animate_3_1.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-carrie-partner" class="global-avatar" src="assets/videos/carrie_girlfriend.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-james-business" class="global-avatar" src="assets/videos/james_business.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-james-casual" class="global-avatar" src="assets/videos/james_casual.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-james-partner" class="global-avatar" src="assets/videos/james_boyfriend.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-azreen-business" class="global-avatar" src="assets/videos/azreen_business.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-azreen-casual" class="global-avatar" src="assets/videos/azreen_casual.webm" autoplay loop muted playsinline></video>\
  <video id="avatar-azreen-partner" class="global-avatar" src="assets/videos/azreen_girlfriend.webm" autoplay loop muted playsinline></video>\
</div>\
';
    }

    ui.innerHTML = html;
    document.body.appendChild(ui);

    var fab = document.getElementById("fab");
    var menu = document.getElementById("menu");
    var backdrop = document.getElementById("menu-backdrop");
    var menuTimer = null;

    function openMenu() {
      if (!menu || !backdrop) return;
      menu.classList.add("open"); backdrop.classList.add("open");
      document.body.classList.add("menu-open"); resetMenuTimer();
      var cw = document.getElementById("carrieWrap");
      var bs = document.getElementById("bubble-top-single");
      if (cw) { cw.style.right = (window.innerWidth <= 480 ? "300px" : "340px"); cw.style.left = ""; cw.style.top = ""; cw.style.bottom = ""; }
      if (bs) { bs.style.right = (window.innerWidth <= 480 ? "300px" : "340px"); }
    }
    function closeMenu() {
      if (!menu || !backdrop) return;
      menu.classList.remove("open"); backdrop.classList.remove("open");
      document.body.classList.remove("menu-open"); clearTimeout(menuTimer); menuTimer = null;
      var cw = document.getElementById("carrieWrap");
      var bs = document.getElementById("bubble-top-single");
      if (cw) { cw.style.right = "16px"; cw.style.left = ""; cw.style.top = ""; cw.style.bottom = ""; }
      if (bs) { bs.style.right = "16px"; }
    }
    function resetMenuTimer() { clearTimeout(menuTimer); menuTimer = setTimeout(closeMenu, 20000); }

    if (fab) { fab.addEventListener("click", function(e) { e.stopPropagation(); if (menu && menu.classList.contains("open")) closeMenu(); else openMenu(); }); }
    if (backdrop) { backdrop.addEventListener("click", closeMenu); }
    document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeMenu(); });
    if (menu) { menu.addEventListener("pointermove", resetMenuTimer); menu.addEventListener("wheel", resetMenuTimer); menu.addEventListener("touchmove", function(e){ e.stopPropagation(); resetMenuTimer(); }, {passive: true}); menu.addEventListener("touchstart", resetMenuTimer, {passive: true}); }

    var groups = menu ? menu.querySelectorAll(".menu-group") : [];
    groups.forEach(function(group) {
      var title = group.querySelector(".menu-group-title");
      if (!title) return;
      title.addEventListener("click", function() {
        var willOpen = group.classList.contains("collapsed");
        groups.forEach(function(g) { g.classList.add("collapsed"); });
        if (willOpen) group.classList.remove("collapsed");
      });
    });

    var carrieWrap = document.getElementById("carrieWrap");
    var carrieBubble = document.getElementById("carrieBubble");
    var avatarSwitcher = document.getElementById("avatarSwitcher");
    var avatarVideos = Array.from(document.querySelectorAll(".global-avatar"));

    var CHAR_KEYS = ["carrie", "james", "azreen"];
    var STYLE_KEYS = ["business", "casual", "partner"];

    function getStoredChar() { try { var r = localStorage.getItem("8bfr_avatar_char"); if (r && CHAR_KEYS.indexOf(r)!==-1) return r; } catch(e){} return "carrie"; }
    function getStoredStyle() { try { var r = localStorage.getItem("8bfr_avatar_style"); if (r && STYLE_KEYS.indexOf(r)!==-1) return r; } catch(e){} return "business"; }
    function saveChar(c) { try { localStorage.setItem("8bfr_avatar_char", c); } catch(e){} }
    function saveStyle(s) { try { localStorage.setItem("8bfr_avatar_style", s); } catch(e){} }

    var currentChar = getStoredChar();
    var currentStyle = getStoredStyle();
    var userScale = 1;

    function applyAvatarScale() {
      avatarVideos.forEach(function(v) { v.style.transform = "scale(" + userScale + ")"; });
      if (carrieBubble) carrieBubble.style.transform = "scale(" + userScale + ")";
    }

    function setActiveAvatar(char, style) {
      currentChar = CHAR_KEYS.indexOf(char)!==-1 ? char : "carrie";
      currentStyle = STYLE_KEYS.indexOf(style)!==-1 ? style : "business";
      var activeId = "avatar-" + currentChar + "-" + currentStyle;
      avatarVideos.forEach(function(v) {
        if (v.id === activeId) {
          v.classList.add("active");
          try { v.muted = true; v.play().catch(function(){}); } catch(e){}
        } else {
          v.classList.remove("active");
          try { v.pause(); } catch(e){}
        }
      });
      if (avatarSwitcher) {
        avatarSwitcher.querySelectorAll(".avatar-char-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.char === currentChar); });
        avatarSwitcher.querySelectorAll(".avatar-style-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.style === currentStyle); });
      }
      saveChar(currentChar); saveStyle(currentStyle); applyAvatarScale();
    }

    if (avatarVideos.length) { setActiveAvatar(currentChar, currentStyle); }

    if (avatarSwitcher) {
      avatarSwitcher.addEventListener("click", function(e) {
        var cb = e.target.closest(".avatar-char-btn");
        var sb = e.target.closest(".avatar-style-btn");
        if (cb && CHAR_KEYS.indexOf(cb.dataset.char)!==-1) setActiveAvatar(cb.dataset.char, currentStyle);
        else if (sb && STYLE_KEYS.indexOf(sb.dataset.style)!==-1) setActiveAvatar(currentChar, sb.dataset.style);
      });
    }

    window.addEventListener("storage", function(ev) {
      if (ev.key === "8bfr_avatar_char" || ev.key === "8bfr_avatar_style") {
        setActiveAvatar(getStoredChar(), getStoredStyle());
      }
    });

    var dragging2 = false; var moved = false; var sx = 0; var sy = 0; var ox = 0; var oy = 0;
    var pinchActive = false; var pinchStartDist = 0; var userScaleStart = 1;
    var mouseResizeActive = false; var mouseResizeStartY = 0;

    function clampScale(v) { return Math.max(0.5, v); }
    function getTouchDist(e) {
      if (!e.touches || e.touches.length < 2) return 0;
      var dx = e.touches[1].clientX - e.touches[0].clientX;
      var dy = e.touches[1].clientY - e.touches[0].clientY;
      return Math.sqrt(dx*dx + dy*dy);
    }
    function ptr(ev) { var t = ev.touches ? ev.touches[0] : ev; return { x: t.clientX, y: t.clientY }; }

    if (carrieWrap) {
      carrieWrap.addEventListener("contextmenu", function(e) { e.preventDefault(); });
      carrieWrap.addEventListener("mousedown", startDragOrResize);
      carrieWrap.addEventListener("touchstart", startTouch, { passive: false });
      carrieWrap.addEventListener("click", function(e) {
        if (e.target.closest("#avatarChatBtn")) { window.location.href = "carrie-chat.html"; return; }
        if (e.target.closest("#avatarSwitcher")) return;
        if (moved || pinchActive || mouseResizeActive) return;
        if (!carrieWrap.classList.contains("switcher-open")) {
          carrieWrap.classList.add("switcher-open");
          setTimeout(function() {
            document.addEventListener("click", function closeSwitcher(ev) {
              if (!carrieWrap.contains(ev.target)) { carrieWrap.classList.remove("switcher-open"); document.removeEventListener("click", closeSwitcher); }
            });
          }, 50);
        } else {
          carrieWrap.classList.remove("switcher-open");
        }
      });
      carrieWrap.addEventListener("touchend", function(e) {
        if (e.target.closest("#avatarChatBtn")) { window.location.href = "carrie-chat.html"; return; }
        if (e.target.closest("#avatarSwitcher")) return;
        if (moved || pinchActive) return;
        e.preventDefault();
        if (!carrieWrap.classList.contains("switcher-open")) {
          carrieWrap.classList.add("switcher-open");
          setTimeout(function() {
            document.addEventListener("touchend", function closeSwitcher(ev) {
              if (!carrieWrap.contains(ev.target)) { carrieWrap.classList.remove("switcher-open"); document.removeEventListener("touchend", closeSwitcher); }
            });
          }, 50);
        } else {
          carrieWrap.classList.remove("switcher-open");
        }
      });
    }

    function startDragOrResize(e) {
      if (e.button === 2) { mouseResizeActive = true; mouseResizeStartY = e.clientY; userScaleStart = userScale; moved = false; dragging2 = false; e.preventDefault(); return; }
      if (e.target.closest("#avatarSwitcher")) return;
      dragging2 = true; moved = false;
      var p = ptr(e); sx = p.x; sy = p.y;
      var r = carrieWrap.getBoundingClientRect(); ox = r.left; oy = r.top;
      carrieWrap.style.right = "auto"; carrieWrap.style.bottom = "auto";
    }

    function startTouch(e) {
      if (document.body.classList.contains("menu-open")) return;
      if (e.touches && e.touches.length >= 2) { pinchActive = true; dragging2 = false; moved = false; pinchStartDist = getTouchDist(e); userScaleStart = userScale; e.preventDefault(); return; }
      if (e.target.closest("#avatarSwitcher")) return;
      dragging2 = true; moved = false;
      var p = ptr(e); sx = p.x; sy = p.y;
      var r = carrieWrap.getBoundingClientRect(); ox = r.left; oy = r.top;
      carrieWrap.style.right = "auto"; carrieWrap.style.bottom = "auto";
      e.preventDefault();
    }

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", endAll);
    window.addEventListener("touchend", endAll);

    function onMove(e) {
      if (document.body.classList.contains("menu-open")) return;
      if (pinchActive && e.touches && e.touches.length >= 2) {
        var dist = getTouchDist(e); if (!dist || !pinchStartDist) return;
        userScale = clampScale(userScaleStart * (dist / pinchStartDist)); applyAvatarScale(); e.preventDefault(); return;
      }
      if (mouseResizeActive && !e.touches) {
        userScale = clampScale(userScaleStart * (1 - (e.clientY - mouseResizeStartY) / 300));
        applyAvatarScale(); e.preventDefault(); return;
      }
      if (!dragging2) return;
      var p = ptr(e); var dx = p.x - sx; var dy = p.y - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      carrieWrap.style.left = (ox + dx) + "px"; carrieWrap.style.top = (oy + dy) + "px";
      e.preventDefault();
    }

    function endAll(e) { if (e && e.touches && e.touches.length > 0) return; dragging2 = false; pinchActive = false; mouseResizeActive = false; }

    // Only ensure the active avatar video plays (not all 9)
    avatarVideos.forEach(function(v) {
      v.muted = true; v.playsInline = true;
      if(v.classList.contains('active')){ try{v.play().catch(function(){});}catch(e){} }
      else { try{v.pause();}catch(e){} }
    });

    // Pause avatar video when any audio plays on the page (mobile resource conflict)
    document.addEventListener('play', function(e) {
      if(e.target.tagName==='AUDIO'){
        avatarVideos.forEach(function(v){ try{v.pause();}catch(ex){} });
      }
    }, true);
    document.addEventListener('pause', function(e) {
      if(e.target.tagName==='AUDIO'){
        avatarVideos.forEach(function(v){
          if(v.classList.contains('active')){ try{v.play().catch(function(){});}catch(ex){} }
        });
      }
    }, true);

    var contact = document.getElementById("bubble-contact");
    var donate = document.getElementById("bubble-donate");
    var footerBtn = document.getElementById("bubble-footer");
    var topBtn = document.getElementById("bubble-top-single");
    var themeBtn = document.getElementById("bubble-theme");
    var themeRandomBtn = document.getElementById("bubble-theme-random");
    var streamBtn = document.getElementById("bubble-stream");

    if (contact) { contact.addEventListener("click", function() { window.location.href = "contact.html"; }); }
    if (donate) { donate.addEventListener("click", function() { var d = document.getElementById("donate"); if (d) d.scrollIntoView({behavior:"smooth"}); else window.location.href = "donate.html"; }); }
    if (footerBtn) { footerBtn.addEventListener("click", function() { window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}); }); }
    if (topBtn) { topBtn.addEventListener("click", function() { window.scrollTo({top:0,behavior:"smooth"}); }); }

    var themes = [
      { name:"dark", bg:"linear-gradient(#0b0014,#000000)", color:"#eae6ff" },
      { name:"light", bg:"#f5f5ff", color:"#111827" },
      { name:"neon", bg:"radial-gradient(circle at 0% 0%, #00f5ff 0, #12001e 40%, #000 100%)", color:"#e0f2fe" },
      { name:"sunset", bg:"linear-gradient(135deg,#ff7a18,#af002d 60%,#000 100%)", color:"#fff7ed" },
      { name:"ocean", bg:"linear-gradient(135deg,#0f172a,#0369a1,#0b0014)", color:"#e0f2fe" }
    ];

    function applyTheme(name) { var t = themes.filter(function(x){return x.name===name;})[0]; if (!t) return; document.body.style.background = t.bg; document.body.style.color = t.color; try { localStorage.setItem("8bfr-theme", name); } catch(e){} }
    function getCurrentTheme() { try { return localStorage.getItem("8bfr-theme") || "dark"; } catch(e) { return "dark"; } }
    applyTheme(getCurrentTheme());

    if (themeBtn) { themeBtn.addEventListener("click", function() { applyTheme(getCurrentTheme() === "light" ? "dark" : "light"); }); }
    if (themeRandomBtn) { themeRandomBtn.addEventListener("click", function() { var cur = getCurrentTheme(); var pool = themes.map(function(t){return t.name;}).filter(function(n){return n!==cur;}); applyTheme(pool[Math.floor(Math.random()*pool.length)]); }); }
    if (streamBtn) { streamBtn.addEventListener("click", function() { window.open("https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x?si=Ja3kOaL5S36QWOUS6yvnsA","_blank","noopener"); }); }

    // Notification bell badge
    (function() {
      try {
        var _db = window._8bfrSupabaseClient;
        if (!_db && window.supabase && window.supabase.createClient) {
          _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        if (!_db) return;
        _db.auth.getSession().then(function(_s) {
          var _uid = _s && _s.data && _s.data.session ? _s.data.session.user.id : null;
          if (!_uid) return;

          function setBellBadge(count) {
            document.querySelectorAll('a[href="notifications.html"]').forEach(function(link) {
              var ex = link.querySelector('.notif-nav-badge');
              if (count > 0) {
                if (!ex) {
                  ex = document.createElement('span');
                  ex.className = 'notif-nav-badge';
                  ex.style.cssText = 'background:#ef4444;color:#fff;font-size:0.6rem;font-weight:700;padding:1px 5px;border-radius:50px;margin-left:3px;vertical-align:middle;display:inline-block;';
                  link.appendChild(ex);
                }
                ex.textContent = count > 99 ? '99+' : count;
              } else if (ex) { ex.remove(); }
            });
          }

          _db.from('notifications').select('*', { count: 'exact', head: true }).eq('recipient_id', _uid).eq('is_read', false).then(function(res) {
            setBellBadge(res.count || 0);
          });

          function showToast(notif) {
            var existing = document.getElementById('8bfr-toast');
            if (existing) existing.remove();
            var meta = notif.metadata || {};
            var type = notif.notif_type || 'notification';
            var typeLabels = {follow:'New Follower',like:'Post Liked',comment:'New Comment',reshare:'Reshared',tip:'Coin Tip',dm:'New Message',direct_message:'New Message',friend_request:'Friend Request',friend_accepted:'Friend Accepted',purchase:'New Purchase',badge:'New Badge',referral:'New Referral',system:'System'};
            var title = typeLabels[type] || 'Notification';
            var body = meta.from_name ? meta.from_name : '';
            if (meta.message_preview) body += (body ? ': ' : '') + meta.message_preview;
            else if (meta.message) body += (body ? ': ' : '') + meta.message;
            if (!body) body = meta.body || '';
            var link = meta.link || 'notifications.html';
            if (type === 'dm' && meta.from_id) link = 'dm.html?user=' + meta.from_id;
            else if (type === 'friend_request' && meta.from_id) link = 'notifications.html';

            var toast = document.createElement('div');
            toast.id = '8bfr-toast';
            toast.style.cssText = 'position:fixed;top:58px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(12,6,24,.96);border:1px solid rgba(124,58,237,.6);border-radius:12px;padding:0.6rem 1rem;max-width:min(90vw,360px);cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.6);animation:toastSlide 0.3s ease;display:flex;gap:0.6rem;align-items:center;';
            toast.innerHTML = '<div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:0.82rem;color:#a855f7;">' + title + '</div>' + (body ? '<div style="font-size:0.78rem;color:rgba(234,230,255,.7);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + body.substring(0, 60) + '</div>' : '') + '</div><div style="color:rgba(234,230,255,.3);font-size:0.7rem;cursor:pointer;" onclick="event.stopPropagation();this.parentElement.remove();">X</div>';
            toast.onclick = function() { toast.remove(); window.location.href = link; };
            document.body.appendChild(toast);
            setTimeout(function() { if (toast.parentElement) toast.remove(); }, 6000);
          }

          // Add toast animation CSS
          if (!document.getElementById('8bfr-toast-css')) {
            var tcss = document.createElement('style');
            tcss.id = '8bfr-toast-css';
            tcss.textContent = '@keyframes toastSlide{from{opacity:0;transform:translateX(-50%) translateY(-20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}';
            document.head.appendChild(tcss);
          }

          if (window.location.pathname.indexOf('notifications') === -1) {
            _db.channel('global-notif-bell').on('postgres_changes', {
              event: 'INSERT', schema: 'public', table: 'notifications', filter: 'recipient_id=eq.' + _uid
            }, function(payload) {
              _db.from('notifications').select('*', { count: 'exact', head: true }).eq('recipient_id', _uid).eq('is_read', false).then(function(r2) {
                setBellBadge(r2.count || 0);
              });
              // Show toast popup
              if (payload && payload.new) showToast(payload.new);
            }).subscribe();
          }
        });
      } catch(e) { console.warn('Notif bell:', e); }
    })();

    enforceAuthGate();
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", injectGlobalUI); }
  else { injectGlobalUI(); }
})();

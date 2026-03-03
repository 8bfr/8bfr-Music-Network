

**SECTION 1 of 5 — Ad Carousel (copy everything below)**

```javascript
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
    { img: "assets/images/ad_banner_5.jpg", url: "ads.html#ad5" },
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
    if (oldSlide) {
      setTimeout(function() { oldSlide.remove(); }, 380);
    }
  }

  function schedule() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(function() {
      showSlide(index + 1);
      schedule();
    }, 5000);
  }

  if (prev) {
    prev.addEventListener("click", function() {
      if (!paused && pause) { paused = true; pause.textContent = "Play"; }
      showSlide(index - 1);
    });
  }
  if (next) {
    next.addEventListener("click", function() {
      if (!paused && pause) { paused = true; pause.textContent = "Play"; }
      showSlide(index + 1);
    });
  }
  if (pause) {
    pause.addEventListener("click", function() {
      paused = !paused;
      pause.textContent = paused ? "Play" : "Pause";
      if (!paused) schedule();
      else clearTimeout(timer);
    });
  }

  var startX = 0;
  var deltaX = 0;
  var dragging = false;

  track.addEventListener("touchstart", function(e) {
    dragging = true;
    startX = e.touches[0].clientX;
    deltaX = 0;
    clearTimeout(timer);
  }, { passive: true });

  track.addEventListener("touchmove", function(e) {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  track.addEventListener("touchend", function() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 40) {
      if (!paused && pause) { paused = true; pause.textContent = "Play"; }
      if (deltaX < 0) showSlide(index + 1);
      else showSlide(index - 1);
    }
    schedule();
  }, { passive: true });

  function loadFeaturedAds() {
    try {
      var client = null;
      if (window._8bfrSupabaseClient) {
        client = window._8bfrSupabaseClient;
      } else if (window.supabase && window.supabase.createClient) {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
      if (!client) { showSlide(0); schedule(); return; }
      var now = new Date().toISOString();
      client
        .from("ads")
        .select("*")
        .eq("status", "approved")
        .eq("approved", true)
        .eq("ad_type", "featured")
        .gte("expires_at", now)
        .order("created_at", { ascending: false })
        .then(function(res) {
          if (res.data && res.data.length > 0) {
            var liveAds = res.data.map(function(ad) {
              return {
                img: ad.image_url || "assets/images/ad_banner_1.jpg",
                url: ad.link_url || "all-ads.html"
              };
            });
            if (liveAds.length < defaultAds.length) {
              for (var i = liveAds.length; i < defaultAds.length; i++) {
                liveAds.push(defaultAds[i]);
              }
            }
            ads = liveAds;
          }
          showSlide(0);
          schedule();
        })
        .catch(function() { showSlide(0); schedule(); });
    } catch (e) { showSlide(0); schedule(); }
  }

  loadFeaturedAds();
})();

**SECTION 2 of 5 — Global UI, Supabase, Auth Gate, CSS**

```javascript
// ========== GLOBAL 8BFR UI (menu, bubbles, Avatars, auth gate, Spotify stripe) ==========
(function () {
  const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  function loadSupabaseClient(callback) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    if (window._8bfrSupabaseClient) { callback(window._8bfrSupabaseClient); return; }
    function init() {
      if (!window.supabase || !window.supabase.createClient) return;
      const { createClient } = window.supabase;
      window._8bfrSupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      callback(window._8bfrSupabaseClient);
    }
    if (window.supabase && window.supabase.createClient) {
      init();
    } else {
      const existing = document.querySelector("script[data-8bfr-supabase]");
      if (!existing) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.defer = true;
        s.dataset["8bfrSupabase"] = "1";
        s.onload = init;
        document.head.appendChild(s);
      } else {
        existing.addEventListener("load", init, { once: true });
      }
    }
  }

  function showAuthOverlay() {
    if (document.getElementById('authGateOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'authGateOverlay';
    overlay.innerHTML = `
      <div id="authGateCard">
        <h2>🔒 Login Required</h2>
        <p>Sign in to access this page and join the 8BFR community.</p>
        <div class="auth-buttons">
          <a href="login.html">Log In</a>
          <a href="signup.html">Sign Up</a>
          <a href="index.html">← Back to Home</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function enforceAuthGate() {
    const publicPages = [
      "index.html","login.html","signup.html",
      "reset-password.html","reset_password.html","logout.html","profile.html",
    ];
    let path = window.location.pathname.split("/").pop();
    if (!path) path = "index.html";
    if (publicPages.includes(path)) return;
    var authTimeout = setTimeout(function() { showAuthOverlay(); }, 8000);
    loadSupabaseClient(async (client) => {
      try {
        const { data, error } = await client.auth.getSession();
        clearTimeout(authTimeout);
        if (error || !data || !data.session) { showAuthOverlay(); }
      } catch (e) {
        clearTimeout(authTimeout);
        console.warn("Auth gate check failed", e);
        showAuthOverlay();
      }
    });
  }

  function injectGlobalUI() {
    if (document.getElementById("fab")) { enforceAuthGate(); return; }
    const noCarrie = document.body && document.body.dataset.noGlobalCarrie === "true";
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isIndex = (currentPage === "index.html" || currentPage === "" || currentPage === "/");

    const css = document.createElement("style");
    css.textContent = `
:root{
  --ring: rgba(124,58,237,.65);
  --glass: rgba(12,6,24,.88);
  --chip-bg: rgba(18,3,39,.96);
  --chip-hover: rgba(55,9,90,1);
}
#menuStripe{
  position:fixed; top:0; right:0; bottom:0; width:280px;
  background:radial-gradient(circle at 0 0, rgba(15,23,42,.95), rgba(24,0,48,.98));
  border-left:1px solid rgba(124,58,237,.6); z-index:9991; display:none;
}
#menuStripeText{
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%) rotate(-90deg);
  font-size:.75rem; letter-spacing:.35em; text-transform:uppercase;
  color:#a855f7; opacity:.9;
}
body.menu-open #menuStripe{ display:block; }
body.menu-open #pageWrap{ margin-right:280px; }
#fab{
  position:fixed; top:10px; right:14px; z-index:9999;
  width:56px; height:56px; border-radius:9999px;
  display:grid; place-items:center;
  background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.60), rgba(10,10,20,.80));
  border:1px solid rgba(124,58,237,.60);
  box-shadow:0 0 14px rgba(124,58,237,.40),0 0 18px rgba(0,217,255,.25) inset;
  cursor:pointer; transition:filter .2s ease;
}
#fab:hover{ filter:brightness(1.1); }
#fab svg{ display:block; }
#menu-backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.25);
  backdrop-filter:blur(2px); z-index:9990;
  opacity:0; pointer-events:none; transition:opacity .2s ease;
}
#menu-backdrop.open{ opacity:1; pointer-events:auto; }
#menu{
  position:fixed; top:72px; right:14px;
  width:min(92vw,280px); max-height:calc(100vh - 88px);
  overflow-y:auto; z-index:9998;
  transform:translateX(115%); transition:transform .25s ease;
  backdrop-filter:blur(12px); background:var(--glass);
  border:1px solid var(--ring); border-radius:14px;
  box-shadow:0 14px 32px rgba(0,0,0,.6); padding:8px 7px 10px;
}
#menu.open{ transform:translateX(0); }
#menu h2{
  font-size:.85rem; text-transform:uppercase;
  letter-spacing:.12em; opacity:.9; margin:2px 6px 4px;
}
.menu-group{
  margin:4px 0 6px; padding:4px 4px 6px; border-radius:10px;
  border:1px solid rgba(139,92,246,.48); background:rgba(10,2,26,.85);
}
.menu-group-title{
  font-size:.78rem; font-weight:600; opacity:.9; margin-bottom:3px;
  cursor:pointer; display:flex; align-items:center;
}
.menu-group-title::after{
  content:"▾"; font-size:.65rem; opacity:.7;
  margin-left:auto; transition:transform .2s ease;
}
.menu-group.collapsed .menu-group-title::after{ transform:rotate(-90deg); }
.menu-links{ display:flex; flex-wrap:wrap; gap:4px; }
.menu-group.collapsed .menu-links{ display:none; }
.menu-chip{
  display:inline-block; padding:3px 10px; border-radius:999px; font-size:.75rem;
  text-decoration:none; background:var(--chip-bg);
  border:1px solid rgba(129,140,248,.9); color:#eae6ff; white-space:nowrap;
}
.menu-chip:hover{ background:var(--chip-hover); }
.menu-chip-network{ position:relative; overflow:hidden; }
.menu-chip-network .menu-label-main,
.menu-chip-network .menu-label-alt{ display:inline-block; transition:opacity .3s ease; }
.menu-chip-network .menu-label-alt{ position:absolute; left:50%; transform:translateX(-50%); }
.menu-chip-network .menu-label-main{ animation:networkLabelMain 3s ease-in-out infinite; }
.menu-chip-network .menu-label-alt{ animation:networkLabelAlt 3s ease-in-out infinite; }
@keyframes networkLabelMain{ 0%,45%{opacity:1;} 55%,100%{opacity:0;} }
@keyframes networkLabelAlt{ 0%,45%{opacity:0;} 55%,100%{opacity:1;} }
.menu-chip-ai{
  background:linear-gradient(135deg,rgba(124,58,237,.4),rgba(0,217,255,.2)) !important;
  border-color:rgba(0,217,255,.6) !important;
  color:#00d9ff !important; font-weight:700 !important;
}
.menu-chip-ai:hover{
  background:linear-gradient(135deg,rgba(124,58,237,.6),rgba(0,217,255,.35)) !important;
  box-shadow:0 0 12px rgba(0,217,255,.4);
}
#bubbleStack{
  position:fixed; top:0; left:0; right:0; z-index:9989;
  display:flex; flex-direction:row; align-items:center;
  gap:4px; padding:6px 74px 6px 12px;
  background:rgba(10,2,26,.92); border-bottom:1px solid rgba(124,58,237,.4);
  backdrop-filter:blur(10px); overflow-x:auto; scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
}
body{ padding-top:52px !important; }
#bubbleStack::-webkit-scrollbar{ display:none; }
.bubble-row{ display:flex; flex-direction:column; align-items:center; gap:1px; flex-shrink:0; }
.bubble-label{ font-size:.58rem; color:#ffffff; opacity:.85; white-space:nowrap; }
#bubble-top-single{ position:fixed; right:16px; bottom:18px; z-index:9996; transition:right .25s ease; }
body.menu-open #bubble-top-single,
body.menu-open #carrieWrap{ right:340px; }
.bubble{
  width:34px; height:34px; border-radius:999px; display:grid; place-items:center;
  background:rgba(18,3,39,.94); border:1px solid rgba(129,140,248,.9);
  box-shadow:0 0 8px rgba(124,58,237,.35);
  cursor:pointer; transition:background .2s ease,transform .1s ease; font-size:.85rem;
}
.bubble:hover{ background:rgba(60,15,90,.95); transform:scale(1.08); }
#carrieWrap{
  position:fixed; right:16px; bottom:72px; z-index:9997;
  user-select:none; touch-action:none; transition:right .25s ease;
}
.global-avatar{
  width:min(48vw,260px); object-fit:contain; background:transparent!important; display:none;
  filter:drop-shadow(0 14px 32px rgba(15,6,40,.9)) drop-shadow(0 0 18px rgba(124,58,237,.55));
}
.global-avatar.active{ display:block; }
#carrieBubble{
  position:absolute; bottom:100%; right:40px; margin-bottom:4px; padding:3px 10px;
  border-radius:999px; font-size:.72rem; background:rgba(15,23,42,.95);
  color:#e5e7eb; border:1px solid rgba(129,140,248,.9); white-space:nowrap;
}
#carrieBubble::after{
  content:""; position:absolute; top:100%; right:16px;
  border-width:6px 6px 0 6px; border-style:solid;
  border-color:rgba(15,23,42,.95) transparent transparent transparent;
}
#avatarSwitcher{ display:flex; gap:4px; margin-bottom:4px; }
#avatarSwitcher button{
  padding:2px 6px; border-radius:999px; border:1px solid rgba(129,140,248,.6);
  background:rgba(15,23,42,.85); color:#e5e7eb; font-size:.65rem; cursor:pointer;
}
#avatarSwitcher button.active{ border-color:#a855f7; background:rgba(88,28,135,0.95); }
#authGateOverlay{
  position:fixed; inset:0; z-index:12000;
  background:radial-gradient(circle at 10% -10%, rgba(124,58,237,.45), rgba(3,0,10,.96));
  display:flex; align-items:center; justify-content:center;
}
#authGateCard{
  width:min(92vw,360px); border-radius:18px;
  border:1px solid rgba(129,140,248,.85); background:rgba(10,2,26,.96);
  box-shadow:0 20px 40px rgba(0,0,0,.85); padding:1.4rem 1.5rem; text-align:center;
}
#authGateCard h2{ font-size:1.05rem; font-weight:700; margin-bottom:.4rem; }
#authGateCard p{ font-size:.8rem; opacity:.82; margin-bottom:.8rem; }
#authGateCard .auth-buttons{ display:flex; flex-direction:column; gap:.4rem; }
#authGateCard .auth-buttons a{
  display:block; border-radius:.9rem; padding:.45rem .7rem; font-size:.8rem;
  text-decoration:none; border:1px solid rgba(129,140,248,.9);
  background:rgba(15,23,42,.9); color:#e5e7eb;
}
#authGateCard .auth-buttons a:first-child{ background:#7c3aed; border-color:#7c3aed; color:#fff; }
@media(max-width:480px){
  .global-avatar{ width:min(56vw,220px); }
  body.menu-open #bubble-top-single,
  body.menu-open #carrieWrap{ right:300px; }
}
`;
    document.head.appendChild(css);

**SECTION 3 of 5 — Menu HTML**



**SECTION 3 of 5 (REPLACEMENT) — Menu HTML + Avatar HTML**

```javascript
    // ---------- HTML SHELL ----------
    const ui = document.createElement("div");
    let html = `
<div id="menuStripe">
  <div id="menuStripeText">STREAM 8BFR ON SPOTIFY</div>
</div>

<button id="fab" aria-label="Open navigation">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round">
    <path d="M4 6h16M4 12h12M4 18h8"/>
  </svg>
</button>
<div id="menu-backdrop"></div>

<nav id="menu" aria-hidden="true">
  <h2>8BFR Navigation</h2>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Home & Core</div>
    <div class="menu-links">
      <a href="index.html" class="menu-chip">🏠 Home</a>
      <a href="search.html" class="menu-chip menu-chip-network">
        <span class="menu-label-main">Network</span>
        <span class="menu-label-alt">Search</span>
      </a>
      <a href="feed.html" class="menu-chip">📰 Community Feed</a>
      <a href="radio.html" class="menu-chip">📻 Radio</a>
      <a href="live.html" class="menu-chip">📡 Live</a>
      <a href="music-lab.html" class="menu-chip">🎛️ Music Lab</a>
      <a href="featured.html" class="menu-chip">⭐ Featured Artist</a>
      <a href="featured-songs.html" class="menu-chip">🎵 Featured Songs</a>
      <a href="fan-zone.html" class="menu-chip">🎤 Fan Zone</a>
      <a href="stories.html" class="menu-chip">📖 Stories</a>
      <a href="announcements.html" class="menu-chip">📣 Announcements</a>
      <a href="blog.html" class="menu-chip">✍️ Blog</a>
      <a href="algorithm-points.html" class="menu-chip">📊 Algorithm Points</a>
      <a href="about.html" class="menu-chip">ℹ️ About</a>
      <a href="contact.html" class="menu-chip">📬 Contact</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Music & Content</div>
    <div class="menu-links">
      <a href="song.html" class="menu-chip">🎵 Songs</a>
      <a href="singles.html" class="menu-chip">💿 Singles</a>
      <a href="albums.html" class="menu-chip">📀 Albums</a>
      <a href="beats.html" class="menu-chip">🥁 Beats</a>
      <a href="beat-store.html" class="menu-chip">🛒 Beat Store</a>
      <a href="playlists.html" class="menu-chip">▶️ Playlists</a>
      <a href="genres.html" class="menu-chip">🎼 Genres</a>
      <a href="charts.html" class="menu-chip">📈 Charts</a>
      <a href="dedications.html" class="menu-chip">💌 Dedications</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">🤖 Producer AI</div>
    <div class="menu-links">
      <a href="https://8bfr.github.io/producer-ai/index.html" target="_blank" rel="noopener" class="menu-chip menu-chip-ai">🤖 Open Producer AI</a>
      <a href="author.html" class="menu-chip">📝 Author</a>
      <a href="author-hub.html" class="menu-chip">📚 Author Hub</a>
      <a href="translate.html" class="menu-chip">🌐 Translate</a>
      <a href="integration.html" class="menu-chip">🔗 Integration</a>
      <a href="stats.html" class="menu-chip">📊 Stats</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Games & Tournaments</div>
    <div class="menu-links">
      <a href="game-hub.html" class="menu-chip">🕹️ Game Hub</a>
      <a href="games.html" class="menu-chip">🎮 Games</a>
      <a href="arcade.html" class="menu-chip">👾 Arcade</a>
      <a href="game-music.html" class="menu-chip">🎵 Game Music</a>
      <a href="game-tournaments.html" class="menu-chip">🏆 Tournaments</a>
      <a href="game-leaderboards.html" class="menu-chip">🥇 Leaderboards</a>
      <a href="pool-8-ball.html" class="menu-chip">🎱 Pool 8-Ball</a>
      <a href="pool-9-ball.html" class="menu-chip">🎱 Pool 9-Ball</a>
      <a href="trickshot-pool.html" class="menu-chip">🎯 Trickshot Pool</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Profiles & Community</div>
    <div class="menu-links">
      <a href="members.html" class="menu-chip">👥 Browse Members</a>
      <a href="profile.html" class="menu-chip">👤 My Profile</a>
      <a href="chat.html" class="menu-chip">💬 Chat</a>
      <a href="dm.html" class="menu-chip">✉️ DM</a>
      <a href="kids.html" class="menu-chip">👶 Kids</a>
      <a href="kids-zone.html" class="menu-chip">🧸 Kids Zone</a>
      <a href="kids_games.html" class="menu-chip">🎮 Kids Games</a>
      <a href="kids_stories.html" class="menu-chip">📖 Kids Stories</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">My Account & Payments</div>
    <div class="menu-links">
      <a href="settings.html" class="menu-chip">⚙️ Settings</a>
      <a href="purchases.html" class="menu-chip">🛒 My Purchases</a>
      <a href="artist-payouts.html" class="menu-chip">💰 Earnings</a>
      <a href="artist-discounts.html" class="menu-chip">🏷️ My Discounts</a>
      <a href="notifications.html" class="menu-chip">🔔 Notifications</a>
      <a href="messages.html" class="menu-chip">✉️ Messages</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Shop & Coins</div>
    <div class="menu-links">
      <a href="shop.html" class="menu-chip">🛒 Shop</a>
      <a href="shop-stickers.html" class="menu-chip">🎨 Stickers</a>
      <a href="shop-upgrades.html" class="menu-chip">⬆️ Shop Upgrades</a>
      <a href="coinshop.html" class="menu-chip">🪙 Coin Shop</a>
      <a href="game-coin-shop.html" class="menu-chip">🎮 Game Coin Shop</a>
      <a href="upgrades.html" class="menu-chip">🚀 Upgrades</a>
      <a href="pricing.html" class="menu-chip">💳 Pricing</a>
      <a href="donate.html" class="menu-chip">❤️ Donate</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Carrie & Fun</div>
    <div class="menu-links">
      <a href="carrie-chat.html" class="menu-chip">🤖 Carrie Chat</a>
      <a href="carrie-closet.html" class="menu-chip">👗 Carrie Closet</a>
      <a href="carrie-concerts.html" class="menu-chip">🎤 Carrie Concerts</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Admin / Mod / Owner</div>
    <div class="menu-links">
      <a href="owner-panel.html" class="menu-chip">👑 Owner Panel</a>
      <a href="admin-panel.html" class="menu-chip">⚙️ Admin Panel</a>
      <a href="mod-panel.html" class="menu-chip">🛡️ Mod Panel</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Info & Legal</div>
    <div class="menu-links">
      <a href="faq.html" class="menu-chip">❓ FAQ</a>
      <a href="help.html" class="menu-chip">🆘 Help</a>
      <a href="rules.html" class="menu-chip">📋 Rules</a>
      <a href="privacy.html" class="menu-chip">🔒 Privacy</a>
      <a href="terms.html" class="menu-chip">📄 Terms</a>
      <a href="tos_updates.html" class="menu-chip">🔄 TOS Updates</a>
      <a href="credits.html" class="menu-chip">🙏 Credits</a>
      <a href="press.html" class="menu-chip">📰 Press</a>
      <a href="reset-password.html" class="menu-chip">🔑 Reset Password</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Login & Auth</div>
    <div class="menu-links">
      <a href="login.html" class="menu-chip">🔑 Log In</a>
      <a href="signup.html" class="menu-chip">✨ Sign Up</a>
      <a href="logout.html" class="menu-chip">🚪 Log Out</a>
    </div>
  </div>

</nav>

<div id="bubbleStack">
  <div class="bubble-row">
    <button class="bubble" id="bubble-contact" title="Contact"><span>✉️</span></button>
    <span class="bubble-label">Contact</span>
  </div>
  <div class="bubble-row">
    <button class="bubble" id="bubble-donate" title="Donate"><span>💜</span></button>
    <span class="bubble-label">Donate</span>
  </div>
  <div class="bubble-row">
    <button class="bubble" id="bubble-footer" title="Go to footer"><span>⬇️</span></button>
    <span class="bubble-label">Footer</span>
  </div>
  <div class="bubble-row">
    <button class="bubble" id="bubble-theme" title="Light / Dark"><span>☯️</span></button>
    <span class="bubble-label">Theme</span>
  </div>
  <div class="bubble-row">
    <button class="bubble" id="bubble-theme-random" title="Random theme"><span>🔀</span></button>
    <span class="bubble-label">Random</span>
  </div>
  <div class="bubble-row">
    <button class="bubble" id="bubble-stream" title="Stream 8BFR"><span>🎧</span></button>
    <span class="bubble-label">Stream</span>
  </div>
</div>

<button class="bubble" id="bubble-top-single">
  <span>⬆️</span>
</button>
`;

    if (!noCarrie) {
      html += `
<div id="carrieWrap" title="Chat avatar (global)">
  <div id="avatarSwitcher">
    <div class="avatar-switcher-row">
      <button class="avatar-char-btn active" data-char="carrie">Carrie</button>
      <button class="avatar-char-btn" data-char="james">James</button>
      <button class="avatar-char-btn" data-char="azreen">Azreen</button>
    </div>
    <div class="avatar-style-row">
      <button class="avatar-style-btn active" data-style="business">Business</button>
      <button class="avatar-style-btn" data-style="casual">Casual</button>
      <button class="avatar-style-btn" data-style="partner">Partner</button>
    </div>
  </div>
  <div id="carrieBubble">Chat with me</div>
  <video id="avatar-carrie-business" class="global-avatar active" src="assets/videos/carrie_business_animate.webm" autoplay loop muted playsinline></video>
  <video id="avatar-carrie-casual" class="global-avatar" src="assets/videos/Carrie_casual_animate_3_1.webm" autoplay loop muted playsinline></video>
  <video id="avatar-carrie-partner" class="global-avatar" src="assets/videos/carrie_girlfriend.webm" autoplay loop muted playsinline></video>
  <video id="avatar-james-business" class="global-avatar" src="assets/videos/james_business.webm" autoplay loop muted playsinline></video>
  <video id="avatar-james-casual" class="global-avatar" src="assets/videos/james_casual.webm" autoplay loop muted playsinline></video>
  <video id="avatar-james-partner" class="global-avatar" src="assets/videos/james_boyfriend.webm" autoplay loop muted playsinline></video>
  <video id="avatar-azreen-business" class="global-avatar" src="assets/videos/azreen_business.webm" autoplay loop muted playsinline></video>
  <video id="avatar-azreen-casual" class="global-avatar" src="assets/videos/azreen_casual.webm" autoplay loop muted playsinline></video>
  <video id="avatar-azreen-partner" class="global-avatar" src="assets/videos/azreen_girlfriend.webm" autoplay loop muted playsinline></video>
</div>
`;
    }

    ui.innerHTML = html;
    document.body.appendChild(ui);




```javascript
    // ---------- MENU CONTROL ----------
    const fab = document.getElementById("fab");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("menu-backdrop");
    let timer = null;

    function openMenu() {
      if (!menu || !backdrop) return;
      menu.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("menu-open");
      resetTimer();
    }
    function closeMenu() {
      if (!menu || !backdrop) return;
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.classList.remove("menu-open");
      clearTimeout(timer);
      timer = null;
    }
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(closeMenu, 20000);
    }

    if (fab) {
      fab.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menu && menu.classList.contains("open")) closeMenu();
        else openMenu();
      });
    }
    if (backdrop) { backdrop.addEventListener("click", closeMenu); }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    if (menu) {
      menu.addEventListener("pointermove", resetTimer);
      menu.addEventListener("wheel", resetTimer);
    }

    const groups = menu ? menu.querySelectorAll(".menu-group") : [];
    groups.forEach((group) => {
      const title = group.querySelector(".menu-group-title");
      if (!title) return;
      title.addEventListener("click", () => {
        const willOpen = group.classList.contains("collapsed");
        groups.forEach((g) => g.classList.add("collapsed"));
        if (willOpen) group.classList.remove("collapsed");
      });
    });

    // ---------- Global Avatars (Carrie / James / Azreen) ----------
    const carrieWrap = document.getElementById("carrieWrap");
    const carrieBubble = document.getElementById("carrieBubble");
    const avatarSwitcher = document.getElementById("avatarSwitcher");
    const avatarVideos = Array.from(document.querySelectorAll(".global-avatar"));

    const AVATAR_KEYS = ["carrie", "james", "azreen"];
    const AVATAR_IDS = {
      carrie: "avatar-carrie",
      james: "avatar-james",
      azreen: "avatar-azreen",
    };
    const AVATAR_BASE_SCALE = {
      carrie: 1.0,
      james: 1.0,
      azreen: 1.0,
    };

    function getStoredAvatar() {
      try {
        const raw = localStorage.getItem("carrie_avatar");
        if (!raw) return "carrie";
        const a = raw.toLowerCase();
        if (AVATAR_KEYS.includes(a)) return a;
      } catch (e) {}
      return "carrie";
    }

    function setStoredAvatar(name) {
      try { localStorage.setItem("carrie_avatar", name); } catch (e) {}
    }

    let currentAvatar = getStoredAvatar();
    let userScale = 1;

    function applyAvatarScale() {
      const base = AVATAR_BASE_SCALE[currentAvatar] || 1.0;
      const total = base * userScale;
      avatarVideos.forEach((vid) => { vid.style.transform = `scale(${total})`; });
      if (carrieBubble) { carrieBubble.style.transform = `scale(${total})`; }
    }

    function setActiveAvatar(name) {
      const key = AVATAR_IDS[name] ? name : "carrie";
      currentAvatar = key;
      AVATAR_KEYS.forEach((k) => {
        const id = AVATAR_IDS[k];
        const vid = id ? document.getElementById(id) : null;
        if (!vid) return;
        if (k === key) {
          vid.classList.add("active");
          try {
            vid.muted = true;
            vid.autoplay = true;
            vid.playsInline = true;
            vid.play().catch(() => {});
          } catch (e) {}
        } else {
          vid.classList.remove("active");
          try { vid.pause(); } catch (e) {}
        }
      });
      if (avatarSwitcher) {
        const btns = avatarSwitcher.querySelectorAll("button[data-avatar]");
        btns.forEach((btn) => {
          if (btn.dataset.avatar === key) btn.classList.add("active");
          else btn.classList.remove("active");
        });
      }
      setStoredAvatar(key);
      applyAvatarScale();
    }

    if (avatarVideos.length) { setActiveAvatar(currentAvatar); }

    if (avatarSwitcher) {
      avatarSwitcher.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-avatar]");
        if (!btn) return;
        const name = btn.dataset.avatar;
        if (!AVATAR_KEYS.includes(name)) return;
        setActiveAvatar(name);
      });
    }

    window.addEventListener("storage", (ev) => {
      if (ev.key === "carrie_avatar") {
        currentAvatar = getStoredAvatar();
        setActiveAvatar(currentAvatar);
      }
    });

    // ---------- DRAG / RESIZE ----------
    let dragging = false;
    let moved = false;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    let pinchActive = false;
    let pinchStartDist = 0;
    let userScaleStart = 1;
    let mouseResizeActive = false;
    let mouseResizeStartY = 0;

    function clampScale(v) { return Math.max(0.5, v); }

    function getTouchDistance(e) {
      if (!e.touches || e.touches.length < 2) return 0;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function ptr(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX, y: t.clientY };
    }

    if (carrieWrap) {
      carrieWrap.addEventListener("contextmenu", (e) => { e.preventDefault(); });
      carrieWrap.addEventListener("mousedown", startDragOrResize);
      carrieWrap.addEventListener("touchstart", startTouch, { passive: false });
      carrieWrap.addEventListener("click", (e) => {
        if (e.target.closest("#avatarSwitcher")) return;
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });
      carrieWrap.addEventListener("touchend", (e) => {
        if (e.target.closest("#avatarSwitcher")) return;
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });
    }

    function startDragOrResize(e) {
      if (e.button === 2) {
        mouseResizeActive = true;
        mouseResizeStartY = e.clientY;
        userScaleStart = userScale;
        moved = false;
        dragging = false;
        e.preventDefault();
        return;
      }
      if (e.target.closest("#avatarSwitcher")) { return; }
      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x; sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left; oy = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
    }

    function startTouch(e) {
      if (e.touches && e.touches.length >= 2) {
        pinchActive = true;
        dragging = false;
        moved = false;
        pinchStartDist = getTouchDistance(e);
        userScaleStart = userScale;
        e.preventDefault();
        return;
      }
      if (e.target.closest("#avatarSwitcher")) { return; }
      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x; sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left; oy = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
      e.preventDefault();
    }

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", endAll);
    window.addEventListener("touchend", endAll);

    function onMove(e) {
      if (pinchActive && e.touches && e.touches.length >= 2) {
        const dist = getTouchDistance(e);
        if (!dist || !pinchStartDist) return;
        userScale = clampScale(userScaleStart * (dist / pinchStartDist));
        applyAvatarScale();
        e.preventDefault();
        return;
      }
      if (mouseResizeActive && !e.touches) {
        const dy = e.clientY - mouseResizeStartY;
        userScale = clampScale(userScaleStart * (1 - dy / 300));
        applyAvatarScale();
        e.preventDefault();
        return;
      }
      if (!dragging) return;
// ---------- MENU CONTROL ----------
    const fab = document.getElementById("fab");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("menu-backdrop");
    let timer = null;

    function openMenu() {
      if (!menu || !backdrop) return;
      menu.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("menu-open");
      resetTimer();
    }
    function closeMenu() {
      if (!menu || !backdrop) return;
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.classList.remove("menu-open");
      clearTimeout(timer);
      timer = null;
    }
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(closeMenu, 20000);
    }

    if (fab) {
      fab.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menu && menu.classList.contains("open")) closeMenu();
        else openMenu();
      });
    }
    if (backdrop) { backdrop.addEventListener("click", closeMenu); }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    if (menu) {
      menu.addEventListener("pointermove", resetTimer);
      menu.addEventListener("wheel", resetTimer);
    }

    const groups = menu ? menu.querySelectorAll(".menu-group") : [];
    groups.forEach((group) => {
      const title = group.querySelector(".menu-group-title");
      if (!title) return;
      title.addEventListener("click", () => {
        const willOpen = group.classList.contains("collapsed");
        groups.forEach((g) => g.classList.add("collapsed"));
        if (willOpen) group.classList.remove("collapsed");
      });
    });

    // ---------- Global Avatars (Carrie / James / Azreen) ----------
    const carrieWrap = document.getElementById("carrieWrap");
    const carrieBubble = document.getElementById("carrieBubble");
    const avatarSwitcher = document.getElementById("avatarSwitcher");
    const avatarVideos = Array.from(document.querySelectorAll(".global-avatar"));

    const CHAR_KEYS = ["carrie", "james", "azreen"];
    const STYLE_KEYS = ["business", "casual", "partner"];

    function getStoredChar() {
      try {
        const raw = localStorage.getItem("carrie_avatar");
        if (raw && CHAR_KEYS.includes(raw.toLowerCase())) return raw.toLowerCase();
      } catch (e) {}
      return "carrie";
    }
    function getStoredStyle() {
      try {
        const raw = localStorage.getItem("carrie_avatar_style");
        if (raw && STYLE_KEYS.includes(raw.toLowerCase())) return raw.toLowerCase();
      } catch (e) {}
      return "business";
    }
    function setStoredChar(name) {
      try { localStorage.setItem("carrie_avatar", name); } catch (e) {}
    }
    function setStoredStyle(style) {
      try { localStorage.setItem("carrie_avatar_style", style); } catch (e) {}
    }

    let currentChar = getStoredChar();
    let currentStyle = getStoredStyle();
    let userScale = 1;

    function applyAvatarScale() {
      avatarVideos.forEach((vid) => { vid.style.transform = `scale(${userScale})`; });
      if (carrieBubble) { carrieBubble.style.transform = `scale(${userScale})`; }
    }

    function setActiveAvatar(char, style) {
      currentChar = CHAR_KEYS.includes(char) ? char : "carrie";
      currentStyle = STYLE_KEYS.includes(style) ? style : "business";
      const activeId = `avatar-${currentChar}-${currentStyle}`;

      avatarVideos.forEach((vid) => {
        if (vid.id === activeId) {
          vid.classList.add("active");
          try { vid.muted = true; vid.autoplay = true; vid.playsInline = true; vid.play().catch(() => {}); } catch (e) {}
        } else {
          vid.classList.remove("active");
          try { vid.pause(); } catch (e) {}
        }
      });

      if (avatarSwitcher) {
        avatarSwitcher.querySelectorAll(".avatar-char-btn").forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.char === currentChar);
        });
        avatarSwitcher.querySelectorAll(".avatar-style-btn").forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.style === currentStyle);
        });
      }

      setStoredChar(currentChar);
      setStoredStyle(currentStyle);
      applyAvatarScale();
    }

    if (avatarVideos.length) { setActiveAvatar(currentChar, currentStyle); }

    if (avatarSwitcher) {
      avatarSwitcher.addEventListener("click", (e) => {
        const charBtn = e.target.closest(".avatar-char-btn");
        const styleBtn = e.target.closest(".avatar-style-btn");
        if (charBtn && CHAR_KEYS.includes(charBtn.dataset.char)) {
          setActiveAvatar(charBtn.dataset.char, currentStyle);
        } else if (styleBtn && STYLE_KEYS.includes(styleBtn.dataset.style)) {
          setActiveAvatar(currentChar, styleBtn.dataset.style);
        }
      });
    }

    window.addEventListener("storage", (ev) => {
      if (ev.key === "carrie_avatar" || ev.key === "carrie_avatar_style") {
        setActiveAvatar(getStoredChar(), getStoredStyle());
      }
    });

    // ---------- DRAG / RESIZE ----------
    let dragging = false;
    let moved = false;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    let pinchActive = false;
    let pinchStartDist = 0;
    let userScaleStart = 1;
    let mouseResizeActive = false;
    let mouseResizeStartY = 0;

    function clampScale(v) { return Math.max(0.5, v); }

    function getTouchDistance(e) {
      if (!e.touches || e.touches.length < 2) return 0;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function ptr(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX, y: t.clientY };
    }

    if (carrieWrap) {
      carrieWrap.addEventListener("contextmenu", (e) => { e.preventDefault(); });
      carrieWrap.addEventListener("mousedown", startDragOrResize);
      carrieWrap.addEventListener("touchstart", startTouch, { passive: false });
      carrieWrap.addEventListener("click", (e) => {
        if (e.target.closest("#avatarSwitcher")) return;
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });
      carrieWrap.addEventListener("touchend", (e) => {
        if (e.target.closest("#avatarSwitcher")) return;
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });
    }

    function startDragOrResize(e) {
      if (e.button === 2) {
        mouseResizeActive = true;
        mouseResizeStartY = e.clientY;
        userScaleStart = userScale;
        moved = false;
        dragging = false;
        e.preventDefault();
        return;
      }
      if (e.target.closest("#avatarSwitcher")) { return; }
      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x; sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left; oy = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
    }

    function startTouch(e) {
      if (e.touches && e.touches.length >= 2) {
        pinchActive = true;
        dragging = false;
        moved = false;
        pinchStartDist = getTouchDistance(e);
        userScaleStart = userScale;
        e.preventDefault();
        return;
      }
      if (e.target.closest("#avatarSwitcher")) { return; }
      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x; sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left; oy = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
      e.preventDefault();
    }

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", endAll);
    window.addEventListener("touchend", endAll);

    function onMove(e) {
      if (pinchActive && e.touches && e.touches.length >= 2) {
        const dist = getTouchDistance(e);
        if (!dist || !pinchStartDist) return;
        userScale = clampScale(userScaleStart * (dist / pinchStartDist));
        applyAvatarScale();
        e.preventDefault();
        return;
      }
      if (mouseResizeActive && !e.touches) {
        const dy = e.clientY - mouseResizeStartY;
        userScale = clampScale(userScaleStart * (1 - dy / 300));
        applyAvatarScale();
        e.preventDefault();
        return;
      }
      if (!dragging) return;
      const p = ptr(e);
      const dx = p.x - sx;
      const dy = p.y - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      carrieWrap.style.left = ox + dx + "px";
      carrieWrap.style.top = oy + dy + "px";
      e.preventDefault();
    }

    function endAll(e) {
      if (e && e.touches && e.touches.length > 0) { return; }
      dragging = false;
      pinchActive = false;
      mouseResizeActive = false;
    }

    avatarVideos.forEach((vid) => {
      try {
        vid.muted = true;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.play().catch(() => {});
      } catch (e) {}
    });

**SECTION 5 of 5 — Bubbles, Themes, Closing brackets**

```javascript
    // ---------- BUBBLES ----------
    const contact = document.getElementById("bubble-contact");
    const donate = document.getElementById("bubble-donate");
    const footerBtn = document.getElementById("bubble-footer");
    const topBtn = document.getElementById("bubble-top-single");
    const themeBtn = document.getElementById("bubble-theme");
    const themeRandomBtn = document.getElementById("bubble-theme-random");
    const streamBtn = document.getElementById("bubble-stream");

    if (contact) {
      contact.addEventListener("click", () => {
        window.location.href = "contact.html";
      });
    }

    if (donate) {
      donate.addEventListener("click", () => {
        const donateSection = document.getElementById("donate");
        if (donateSection) {
          donateSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "donate.html";
        }
      });
    }

    if (footerBtn) {
      footerBtn.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
    }

    if (topBtn) {
      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const themes = [
      { name: "dark", bg: "linear-gradient(#0b0014,#000000)", color: "#eae6ff" },
      { name: "light", bg: "#f5f5ff", color: "#111827" },
      {
        name: "neon",
        bg: "radial-gradient(circle at 0% 0%, #00f5ff 0, #12001e 40%, #000 100%)",
        color: "#e0f2fe",
      },
      {
        name: "sunset",
        bg: "linear-gradient(135deg,#ff7a18,#af002d 60%,#000 100%)",
        color: "#fff7ed",
      },
      {
        name: "ocean",
        bg: "linear-gradient(135deg,#0f172a,#0369a1,#0b0014)",
        color: "#e0f2fe",
      },
    ];

    function applyTheme(name) {
      const t = themes.find((x) => x.name === name);
      if (!t) return;
      document.body.style.background = t.bg;
      document.body.style.color = t.color;
      try { localStorage.setItem("8bfr-theme", name); } catch {}
    }

    function getCurrentTheme() {
      try { return localStorage.getItem("8bfr-theme") || "dark"; } catch { return "dark"; }
    }

    applyTheme(getCurrentTheme());

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current = getCurrentTheme();
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
      });
    }

    if (themeRandomBtn) {
      themeRandomBtn.addEventListener("click", () => {
        const current = getCurrentTheme();
        const pool = themes.map((t) => t.name).filter((n) => n !== current);
        const next = pool[Math.floor(Math.random() * pool.length)];
        applyTheme(next);
      });
    }

    if (streamBtn) {
      streamBtn.addEventListener("click", () => {
        window.open(
          "https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x?si=Ja3kOaL5S36QWOUS6yvnsA",
          "_blank",
          "noopener"
        );
      });
    }

    enforceAuthGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  } else {
    injectGlobalUI();
  }
})();


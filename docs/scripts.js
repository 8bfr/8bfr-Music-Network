// ========== FEATURED ADS + BUTTONS (index.html only, with swipe) ==========
(function () {
  const track = document.getElementById("adTrack");
  if (!track) return;

  const ads = [
    { img: "assets/images/ad_banner_1.jpg", url: "ads.html#ad1" },
    { img: "assets/images/ad_banner_2.jpg", url: "ads.html#ad2" },
    { img: "assets/images/ad_banner_3.jpg", url: "ads.html#ad3" },
    { img: "assets/images/ad_banner_4.jpg", url: "ads.html#ad4" },
    { img: "assets/images/ad_banner_5.jpg", url: "ads.html#ad5" },
  ];

  const prev = document.getElementById("adPrev");
  const next = document.getElementById("adNext");
  const pause = document.getElementById("adPause");

  let index = 0;
  let paused = false;
  let timer = null;

  function createSlide(i) {
    const data = ads[i];
    const a = document.createElement("a");
    a.className = "ad-slide";
    a.href = data.url || "#";
    a.target = "_blank";
    a.rel = "noopener";

    const img = new Image();
    img.src = data.img;
    img.alt = "Featured ad banner " + (i + 1);
    a.appendChild(img);
    return a;
  }

  function showSlide(nextIndex) {
    index = (nextIndex + ads.length) % ads.length;

    const oldSlide = track.querySelector(".ad-slide.show");
    const newSlide = createSlide(index);

    track.appendChild(newSlide);
    requestAnimationFrame(() => newSlide.classList.add("show"));

    if (oldSlide) {
      setTimeout(() => oldSlide.remove(), 380);
    }
  }

  function schedule() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(() => {
      showSlide(index + 1);
      schedule();
    }, 5000);
  }

  if (prev) {
    prev.addEventListener("click", () => {
      if (!paused && pause) {
        paused = true;
        pause.textContent = "Play";
      }
      showSlide(index - 1);
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      if (!paused && pause) {
        paused = true;
        pause.textContent = "Play";
      }
      showSlide(index + 1);
    });
  }

  if (pause) {
    pause.addEventListener("click", () => {
      paused = !paused;
      pause.textContent = paused ? "Play" : "Pause";
      if (!paused) {
        schedule();
      } else {
        clearTimeout(timer);
      }
    });
  }

  // ✅ Touch swipe left/right
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  track.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
      clearTimeout(timer);
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          if (!paused && pause) {
            paused = true;
            pause.textContent = "Play";
          }
          showSlide(index + 1);
        } else {
          if (!paused && pause) {
            paused = true;
            pause.textContent = "Play";
          }
          showSlide(index - 1);
        }
      }
      schedule();
    },
    { passive: true }
  );

  showSlide(0);
  schedule();

  // Buttons under the carousel are plain links in index.html (Buy / How ads work)
})();

// ========== GLOBAL 8BFR UI (menu, bubbles, Carrie, auth gate, Spotify stripe) ==========
(function () {
  const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  function loadSupabaseClient(callback) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    if (window._8bfrSupabaseClient) {
      callback(window._8bfrSupabaseClient);
      return;
    }

    function init() {
      if (!window.supabase || !window.supabase.createClient) return;
      const { createClient } = window.supabase;
      window._8bfrSupabaseClient = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );
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
    if (document.getElementById("authGateOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "authGateOverlay";
    overlay.innerHTML = `
      <div id="authGateCard">
        <h2>Login required</h2>
        <p>You need an 8BFR account to open this page.</p>
        <div class="auth-buttons">
          <a href="login.html">Log in</a>
          <a href="signup.html">Sign up free</a>
          <a href="index.html">Back to home</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function enforceAuthGate() {
    const publicPages = [
      "index.html",
      "login.html",
      "signup.html",
      "reset-password.html",
      "reset_password.html",
      "logout.html",
    ];
    let path = window.location.pathname.split("/").pop();
    if (!path) path = "index.html";

    if (publicPages.includes(path)) {
      return;
    }

    loadSupabaseClient(async (client) => {
      try {
        const { data, error } = await client.auth.getSession();
        if (error || !data || !data.session) {
          showAuthOverlay();
        }
      } catch (e) {
        console.warn("Auth gate check failed", e);
      }
    });
  }

  function injectGlobalUI() {
    if (document.getElementById("fab")) {
      enforceAuthGate();
      return;
    }

    // 🔑 Check if this page wants to hide global Carrie
    const noCarrie =
      document.body && document.body.dataset.noGlobalCarrie === "true";

    // ---------- STYLES ----------
    const css = document.createElement("style");
    css.textContent = `
:root{
  --ring: rgba(124,58,237,.65);
  --glass: rgba(12,6,24,.88);
  --chip-bg: rgba(18,3,39,.96);
  --chip-hover: rgba(55,9,90,1);
}

/* stripe on the right behind the menu */
#menuStripe{
  position:fixed; top:0; right:0; bottom:0;
  width:280px;
  background:radial-gradient(circle at 0 0, rgba(15,23,42,.95), rgba(24,0,48,.98));
  border-left:1px solid rgba(124,58,237,.6);
  z-index:9991;
  display:none;
}
#menuStripeText{
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%) rotate(-90deg);
  font-size:.75rem;
  letter-spacing:.35em;
  text-transform:uppercase;
  color:#a855f7;
  opacity:.9;
}
body.menu-open #menuStripe{ display:block; }

/* shift page content left when menu is open (for pages using #pageWrap) */
body.menu-open #pageWrap{
  margin-right:280px;
}

/* --- Floating menu button --- */
#fab{
  position:fixed; top:10px; right:14px;
  z-index:9999; width:56px; height:56px;
  border-radius:9999px; display:grid; place-items:center;
  background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.60), rgba(10,10,20,.80));
  border:1px solid rgba(124,58,237,.60);
  box-shadow:0 0 14px rgba(124,58,237,.40),0 0 18px rgba(0,217,255,.25) inset;
  cursor:pointer; transition:filter .2s ease;
}
#fab:hover{ filter:brightness(1.1); }
#fab svg{display:block}

/* --- Menu panel --- */
#menu-backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.25);
  backdrop-filter:blur(2px); z-index:9990;
  opacity:0; pointer-events:none; transition:opacity .2s ease;
}
#menu-backdrop.open{opacity:1;pointer-events:auto}

#menu{
  position:fixed; top:72px; right:14px;
  width:min(92vw,280px); max-height:calc(100vh - 88px);
  overflow-y:auto; z-index:9998;
  transform:translateX(115%); transition:transform .25s ease;
  backdrop-filter:blur(12px); background:var(--glass);
  border:1px solid var(--ring); border-radius:14px;
  box-shadow:0 14px 32px rgba(0,0,0,.6);
  padding:8px 7px 10px;
}
#menu.open{ transform:translateX(0); }

#menu h2{
  font-size:.85rem; text-transform:uppercase;
  letter-spacing:.12em; opacity:.9;
  margin:2px 6px 4px;
}
.menu-group{
  margin:4px 0 6px; padding:4px 4px 6px;
  border-radius:10px;
  border:1px solid rgba(139,92,246,.48);
  background:rgba(10,2,26,.85);
}
.menu-group-title{
  font-size:.78rem; font-weight:600;
  opacity:.9; margin-bottom:3px;
  cursor:pointer;
  display:flex;
  align-items:center;
}
.menu-group-title::after{
  content:"▾";
  font-size:.65rem;
  opacity:.7;
  margin-left:auto;
  transition:transform .2s ease;
}
.menu-group.collapsed .menu-group-title::after{
  transform:rotate(-90deg);
}

.menu-links{display:flex;flex-wrap:wrap;gap:4px}
.menu-group.collapsed .menu-links{
  display:none;
}

.menu-chip{
  display:inline-block; padding:3px 10px;
  border-radius:999px; font-size:.75rem;
  text-decoration:none; background:var(--chip-bg);
  border:1px solid rgba(129,140,248,.9); color:#eae6ff;
  white-space:nowrap;
}
.menu-chip:hover{background:var(--chip-hover)}

/* Network/Search fading label */
.menu-chip-network{
  position:relative;
  overflow:hidden;
}
.menu-chip-network .menu-label-main,
.menu-chip-network .menu-label-alt{
  display:inline-block;
  transition:opacity .3s ease;
}
.menu-chip-network .menu-label-alt{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
}
.menu-chip-network .menu-label-main{
  animation:networkLabelMain 3s ease-in-out infinite;
}
.menu-chip-network .menu-label-alt{
  animation:networkLabelAlt 3s ease-in-out infinite;
}
@keyframes networkLabelMain{
  0%,45%{opacity:1;}
  55%,100%{opacity:0;}
}
@keyframes networkLabelAlt{
  0%,45%{opacity:0;}
  55%,100%{opacity:1;}
}

/* --- Floating bubbles with labels --- */
#bubbleStack{
  position:fixed; top:76px; right:16px;
  z-index:9996; display:flex;
  flex-direction:column; gap:6px;
  transition:right .25s ease;
}
.bubble-row{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:2px;
}
.bubble-label{
  font-size:.7rem;
  color:#ffffff;
  opacity:1;
  padding:2px 6px;
  border-radius:8px;
  background:rgba(90,0,160,0.55);
  backdrop-filter:blur(4px);
  border:1px solid rgba(160,100,255,0.4);
  text-shadow:0 0 6px rgba(0,0,0,.85);
}

/* Single bottom up-arrow bubble */
#bubble-top-single{
  position:fixed; right:16px; bottom:18px;
  z-index:9996; transition:right .25s ease;
}

/* shift floaters when menu open */
body.menu-open #bubbleStack,
body.menu-open #bubble-top-single,
body.menu-open #carrieWrap{
  right:340px;
}

.bubble{
  width:42px; height:42px;
  border-radius:999px;
  display:grid; place-items:center;
  background:rgba(18,3,39,.94);
  border:1px solid rgba(129,140,248,.9);
  box-shadow:0 0 10px rgba(124,58,237,.45);
  cursor:pointer; transition:background .2s ease, transform .1s ease;
}
.bubble:hover{
  background:rgba(60,15,90,.95);
  transform:translateY(-1px);
}

/* --- Carrie wrapper & chat bubble --- */
#carrieWrap{
  position:fixed; right:16px; bottom:72px;
  z-index:9997; user-select:none; touch-action:none;
  transition:right .25s ease;
}
#carrie{
  width:min(48vw,260px);
  object-fit:contain;
  background:transparent!important;
  display:block;
  filter:
    drop-shadow(0 14px 32px rgba(15,6,40,.9))
    drop-shadow(0 0 18px rgba(124,58,237,.55));
}
#carrieBubble{
  position:absolute; bottom:100%; right:40px;
  margin-bottom:4px; padding:3px 10px;
  border-radius:999px; font-size:.72rem;
  background:rgba(15,23,42,.95); color:#e5e7eb;
  border:1px solid rgba(129,140,248,.9);
  white-space:nowrap;
}
#carrieBubble::after{
  content:""; position:absolute; top:100%; right:16px;
  border-width:6px 6px 0 6px;
  border-style:solid;
  border-color:rgba(15,23,42,.95) transparent transparent transparent;
}

/* --- Auth lock overlay --- */
#authGateOverlay{
  position:fixed; inset:0; z-index:12000;
  background:radial-gradient(circle at 10% -10%, rgba(124,58,237,.45), rgba(3,0,10,.96));
  display:flex; align-items:center; justify-content:center;
}
#authGateCard{
  width:min(92vw,360px);
  border-radius:18px;
  border:1px solid rgba(129,140,248,.85);
  background:rgba(10,2,26,.96);
  box-shadow:0 20px 40px rgba(0,0,0,.85);
  padding:1.4rem 1.5rem;
  text-align:center;
}
#authGateCard h2{
  font-size:1.05rem; font-weight:700; margin-bottom:.4rem;
}
#authGateCard p{
  font-size:.8rem; opacity:.82; margin-bottom:.8rem;
}
#authGateCard .auth-buttons{
  display:flex; flex-direction:column; gap:.4rem;
}
#authGateCard .auth-buttons a{
  display:block; border-radius:.9rem; padding:.45rem .7rem;
  font-size:.8rem; text-decoration:none;
  border:1px solid rgba(129,140,248,.9);
  background:rgba(15,23,42,.9); color:#e5e7eb;
}
#authGateCard .auth-buttons a:first-child{
  background:#7c3aed; border-color:#7c3aed; color:#fff;
}

@media(max-width:480px){
  #carrie{ width:min(56vw,220px); }
  body.menu-open #bubbleStack,
  body.menu-open #bubble-top-single,
  body.menu-open #carrieWrap{
    right:300px;
  }
}
`;
    document.head.appendChild(css);

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
      <a href="index.html" class="menu-chip">Home</a>
      <a href="network.html" class="menu-chip menu-chip-network">
        <span class="menu-label-main">Network</span>
        <span class="menu-label-alt">Search</span>
      </a>
      <a href="featured.html" class="menu-chip">Featured</a>
      <a href="feed.html" class="menu-chip">Community Feed</a>
      <a href="radio.html" class="menu-chip">Radio</a>
      <a href="podcast.html" class="menu-chip">Podcast</a>
      <a href="fan-zone.html" class="menu-chip">Fan Zone</a>
      <a href="about.html" class="menu-chip">About</a>
      <a href="contact.html" class="menu-chip">Contact</a>
      <a href="blog.html" class="menu-chip">Blog</a>
      <a href="algorithm-points.html" class="menu-chip">Algorithm & Points</a>
      <a href="stories.html" class="menu-chip">Stories</a>
      <a href="announcements.html" class="menu-chip">Announcements</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Studio & AI</div>
    <div class="menu-links">
      <a href="studio-tools.html" class="menu-chip">Studio Tools</a>
      <a href="creator-tools.html" class="menu-chip">Creator Tools</a>
      <a href="lyrics-ai.html" class="menu-chip">Lyrics AI</a>
      <a href="lyric_ai.html" class="menu-chip">Lyrics AI (alt)</a>
      <a href="song-ai.html" class="menu-chip">Song AI</a>
      <a href="album-ai.html" class="menu-chip">Album AI</a>
      <a href="voice-ai.html" class="menu-chip">Voice / Post VO</a>
      <a href="cover_ai.html" class="menu-chip">Cover AI</a>
      <a href="master_ai.html" class="menu-chip">Master AI</a>
      <a href="artist-studio.html" class="menu-chip">Artist Studio</a>
      <a href="author.html" class="menu-chip">Author</a>
      <a href="author-hub.html" class="menu-chip">Author Hub</a>
      <a href="translate.html" class="menu-chip">Translate</a>
      <a href="integration.html" class="menu-chip">Integration</a>
      <a href="stats.html" class="menu-chip">Stats</a>
      <a href="system.html" class="menu-chip">System</a>
      <a href="debug.html" class="menu-chip">Debug</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Games & Tournaments</div>
    <div class="menu-links">
      <a href="game-hub.html" class="menu-chip">Game Hub</a>
      <a href="games.html" class="menu-chip">Games</a>
      <a href="arcade.html" class="menu-chip">Arcade</a>
      <a href="game-music.html" class="menu-chip">Game Music</a>
      <a href="game-tournaments.html" class="menu-chip">Tournaments</a>
      <a href="game-leaderboards.html" class="menu-chip">Leaderboards</a>
      <a href="leaderboard.html" class="menu-chip">Leaderboard (alt)</a>
      <a href="pool-8-ball.html" class="menu-chip">Pool 8-Ball</a>
      <a href="pool-9-ball.html" class="menu-chip">Pool 9-Ball</a>
      <a href="trickshot-pool.html" class="menu-chip">Trickshot Pool</a>
      <a href="game_pool_8ball.html" class="menu-chip">8-Ball (alt)</a>
      <a href="game_pool_9ball.html" class="menu-chip">9-Ball (alt)</a>
      <a href="game_pool_trick.html" class="menu-chip">Trickshot (alt)</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Profiles & Community</div>
    <div class="menu-links">
      <a href="profiles.html" class="menu-chip">All Profiles</a>
      <a href="profile.html" class="menu-chip">My Profile</a>
      <a href="profile_artist.html" class="menu-chip">Artist Profile</a>
      <a href="profile_beatmaker.html" class="menu-chip">Beatmaker Profile</a>
      <a href="profile_author.html" class="menu-chip">Author Profile</a>
      <a href="profile_dancer.html" class="menu-chip">Dancer Profile</a>
      <a href="profile_influencer.html" class="menu-chip">Influencer Profile</a>
      <a href="profile_fan.html" class="menu-chip">Fan Profile</a>
      <a href="kids.html" class="menu-chip">Kids</a>
      <a href="kids-zone.html" class="menu-chip">Kids Zone</a>
      <a href="kids_games.html" class="menu-chip">Kids Games</a>
      <a href="kids_stories.html" class="menu-chip">Kids Stories</a>
      <a href="chat.html" class="menu-chip">Chat</a>
      <a href="dm.html" class="menu-chip">DM</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Shop & Coins</div>
    <div class="menu-links">
      <a href="shop.html" class="menu-chip">Shop</a>
      <a href="store.html" class="menu-chip">Store (alt)</a>
      <a href="shop-stickers.html" class="menu-chip">Shop Stickers</a>
      <a href="shop-upgrades.html" class="menu-chip">Shop Upgrades</a>
      <a href="stickers.html" class="menu-chip">Stickers</a>
      <a href="coinshop.html" class="menu-chip">Coin Shop</a>
      <a href="game-coin-shop.html" class="menu-chip">Game Coin Shop</a>
      <a href="upgrades.html" class="menu-chip">Upgrades</a>
      <a href="pricing.html" class="menu-chip">Pricing</a>
      <a href="donate.html" class="menu-chip">Donate</a>
      <a href="thank_you.html" class="menu-chip">Thank You</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Admin / Mod / Owner</div>
    <div class="menu-links">
      <a href="admin.html" class="menu-chip">Admin</a>
      <a href="admin-panel.html" class="menu-chip">Admin Panel</a>
      <a href="admin_panel.html" class="menu-chip">Admin Panel (alt)</a>
      <a href="admin-hub.html" class="menu-chip">Admin Hub</a>
      <a href="admin-guide.html" class="menu-chip">Admin Guide</a>
      <a href="admin_guide.html" class="menu-chip">Admin Guide (alt)</a>
      <a href="mod-hub.html" class="menu-chip">Mod Hub</a>
      <a href="mod-panel.html" class="menu-chip">Mod Panel</a>
      <a href="mod_panel.html" class="menu-chip">Mod Panel (alt)</a>
      <a href="owner.html" class="menu-chip">Owner</a>
      <a href="owner-studio.html" class="menu-chip">Owner Studio</a>
      <a href="owner-panel.html" class="menu-chip">Owner Panel</a>
      <a href="owner_picks.html" class="menu-chip">Owner Picks</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Info & Legal</div>
    <div class="menu-links">
      <a href="faq.html" class="menu-chip">FAQ</a>
      <a href="help.html" class="menu-chip">Help</a>
      <a href="rules.html" class="menu-chip">Rules</a>
      <a href="privacy.html" class="menu-chip">Privacy</a>
      <a href="terms.html" class="menu-chip">Terms</a>
      <a href="tos_updates.html" class="menu-chip">TOS Updates</a>
      <a href="credits.html" class="menu-chip">Credits</a>
      <a href="press.html" class="menu-chip">Press</a>
      <a href="reset-password.html" class="menu-chip">Reset Password</a>
      <a href="reset_password.html" class="menu-chip">Reset Password (alt)</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Carrie & Fun</div>
    <div class="menu-links">
      <a href="carrie-chat.html" class="menu-chip">Carrie Chat</a>
      <a href="carrie-closet.html" class="menu-chip">Carrie Closet</a>
      <a href="carrie-concerts.html" class="menu-chip">Carrie Concerts</a>
      <a href="kids-zone.html" class="menu-chip">Kids Zone</a>
      <a href="system.html" class="menu-chip">System</a>
      <a href="debug.html" class="menu-chip">Debug</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Account</div>
    <div class="menu-links">
      <a href="login.html" class="menu-chip">Log in</a>
      <a href="signup.html" class="menu-chip">Sign up</a>
      <a href="profile.html" class="menu-chip">My Account</a>
      <a href="logout.html" class="menu-chip">Log out</a>
    </div>
  </div>
</nav>

<div id="bubbleStack">
  <div class="bubble-row">
    <span class="bubble-label">Contact</span>
    <button class="bubble" id="bubble-contact" title="Contact"><span>✉️</span></button>
  </div>
  <div class="bubble-row">
    <span class="bubble-label">Donate</span>
    <button class="bubble" id="bubble-donate" title="Donate"><span>💜</span></button>
  </div>
  <div class="bubble-row">
    <span class="bubble-label">Footer</span>
    <button class="bubble" id="bubble-footer" title="Go to footer"><span>⬇️</span></button>
  </div>
  <div class="bubble-row">
    <span class="bubble-label">Theme</span>
    <button class="bubble" id="bubble-theme" title="Light / Dark"><span>☯️</span></button>
  </div>
  <div class="bubble-row">
    <span class="bubble-label">Random</span>
    <button class="bubble" id="bubble-theme-random" title="Random theme"><span>🔀</span></button>
  </div>
  <!-- ✅ Stream 8BFR bubble -->
  <div class="bubble-row">
    <span class="bubble-label">Stream 8BFR</span>
    <button class="bubble" id="bubble-stream" title="Stream 8BFR"><span>🎧</span></button>
  </div>
</div>

<button class="bubble" id="bubble-top-single" title="Back to top">
  <span>⬆️</span>
</button>
`;

    // ✅ Only add global Carrie on pages that did NOT opt out
    if (!noCarrie) {
      html += `
<div id="carrieWrap" title="Chat avatar (global)">
  <div id="carrieBubble">Chat with me</div>
  <video
    id="carrie"
    src="assets/videos/carrie_casual_animate_3_1.webm"
    autoplay
    loop
    muted
    playsinline
  ></video>
</div>
`;
    }

    ui.innerHTML = html;
    document.body.appendChild(ui);

    // ---------- MENU CONTROL ----------
    const fab = document.getElementById("fab");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("menu-backdrop");
    let timer = null;

    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("menu-open");
      resetTimer();
    }
    function closeMenu() {
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

    fab.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    menu.addEventListener("pointermove", resetTimer);
    menu.addEventListener("wheel", resetTimer);

    const groups = menu.querySelectorAll(".menu-group");
    groups.forEach((group) => {
      const title = group.querySelector(".menu-group-title");
      if (!title) return;
      title.addEventListener("click", () => {
        const willOpen = group.classList.contains("collapsed");
        groups.forEach((g) => g.classList.add("collapsed"));
        if (willOpen) group.classList.remove("collapsed");
      });
    });

    // ---------- Carrie drag + resize + click ----------
    const carrieWrap = document.getElementById("carrieWrap");
    const carrie = document.getElementById("carrie");
    const carrieBubble = document.getElementById("carrieBubble");

    // ✅ global avatar video options (Carrie / James / Azreen)
    const GLOBAL_AVATAR_VIDEOS = {
      carrie: "assets/videos/carrie_casual_animate_3_1.webm",
      james: "assets/videos/james-casual.webm",
      azreen: "assets/videos/azreen-business.webm",
    };

    // ✅ base scales so James & Azreen shrink slightly to match Carrie
    const AVATAR_SCALES = {
      carrie: 1.0,
      james: 0.85,
      azreen: 0.85,
    };

    function getGlobalAvatar() {
      try {
        const a = localStorage.getItem("carrie_avatar");
        if (a === "james" || a === "azreen" || a === "carrie") {
          return a;
        }
      } catch (e) {}
      return "carrie";
    }

    // size / scale
    let carrieScale = 1;           // user resize factor
    let carrieAvatarBaseScale = 1; // avatar baseline

    function applyCarrieScale() {
      const scale = carrieAvatarBaseScale * carrieScale;
      if (carrie) {
        carrie.style.transform = `scale(${scale})`;
      }
      if (carrieBubble) {
        carrieBubble.style.transform = `scale(${scale})`;
      }
    }

    function applyGlobalAvatar() {
      const avatar = getGlobalAvatar();

      if (carrie) {
        const src = GLOBAL_AVATAR_VIDEOS[avatar] || GLOBAL_AVATAR_VIDEOS.carrie;
        if (carrie.getAttribute("src") !== src) {
          carrie.src = src;
          try {
            carrie.load();
            carrie.play().catch(function () {});
          } catch (e) {}
        }

        carrieAvatarBaseScale = AVATAR_SCALES[avatar] || 1.0;
        applyCarrieScale();
      }
    }

    applyGlobalAvatar();

    // stay in sync if some other page (home switcher) changes avatar
    window.addEventListener("storage", (ev) => {
      if (ev.key === "carrie_avatar") {
        applyGlobalAvatar();
      }
    });

    // position + movement
    let dragging = false;
    let moved = false;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    let pinchActive = false;
    let pinchStartDist = 0;
    let carrieStartScale = 1;
    let mouseResizeActive = false;
    let mouseResizeStartY = 0;

    function clampScale(v) {
      return Math.max(0.5, v);
    }

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
      carrieWrap.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      carrieWrap.addEventListener("mousedown", startDragOrResize);
      carrieWrap.addEventListener("touchstart", startTouch, { passive: false });
    }

    function startDragOrResize(e) {
      if (e.button === 2) {
        mouseResizeActive = true;
        mouseResizeStartY = e.clientY;
        carrieStartScale = carrieScale;
        moved = false;
        dragging = false;
        e.preventDefault();
        return;
      }

      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x;
      sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left;
      oy = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
    }

    function startTouch(e) {
      if (e.touches && e.touches.length >= 2) {
        pinchActive = true;
        dragging = false;
        moved = false;
        pinchStartDist = getTouchDistance(e);
        carrieStartScale = carrieScale;
        e.preventDefault();
        return;
      }

      dragging = true;
      moved = false;
      const p = ptr(e);
      sx = p.x;
      sy = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      ox = rect.left;
      oy = rect.top;
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
        const ratio = dist / pinchStartDist;
        carrieScale = clampScale(carrieStartScale * ratio);
        applyCarrieScale();
        e.preventDefault();
        return;
      }

      if (mouseResizeActive && !e.touches) {
        const dy = e.clientY - mouseResizeStartY;
        const ratio = 1 - dy / 300;
        carrieScale = clampScale(carrieStartScale * ratio);
        applyCarrieScale();
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
      if (e && e.touches && e.touches.length > 0) {
        return;
      }
      dragging = false;
      pinchActive = false;
      mouseResizeActive = false;
    }

    if (carrie) {
      try {
        carrie.muted = true;
        carrie.autoplay = true;
        carrie.playsInline = true;
        carrie.play().catch(function () {});
      } catch (e) {}
    }

    // ✅ Desktop click
    if (carrie) {
      carrie.addEventListener("click", () => {
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });

      // ✅ Mobile tap
      carrie.addEventListener("touchend", () => {
        if (!moved && !pinchActive && !mouseResizeActive) {
          window.location.href = "carrie-chat.html";
        }
      });
    }

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
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
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
      try {
        localStorage.setItem("8bfr-theme", name);
      } catch {}
    }

    function getCurrentTheme() {
      try {
        return localStorage.getItem("8bfr-theme") || "dark";
      } catch {
        return "dark";
      }
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

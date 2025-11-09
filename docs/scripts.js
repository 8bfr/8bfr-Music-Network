// 8BFR global UI v16 — Carrie above arrow, labeled bubbles, theme toggle + random
(function () {
  function injectGlobalUI() {
    if (document.getElementById("fab")) return; // already injected

    // ---------- STYLES ----------
    const css = document.createElement("style");
    css.textContent = `
:root{
  --ring: rgba(124,58,237,.65);
  --glass: rgba(12,6,24,.88);
  --chip-bg: rgba(18,3,39,.96);
  --chip-hover: rgba(55,9,90,1);
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
}
.menu-links{display:flex;flex-wrap:wrap;gap:4px}
.menu-chip{
  display:inline-block; padding:3px 10px;
  border-radius:999px; font-size:.75rem;
  text-decoration:none; background:var(--chip-bg);
  border:1px solid rgba(129,140,248,.9); color:#eae6ff;
  white-space:nowrap;
}
.menu-chip:hover{background:var(--chip-hover)}

/* --- Floating bubbles with labels --- */
#bubbleStack{
  position:fixed; top:76px; right:16px;
  z-index:9996; display:flex;
  flex-direction:column; gap:6px;
  transition:right .25s ease;
}
.bubble-row{
  display:flex; align-items:center;
  justify-content:flex-end; gap:6px;
}
.bubble-label{
  font-size:.7rem; color:#e5e7eb;
  opacity:.78; text-shadow:0 0 4px rgba(15,23,42,.9);
}

/* Single bottom up-arrow bubble */
#bubble-top-single{
  position:fixed; right:16px; bottom:18px;
  z-index:9996; transition:right .25s ease;
}

/* shift all floaters when menu open */
body.menu-open #bubbleStack,
body.menu-open #bubble-top-single,
body.menu-open #carrieWrap{
  right:300px;
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
  position:fixed; right:16px; bottom:72px; /* above up arrow */
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

@media(max-width:480px){
  #carrie{ width:min(56vw,220px); }
  body.menu-open #bubbleStack,
  body.menu-open #bubble-top-single,
  body.menu-open #carrieWrap{
    right:260px;
  }
}
`;
    document.head.appendChild(css);

    // ---------- HTML SHELL ----------
    const ui = document.createElement("div");
    ui.innerHTML = `
<button id="fab" aria-label="Open navigation">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round">
    <path d="M4 6h16M4 12h12M4 18h8"/>
  </svg>
</button>
<div id="menu-backdrop"></div>

<nav id="menu" aria-hidden="true">
  <h2>8BFR Navigation</h2>

  <div class="menu-group">
    <div class="menu-group-title">Home & Core</div>
    <div class="menu-links">
      <a href="index.html" class="menu-chip">Home</a>
      <a href="home.html" class="menu-chip">Home (alt)</a>
      <a href="featured.html" class="menu-chip">Featured</a>
      <a href="feed.html" class="menu-chip">Community Feed</a>
      <a href="radio.html" class="menu-chip">Radio</a>
      <a href="podcast.html" class="menu-chip">Podcast</a>
      <a href="fan-zone.html" class="menu-chip">Fan Zone</a>
      <a href="about.html" class="menu-chip">About</a>
      <a href="contact.html" class="menu-chip">Contact</a>
      <a href="blog.html" class="menu-chip">Blog</a>
      <a href="posts.html" class="menu-chip">Posts</a>
      <a href="stories.html" class="menu-chip">Stories</a>
      <a href="announcements.html" class="menu-chip">Announcements</a>
    </div>
  </div>

  <div class="menu-group">
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

  <div class="menu-group">
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

  <div class="menu-group">
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

  <div class="menu-group">
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

  <div class="menu-group">
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

  <div class="menu-group">
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

  <div class="menu-group">
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
</div>

<button class="bubble" id="bubble-top-single" title="Back to top">
  <span>⬆️</span>
</button>

<div id="carrieWrap" title="Chat with Carrie (drag)">
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

    // ---------- CARRIE DRAG + CLICK ----------
    const carrieWrap = document.getElementById("carrieWrap");
    const carrie = document.getElementById("carrie");

    let dragging = false,
      moved = false,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0;

    function ptr(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX, y: t.clientY };
    }

    carrieWrap.addEventListener("mousedown", startDrag);
    carrieWrap.addEventListener("touchstart", startDrag, { passive: false });

    function startDrag(e) {
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

    window.addEventListener("mousemove", onDrag, { passive: false });
    window.addEventListener("touchmove", onDrag, { passive: false });

    function onDrag(e) {
      if (!dragging) return;
      const p = ptr(e);
      const dx = p.x - sx;
      const dy = p.y - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      carrieWrap.style.left = ox + dx + "px";
      carrieWrap.style.top = oy + dy + "px";
    }

    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);

    function endDrag() {
      dragging = false;
    }

    // Only open chat if it's a click, not a drag
    carrie.addEventListener("click", () => {
      if (!moved) window.location.href = "carrie-chat.html";
    });

    // ---------- BUBBLES ----------
    const contact = document.getElementById("bubble-contact");
    const donate = document.getElementById("bubble-donate");
    const footerBtn = document.getElementById("bubble-footer");
    const topBtn = document.getElementById("bubble-top-single");
    const themeBtn = document.getElementById("bubble-theme");
    const themeRandomBtn = document.getElementById("bubble-theme-random");

    contact.addEventListener("click", () => {
      window.location.href = "contact.html";
    });

    donate.addEventListener("click", () => {
      const donateSection = document.getElementById("donate");
      if (donateSection) {
        donateSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "donate.html";
      }
    });

    footerBtn.addEventListener("click", () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    });

    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ---------- THEMES (light / dark / random) ----------
    const themes = [
      {
        name: "dark",
        bg: "linear-gradient(#0b0014,#000000)",
        color: "#eae6ff",
      },
      {
        name: "light",
        bg: "#f5f5ff",
        color: "#111827",
      },
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

    // initial theme
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  } else {
    injectGlobalUI();
  }
})();

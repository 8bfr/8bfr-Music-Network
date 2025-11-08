// 8BFR global UI v13 — floating menu, Carrie avatar docked to menu, bubbles
(function () {
  function injectGlobalUI() {
    // Don’t inject twice
    if (document.getElementById("fab")) return;

    // ---------- STYLES ----------
    const css = document.createElement("style");
    css.textContent = `
:root{
  --ring: rgba(124,58,237,.65);
  --glass: rgba(12,6,24,.88);
  --chip-bg: rgba(18,3,39,.96);
  --chip-hover: rgba(55,9,90,1);
}
#fab{
  position:fixed;
  top:10px;
  right:14px;
  z-index:9999;
  width:56px;
  height:56px;
  border-radius:9999px;
  display:grid;
  place-items:center;
  cursor:pointer;
  background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.60), rgba(10,10,20,.80));
  border:1px solid rgba(124,58,237,.60);
  box-shadow:0 0 14px rgba(124,58,237,.40),0 0 18px rgba(0,217,255,.25) inset;
}
#fab:hover{
  filter:brightness(1.05);
}
#fab svg{
  display:block;
}
#menu-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.25);
  backdrop-filter:blur(1px);
  z-index:9990;
  opacity:0;
  pointer-events:none;
  transition:opacity .18s ease;
}
#menu-backdrop.open{
  opacity:1;
  pointer-events:auto;
}
#menu{
  position:fixed;
  top:72px;
  right:14px;
  width:min(92vw,280px);
  max-height:calc(100vh - 88px);
  overflow-y:auto;
  z-index:9998;
  transform:translateX(115%);
  transition:transform .25s ease;
  backdrop-filter:blur(12px);
  background:var(--glass);
  border:1px solid var(--ring);
  border-radius:14px;
  box-shadow:0 14px 32px rgba(0,0,0,.6);
  padding:8px 7px 10px;
}
#menu.open{
  transform:translateX(0);
}
#menu h2{
  font-size:.85rem;
  text-transform:uppercase;
  letter-spacing:.12em;
  opacity:.9;
  margin:2px 6px 4px;
}
.menu-group{
  margin:4px 0 6px;
  padding:4px 4px 6px;
  border-radius:10px;
  border:1px solid rgba(139,92,246,.48);
  background:rgba(10,2,26,.85);
}
.menu-group-title{
  font-size:.78rem;
  font-weight:600;
  opacity:.9;
  margin-bottom:3px;
}
.menu-links{
  display:flex;
  flex-wrap:wrap;
  gap:4px;
}
.menu-chip{
  display:inline-block;
  padding:3px 10px;
  border-radius:999px;
  font-size:.75rem;
  text-decoration:none;
  background:var(--chip-bg);
  border:1px solid rgba(129,140,248,.9);
  color:#eae6ff;
  white-space:nowrap;
}
.menu-chip:hover{
  background:var(--chip-hover);
}

#bubbleStack{
  position:fixed;
  top:76px;
  right:16px;
  z-index:9996;
  display:flex;
  flex-direction:column;
  gap:9px;
}
.bubble{
  width:42px;
  height:42px;
  border-radius:999px;
  display:grid;
  place-items:center;
  background:rgba(18,3,39,.94);
  border:1px solid rgba(129,140,248,.9);
  box-shadow:0 0 10px rgba(124,58,237,.45);
  cursor:pointer;
}
.bubble span{
  font-size:1rem;
}

/* Carrie wrapper + chat bubble */
#carrieWrap{
  position:fixed;
  right:16px;
  bottom:80px;
  z-index:9997;
  user-select:none;
  touch-action:none;
  transition:right .25s ease;
}
body.menu-open #carrieWrap{
  right:300px; /* dock Carrie to the left of the open menu */
}
#carrie{
  width:min(48vw,260px);
  height:auto;
  display:block;
  background:transparent !important;
  object-fit:contain;
  filter:
    drop-shadow(0 14px 32px rgba(15,6,40,.9))
    drop-shadow(0 0 18px rgba(124,58,237,.55));
}
#carrieBubble{
  position:absolute;
  bottom:100%;
  right:40px;
  margin-bottom:4px;
  padding:3px 10px;
  border-radius:999px;
  font-size:.72rem;
  background:rgba(15,23,42,.95);
  color:#e5e7eb;
  border:1px solid rgba(129,140,248,.9);
  white-space:nowrap;
}
#carrieBubble::after{
  content:"";
  position:absolute;
  top:100%;
  right:16px;
  border-width:6px 6px 0 6px;
  border-style:solid;
  border-color:rgba(15,23,42,.95) transparent transparent transparent;
}
@media (max-width:480px){
  #carrie{
    width:min(56vw,220px);
  }
  body.menu-open #carrieWrap{
    right:260px;
  }
}
`;
    document.head.appendChild(css);

    // ---------- SHELL HTML ----------
    const shell = document.createElement("div");
    shell.innerHTML = `
<button id="fab" aria-label="Open navigation" aria-controls="menu" aria-expanded="false">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round">
    <path d="M4 6h16M4 12h12M4 18h8"></path>
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
      <a href="author.html" class="menu-chip">Author</a>
      <a href="author-hub.html" class="menu-chip">Author Hub</a>
      <a href="translate.html" class="menu-chip">Translate</a>
      <a href="artist-studio.html" class="menu-chip">Artist Studio</a>
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
  <button class="bubble" id="bubble-contact" title="Contact">
    <span>✉️</span>
  </button>
  <button class="bubble" id="bubble-donate" title="Donate">
    <span>💜</span>
  </button>
  <button class="bubble" id="bubble-footer" title="Go to footer">
    <span>⬇️</span>
  </button>
  <button class="bubble" id="bubble-top" title="Back to top">
    <span>⬆️</span>
  </button>
</div>

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
    document.body.appendChild(shell);

    // ---------- MENU LOGIC ----------
    const fab = document.getElementById("fab");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("menu-backdrop");
    let timer = null;

    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      resetTimer();
    }
    function closeMenu() {
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
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
      if (menu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
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

    let dragging = false;
    let startX = 0,
      startY = 0,
      origX = 0,
      origY = 0;
    let moved = false;

    function ptrPos(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX, y: t.clientY };
    }

    function onDown(ev) {
      dragging = true;
      moved = false;
      const p = ptrPos(ev);
      startX = p.x;
      startY = p.y;
      const rect = carrieWrap.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
      ev.preventDefault();
    }

    function onMove(ev) {
      if (!dragging) return;
      const p = ptrPos(ev);
      const dx = p.x - startX;
      const dy = p.y - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      carrieWrap.style.left = origX + dx + "px";
      carrieWrap.style.top = origY + dy + "px";
    }

    function onUp() {
      dragging = false;
    }

    carrieWrap.addEventListener("mousedown", onDown);
    carrieWrap.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    // open chat only if you *click* Carrie, not just drag her
    carrie.addEventListener("click", () => {
      if (moved) return;
      window.location.href = "carrie-chat.html";
    });

    // ---------- BUBBLE ACTIONS ----------
    const bContact = document.getElementById("bubble-contact");
    const bDonate = document.getElementById("bubble-donate");
    const bFooter = document.getElementById("bubble-footer");
    const bTop = document.getElementById("bubble-top");

    if (bContact) {
      bContact.addEventListener("click", () => {
        window.location.href = "contact.html";
      });
    }
    if (bDonate) {
      bDonate.addEventListener("click", () => {
        const donateSection = document.getElementById("donate");
        if (donateSection) {
          donateSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "donate.html";
        }
      });
    }
    if (bFooter) {
      bFooter.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
    }
    if (bTop) {
      bTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  } else {
    injectGlobalUI();
  }
})();

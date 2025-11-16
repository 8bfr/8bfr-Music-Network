// scripts.js – global 8BFR UI (Carrie + floating menu + bubbles + auth gate)
(function () {
  const SUPABASE_URL =
    "https://novbuvwpjnxwwvdekjhr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  // ---------- SUPABASE LOADER + AUTH GATE ----------
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
      "",
      "login.html",
      "signup.html",
      "reset-password.html",
      "reset_password.html",
      "logout.html",
      "carrie-chat.html"
    ];
    let path = window.location.pathname.split("/").pop();
    if (path === undefined || path === null) path = "";
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

  // ---------- GLOBAL UI INJECTION ----------
  function injectGlobalUI() {
    // Prevent double-inject
    if (document.getElementById("fab")) {
      enforceAuthGate();
      return;
    }

    const path = window.location.pathname.split("/").pop() || "index.html";

    // --- CSS ---
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

/* shift page content left when menu is open (if #pageWrap exists) */
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

    // --- HTML SHELL (menu + bubbles + Carrie) ---
    const ui = document.createElement("div");
    ui.innerHTML = `
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
      <a href="network.html" class="menu-chip">Network / Search</a>
      <a href="featured.html" class="menu-chip">Featured</a>
      <a href="feed.html" class="menu-chip">Community Feed</a>
      <a href="radio.html" class="menu-chip">Radio</a>
      <a href="podcast.html" class="menu-chip">Podcast</a>
      <a href="about.html" class="menu-chip">About</a>
      <a href="contact.html" class="menu-chip">Contact</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Studio & AI</div>
    <div class="menu-links">
      <a href="studio-tools.html" class="menu-chip">Studio Tools</a>
      <a href="lyrics-ai.html" class="menu-chip">Lyrics AI</a>
      <a href="song-ai.html" class="menu-chip">Song AI</a>
      <a href="album-ai.html" class="menu-chip">Album AI</a>
      <a href="voice-ai.html" class="menu-chip">Voice / Post VO</a>
      <a href="author-hub.html" class="menu-chip">Author Hub</a>
      <a href="stats.html" class="menu-chip">Stats</a>
      <a href="system.html" class="menu-chip">System</a>
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
      <a href="fan-zone.html" class="menu-chip">Fan Zone</a>
      <a href="kids-zone.html" class="menu-chip">Kids Zone</a>
      <a href="chat.html" class="menu-chip">Site Chat</a>
      <a href="carrie-chat.html" class="menu-chip">Carrie Chat</a>
    </div>
  </div>

  <div class="menu-group collapsed">
    <div class="menu-group-title">Shop & Coins</div>
    <div class="menu-links">
      <a href="shop.html" class="menu-chip">Shop</a>
      <a href="coinshop.html" class="menu-chip">Coin Shop</a>
      <a href="upgrades.html" class="menu-chip">Upgrades</a>
      <a href="donate.html" class="menu-chip">Donate</a>
      <a href="thank_you.html" class="menu-chip">Thank You</a>
      <a href="carrie-closet.html" class="menu-chip">Carrie Closet</a>
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
  <div class="bubble-row">
    <span class="bubble-label">Stream 8BFR</span>
    <button class="bubble" id="bubble-stream" title="Stream 8BFR"><span>🎧</span></button>
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
    let menuTimer = null;

    function closeMenu() {
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.classList.remove("menu-open");
      clearTimeout(menuTimer);
      menuTimer = null;
    }
    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("menu-open");
      resetMenuTimer();
    }
    function resetMenuTimer() {
      clearTimeout(menuTimer);
      menuTimer = setTimeout(closeMenu, 20000);
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
    menu.addEventListener("pointermove", resetMenuTimer);
    menu.addEventListener("wheel", resetMenuTimer);

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

    // ---------- CARRIE DRAG ----------
    const carrieWrap = document.getElementById("carrieWrap");
    const carrie = document.getElementById("carrie");

    let dragging = false;
    let startX = 0, startY = 0;
    let originLeft = 0, originTop = 0;

    function ptr(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX, y: t.clientY };
    }

    if (carrieWrap) {
      carrieWrap.addEventListener("mousedown", (e) => {
        dragging = true;
        const p = ptr(e);
        startX = p.x;
        startY = p.y;
        const rect = carrieWrap.getBoundingClientRect();
        originLeft = rect.left;
        originTop = rect.top;
        carrieWrap.style.right = "auto";
        carrieWrap.style.bottom = "auto";
        e.preventDefault();
      });
      carrieWrap.addEventListener("touchstart", (e) => {
        dragging = true;
        const p = ptr(e);
        startX = p.x;
        startY = p.y;
        const rect = carrieWrap.getBoundingClientRect();
        originLeft = rect.left;
        originTop = rect.top;
        carrieWrap.style.right = "auto";
        carrieWrap.style.bottom = "auto";
      }, { passive: true });
    }

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const p = ptr(e);
      const dx = p.x - startX;
      const dy = p.y - startY;
      carrieWrap.style.left = originLeft + dx + "px";
      carrieWrap.style.top = originTop + dy + "px";
      e.preventDefault();
    });
    window.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const p = ptr(e);
      const dx = p.x - startX;
      const dy = p.y - startY;
      carrieWrap.style.left = originLeft + dx + "px";
      carrieWrap.style.top = originTop + dy + "px";
    }, { passive: true });
    window.addEventListener("mouseup", () => { dragging = false; });
    window.addEventListener("touchend", () => { dragging = false; });

    if (carrie) {
      try {
        carrie.muted = true;
        carrie.autoplay = true;
        carrie.playsInline = true;
        carrie.play().catch(() => {});
      } catch (e) {}
      carrie.addEventListener("click", () => {
        window.location.href = "carrie-chat.html";
      });
      carrie.addEventListener("touchend", () => {
        window.location.href = "carrie-chat.html";
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
      { name: "dark",   bg: "linear-gradient(#0b0014,#000000)", color: "#eae6ff" },
      { name: "light",  bg: "#f5f5ff",                            color: "#111827" },
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
          "https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x",
          "_blank",
          "noopener"
        );
      });
    }

    // ---------- SPECIAL: CHAT PAGE → ONLY HAMBURGER + CARRIE ----------
    if (path === "carrie-chat.html") {
      const stack = document.getElementById("bubbleStack");
      if (stack) stack.style.display = "none";
      const topBubble = document.getElementById("bubble-top-single");
      if (topBubble) topBubble.style.display = "none";
    }

    enforceAuthGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  } else {
    injectGlobalUI();
  }
})();

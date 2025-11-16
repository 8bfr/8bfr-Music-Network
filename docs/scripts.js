// scripts.js – minimal global 8BFR UI
(function () {
  console.log("8BFR scripts.js loaded");

  function injectUI() {
    // Prevent double inject
    if (document.getElementById("fab")) return;

    const path = window.location.pathname.split("/").pop() || "index.html";

    // ---------- STYLES ----------
    const css = document.createElement("style");
    css.textContent = `
:root{
  --ring: rgba(124,58,237,.65);
  --glass: rgba(12,6,24,.88);
}

/* Floating menu button */
#fab{
  position:fixed; top:10px; right:14px;
  z-index:9999; width:52px; height:52px;
  border-radius:9999px; display:grid; place-items:center;
  background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.60), rgba(10,10,20,.80));
  border:1px solid rgba(124,58,237,.60);
  box-shadow:0 0 14px rgba(124,58,237,.40),0 0 18px rgba(0,217,255,.25) inset;
  cursor:pointer; transition:filter .2s ease;
}
#fab:hover{ filter:brightness(1.1); }
#fab svg{display:block}

/* Menu backdrop */
#menu-backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.25);
  backdrop-filter:blur(2px); z-index:9990;
  opacity:0; pointer-events:none; transition:opacity .2s ease;
}
#menu-backdrop.open{opacity:1;pointer-events:auto}

/* Menu panel */
#menu{
  position:fixed; top:72px; right:14px;
  width:min(92vw,260px); max-height:calc(100vh - 88px);
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
.menu-group.collapsed .menu-links{ display:none; }

.menu-chip{
  display:inline-block; padding:3px 10px;
  border-radius:999px; font-size:.75rem;
  text-decoration:none; background:rgba(18,3,39,.96);
  border:1px solid rgba(129,140,248,.9); color:#eae6ff;
  white-space:nowrap;
}
.menu-chip:hover{background:rgba(55,9,90,1)}

/* Bubbles stack */
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
  right:300px;
}

.bubble{
  width:40px; height:40px;
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

/* Carrie */
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

    // ---------- MENU ----------
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

    // ---------- CARRIE DRAG + CLICK ----------
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

    // ---------- Chat page: hide bubbles ----------
    if (path === "carrie-chat.html") {
      const stack = document.getElementById("bubbleStack");
      if (stack) stack.style.display = "none";
      const topBubble = document.getElementById("bubble-top-single");
      if (topBubble) topBubble.style.display = "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectUI);
  } else {
    injectUI();
  }
})();

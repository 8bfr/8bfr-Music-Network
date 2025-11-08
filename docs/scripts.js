// 8BFR global UI v15 — Carrie docked, all bubbles slide with menu
(function () {
  function injectGlobalUI() {
    if (document.getElementById("fab")) return;

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
#menu-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.25);backdrop-filter:blur(2px);
z-index:9990;opacity:0;pointer-events:none;transition:opacity .2s;}
#menu-backdrop.open{opacity:1;pointer-events:auto}
#menu{
  position:fixed;top:72px;right:14px;width:min(92vw,280px);max-height:calc(100vh - 88px);
  overflow-y:auto;z-index:9998;transform:translateX(115%);transition:transform .25s ease;
  backdrop-filter:blur(12px);background:var(--glass);border:1px solid var(--ring);
  border-radius:14px;box-shadow:0 14px 32px rgba(0,0,0,.6);
  padding:8px 7px 10px;
}
#menu.open{transform:translateX(0)}
#menu h2{font-size:.85rem;text-transform:uppercase;letter-spacing:.12em;opacity:.9;margin:2px 6px 4px}
.menu-group{margin:4px 0 6px;padding:4px 4px 6px;border-radius:10px;border:1px solid rgba(139,92,246,.48);background:rgba(10,2,26,.85)}
.menu-group-title{font-size:.78rem;font-weight:600;opacity:.9;margin-bottom:3px}
.menu-links{display:flex;flex-wrap:wrap;gap:4px}
.menu-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.75rem;text-decoration:none;background:var(--chip-bg);border:1px solid rgba(129,140,248,.9);color:#eae6ff}
.menu-chip:hover{background:var(--chip-hover)}

/* --- Floating bubbles --- */
#bubbleStack{
  position:fixed; top:76px; right:16px; z-index:9996;
  display:flex; flex-direction:column; gap:9px;
  transition:right .25s ease;
}
#bubble-top-single{
  position:fixed; right:16px; bottom:18px; z-index:9996;
  transition:right .25s ease;
}
body.menu-open #bubbleStack,
body.menu-open #bubble-top-single{ right:300px; }

.bubble{
  width:42px; height:42px; border-radius:999px;
  display:grid; place-items:center;
  background:rgba(18,3,39,.94);
  border:1px solid rgba(129,140,248,.9);
  box-shadow:0 0 10px rgba(124,58,237,.45);
  cursor:pointer; transition:background .2s ease;
}
.bubble:hover{background:rgba(60,15,90,.95)}

/* --- Carrie wrapper & chat bubble --- */
#carrieWrap{
  position:fixed; right:16px; bottom:72px; z-index:9997;
  user-select:none; touch-action:none; transition:right .25s ease;
}
body.menu-open #carrieWrap{ right:300px; }
#carrie{ width:min(48vw,260px); object-fit:contain;
  background:transparent!important; display:block;
  filter:drop-shadow(0 14px 32px rgba(15,6,40,.9)) drop-shadow(0 0 18px rgba(124,58,237,.55));
}
#carrieBubble{
  position:absolute; bottom:100%; right:40px; margin-bottom:4px;
  padding:3px 10px; border-radius:999px; font-size:.72rem;
  background:rgba(15,23,42,.95); color:#e5e7eb;
  border:1px solid rgba(129,140,248,.9); white-space:nowrap;
}
#carrieBubble::after{
  content:""; position:absolute; top:100%; right:16px;
  border-width:6px 6px 0 6px; border-style:solid;
  border-color:rgba(15,23,42,.95) transparent transparent transparent;
}
@media(max-width:480px){
  #carrie{width:min(56vw,220px)}
  body.menu-open #bubbleStack,
  body.menu-open #bubble-top-single,
  body.menu-open #carrieWrap{right:260px}
}`;
    document.head.appendChild(css);

    // ---------- HTML SHELL ----------
    const ui = document.createElement("div");
    ui.innerHTML = `
<button id="fab" aria-label="Open navigation"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h12M4 18h8"/></svg></button>
<div id="menu-backdrop"></div>
<nav id="menu" aria-hidden="true">
  <h2>8BFR Navigation</h2>
  <div class="menu-group"><div class="menu-group-title">Core</div><div class="menu-links">
    <a href="index.html" class="menu-chip">Home</a>
    <a href="featured.html" class="menu-chip">Featured</a>
    <a href="feed.html" class="menu-chip">Feed</a>
    <a href="radio.html" class="menu-chip">Radio</a>
    <a href="contact.html" class="menu-chip">Contact</a>
  </div></div>
</nav>

<div id="bubbleStack">
  <button class="bubble" id="bubble-contact" title="Contact"><span>✉️</span></button>
  <button class="bubble" id="bubble-donate" title="Donate"><span>💜</span></button>
  <button class="bubble" id="bubble-footer" title="Footer"><span>⬇️</span></button>
</div>

<button class="bubble" id="bubble-top-single" title="Back to top"><span>⬆️</span></button>

<div id="carrieWrap" title="Chat with Carrie (drag)">
  <div id="carrieBubble">Chat with me</div>
  <video id="carrie" src="assets/videos/carrie_casual_animate_3_1.webm" autoplay loop muted playsinline></video>
</div>
`;
    document.body.appendChild(ui);

    // ---------- MENU CONTROL ----------
    const fab = document.getElementById("fab"),
      menu = document.getElementById("menu"),
      backdrop = document.getElementById("menu-backdrop");
    let timer;

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
    }
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(closeMenu, 20000);
    }
    fab.onclick = (e) => {
      e.stopPropagation();
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    };
    backdrop.onclick = closeMenu;
    document.onkeydown = (e) => e.key === "Escape" && closeMenu();

    // ---------- CARRIE ----------
    const carrieWrap = document.getElementById("carrieWrap"),
      carrie = document.getElementById("carrie");
    let drag = false,
      moved = false,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0;

    function pos(e) {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }
    carrieWrap.addEventListener("mousedown", down);
    carrieWrap.addEventListener("touchstart", down, { passive: false });
    function down(e) {
      drag = true;
      moved = false;
      const p = pos(e);
      sx = p.x;
      sy = p.y;
      const r = carrieWrap.getBoundingClientRect();
      ox = r.left;
      oy = r.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
      e.preventDefault();
    }
    window.addEventListener("mousemove", move, { passive: false });
    window.addEventListener("touchmove", move, { passive: false });
    function move(e) {
      if (!drag) return;
      const p = pos(e);
      const dx = p.x - sx,
        dy = p.y - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      carrieWrap.style.left = ox + dx + "px";
      carrieWrap.style.top = oy + dy + "px";
    }
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    function up() {
      drag = false;
    }

    carrie.addEventListener("click", () => {
      if (!moved) window.location.href = "carrie-chat.html";
    });

    // ---------- BUBBLES ----------
    const contact = document.getElementById("bubble-contact"),
      donate = document.getElementById("bubble-donate"),
      footer = document.getElementById("bubble-footer"),
      topbtn = document.getElementById("bubble-top-single");

    contact.onclick = () => (window.location.href = "contact.html");
    donate.onclick = () => {
      const d = document.getElementById("donate");
      if (d) d.scrollIntoView({ behavior: "smooth" });
      else window.location.href = "donate.html";
    };
    footer.onclick = () =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    topbtn.onclick = () =>
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  else injectGlobalUI();
})();

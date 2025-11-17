<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chat with Carrie — 8BFR Music Network</title>
  <meta name="description" content="Chat with Carrie — your AI assistant on the 8BFR Music Network." />
  <link rel="icon" href="assets/images/favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    :root {
      --ring: rgba(124,58,237,.55);
      --glass: rgba(12,6,24,.80);
    }
    html,body { scroll-behavior:smooth; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(900px 400px at 110% 10%, rgba(0,217,255,.22), transparent 60%),
        linear-gradient(#0b0014,#000);
      color:#eae6ff;
      margin:0;
      min-height:100vh;
      overflow-x:hidden;
    }
    header{
      position:relative;
      z-index:5;
      background:rgba(15,0,30,.9);
      border-bottom:1px solid rgba(124,58,237,.5);
    }
    .chat-shell{
      border-radius:18px;
      border:1px solid rgba(124,58,237,.55);
      background:rgba(10,2,26,.95);
      box-shadow:0 16px 40px rgba(0,0,0,.75);
    }
    .chat-log{
      height:420px;
      max-height:65vh;
      overflow-y:auto;
      padding:1rem;
      background:
        radial-gradient(circle at 0 0, rgba(124,58,237,.12), transparent 55%),
        radial-gradient(circle at 100% 0, rgba(0,217,255,.10), transparent 55%),
        #020014;
    }
    .msg-row{
      display:flex;
      margin-bottom:.65rem;
      gap:.4rem;
    }
    .msg-row.user{
      justify-content:flex-end;
    }
    .msg-bubble{
      max-width:80%;
      padding:.55rem .8rem;
      border-radius:.85rem;
      font-size:.9rem;
      line-height:1.35;
      border:1px solid rgba(148,163,255,.55);
      background:rgba(17,24,39,.96);
      box-shadow:0 0 12px rgba(79,70,229,.35);
    }
    .msg-row.user .msg-bubble{
      background:linear-gradient(135deg,#7c3aed,#4c1d95);
      border-color:#a855f7;
      box-shadow:0 0 12px rgba(168,85,247,.55);
    }
    .msg-meta{
      font-size:.7rem;
      opacity:.7;
      margin-top:.2rem;
    }
    .msg-avatar{
      width:28px;
      height:28px;
      border-radius:999px;
      flex-shrink:0;
      overflow:hidden;
      border:1px solid rgba(129,140,248,.9);
      display:grid;
      place-items:center;
      font-size:.75rem;
      background:#020014;
    }
    .msg-avatar img,
    .msg-avatar video{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
    .msg-row.user .msg-avatar{
      display:none;
    }

    .pill-tag{
      display:inline-flex;
      align-items:center;
      gap:.25rem;
      font-size:.7rem;
      border-radius:999px;
      padding:.15rem .55rem;
      border:1px solid rgba(129,140,248,.85);
      background:rgba(15,23,42,.9);
      text-transform:uppercase;
      letter-spacing:.08em;
    }

    .btn{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:.3rem;
      background:#120327;
      border:1px solid rgba(124,58,237,.6);
      color:#eae6ff;
      padding:.55rem .95rem;
      border-radius:.75rem;
      font-size:.9rem;
      text-decoration:none;
      cursor:pointer;
    }
    .btn:hover{
      background:#190536;
    }
    .btn-primary{
      background:#7c3aed;
      border-color:#7c3aed;
      color:#fff;
    }
    .btn-primary:hover{ filter:brightness(1.05); }

    textarea#carrieInput{
      resize:none;
      min-height:52px;
      max-height:120px;
      background:rgba(10,2,26,.95);
      border-radius:.75rem;
      border:1px solid rgba(148,163,255,.55);
      padding:.5rem .7rem;
      font-size:.9rem;
      color:#e5e7eb;
    }
    textarea#carrieInput:focus{
      outline:none;
      box-shadow:0 0 0 1px rgba(129,140,248,.9);
      border-color:rgba(129,140,248,1);
    }
    .input-hint{
      font-size:.7rem;
      opacity:.7;
    }
    .typing-dot{
      width:6px;height:6px;border-radius:999px;
      background:#a855f7;
      animation:bounce 1s infinite ease-in-out;
    }
    .typing-dot:nth-child(2){ animation-delay:.15s; }
    .typing-dot:nth-child(3){ animation-delay:.3s; }
    @keyframes bounce{
      0%,80%,100%{ transform:translateY(0); opacity:.4;}
      40%{ transform:translateY(-4px); opacity:1;}
    }

    @media (max-width:640px){
      .chat-log{ height:60vh; }
      .msg-bubble{ max-width:88%; }
    }

    /* Hide global Carrie + bubbles from scripts.js on this page */
    #bubbleStack,
    #bubble-top-single,
    #carrieWrap {
      display:none !important;
    }

    /* Local avatar for this chat page (bottom-right, draggable + resizable) */
    #chatCarrieWrap{
      position:fixed;
      right:16px;
      bottom:100px; /* stops above send button */
      z-index:9997;
      user-select:none;
      touch-action:none;
      pointer-events:auto;
    }
    #chatCarrieVideo{
      width:min(48vw,260px);
      max-height:70vh;
      object-fit:contain;
      background:transparent!important;
      display:block;
      filter:
        drop-shadow(0 14px 32px rgba(15,6,40,.9))
        drop-shadow(0 0 18px rgba(124,58,237,.55));
    }
    #chatCarrieBubble{
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
    #chatCarrieBubble::after{
      content:"";
      position:absolute;
      top:100%;
      right:16px;
      border-width:6px 6px 0 6px;
      border-style:solid;
      border-color:rgba(15,23,42,.95) transparent transparent transparent;
    }

    /* Dropdown controls */
    .dropdown-wrap{
      position:relative;
    }
    .dropdown-toggle{
      display:inline-flex;
      align-items:center;
      gap:.25rem;
      padding:3px 9px;
      border-radius:999px;
      border:1px solid rgba(129,140,248,.65);
      background:rgba(12,6,32,.95);
      font-size:11px;
      cursor:pointer;
      color:rgba(233,213,255,0.9);
      white-space:nowrap;
    }
    .dropdown-toggle span.label{
      font-weight:600;
      color:#e9d5ff;
    }
    .dropdown-toggle span.value{
      color:#c4b5fd;
    }
    .dropdown-menu{
      position:absolute;
      right:0;
      top:calc(100% + 6px);
      min-width:180px;
      background:rgba(12,6,32,.98);
      border-radius:12px;
      border:1px solid rgba(129,140,248,.65);
      box-shadow:0 16px 40px rgba(0,0,0,.8);
      padding:4px;
      display:none;
      z-index:40;
    }
    .dropdown-menu.open{ display:block; }
    .dropdown-item{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:.4rem;
      width:100%;
      padding:5px 7px;
      border-radius:9px;
      border:none;
      background:transparent;
      color:#e5e7eb;
      font-size:11px;
      cursor:pointer;
      text-align:left;
    }
    .dropdown-item:hover{
      background:rgba(55,48,163,.85);
    }
    .dropdown-item small{
      font-size:10px;
      opacity:.8;
    }
    .dropdown-item.disabled{
      opacity:.45;
      cursor:not-allowed;
    }
    .dropdown-item.disabled:hover{
      background:transparent;
    }

    .dropdown-section-title{
      font-size:10px;
      text-transform:uppercase;
      letter-spacing:.08em;
      color:rgba(196,181,253,0.8);
      padding:4px 6px 2px;
    }
  </style>
</head>
<body>
  <header class="px-4 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <img src="assets/images/logo_8bfr.svg"
             alt="8BFR logo"
             class="h-9 w-auto"
             onerror="this.onerror=null;this.src='assets/images/8bfr.png'">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold">
            Chat with <span class="text-[#a855f7]">Carrie</span>
          </h1>
          <p class="text-[11px] text-purple-300/80 -mt-0.5">
            8BFR Music Network • Create • Connect • Collab
          </p>
        </div>
      </div>
      <a href="index.html"
         class="hidden sm:inline text-[#00d9ff] text-xs sm:text-sm underline/50 hover:underline">
        ⬅ Back to Home
      </a>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 pb-10 pt-4">
    <div class="chat-shell p-4 sm:p-5">
      <!-- Back to home + controls -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <a href="index.html"
           class="text-[#00d9ff] text-xs underline hover:underline">
          ⬅ Back to Home
        </a>

        <div class="flex flex-wrap justify-end gap-2 text-[11px]">
          <!-- Chat mode dropdown -->
          <div class="dropdown-wrap">
            <button id="chatModeToggle" type="button" class="dropdown-toggle">
              <span class="label">Chat mode:</span>
              <span id="chatModeLabel" class="value">Business</span>
              <span>▾</span>
            </button>
            <div id="chatModeMenu" class="dropdown-menu">
              <button class="dropdown-item" data-mode="business">
                <span>Business</span>
                <small>Tools, plans, progress</small>
              </button>
              <button class="dropdown-item" data-mode="personal">
                <span>Personal</span>
                <small>Softer, hangout energy</small>
              </button>
              <div class="dropdown-section-title">Pro romance (coming)</div>
              <button class="dropdown-item pro-lock" data-mode="girlfriend">
                <span>Girlfriend</span>
                <small>Pro only • soft + loving</small>
              </button>
              <button class="dropdown-item pro-lock" data-mode="boyfriend">
                <span>Boyfriend</span>
                <small>Pro only • supportive + protective</small>
              </button>
            </div>
          </div>

          <!-- Avatar dropdown -->
          <div class="dropdown-wrap">
            <button id="avatarToggle" type="button" class="dropdown-toggle">
              <span class="label">Avatar:</span>
              <span id="avatarLabel" class="value">Carrie</span>
              <span>▾</span>
            </button>
            <div id="avatarMenu" class="dropdown-menu">
              <button class="dropdown-item" data-avatar="carrie">
                <span>Carrie</span>
                <small>Main AI assistant</small>
              </button>
              <button class="dropdown-item" data-avatar="james">
                <span>James</span>
                <small>8BFR founder</small>
              </button>
              <button class="dropdown-item" data-avatar="azreen">
                <span>Azreen</span>
                <small>Systems partner</small>
              </button>
            </div>
          </div>

          <!-- Maintenance dropdown -->
          <div class="dropdown-wrap">
            <button id="maintToggle" type="button" class="dropdown-toggle">
              <span class="label">Maintenance</span>
              <span>▾</span>
            </button>
            <div id="maintMenu" class="dropdown-menu">
              <button id="maintClearLocal" class="dropdown-item">
                <span>Clear chat (this device)</span>
              </button>
              <button id="maintSaveSnapshot" class="dropdown-item">
                <span>Save snapshot (coming)</span>
              </button>
              <div class="dropdown-section-title owner-only">Owner tools</div>
              <button id="maintArchiveAll" class="dropdown-item owner-only">
                <span>Archive + clear all</span>
              </button>
              <button id="maintToggleRole" class="dropdown-item owner-only">
                <span id="maintToggleRoleLabel">View as regular user</span>
              </button>
            </div>
          </div>

          <!-- Shop dropdown -->
          <div class="dropdown-wrap">
            <button id="shopToggle" type="button" class="dropdown-toggle">
              <span class="label">Shop</span>
              <span>▾</span>
            </button>
            <div id="shopMenu" class="dropdown-menu">
              <button class="dropdown-item" data-shop="outfits">
                <span>Outfits & styles</span>
                <small>Visit Carrie’s Closet</small>
              </button>
              <button class="dropdown-item" data-shop="makeup">
                <span>Makeup & accessories</span>
              </button>
              <button class="dropdown-item" data-shop="coins">
                <span>Buy coins</span>
                <small>Coin Shop</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-3 gap-3">
        <div class="flex items-center gap-2">
          <span class="pill-tag">
            <span class="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Live Assistant</span>
          </span>
          <span class="text-[11px] text-purple-200/80" id="modeHint">
            Business chat • focused on tools, music, and progress
          </span>
        </div>
        <div class="text-right space-y-1">
          <div id="sessionIndicator" class="text-[11px] text-purple-200/70">
            Checking login…
          </div>
          <button
            id="trainerBtn"
            type="button"
            class="btn hidden"
            style="padding:2px 8px;font-size:10px;border-radius:999px;"
          >
            Carrie Trainer
          </button>
        </div>
      </div>

      <!-- Inline circle avatar (top of chat) is injected by JS -->

      <!-- Chat log -->
      <div id="chatLog" class="chat-log rounded-lg mb-3"></div>

      <!-- Typing indicator -->
      <div id="typingRow" class="hidden mb-2 text-xs text-purple-200/80 flex items-center gap-2">
        <span class="pill-tag">Assistant typing</span>
        <div class="flex items-center gap-1 ml-1">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>

      <!-- Input row -->
      <form id="carrieForm" class="mt-1">
        <div class="flex items-end gap-2">
          <div class="flex-1">
            <label for="carrieInput"
                   class="text-xs text-purple-200/80 mb-1 inline-block">
              Ask anything about 8BFR, music, games, or ideas.
            </label>
            <textarea id="carrieInput"
                      placeholder="Example: “Help me write a hook for a trap beat about late nights.”"></textarea>
            <p class="input-hint mt-1">
              Press <b>Enter</b> to send • <b>Shift+Enter</b> for a new line.
            </p>
          </div>
          <button type="submit" class="btn btn-primary px-3 sm:px-4 h-10">
            <span>Send</span>
            <span>📤</span>
          </button>
        </div>
      </form>
    </div>

    <p class="mt-3 text-[11px] text-purple-300/70 text-center max-w-xl mx-auto">
      Carrie, James, and Azreen are in beta. Conversations may be stored to improve your experience on the 8BFR Music Network.
    </p>
  </main>

  <!-- Local avatar (bottom-right) just for this chat page -->
  <div id="chatCarrieWrap" title="Chat avatar (local)">
    <div id="chatCarrieBubble">Carrie (chat)</div>
    <video
      id="chatCarrieVideo"
      src="assets/videos/carrie_business_animate.webm"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>

  <!-- Trainer modal (owner only; optional) -->
  <div id="trainerModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
    <div
      class="relative max-w-md mx-auto mt-24 bg-[#0c0618] border border-purple-500/60 rounded-xl p-4 shadow-2xl"
    >
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-semibold text-purple-100">
          Carrie Trainer (Owner Only)
        </h2>
        <button
          id="trainerClose"
          type="button"
          class="text-xs text-purple-200 hover:underline"
        >
          Close
        </button>
      </div>
      <p class="text-[11px] text-purple-200/80 mb-2">
        Add a question pattern and the reply you want Carrie/James/Azreen to use.
        Replies can include basic HTML and links.
      </p>
      <form id="trainerForm" class="space-y-2">
        <div>
          <label class="text-xs text-purple-200/90 block mb-1">
            User question / pattern (example: "how do i purchase 8bfr music")
          </label>
          <textarea
            id="trainerQuestion"
            class="w-full text-xs rounded-md border border-purple-500/50 bg-[#120327] px-2 py-1 text-purple-50"
            rows="2"
          ></textarea>
        </div>
        <div>
          <label class="text-xs text-purple-200/90 block mb-1">
            Assistant reply (HTML allowed)
          </label>
          <textarea
            id="trainerAnswer"
            class="w-full text-xs rounded-md border border-purple-500/50 bg-[#120327] px-2 py-1 text-purple-50"
            rows="4"
          ></textarea>
        </div>
        <p class="text-[10px] text-purple-300/80">
          Tip: You can add more patterns for the same answer later by repeating this with small variations.
        </p>
        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            id="trainerCancel"
            class="btn"
            style="padding:3px 10px;font-size:11px;"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            style="padding:3px 10px;font-size:11px;"
          >
            Save &amp; Use
          </button>
        </div>
        <div
          id="trainerStatus"
          class="text-[10px] text-green-300/80 mt-1"
          style="display:none;"
        ></div>
      </form>
    </div>
  </div>

  <!-- Supabase client (for this page only) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <!-- Global 8BFR UI (menu, Carrie, etc.) -->
  <script src="scripts.js?v=1" defer></script>

  <!-- Carrie chat brain JUST for this page -->
  <script src="carrie-chat.js?v=7"></script>

  <!-- Local avatar (chat page only): mode + avatar sync + drag/resize -->
  <script>
    (function () {
      const AVATAR_VIDEOS = {
        carrie: {
          business:   "assets/videos/carrie_business_animate.webm",
          personal:   "assets/videos/carrie_casual_animate_3_1.webm",
          girlfriend: "assets/videos/carrie_casual_animate_3_1.webm",
          boyfriend:  "assets/videos/carrie_business_animate.webm",
        },
        james: {
          business:   "assets/videos/james-business.webm",
          personal:   "assets/videos/james-casual.webm",
          girlfriend: "assets/videos/james-casual.webm",
          boyfriend:  "assets/videos/james-business.webm",
        },
        azreen: {
          business:   "assets/videos/azreen-business.webm",
          personal:   "assets/videos/azreen-casual.webm",
          girlfriend: "assets/videos/azreen-casual.webm",
          boyfriend:  "assets/videos/azreen-business.webm",
        },
      };

      const wrap   = document.getElementById("chatCarrieWrap");
      const video  = document.getElementById("chatCarrieVideo");
      const bubble = document.getElementById("chatCarrieBubble");

      if (!wrap || !video) return;

      function getMode() {
        try {
          const m = localStorage.getItem("carrie_mode");
          if (m === "business" || m === "personal") return m;
        } catch (e) {}
        return "business";
      }

      function getRomance() {
        try {
          const m = localStorage.getItem("carrie_romance_mode");
          if (m === "girlfriend" || m === "boyfriend") return m;
        } catch (e) {}
        return "none";
      }

      function getAvatar() {
        try {
          const a = localStorage.getItem("carrie_avatar");
          if (a === "carrie" || a === "james" || a === "azreen") return a;
        } catch (e) {}
        return "carrie";
      }

      function getSrc() {
        const avatar = getAvatar();
        const romance = getRomance();
        const baseMode = getMode();

        const mode =
          romance === "girlfriend" || romance === "boyfriend"
            ? romance
            : baseMode;

        const def = AVATAR_VIDEOS[avatar] || AVATAR_VIDEOS.carrie;
        return def[mode] || def.personal || def.business;
      }

      function applyVideo() {
        const src = getSrc();
        if (video.getAttribute("src") !== src) {
          video.src = src;
          try {
            video.load();
            video.play().catch(function () {});
          } catch (e) {}
        }
        if (bubble) {
          const a = getAvatar();
          bubble.textContent =
            a === "james"
              ? "James (chat)"
              : a === "azreen"
              ? "Azreen (chat)"
              : "Carrie (chat)";
        }
      }

      applyVideo();

      window.addEventListener("storage", function (ev) {
        if (
          ev.key === "carrie_mode" ||
          ev.key === "carrie_avatar" ||
          ev.key === "carrie_romance_mode"
        ) {
          applyVideo();
        }
      });

      /* drag + resize (unchanged from your version) */
      let dragging = false;
      let moved = false;
      let sx = 0;
      let sy = 0;
      let ox = 0;
      let oy = 0;

      let scale = 1;
      let pinchActive = false;
      let pinchStartDist = 0;
      let startScale = 1;
      let mouseResizeActive = false;
      let mouseResizeStartY = 0;

      function applyScale() {
        video.style.transform = "scale(" + scale + ")";
        if (bubble) bubble.style.transform = "scale(" + scale + ")";
      }
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

      wrap.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });

      wrap.addEventListener("mousedown", startDragOrResize);
      wrap.addEventListener("touchstart", startTouch, { passive: false });

      function startDragOrResize(e) {
        if (e.button === 2) {
          mouseResizeActive = true;
          mouseResizeStartY = e.clientY;
          startScale = scale;
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
        const rect = wrap.getBoundingClientRect();
        ox = rect.left;
        oy = rect.top;
        wrap.style.right = "auto";
        wrap.style.bottom = "auto";
      }

      function startTouch(e) {
        if (e.touches && e.touches.length >= 2) {
          pinchActive = true;
          dragging = false;
          moved = false;
          pinchStartDist = getTouchDistance(e);
          startScale = scale;
          e.preventDefault();
          return;
        }
        dragging = true;
        moved = false;
        const p = ptr(e);
        sx = p.x;
        sy = p.y;
        const rect = wrap.getBoundingClientRect();
        ox = rect.left;
        oy = rect.top;
        wrap.style.right = "auto";
        wrap.style.bottom = "auto";
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
          scale = clampScale(startScale * ratio);
          applyScale();
          e.preventDefault();
          return;
        }
        if (mouseResizeActive && !e.touches) {
          const dy = e.clientY - mouseResizeStartY;
          const ratio = 1 - dy / 300;
          scale = clampScale(startScale * ratio);
          applyScale();
          e.preventDefault();
          return;
        }
        if (!dragging) return;
        const p = ptr(e);
        const dx = p.x - sx;
        const dy = p.y - sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        wrap.style.left = ox + dx + "px";
        wrap.style.top = oy + dy + "px";
        e.preventDefault();
      }

      function endAll(e) {
        if (e && e.touches && e.touches.length > 0) return;
        dragging = false;
        pinchActive = false;
        mouseResizeActive = false;
      }

      try {
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.play().catch(function () {});
      } catch (e) {}
    })();
  </script>
</body>
</html>

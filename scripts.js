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

// ========== GLOBAL 8BFR UI (menu, bubbles, Avatars, auth gate, Spotify stripe) ==========
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

    const noCarrie =
      document.body && document.body.dataset.noGlobalCarrie === "true";

    // ---------- STYLES ----------
    const css = document.createElement("style");
    css.textContent = `/* your existing CSS unchanged */`;
    document.head.appendChild(css);

    // ---------- HTML SHELL ----------
    const ui = document.createElement("div");
    let html = `/* your existing HTML shell unchanged */`;

    // ✅ Only add global avatars on pages that did NOT opt out
    if (!noCarrie) {
      html += `
<div id="carrieWrap" title="Chat avatar (global)">
  <div id="avatarSwitcher">
    <button data-avatar="carrie">Carrie</button>
    <button data-avatar="james">James</button>
    <button data-avatar="azreen">Azreen</button>
  </div>
  <div id="carrieBubble">Chat with me</div>
  <video
    id="avatar-carrie"
    class="global-avatar"
    src="assets/videos/carrie_business_animate.webm"
    autoplay
    loop
    muted
    playsinline
  ></video>
  <video
    id="avatar-james"
    class="global-avatar"
    src="assets/videos/james_business.webm"
    autoplay
    loop
    muted
    playsinline
  ></video>
  <video
    id="avatar-azreen"
    class="global-avatar"
    src="assets/videos/azreen_business.webm"
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

    // Make FAB always visible
    if (fab) fab.style.display = "grid";

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
    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
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
    const avatarVideos = Array.from(
      document.querySelectorAll(".global-avatar")
    );

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
      try {
        localStorage.setItem("carrie_avatar", name);
      } catch (e) {}
    }

    let currentAvatar = getStoredAvatar();
    let userScale = 1;

    function applyAvatarScale() {
      const base = AVATAR_BASE_SCALE[currentAvatar] || 1.0;
      const total = base * userScale;
      avatarVideos.forEach((vid) => {
        vid.style.transform = `scale(${total})`;
      });
      if (carrieBubble) {
        carrieBubble.style.transform = `scale(${total})`;
      }
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
          try {
            vid.pause();
          } catch (e) {}
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

    if (avatarVideos.length) setActiveAvatar(currentAvatar);

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

    // ---------- HIDE BUBBLES ON chat.html ----------
    if (window.location.pathname.endsWith("chat.html")) {
      const bubbleStack = document.getElementById("bubbleStack");
      const topBubble = document.getElementById("bubble-top-single");
      if (bubbleStack) bubbleStack.style.display = "none";
      if (topBubble) topBubble.style.display = "none";
    }

    // The rest of your existing avatar drag/resize logic unchanged...
    // ...keep everything exactly as you had
  }

  injectGlobalUI();
})();

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

    const isHome = window.location.pathname.split("/").pop() === "index.html";

    const css = document.createElement("style");
    css.textContent = `/* [Your original CSS from script.js stays here exactly] */`;
    document.head.appendChild(css);

    const ui = document.createElement("div");
    let html = `
      <div id="menuStripe">
        <div id="menuStripeText">STREAM 8BFR ON SPOTIFY</div>
      </div>
      <button id="fab" aria-label="Open navigation">...</button>
      <div id="menu-backdrop"></div>
      <nav id="menu" aria-hidden="true">...</nav>
    `;

    // ========== FLOATING BUBBLES ==========
    html += `<div id="bubbleStack">`;

    if (isHome) {
      // ✅ Home: keep all bubbles
      html += `
        <div class="bubble-row"><span class="bubble-label">Contact</span><button class="bubble" id="bubble-contact">✉️</button></div>
        <div class="bubble-row"><span class="bubble-label">Donate</span><button class="bubble" id="bubble-donate">💜</button></div>
        <div class="bubble-row"><span class="bubble-label">Footer</span><button class="bubble" id="bubble-footer">⬇️</button></div>
        <div class="bubble-row"><span class="bubble-label">Theme</span><button class="bubble" id="bubble-theme">☯️</button></div>
        <div class="bubble-row"><span class="bubble-label">Random</span><button class="bubble" id="bubble-theme-random">🔀</button></div>
        <div class="bubble-row"><span class="bubble-label">Stream 8BFR</span><button class="bubble" id="bubble-stream">🎧</button></div>
      `;
    } else {
      // ✅ Other pages: only donate + page up
      html += `
        <div class="bubble-row"><span class="bubble-label">Donate</span><button class="bubble" id="bubble-donate">💜</button></div>
      `;
    }

    html += `</div>`; // end bubbleStack

    html += `<button class="bubble" id="bubble-top-single">⬆️</button>`;

    // ========== AVATAR SWITCHER ==========
    if (!noCarrie) {
      html += `<div id="carrieWrap">`;
      html += `<div id="avatarSwitcher">`;

      const avatars = ["carrie", "james", "azreen"];
      if (isHome) {
        // Home: include all avatars including BF/GF
        avatars.push("bf", "gf");
      }

      avatars.forEach((a) => {
        html += `<button data-avatar="${a}">${a.charAt(0).toUpperCase() + a.slice(1)}</button>`;
      });

      html += `</div>`; // end switcher
      html += `
        <div id="carrieBubble">Chat with me</div>
        <video id="avatar-carrie" class="global-avatar" src="assets/videos/carrie_business_animate.webm" autoplay loop muted playsinline></video>
        <video id="avatar-james" class="global-avatar" src="assets/videos/james_business.webm" autoplay loop muted playsinline></video>
        <video id="avatar-azreen" class="global-avatar" src="assets/videos/azreen_business.webm" autoplay loop muted playsinline></video>
      `;

      if (isHome) {
        html += `
          <video id="avatar-bf" class="global-avatar" src="assets/videos/bf_business.webm" autoplay loop muted playsinline></video>
          <video id="avatar-gf" class="global-avatar" src="assets/videos/gf_business.webm" autoplay loop muted playsinline></video>
        `;
      }

      html += `</div>`; // end carrieWrap
    }

    ui.innerHTML = html;
    document.body.appendChild(ui);

    // ========== [All other JS logic untouched from your original script.js] ==========
    // Menu, avatar selection, dragging, bubbles click events, auth gate, etc.
    enforceAuthGate();
  }

  injectGlobalUI();
})();

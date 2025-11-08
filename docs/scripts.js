// docs/scripts.js
// Handles:
// - Hero rotating text (index only)
// - Featured ads carousel + swipe + modals (index only)
// - Global floating menu (all pages)
// - Carrie avatar (all pages) – draggable + tap opens carrie-chat
// - Floating Contact + Donate bubbles (all pages)

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    setupHero();
    setupAdsCarousel();
    setupAdFormModal();
    setupHowAdsModal();
    injectGlobalUI(); // menu + Carrie + bubbles
  });

  // ---------------- HERO TEXT ----------------
  function setupHero() {
    const el = document.getElementById("line");
    if (!el) return;
    const lines = [
      "Game Tournaments (Win Free Coins)",
      "Music Studio — AI Lyrics & AI Beat Creator (Artists & Beatmakers)",
      "AI Post Creator with Voiceover (Influencers)",
      "AI Helper for Authors",
      "Mirror Your Streams from Other Sites",
      "Seller Options • Group 7 (G7) Perks",
      "Carrie — AI Chat & Helper",
      "Explore the site to find all features",
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      el.textContent = lines[i];
    }, 4800);
  }

  // ---------------- ADS CAROUSEL ----------------
  function setupAdsCarousel() {
    const track = document.getElementById("adTrack");
    const prev = document.getElementById("adPrev");
    const next = document.getElementById("adNext");
    const pause = document.getElementById("adPause");
    if (!track || !prev || !next || !pause) return;

    const ads = [
      { img: "assets/images/ad_banner_1.jpg", url: "#" },
      { img: "assets/images/ad_banner_2.jpg", url: "#" },
      { img: "assets/images/ad_banner_3.jpg", url: "#" },
      { img: "assets/images/ad_banner_4.jpg", url: "#" },
      { img: "assets/images/ad_banner_5.jpg", url: "#" },
    ];

    let i = 0;
    let paused = false;
    let t = null;

    function slide(idx) {
      i = (idx + ads.length) % ads.length;
      const old = track.querySelector(".ad-slide.show");

      const a = document.createElement("a");
      a.className = "ad-slide";
      a.href = ads[i].url || "#";
      a.target = "_blank";
      a.rel = "noopener";

      const img = new Image();
      img.src = ads[i].img;
      img.alt = "Ad banner";
      a.appendChild(img);

      track.appendChild(a);
      requestAnimationFrame(() => a.classList.add("show"));

      if (old) setTimeout(() => old.remove(), 380);
    }

    function auto() {
      if (paused) return;
      slide(i + 1);
      schedule();
    }

    function schedule() {
      clearTimeout(t);
      t = setTimeout(auto, 5000);
    }

    prev.onclick = () => {
      if (!paused) {
        paused = true;
        pause.textContent = "Play";
      }
      slide(i - 1);
    };

    next.onclick = () => {
      if (!paused) {
        paused = true;
        pause.textContent = "Play";
      }
      slide(i + 1);
    };

    pause.onclick = () => {
      paused = !paused;
      pause.textContent = paused ? "Play" : "Pause";
      if (!paused) schedule();
      else clearTimeout(t);
    };

    // touch swipe
    let sx = 0,
      dx = 0,
      down = false;

    track.addEventListener(
      "touchstart",
      (e) => {
        down = true;
        sx = e.touches[0].clientX;
        dx = 0;
        clearTimeout(t);
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (e) => {
        if (!down) return;
        dx = e.touches[0].clientX - sx;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      () => {
        down = false;
        if (Math.abs(dx) > 40) {
          if (dx < 0) next.click();
          else prev.click();
        }
        schedule();
      },
      { passive: true }
    );

    slide(0);
    schedule();
  }

  // ---------------- BUY AD MODAL ----------------
  function setupAdFormModal() {
    const openBtn = document.getElementById("openAdForm");
    if (!openBtn) return;

    const modal = document.createElement("div");
    modal.className = "modal ad-modal";
    modal.innerHTML = `
      <style>
        .modal{ position: fixed; inset: 0; z-index: 10000; display:none; }
        .modal.open{ display:block; }
        .modal .shade{
          position:absolute; inset:0;
          background:rgba(0,0,0,.6); backdrop-filter: blur(2px);
        }
        .modal .panel{
          position:relative; margin:6vh auto 0; max-width:720px;
          background:#0c0618; border:1px solid rgba(124,58,237,.4);
          border-radius:14px; padding:16px;
          box-shadow:0 20px 40px rgba(0,0,0,.6);
        }
        .modal label{ font-size:.9rem; opacity:.9; display:block; margin-bottom:2px; }
        .modal .input{
          width:100%; padding:.55rem .7rem; background:#120327;
          color:#fff; border:1px solid rgba(124,58,237,.5); border-radius:.55rem;
          margin-bottom:.35rem;
        }
        .modal .btn{
          display:inline-block; background:#120327;
          border:1px solid rgba(124,58,237,.6); color:#eae6ff;
          padding:.6rem .95rem; border-radius:.75rem; text-decoration:none;
          font-size:.9rem;
        }
        .modal .btn-primary{ background:#7c3aed; border-color:#7c3aed; color:#fff; }
      </style>
      <div class="shade"></div>
      <div class="panel">
        <h3 class="text-xl font-bold mb-3">Buy an Ad</h3>
        <form action="ads.html#form" method="get">
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label>Advertiser / Artist</label>
              <input class="input" name="name" placeholder="Your name or brand">
            </div>
            <div>
              <label>Contact Email</label>
              <input class="input" name="email" type="email" placeholder="you@domain.com">
            </div>
            <div class="sm:col-span-2">
              <label>Target URL</label>
              <input class="input" name="url" placeholder="https://your-link">
            </div>
            <div class="sm:col-span-2">
              <label>Notes</label>
              <textarea class="input" name="notes" rows="3"
                placeholder="Tell us about your ad"></textarea>
            </div>
          </div>
          <div class="mt-4 flex gap-2 flex-wrap">
            <button type="submit" class="btn btn-primary">Continue</button>
            <button type="button" class="btn" id="closeAdForm">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const shade = modal.querySelector(".shade");
    const closeBtn = modal.querySelector("#closeAdForm");

    openBtn.addEventListener("click", () => modal.classList.add("open"));
    shade.addEventListener("click", () => modal.classList.remove("open"));
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  // ---------------- HOW ADS WORK MODAL ----------------
  function setupHowAdsModal() {
    const btn = document.getElementById("openHowAds");
    if (!btn) return;

    const modal = document.createElement("div");
    modal.className = "modal how-ads-modal";
    modal.innerHTML = `
      <style>
        .how-ads-modal{ position: fixed; inset: 0; z-index: 10000; display:none; }
        .how-ads-modal.open{ display:block; }
        .how-ads-modal .shade{
          position:absolute; inset:0;
          background:rgba(0,0,0,.6); backdrop-filter: blur(2px);
        }
        .how-ads-modal .panel{
          position:relative; margin:6vh auto 0; max-width:720px;
          background:#0c0618; border:1px solid rgba(124,58,237,.4);
          border-radius:14px; padding:16px;
          box-shadow:0 20px 40px rgba(0,0,0,.6);
        }
        .how-ads-modal .btn{
          display:inline-block; background:#120327;
          border:1px solid rgba(124,58,237,.6); color:#eae6ff;
          padding:.6rem .95rem; border-radius:.75rem; text-decoration:none;
          font-size:.9rem;
        }
        .how-ads-modal .btn-primary{ background:#7c3aed; border-color:#7c3aed; color:#fff; }
      </style>
      <div class="shade"></div>
      <div class="panel">
        <h3 class="text-xl font-bold mb-3">How Ads Work</h3>
        <ol class="list-decimal pl-6 space-y-2 text-sm text-purple-100/90">
          <li>There are always <b>5 ad slots</b> in rotation.</li>
          <li>When someone buys an ad, it replaces a placeholder until it <b>expires</b>.</li>
          <li>After expiration, the placeholder returns automatically.</li>
          <li>You can <b>pause</b> the carousel, or use <b>arrows</b> to navigate.</li>
          <li>Click any ad to open the advertiser’s page.</li>
        </ol>
        <div class="mt-4 flex gap-2 flex-wrap">
          <a class="btn btn-primary" href="ads.html#form">Buy an Ad</a>
          <button class="btn" type="button" id="closeHowAds">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const shade = modal.querySelector(".shade");
    const closeBtn = modal.querySelector("#closeHowAds");

    btn.addEventListener("click", () => modal.classList.add("open"));
    shade.addEventListener("click", () => modal.classList.remove("open"));
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  // ---------------- GLOBAL MENU + CARRIE + BUBBLES ----------------
  function injectGlobalUI() {
    if (document.getElementById("fab")) return; // already injected

    const css = document.createElement("style");
    css.textContent = `
      :root{ --ring: rgba(124,58,237,.55); --glass: rgba(12,6,24,.80); }

      #fab{
        position:fixed; top:86px; right:14px; z-index:9999;
        width:56px; height:56px; border-radius:9999px;
        display:grid; place-items:center; cursor:pointer;
        background:radial-gradient(120% 120% at 30% 20%,
          rgba(124,58,237,.50), rgba(10,10,20,.70));
        border:1px solid rgba(124,58,237,.35);
        box-shadow:0 0 14px rgba(124,58,237,.30),
                   0 0 18px rgba(0,217,255,.18) inset;
      }

      #menu{
        position:fixed; top:144px; right:14px;
        width:min(92vw,270px);
        max-height:calc(100vh - 160px);
        overflow-y:auto; z-index:9998;
        transform:translateX(115%);
        transition:transform .25s ease;
        backdrop-filter:blur(10px);
        background:var(--glass);
        border:1px solid var(--ring);
        border-radius:12px;
        box-shadow:0 12px 28px rgba(0,0,0,.45);
        font-size:.85rem;
      }
      #menu.open{ transform:translateX(0); }

      #backdrop{
        position:fixed; inset:0;
        background:rgba(0,0,0,.18);
        backdrop-filter:blur(1px);
        z-index:9990;
        opacity:0; pointer-events:none;
        transition:opacity .2s ease;
      }
      #backdrop.open{
        opacity:1; pointer-events:auto;
      }

      #menu .group{
        margin:8px; border:1px solid rgba(124,58,237,.28);
        border-radius:10px; overflow:hidden;
      }
      #menu .group summary{
        cursor:pointer; padding:7px 9px;
        background:rgba(124,58,237,.10);
      }
      #menu .group a{
        display:block; padding:6px 9px;
        color:#eae6ff; text-decoration:none;
      }
      #menu .group a:hover{
        background:rgba(124,58,237,.14);
      }

      #carrieWrap{
        position:fixed; right:14px; bottom:16px;
        z-index:9997; transition:transform .25s ease;
        user-select:none; touch-action:none;
      }
      #carrieWrap.aside{
        transform:translateX(-260px);
      }
      #carrie{
        /* BIGGER avatar */
        width:min(80vw,420px);
        height:auto;
        border-radius:0;
        background:transparent!important;
        filter:drop-shadow(0 10px 28px rgba(124,58,237,.35))
               drop-shadow(0 4px 10px rgba(0,0,0,.45));
        display:block;
      }
      #carrieWrap.bob{
        animation:bob 3.5s ease-in-out infinite;
      }
      @keyframes bob{
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(-6px)}
      }

      .bubble{
        position:fixed;
        width:46px; height:46px;
        border-radius:999px;
        display:grid; place-items:center;
        font-size:22px;
        background:radial-gradient(circle at 30% 20%,
          rgba(124,58,237,.55), rgba(10,10,20,.85));
        border:1px solid rgba(124,58,237,.5);
        box-shadow:0 0 14px rgba(124,58,237,.30);
        color:#eae6ff; cursor:pointer;
        z-index:10001;
        opacity:0.9;
        transition:transform .25s ease;
      }
      .bubble:hover{
        opacity:1;
        box-shadow:0 0 18px rgba(124,58,237,.45);
      }
      /* directly under the floating menu button */
      #bubble-contact{ right:14px; top:150px; }
      #bubble-donate{ right:14px; top:204px; }

      /* slide left with the menu & Carrie */
      .bubble.aside{
        transform:translateX(-260px);
      }
    `;
    document.head.appendChild(css);

    const shell = document.createElement("div");
    shell.innerHTML = `
      <button id="fab" aria-controls="menu" aria-expanded="false" title="Menu">
        <svg width="26" height="26" viewBox="0 0 24 24"
             fill="none" stroke="#00d9ff" stroke-width="2">
          <path d="M9 18V5l10-2v13" />
          <circle cx="7" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
      </button>
      <div id="backdrop"></div>
      <nav id="menu" aria-hidden="true">
        <details class="group" open>
          <summary>Home & Main</summary>
          <a href="index.html">Dashboard</a>
          <a href="home.html">Home (alt)</a>
          <a href="featured.html">Featured</a>
          <a href="featured_songs.html">Featured Songs</a>
          <a href="feed.html">Community Feed</a>
          <a href="radio.html">Radio</a>
          <a href="podcast.html">Podcast</a>
          <a href="blog.html">Blog</a>
          <a href="fan-zone.html">Fan Zone</a>
          <a href="stories.html">Stories</a>
          <a href="dedications.html">Dedications</a>
          <a href="dedication.html">Single Dedication</a>
          <a href="contest.html">Contest</a>
          <a href="contests.html">Contests</a>
          <a href="leaderboard.html">Leaderboards</a>
          <a href="stats.html">Site Stats</a>
          <a href="awards.html">Awards</a>
          <a href="contact.html">Contact</a>
          <a href="about.html">About</a>
        </details>

        <details class="group">
          <summary>Studio & AI</summary>
          <a href="studio-tools.html">Studio Tools</a>
          <a href="studio_tools.html">Studio Tools (alt)</a>
          <a href="creator-tools.html">Creator Tools</a>
          <a href="creator_tools.html">Creator Tools (alt)</a>
          <a href="lyrics-ai.html">AI Lyrics</a>
          <a href="lyric_ai.html">AI Lyrics (alt)</a>
          <a href="song-ai.html">AI Song</a>
          <a href="album-ai.html">AI Album</a>
          <a href="voice-ai.html">Voice / Post VO</a>
          <a href="cover_ai.html">Cover AI</a>
          <a href="master_ai.html">Master AI</a>
          <a href="author.html">Author AI</a>
          <a href="author-hub.html">Author Hub</a>
          <a href="ai-dashboard.html">AI Dashboard</a>
          <a href="translate.html">Translate</a>
          <a href="integration.html">Integration</a>
        </details>

        <details class="group">
          <summary>Tournaments & Games</summary>
          <a href="game-hub.html">Game Hub</a>
          <a href="games.html">Games</a>
          <a href="arcade.html">Arcade</a>
          <a href="game-music.html">Music Game</a>
          <a href="game-tournaments.html">Tournaments</a>
          <a href="game-leaderboards.html">Game Leaderboards</a>
          <a href="pool-8-ball.html">Pool 8-Ball</a>
          <a href="pool-9-ball.html">Pool 9-Ball</a>
          <a href="trickshot-pool.html">Trickshot Pool</a>
          <a href="game_pool_8ball.html">8-Ball (alt)</a>
          <a href="game_pool_9ball.html">9-Ball (alt)</a>
          <a href="game_pool_trick.html">Trickshot (alt)</a>
          <a href="game-coin-shop.html">Game Coin Shop</a>
        </details>

        <details class="group">
          <summary>Profiles & Badges</summary>
          <a href="profiles.html">All Profiles</a>
          <a href="profile.html">My Profile (base)</a>
          <a href="profile_base.html">Profile Template</a>
          <a href="artist.html">Artist Landing</a>
          <a href="beatmaker.html">Beatmaker Landing</a>
          <a href="influencer.html">Influencer Landing</a>
          <a href="influencer-hub.html">Influencer Hub</a>
          <a href="artist-studio.html">Artist Studio</a>
          <a href="profile_artist.html">Artist Profile</a>
          <a href="profile_beatmaker.html">Beatmaker Profile</a>
          <a href="profile_author.html">Author Profile</a>
          <a href="profile_dancer.html">Dancer Profile</a>
          <a href="profile_influencer.html">Influencer Profile</a>
          <a href="profile_fan.html">Fan Profile</a>
          <a href="login.html">Login</a>
          <a href="reset-password.html">Reset Password</a>
          <a href="reset_password.html">Reset Password (alt)</a>
        </details>

        <details class="group">
          <summary>Shop & Coins</summary>
          <a href="shop.html">Shop</a>
          <a href="store.html">Store (alt)</a>
          <a href="shop-stickers.html">Shop Stickers</a>
          <a href="shop-upgrades.html">Shop Upgrades</a>
          <a href="stickers.html">Stickers</a>
          <a href="upgrades.html">Upgrades</a>
          <a href="coinshop.html">Coin Shop</a>
          <a href="game-coin-shop.html">Game Coin Shop</a>
          <a href="pricing.html">Pricing</a>
          <a href="donate.html">Donate</a>
          <a href="ads.html">Ads</a>
          <a href="affiliates.html">Affiliates</a>
        </details>

        <details class="group">
          <summary>Admin / Mod / Owner</summary>
          <a href="admin.html">Admin</a>
          <a href="admin-panel.html">Admin Panel</a>
          <a href="admin_panel.html">Admin Panel (alt)</a>
          <a href="admin-hub.html">Admin Hub</a>
          <a href="admin-guide.html">Admin Guide</a>
          <a href="admin_guide.html">Admin Guide (alt)</a>
          <a href="mod-hub.html">Mod Hub</a>
          <a href="mod-panel.html">Mod Panel</a>
          <a href="mod_panel.html">Mod Panel (alt)</a>
          <a href="owner.html">Owner</a>
          <a href="owner-studio.html">Owner Studio</a>
          <a href="owner-panel.html">Owner Panel</a>
          <a href="owner_picks.html">Owner Picks</a>
          <a href="menu.html">Menu (legacy)</a>
          <a href="system.html">System</a>
          <a href="debug.html">Debug</a>
        </details>

        <details class="group">
          <summary>Info & Legal</summary>
          <a href="faq.html">FAQ</a>
          <a href="help.html">Help</a>
          <a href="press.html">Press</a>
          <a href="announcements.html">Announcements</a>
          <a href="rules.html">Rules</a>
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="tos_updates.html">TOS Updates</a>
          <a href="credits.html">Credits</a>
          <a href="thank_you.html">Thank You</a>
        </details>

        <details class="group">
          <summary>Carrie, Kids & Fun</summary>
          <a href="carrie-chat.html">Carrie Chat</a>
          <a href="carrie-closet.html">Carrie Closet</a>
          <a href="carrie-concerts.html">Carrie Concerts</a>
          <a href="kids.html">Kids</a>
          <a href="kids-zone.html">Kids Zone</a>
          <a href="kids_games.html">Kids Games</a>
          <a href="kids_stories.html">Kids Stories</a>
          <a href="dm.html">Messages</a>
          <a href="chat.html">Chat</a>
          <a href="posts.html">Posts</a>
          <a href="song-killa-bees.html">Killa Bees Song Page</a>
          <a href="song.html">Song (generic)</a>
          <a href="zz-test.html">ZZ Test</a>
        </details>
      </nav>

      <div id="carrieWrap" class="bob" title="Chat with Carrie (drag / tap)">
        <video id="carrie"
          src="assets/videos/carrie_casual_animate_3_1.webm"
          autoplay loop muted playsinline
          style="width:min(80vw,420px);height:auto;background:transparent;object-fit:contain;">
        </video>
      </div>

      <button id="bubble-contact" class="bubble" title="Contact">
        ♪
      </button>
      <button id="bubble-donate" class="bubble" title="Donate">
        ♫
      </button>
    `;
    document.body.appendChild(shell);

    const fab = document.getElementById("fab");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("backdrop");
    const carrieWrap = document.getElementById("carrieWrap");
    const bubbleContact = document.getElementById("bubble-contact");
    const bubbleDonate = document.getElementById("bubble-donate");

    let timer = null;

    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      carrieWrap.classList.add("aside");
      bubbleContact.classList.add("aside");
      bubbleDonate.classList.add("aside");
      resetTimer();
    }

    function closeMenu() {
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
      carrieWrap.classList.remove("aside");
      bubbleContact.classList.remove("aside");
      bubbleDonate.classList.remove("aside");
      clearTimeout(timer);
      timer = null;
    }

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(closeMenu, 20000); // 20s auto-close
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
    menu.addEventListener("wheel", resetTimer, { passive: true });

    // Floating bubbles
    bubbleContact.addEventListener("click", () => {
      window.location.href = "contact.html";
    });
    bubbleDonate.addEventListener("click", () => {
      const donate = document.getElementById("donate");
      if (donate) donate.scrollIntoView({ behavior: "smooth" });
      else window.location.href = "donate.html";
    });

    // Carrie drag + tap-to-chat
    let dragging = false;
    let sx = 0,
      sy = 0,
      ox = 0,
      oy = 0;
    let pointerDownTime = 0;
    let moved = false;

    function getPoint(e) {
      if ("touches" in e && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      dragging = true;
      moved = false;
      pointerDownTime = Date.now();
      const p = getPoint(e);
      sx = p.x;
      sy = p.y;
      const r = carrieWrap.getBoundingClientRect();
      ox = r.left;
      oy = r.top;
      carrieWrap.style.right = "auto";
      carrieWrap.style.bottom = "auto";
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      const p = getPoint(e);
      const dx = p.x - sx;
      const dy = p.y - sy;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
      carrieWrap.style.left = ox + dx + "px";
      carrieWrap.style.top = oy + dy + "px";
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      const dt = Date.now() - pointerDownTime;
      // Treat as tap if short and not moved much
      if (!moved && dt < 300) {
        window.location.href = "carrie-chat.html";
      }
    }

    carrieWrap.addEventListener("mousedown", onDown);
    carrieWrap.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  }
})();

// 8BFR global UI: floating menu, Carrie avatar, contact/donate/top/bottom bubbles
(function () {
  function injectGlobalUI() {
    // don’t inject twice
    if (document.getElementById("fab")) return;

    // ---------- STYLES ----------
    const style = document.createElement("style");
    style.textContent = `
      :root{
        --ring: rgba(124,58,237,.55);
        --glass: rgba(12,6,24,.80);
      }

      /* Floating main button */
      #fab{
        position:fixed;
        top:86px;
        right:14px;
        z-index:9999;
        width:56px;
        height:56px;
        border-radius:9999px;
        display:grid;
        place-items:center;
        cursor:pointer;
        background:radial-gradient(120% 120% at 30% 20%,rgba(124,58,237,.50),rgba(10,10,20,.70));
        border:1px solid rgba(124,58,237,.35);
        box-shadow:0 0 14px rgba(124,58,237,.30),0 0 18px rgba(0,217,255,.18) inset;
      }

      /* Slide menu */
      #menu{
        position:fixed;
        top:144px;
        right:14px;
        width:min(88vw,230px);
        max-height:calc(100vh - 160px);
        overflow-y:auto;
        z-index:9998;
        transform:translateX(115%);
        transition:transform .25s ease;
        backdrop-filter:blur(10px);
        background:var(--glass);
        border:1px solid var(--ring);
        border-radius:12px;
        box-shadow:0 12px 28px rgba(0,0,0,.45);
        font-size:.78rem;
      }
      #menu.open{ transform:translateX(0); }

      #backdrop{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.18);
        backdrop-filter:blur(1px);
        z-index:9990;
        opacity:0;
        pointer-events:none;
        transition:opacity .2s ease;
      }
      #backdrop.open{
        opacity:1;
        pointer-events:auto;
      }

      #menu .group{
        margin:3px;
        border:1px solid rgba(124,58,237,.28);
        border-radius:10px;
        overflow:hidden;
      }
      #menu .group summary{
        cursor:pointer;
        padding:5px 7px;
        background:rgba(124,58,237,.10);
      }
      #menu .group a{
        display:block;
        padding:3px 7px;
        color:#eae6ff;
        text-decoration:none;
      }
      #menu .group a:hover{
        background:rgba(124,58,237,.14);
      }

      #carrieWrap{
        position:fixed;
        right:14px;
        top:320px;       /* Carrie sits under the floating menu & bubbles */
        bottom:auto;
        z-index:9997;
        transition:transform .25s ease;
        user-select:none;
        touch-action:none;
      }
      }
      /* when menu open, dock her to the left */
      #carrieWrap.aside{
        transform:translateX(-240px);
      }
      #carrie{
        width:min(90vw,520px);
        height:auto;
        border-radius:0;
        background:transparent!important;
        filter:drop-shadow(0 10px 28px rgba(124,58,237,.35))
               drop-shadow(0 4px 10px rgba(0,0,0,.45));
        display:block;
        object-fit:contain;
      }
      #carrie.bob{
        animation:bob 3.5s ease-in-out infinite;
      }
      @keyframes bob{
        0%,100%{ transform:translateY(0); }
        50%{ transform:translateY(-6px); }
      }

      /* "Chat with me" speech bubble attached to Carrie */
      #carrieTip{
        position:absolute;
        bottom:100%;
        right:40px;              /* shift left a bit so it's more over her head */
        margin-bottom:8px;
        padding:5px 10px;
        font-size:11px;
        border-radius:14px;
        background:rgba(10,6,24,.95);
        color:#eae6ff;
        border:1px solid rgba(124,58,237,.9);
        box-shadow:0 0 10px rgba(124,58,237,.55);
        white-space:nowrap;
      }
      #carrieTip::after{
        content:"";
        position:absolute;
        bottom:-7px;             /* tail points downward toward her mouth */
        right:16px;              /* move this left/right to fine-tune where it points */
        border-width:7px 7px 0 7px;
        border-style:solid;
        border-color:rgba(10,6,24,.95) transparent transparent transparent;
      }
      #carrieTip::after{
        content:"";
        position:absolute;
        bottom:-7px;             /* tail points downward toward her mouth */
        right:16px;              /* move this left/right to fine-tune where it points */
        border-width:7px 7px 0 7px;
        border-style:solid;
        border-color:rgba(10,6,24,.95) transparent transparent transparent;
      }

      /* Floating bubbles */
      .bubble{
        position:fixed;
        width:46px;
        height:46px;
        border-radius:999px;
        display:grid;
        place-items:center;
        font-size:22px;
        background:radial-gradient(circle at 30% 20%,rgba(124,58,237,.55),rgba(10,10,20,.85));
        border:1px solid rgba(124,58,237,.5);
        box-shadow:0 0 14px rgba(124,58,237,.30);
        color:#eae6ff;
        cursor:pointer;
        z-index:10001;
        opacity:0.9;
        transition:transform .25s ease;
      }
      .bubble:hover{
        opacity:1;
        box-shadow:0 0 18px rgba(124,58,237,.45);
      }
      #bubble-contact{ right:14px; top:150px; }
      #bubble-donate{ right:14px; top:204px; }
      #bubble-bottom{ right:14px; top:258px; } /* down arrow */
      #bubble-top{    right:14px; bottom:24px; } /* up arrow */

      .bubble.aside{
        transform:translateX(-240px);
      }

      /* Labels for bubbles */
      .bubble-label{
        position:fixed;
        right:68px;
        font-size:11px;
        padding:2px 6px;
        border-radius:999px;
        background:rgba(5,2,12,.75);
        color:#eae6ff;
        opacity:.7;
        pointer-events:none;
        z-index:10000;
      }
      #label-contact{ top:160px; }
      #label-donate{  top:214px; }
      #label-bottom{  top:268px; }
      #label-top{     bottom:74px; }

      .bubble-label.aside{
        transform:translateX(-240px);
      }
    `;
    document.head.appendChild(style);

    // ---------- HTML SHELL ----------
    const shell = document.createElement("div");
    shell.innerHTML = `
      <button id="fab" aria-controls="menu" aria-expanded="false" title="Menu">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2">
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

      <div id="carrieWrap" title="Chat with Carrie (drag / tap)">
        <video
          id="carrie"
          class="bob"
          src="assets/videos/carrie_casual_animate_3_1.webm"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <div id="carrieTip">Chat with me</div>
      </div>

      <button id="bubble-contact" class="bubble" title="Contact">&#9835;</button>
      <button id="bubble-donate"  class="bubble" title="Donate">&#9834;</button>
      <button id="bubble-bottom"  class="bubble" title="Go to footer">&#8595;</button>
      <button id="bubble-top"     class="bubble" title="Back to top">&#8593;</button>

      <span id="label-contact" class="bubble-label">Contact</span>
      <span id="label-donate"  class="bubble-label">Donate</span>
      <span id="label-bottom"  class="bubble-label">Footer</span>
      <span id="label-top"     class="bubble-label">Top</span>
    `;
    document.body.appendChild(shell);

    // ---------- BEHAVIOR ----------
    const fab           = document.getElementById("fab");
    const menu          = document.getElementById("menu");
    const backdrop      = document.getElementById("backdrop");
    const carrieWrap    = document.getElementById("carrieWrap");
    const carrieVideo   = document.getElementById("carrie");
    const bubbleContact = document.getElementById("bubble-contact");
    const bubbleDonate  = document.getElementById("bubble-donate");
    const bubbleBottom  = document.getElementById("bubble-bottom");
    const bubbleTop     = document.getElementById("bubble-top");
    const labelContact  = document.getElementById("label-contact");
    const labelDonate   = document.getElementById("label-donate");
    const labelBottom   = document.getElementById("label-bottom");
    const labelTop      = document.getElementById("label-top");

    let timer = null;

    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      carrieWrap.classList.add("aside");
      bubbleContact.classList.add("aside");
      bubbleDonate.classList.add("aside");
      bubbleBottom.classList.add("aside");
      bubbleTop.classList.add("aside");
      labelContact.classList.add("aside");
      labelDonate.classList.add("aside");
      labelBottom.classList.add("aside");
      labelTop.classList.add("aside");
      resetTimer();
    }

    function closeMenu() {
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
      carrieWrap.classList.remove("aside");
      bubbleContact.classList.remove("aside");
      bubbleDonate.classList.remove("aside");
      bubbleBottom.classList.remove("aside");
      bubbleTop.classList.remove("aside");
      labelContact.classList.remove("aside");
      labelDonate.classList.remove("aside");
      labelBottom.classList.remove("aside");
      labelTop.classList.remove("aside");
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
    menu.addEventListener("wheel", resetTimer, { passive: true });

    // bubble actions
    bubbleContact.addEventListener("click", () => {
      window.location.href = "contact.html";
    });

    bubbleDonate.addEventListener("click", () => {
      window.open(
        "https://www.paypal.com/donate?business=8bfr.music@gmail.com",
        "_blank"
      );
    });

    bubbleTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    bubbleBottom.addEventListener("click", () => {
      const footer = document.getElementById("page-footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    // Carrie drag (wrapper) + click-to-chat (video only)
    let dragging = false,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0;

    function getPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      dragging = true;
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
      carrieWrap.style.left = ox + dx + "px";
      carrieWrap.style.top = oy + dy + "px";
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

    // ONLY clicking directly on Carrie opens chat
    if (carrieVideo) {
      carrieVideo.addEventListener("click", function (e) {
        e.stopPropagation();
        window.location.href = "carrie-chat.html";
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGlobalUI);
  } else {
    injectGlobalUI();
  }
})();

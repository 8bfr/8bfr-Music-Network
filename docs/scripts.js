(function(){
  if (document.getElementById('fab')) return; // already injected

  const css = document.createElement('style');
  css.textContent = `
  :root{ --ring: rgba(124,58,237,.55); --glass: rgba(12,6,24,.70); }

  /* Floating round buttons */
  #fab, #contactFab, #donateFab, #topFab{
    position:fixed; right:14px; z-index:9999; width:56px; height:56px; border-radius:9999px;
    display:grid; place-items:center; cursor:pointer;
    background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.50), rgba(10,10,20,.50));
    border:1px solid rgba(124,58,237,.35);
    box-shadow:0 0 14px rgba(124,58,237,.30), 0 0 18px rgba(0,217,255,.18) inset;
    backdrop-filter: blur(4px);
  }
  #fab{ top:86px; }
  #contactFab{ top:152px; z-index:9998 }
  #donateFab{ top:218px; z-index:9998 }
  #topFab{ top:284px; z-index:9998 }

  #fab svg, #contactFab svg, #donateFab svg, #topFab svg{ stroke:#00d9ff }

  /* Slide-out menu panel */
  #menu{
    position:fixed; top:144px; right:14px; width:min(92vw,270px);
    max-height:calc(100vh - 160px); overflow-y:auto; z-index:9998;
    transform:translateX(115%); transition:transform .25s ease;
    backdrop-filter:blur(10px); background:var(--glass);
    border:1px solid var(--ring); border-radius:12px; box-shadow:0 12px 28px rgba(0,0,0,.45)
  }
  #menu.open{transform:translateX(0)}

  #backdrop{
    position:fixed; inset:0; background:rgba(0,0,0,.18); backdrop-filter:blur(1px);
    z-index:9990; opacity:0; pointer-events:none; transition:opacity .2s ease
  }
  #backdrop.open{opacity:1; pointer-events:auto}

  .group{margin:8px; border:1px solid rgba(124,58,237,.28); border-radius:10px; overflow:hidden}
  .group summary{cursor:pointer; padding:7px 9px; background:rgba(124,58,237,.10)}
  .group a{display:block; padding:6px 9px; color:#eae6ff; text-decoration:none}
  .group a:hover{background:rgba(124,58,237,.14)}

  /* Carrie avatar */
  #carrieWrap{
    position:fixed; right:14px; bottom:16px; z-index:9997;
    transition:transform .25s ease; user-select:none; touch-action:none;
  }
  /* When menu opens, slide Carrie left to sit beside it */
  #carrieWrap.aside{
    transform:translateX(-320px);
  }
  #carrie{
    width:min(55vw,420px);
    height:auto;
    border-radius:0;
    background:transparent !important;
    display:block;
    filter:
      drop-shadow(0 10px 28px rgba(124,58,237,.35))
      drop-shadow(0 4px 10px rgba(0,0,0,.45));
    /* This *might* soften black edges a tiny bit, but cannot fully remove video background */
    /* mix-blend-mode: screen; */ 
  }
  .bob{ animation:bob 3.5s ease-in-out infinite }
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  /* Small screens */
  @media (max-width: 420px){
    #fab{ top:90px }
    #contactFab{ top:156px }
    #donateFab{ top:222px }
    #topFab{ top:288px }
    #menu{ top:170px; max-height:calc(100vh - 186px) }
    #carrieWrap.aside{
      transform:translateX(-260px);
    }
    #carrie{
      width:min(70vw,280px);
    }
  }
  `;
  document.head.appendChild(css);

  const shell = document.createElement('div');
  shell.innerHTML = `
    <!-- Main menu FAB -->
    <button id="fab" aria-controls="menu" aria-expanded="false" title="Menu">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
        <path d="M9 18V5l10-2v13" />
        <circle cx="7" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
      <span class="sr-only">Open site menu</span>
    </button>

    <!-- Contact -->
    <button id="contactFab" title="Contact 8BFR">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
        <path d="M22 6l-10 7L2 6"></path>
      </svg>
      <span class="sr-only">Contact</span>
    </button>

    <!-- Donate -->
    <button id="donateFab" title="Donate">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
        <path d="M12 21s-6-4.35-8.485-6.835A6 6 0 1 1 12 5a6 6 0 1 1 8.485 9.165C18 16.65 12 21 12 21z"></path>
      </svg>
      <span class="sr-only">Donate</span>
    </button>

    <!-- Back to Top -->
    <button id="topFab" title="Back to Top">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
        <path d="M12 19V5"></path>
        <path d="M5 12l7-7 7 7"></path>
      </svg>
      <span class="sr-only">Back to Top</span>
    </button>

    <!-- Backdrop + Menu -->
    <div id="backdrop"></div>
    <nav id="menu" aria-hidden="true">
      <!-- HOME / COMMUNITY -->
      <details class="group" open><summary>Home & Community</summary>
        <a href="index.html">Dashboard / Home</a>
        <a href="home.html">Home (alt)</a>
        <a href="featured.html">Featured</a>
        <a href="featured_songs.html">Featured Songs</a>
        <a href="feed.html">Community Feed</a>
        <a href="fan-zone.html">Fan Zone</a>
        <a href="blog.html">Blog</a>
        <a href="stories.html">Stories</a>
        <a href="posts.html">Posts</a>
        <a href="podcast.html">Podcast</a>
        <a href="radio.html">Radio</a>
        <a href="contact.html">Contact</a>
        <a href="about.html">About</a>
        <a href="press.html">Press</a>
        <a href="help.html">Help</a>
        <a href="faq.html">FAQ</a>
        <a href="chat.html">Site Chat</a>
      </details>

      <!-- STUDIO & AI -->
      <details class="group"><summary>Studio & AI</summary>
        <a href="artist-studio.html">Artist Studio</a>
        <a href="artist.html">Artist Page</a>
        <a href="beatmaker.html">Beatmaker Page</a>
        <a href="studio-tools.html">Studio Tools</a>
        <a href="studio_tools.html">Studio Tools (alt)</a>
        <a href="creator-tools.html">Creator Tools</a>
        <a href="creator_tools.html">Creator Tools (alt)</a>
        <a href="game-music.html">Game Music</a>
        <a href="lyrics-ai.html">AI Lyrics</a>
        <a href="lyric_ai.html">AI Lyrics (alt)</a>
        <a href="song-ai.html">AI Song</a>
        <a href="album-ai.html">AI Album</a>
        <a href="voice-ai.html">Voice / Post VO</a>
        <a href="master_ai.html">Master AI</a>
        <a href="cover_ai.html">Cover AI</a>
        <a href="author.html">Author</a>
        <a href="author-hub.html">Author Hub</a>
        <a href="integration.html">Integration</a>
        <a href="translate.html">Translate</a>
      </details>

      <!-- TOURNAMENTS & GAMES -->
      <details class="group"><summary>Tournaments & Games</summary>
        <a href="game-hub.html">Game Hub</a>
        <a href="games.html">Games</a>
        <a href="arcade.html">Arcade</a>
        <a href="game-tournaments.html">Tournaments</a>
        <a href="game-leaderboards.html">Game Leaderboards</a>
        <a href="leaderboard.html">Site Leaderboard</a>
        <a href="game-coin-shop.html">Game Coin Shop</a>
        <a href="pool-8-ball.html">Pool 8-Ball</a>
        <a href="pool-9-ball.html">Pool 9-Ball</a>
        <a href="trickshot-pool.html">Trickshot Pool</a>
        <a href="game_pool_8ball.html">Pool 8-Ball (alt)</a>
        <a href="game_pool_9ball.html">Pool 9-Ball (alt)</a>
        <a href="game_pool_trick.html">Trickshot (alt)</a>
      </details>

      <!-- PROFILES -->
      <details class="group"><summary>Profiles & Badges</summary>
        <a href="profiles.html">All Profiles</a>
        <a href="profile.html">My Profile (generic)</a>
        <a href="profile_base.html">Profile Base</a>
        <a href="profile_artist.html">Artist Profile</a>
        <a href="profile_beatmaker.html">Beatmaker Profile</a>
        <a href="profile_author.html">Author Profile</a>
        <a href="profile_dancer.html">Dancer Profile</a>
        <a href="profile_influencer.html">Influencer Profile</a>
        <a href="profile_fan.html">Fan Profile</a>
        <a href="influencer.html">Influencer Page</a>
        <a href="influencer-hub.html">Influencer Hub</a>
        <a href="fan-zone.html">Fan Zone</a>
      </details>

      <!-- SHOP -->
      <details class="group"><summary>Shop & Coins</summary>
        <a href="shop.html">Shop</a>
        <a href="store.html">Store (alt)</a>
        <a href="coinshop.html">Coin Shop</a>
        <a href="game-coin-shop.html">Game Coin Shop</a>
        <a href="shop-stickers.html">Shop Stickers</a>
        <a href="stickers.html">Stickers (alt)</a>
        <a href="shop-upgrades.html">Shop Upgrades</a>
        <a href="upgrades.html">Upgrades (alt)</a>
        <a href="pricing.html">Pricing</a>
        <a href="donate.html">Donate</a>
        <a href="thank_you.html">Thank You</a>
      </details>

      <!-- ADMIN / MOD / OWNER -->
      <details class="group"><summary>Admin / Mod / Owner</summary>
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
        <a href="owner-panel.html">Owner Panel</a>
        <a href="owner-studio.html">Owner Studio</a>
        <a href="owner_picks.html">Owner Picks</a>

        <a href="contests.html">Contests</a>
        <a href="contest.html">Contest (single)</a>

        <a href="stats.html">Stats</a>
        <a href="rules.html">Rules</a>
        <a href="system.html">System</a>
        <a href="debug.html">Debug</a>
        <a href="dm.html">DM (messages)</a>
        <a href="menu.html">Menu Page</a>
        <a href="login.html">Login</a>
        <a href="reset-password.html">Reset Password</a>
        <a href="reset_password.html">Reset Password (alt)</a>
        <a href="zz-test.html">ZZ Test</a>
      </details>

      <!-- INFO / LEGAL -->
      <details class="group"><summary>Info & Legal</summary>
        <a href="faq.html">FAQ</a>
        <a href="help.html">Help</a>
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="tos_updates.html">TOS Updates</a>
        <a href="credits.html">Credits</a>
        <a href="press.html">Press</a>
        <a href="awards.html">Awards</a>
        <a href="dedications.html">Dedications</a>
        <a href="dedication.html">Dedication (single)</a>
      </details>

      <!-- CARRIE / KIDS / FUN -->
      <details class="group"><summary>Carrie • Kids • Fun</summary>
        <a href="carrie-chat.html">Carrie Chat</a>
        <a href="carrie-closet.html">Carrie Closet</a>
        <a href="carrie-concerts.html">Carrie Concerts</a>
        <a href="kids.html">Kids</a>
        <a href="kids-zone.html">Kids Zone</a>
        <a href="kids_games.html">Kids Games</a>
        <a href="kids_stories.html">Kids Stories</a>
        <a href="stories.html">Stories</a>
      </details>
    </nav>

    <!-- Carrie (draggable) -->
    <div id="carrieWrap" title="Chat with Carrie (drag or tap)">
      <video id="carrie" autoplay loop muted playsinline src="assets/videos/carrie_casual_animate_3_1.mp4"></video>
    </div>
  `;
  document.body.appendChild(shell);

  // Button actions
  document.getElementById('contactFab').addEventListener('click', ()=> location.href='contact.html');
  document.getElementById('donateFab').addEventListener('click', ()=> {
    window.open('https://www.paypal.com/donate?business=8bfr.music@gmail.com','_blank','noopener');
  });
  document.getElementById('topFab').addEventListener('click', ()=> {
    try{ window.scrollTo({top:0, behavior:'smooth'}); }catch{ window.scrollTo(0,0); }
  });

  // Menu logic (also controls Carrie sliding with .aside)
  const fab = document.getElementById('fab');
  const menu = document.getElementById('menu');
  const shade = document.getElementById('backdrop');
  const cWrap = document.getElementById('carrieWrap');

  let timer = null;

  function openMenu(){
    menu.classList.add('open');
    shade.classList.add('open');
    fab.setAttribute('aria-expanded','true');
    cWrap.classList.add('aside');   // Carrie slides left
    resetTimer();
  }
  function closeMenu(){
    menu.classList.remove('open');
    shade.classList.remove('open');
    fab.setAttribute('aria-expanded','false');
    cWrap.classList.remove('aside'); // Carrie slides back
    clearTimeout(timer);
    timer = null;
  }
  function resetTimer(){
    clearTimeout(timer);
    timer = setTimeout(closeMenu, 20000);
  }

  fab.addEventListener('click', e => {
    e.stopPropagation();
    if (menu.classList.contains('open')) closeMenu(); else openMenu();
  });

  shade.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  menu.addEventListener('pointermove', resetTimer);
  menu.addEventListener('wheel', resetTimer);

  // Carrie drag + TAP TO CHAT
  const wrap = cWrap;
  const video = document.getElementById('carrie');
  wrap.classList.add('bob');

  let dragging = false;
  let moved = false;
  let sx = 0, sy = 0, ox = 0, oy = 0;

  const point = e => ('touches' in e ? e.touches[0] : e);

  const down = e => {
    dragging = true;
    moved = false;
    const p = point(e);
    sx = p.clientX;
    sy = p.clientY;
    const r = wrap.getBoundingClientRect();
    ox = r.left;
    oy = r.top;
    e.preventDefault();
  };

  const move = e => {
    if (!dragging) return;
    const p = point(e);
    const dx = p.clientX - sx;
    const dy = p.clientY - sy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    wrap.style.right = 'auto';
    wrap.style.bottom = 'auto';
    wrap.style.left = (ox + dx) + 'px';
    wrap.style.top = (oy + dy) + 'px';
  };

  const up = () => {
    if (!dragging) return;
    dragging = false;
    if (!moved){
      // treated as click/tap
      location.href = 'carrie-chat.html';
    }
  };

  wrap.addEventListener('mousedown', down);
  wrap.addEventListener('touchstart', down, { passive:false });
  window.addEventListener('mousemove', move, { passive:false });
  window.addEventListener('touchmove', move, { passive:false });
  window.addEventListener('mouseup', up);
  window.addEventListener('touchend', up);
})();

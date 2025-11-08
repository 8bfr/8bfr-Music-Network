(function(){
  if (document.getElementById('fab')) return; // prevent duplicate injection

  // Decide which Carrie animation to use (casual vs business)
  const path = location.pathname.toLowerCase();
  let carrieSrc = 'assets/videos/carrie_casual_animate_3_1.webm';

  const businessKeywords = [
    'admin',
    'owner',
    'studio',
    'panel',
    'dashboard',
    'pricing',
    'shop',
    'store',
    'coinshop',
    'game-coin-shop',
    'upgrades',
    'stats',
    'mod',
    'integration'
  ];

  if (businessKeywords.some(k => path.includes(k))) {
    carrieSrc = 'assets/videos/carrie_business_animate.webm';
  }

  const css = document.createElement('style');
  css.textContent = `
  :root{ --ring: rgba(124,58,237,.55); --glass: rgba(12,6,24,.70); }
  #fab{
    position:fixed;top:86px;right:14px;z-index:9999;width:56px;height:56px;
    border-radius:9999px;display:grid;place-items:center;cursor:pointer;
    background:radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.50), rgba(10,10,20,.50));
    border:1px solid rgba(124,58,237,.35);
    box-shadow:0 0 14px rgba(124,58,237,.30),0 0 18px rgba(0,217,255,.18) inset
  }
  #menu{
    position:fixed;top:144px;right:14px;width:min(92vw,270px);
    max-height:calc(100vh - 160px);overflow-y:auto;z-index:9998;
    transform:translateX(115%);transition:transform .25s ease;
    backdrop-filter:blur(10px);background:var(--glass);
    border:1px solid var(--ring);border-radius:12px;
    box-shadow:0 12px 28px rgba(0,0,0,.45)
  }
  #menu.open{transform:translateX(0)}
  #backdrop{
    position:fixed;inset:0;background:rgba(0,0,0,.18);
    backdrop-filter:blur(1px);z-index:9990;opacity:0;
    pointer-events:none;transition:opacity .2s ease
  }
  #backdrop.open{opacity:1;pointer-events:auto}
  .group{
    margin:8px;border:1px solid rgba(124,58,237,.28);
    border-radius:10px;overflow:hidden
  }
  .group summary{
    cursor:pointer;padding:7px 9px;background:rgba(124,58,237,.10)
  }
  .group a{
    display:block;padding:6px 9px;color:#eae6ff;text-decoration:none
  }
  .group a:hover{background:rgba(124,58,237,.14)}
  #carrieWrap{
    position:fixed;right:14px;bottom:16px;z-index:9997;
    transition:transform .25s ease;user-select:none;touch-action:none
  }
  #carrieWrap.aside{transform:translateX(-260px)}
  #carrie{
    width:min(55vw,420px);
    height:auto;
    border-radius:0;
    background:transparent!important;
    display:block;
    object-fit:contain;
    filter:drop-shadow(0 10px 28px rgba(124,58,237,.55))
           drop-shadow(0 4px 10px rgba(0,0,0,.65));
    mix-blend-mode:lighten;
  }
  .bob{animation:bob 3.5s ease-in-out infinite}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  `;
  document.head.appendChild(css);

  const shell = document.createElement('div');
  shell.innerHTML = `
    <button id="fab" aria-controls="menu" aria-expanded="false" title="Menu">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2">
        <path d="M9 18V5l10-2v13" /><circle cx="7" cy="18" r="3" /><circle cx="17" cy="16" r="3" />
      </svg>
    </button>
    <div id="backdrop"></div>
    <nav id="menu" aria-hidden="true">
      <details class="group" open><summary>Home</summary>
        <a href="index.html">Dashboard</a><a href="home.html">Home (alt)</a><a href="featured.html">Featured</a>
        <a href="feed.html">Community Feed</a><a href="radio.html">Radio</a><a href="podcast.html">Podcast</a>
        <a href="contact.html">Contact</a><a href="about.html">About</a>
      </details>
      <details class="group"><summary>Studio & AI</summary>
        <a href="studio-tools.html">All Tools</a><a href="creator-tools.html">Creator Tools</a>
        <a href="lyrics-ai.html">AI Lyrics</a><a href="song-ai.html">AI Song</a><a href="album-ai.html">AI Album</a>
        <a href="voice-ai.html">Voice / Post VO</a><a href="master_ai.html">Master AI</a><a href="cover_ai.html">Cover AI</a>
        <a href="author.html">Author</a><a href="author-hub.html">Author Hub</a><a href="translate.html">Translate</a>
      </details>
      <details class="group"><summary>Tournaments & Games</summary>
        <a href="game-hub.html">Game Hub</a><a href="games.html">Games</a><a href="arcade.html">Arcade</a>
        <a href="game-tournaments.html">Tournaments</a><a href="game-leaderboards.html">Leaderboards</a>
        <a href="pool-8-ball.html">Pool 8-Ball</a><a href="pool-9-ball.html">Pool 9-Ball</a><a href="trickshot-pool.html">Trickshot</a>
      </details>
      <details class="group"><summary>Profiles</summary>
        <a href="profiles.html">All Profiles</a><a href="profile_artist.html">Artist</a>
        <a href="profile_beatmaker.html">Beatmaker</a><a href="profile_author.html">Author</a>
        <a href="profile_dancer.html">Dancer</a><a href="profile_influencer.html">Influencer</a>
        <a href="profile_fan.html">Fan</a><a href="profile.html">Generic Profile</a>
      </details>
      <details class="group"><summary>Shop</summary>
        <a href="shop.html">Store</a><a href="coinshop.html">Coin Shop</a><a href="upgrades.html">Upgrades</a>
        <a href="stickers.html">Stickers</a><a href="pricing.html">Pricing</a><a href="donate.html">Donate</a>
      </details>
      <details class="group"><summary>Admin / Mod / Owner</summary>
        <a href="admin.html">Admin</a><a href="admin-panel.html">Admin Panel</a>
        <a href="admin-hub.html">Admin Hub</a><a href="mod-hub.html">Mod Hub</a>
        <a href="owner.html">Owner</a><a href="owner-panel.html">Owner Panel</a>
      </details>
      <details class="group"><summary>Info & Legal</summary>
        <a href="faq.html">FAQ</a><a href="help.html">Help</a><a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a><a href="credits.html">Credits</a>
      </details>
      <details class="group"><summary>Carrie & Fun</summary>
        <a href="carrie-chat.html">Carrie Chat</a><a href="carrie-closet.html">Carrie Closet</a>
        <a href="carrie-concerts.html">Carrie Concerts</a><a href="kids.html">Kids</a>
        <a href="kids-zone.html">Kids Zone</a><a href="kids_games.html">Kids Games</a>
        <a href="kids_stories.html">Kids Stories</a>
      </details>
    </nav>
    <div id="carrieWrap" title="Chat with Carrie (drag or tap)">
      <video id="carrie"
             autoplay
             loop
             muted
             playsinline
             src="${carrieSrc}"></video>
    </div>
  `;
  document.body.appendChild(shell);

  // Menu logic
  const fab = document.getElementById('fab');
  const menu = document.getElementById('menu');
  const shade = document.getElementById('backdrop');
  const cWrap = document.getElementById('carrieWrap');

  let timer = null;
  function openMenu(){
    menu.classList.add('open');
    shade.classList.add('open');
    fab.setAttribute('aria-expanded','true');
    cWrap.classList.add('aside');
    resetTimer();
  }
  function closeMenu(){
    menu.classList.remove('open');
    shade.classList.remove('open');
    fab.setAttribute('aria-expanded','false');
    cWrap.classList.remove('aside');
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

  // Carrie drag + tap to open chat
  const wrap = cWrap;
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
    wrap.style.top  = (oy + dy) + 'px';
  };

  const up = () => {
    if (!dragging) return;
    dragging = false;
    if (!moved){
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

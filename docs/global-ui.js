<script>
// ===== 8BFR GLOBAL UI — Floating menu + Carrie (video avatar) + optional ads =====
(function(){
  if (window.__8bfrGlobal) return; window.__8bfrGlobal = true;

  // --------- settings ---------
  const CASUAL_SRC   = 'assets/videos/carrie_casual_animate_3_1.mp4';
  const BUSINESS_SRC = 'assets/videos/carrie_business_animate.mp4';

  // Pages that should default to Business Carrie (you can add more)
  const BUSINESS_HINT_PATTERNS = [
    'owner', 'admin', 'mod', 'press', 'pricing', 'shop', 'store', 'business', 'sellers', 'credits'
  ];

  // Meta override (optional): <meta name="carrie-mode" content="business">
  const metaMode = (document.querySelector('meta[name="carrie-mode"]')||{}).content;
  const isBusinessPage =
    (metaMode && metaMode.toLowerCase()==='business') ||
    BUSINESS_HINT_PATTERNS.some(k => location.pathname.toLowerCase().includes(k));

  // --------- styles (compact & transparent UI) ---------
  const css = `
:root{ --ring: rgba(124,58,237,.55); --glass: rgba(12,6,24,.70); }
#hamburgerFab{
  position: fixed; top:14px; right:14px; z-index: 9999;
  width:56px; height:56px; border-radius:9999px; display:grid; place-items:center; cursor:pointer;
  background: radial-gradient(120% 120% at 30% 20%, rgba(124,58,237,.60), rgba(10,10,20,.60));
  border:1px solid rgba(124,58,237,.40);
  box-shadow: 0 0 14px rgba(124,58,237,.30), 0 0 18px rgba(0,217,255,.18) inset;
}
#hamburgerFab svg{ filter: drop-shadow(0 0 5px rgba(0,217,255,.75)); }
#sideMenu{
  position: fixed; top:72px; right:14px; width:min(90vw, 260px);
  max-height: calc(100vh - 88px); overflow-y: auto; z-index: 9998;
  transform: translateX(115%); transition: transform .25s ease;
  backdrop-filter: blur(10px); background: var(--glass);
  border:1px solid var(--ring); border-radius:12px; box-shadow: 0 12px 28px rgba(0,0,0,.45);
}
#sideMenu.open{ transform: translateX(0); }
#menuBackdrop{
  position: fixed; inset:0; background: rgba(0,0,0,.18); backdrop-filter: blur(1px);
  z-index: 9990; opacity:0; pointer-events:none; transition:opacity .2s ease;
}
#menuBackdrop.open{ opacity:1; pointer-events:auto; }
.menu-group{ margin:8px; border:1px solid rgba(124,58,237,.28); border-radius:10px; overflow:hidden }
.menu-group summary{ cursor:pointer; padding:7px 9px; background: rgba(124,58,237,.10) }
.menu-group a{ display:block; padding:6px 9px; color:#eae6ff; text-decoration:none }
.menu-group a:hover{ background: rgba(124,58,237,.14) }

/* Carrie — video avatar (bigger, “transparent look”) */
#carrieWrap{
  position: fixed; right:14px; bottom:16px; z-index: 9997; transition: transform .25s ease;
  user-select:none; touch-action:none;
}
#carrieWrap.aside{ transform: translateX(-260px); }
#carrie{
  width:min(42vw, 280px); height:auto; border-radius:0; background:transparent !important;
  filter: drop-shadow(0 10px 28px rgba(124,58,237,.35)) drop-shadow(0 4px 10px rgba(0,0,0,.45));
  pointer-events:auto; display:block;
}
/* fun modes (transform the wrapper so the video stays crisp) */
.carrie--bob   { animation: carrie-bob 3.5s ease-in-out infinite; }
.carrie--dance { animation: carrie-dance 1.25s ease-in-out infinite; }
.carrie--pace  { animation: carrie-pace 10s ease-in-out infinite; }
.carrie--wave  { animation: carrie-wave 1.2s ease-in-out 6; }
@keyframes carrie-bob { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
@keyframes carrie-dance {
  0%{ transform: translateY(0) rotate(-2deg) scale(1.00) }
  25%{ transform: translateY(-4px) rotate(2deg)  scale(1.03) }
  50%{ transform: translateY(0)  rotate(-2deg) scale(1.00) }
  75%{ transform: translateY(-4px) rotate(2deg)  scale(1.03) }
  100%{ transform: translateY(0) rotate(-2deg)  scale(1.00) }
}
@keyframes carrie-pace {
  0%   { transform: translateX(0)   scaleX(1) }
  45%  { transform: translateX(-240px) scaleX(1) }
  50%  { transform: translateX(-240px) scaleX(-1) }
  95%  { transform: translateX(0)   scaleX(-1) }
  100% { transform: translateX(0)   scaleX(1) }
}
@keyframes carrie-wave {
  0%,100% { filter: drop-shadow(0 10px 28px rgba(124,58,237,.35)) drop-shadow(0 4px 10px rgba(0,0,0,.45)); }
  50%     { filter: drop-shadow(0 10px 28px rgba(0,217,255,.55)) drop-shadow(0 4px 10px rgba(0,0,0,.45)); }
}

/* Ads (only runs if #adTrack exists on a page) */
.ad-frame{position:relative; overflow:hidden; border-radius:1rem; border:1px solid rgba(124,58,237,.4); background:#0c0618}
.ad-track{display:flex; width:100%; height:260px; position:relative}
.ad-slide{position:absolute; inset:0; display:grid; place-items:center; opacity:0; transform:translateX(20px);
          transition:opacity .35s ease, transform .35s ease}
.ad-slide.show{opacity:1; transform:translateX(0)}
.ad-slide img{display:block; width:100%; height:100%; object-fit:cover}
.ad-btn{position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,.35);
        border:1px solid rgba(124,58,237,.35); padding:.4rem .6rem; border-radius:.5rem}
#adPrev{left:10px} #adNext{right:10px} #adPause{right:10px; bottom:10px; top:auto; transform:none}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // --------- build FAB + menu ---------
  const fab = document.createElement('button');
  fab.id = 'hamburgerFab';
  fab.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2">
    <path d="M9 18V5l10-2v13" /><circle cx="7" cy="18" r="3" /><circle cx="17" cy="16" r="3" />
  </svg>`;
  fab.setAttribute('aria-controls','sideMenu'); fab.setAttribute('aria-expanded','false'); fab.title='Menu';

  const backdrop = document.createElement('div'); backdrop.id='menuBackdrop';

  const menu = document.createElement('nav'); menu.id='sideMenu'; menu.setAttribute('aria-hidden','true');
  menu.innerHTML = `
    <details class="menu-group" open><summary>Home</summary>
      <a href="index.html">Dashboard</a>
      <a href="featured.html">Featured</a>
      <a href="feed.html">Community Feed</a>
      <a href="radio.html">Radio</a>
      <a href="contact.html">Contact</a>
      <a href="#ads-info">How Ads Work</a>
      <a href="#donate">Donate</a>
      <a href="#killa-bees">Killa Bees</a>
    </details>
    <details class="menu-group"><summary>Studio & AI</summary>
      <a href="studio-tools.html">All Tools</a>
      <a href="lyrics-ai.html">AI Lyrics</a>
      <a href="song-ai.html">AI Song</a>
      <a href="album-ai.html">AI Album</a>
      <a href="voice-ai.html">Voice / Post VO</a>
      <a href="master_ai.html">Master AI</a>
      <a href="cover_ai.html">Cover AI</a>
      <a href="creator-tools.html">Creator Tools</a>
    </details>
    <details class="menu-group"><summary>Tournaments</summary>
      <a href="game-tournaments.html">Overview</a>
      <a href="game-leaderboards.html">Leaderboards</a>
      <a href="games.html">Games</a>
      <a href="arcade.html">Arcade</a>
      <a href="game-hub.html">Game Hub</a>
    </details>
    <details class="menu-group"><summary>Community</summary>
      <a href="profiles.html">Profiles</a>
      <a href="profile.html">My Profile</a>
      <a href="profile_artist.html">Artist Profile</a>
      <a href="profile_influencer.html">Influencer Profile</a>
      <a href="featured_songs.html">Featured Songs</a>
      <a href="blog.html">Blog</a>
      <a href="stories.html">Stories</a>
    </details>
    <details class="menu-group"><summary>Shop</summary>
      <a href="shop.html">Store</a>
      <a href="coinshop.html">Coin Shop</a>
      <a href="upgrades.html">Upgrades</a>
      <a href="stickers.html">Stickers</a>
      <a href="shop-stickers.html">Shop Stickers</a>
      <a href="shop-upgrades.html">Shop Upgrades</a>
      <a href="pricing.html">Pricing</a>
      <a href="donate.html">Donate</a>
    </details>
    <details class="menu-group"><summary>Help & Legal</summary>
      <a href="faq.html">FAQ</a>
      <a href="help.html">Help</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
      <a href="credits.html">Credits</a>
    </details>
  `;

  document.body.append(fab, backdrop, menu);

  // --------- Carrie (VIDEO avatar) ---------
  const carrieWrap = document.createElement('div'); carrieWrap.id='carrieWrap';
  const carrie = document.createElement('video'); carrie.id='carrie';
  carrie.autoplay = true; carrie.loop = true; carrie.muted = true; carrie.playsInline = true;
  carrie.src = isBusinessPage ? BUSINESS_SRC : CASUAL_SRC;
  carrieWrap.appendChild(carrie);
  document.body.appendChild(carrieWrap);

  // menu behavior
  let timer=null;
  function openMenu(){ menu.classList.add('open'); backdrop.classList.add('open'); fab.setAttribute('aria-expanded','true'); carrieWrap.classList.add('aside'); reset(); }
  function closeMenu(){ menu.classList.remove('open'); backdrop.classList.remove('open'); fab.setAttribute('aria-expanded','false'); carrieWrap.classList.remove('aside'); clearTimeout(timer); timer=null; }
  function reset(){ clearTimeout(timer); timer=setTimeout(closeMenu,20000); }
  fab.addEventListener('click', e=>{ e.stopPropagation(); menu.classList.contains('open')?closeMenu():openMenu(); });
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  menu.addEventListener('pointermove', reset);
  menu.addEventListener('wheel', reset);

  // click → chat
  carrie.addEventListener('click', ()=> location.href='carrie-chat.html');

  // drag (wrapper)
  let dragging=false,sx=0,sy=0,ox=0,oy=0;
  const getXY = e=>('touches'in e)?[e.touches[0].clientX,e.touches[0].clientY]:[e.clientX,e.clientY];
  const down = e=>{ dragging=true; [sx,sy]=getXY(e); const r=carrieWrap.getBoundingClientRect(); ox=r.left; oy=r.top; e.preventDefault(); }
  const move = e=>{ if(!dragging) return; const [x,y]=getXY(e); const dx=x-sx, dy=y-sy; carrieWrap.style.right='auto'; carrieWrap.style.bottom='auto'; carrieWrap.style.left=(ox+dx)+'px'; carrieWrap.style.top=(oy+dy)+'px'; }
  const up = ()=> dragging=false;
  carrieWrap.addEventListener('mousedown',down); carrieWrap.addEventListener('touchstart',down,{passive:false});
  window.addEventListener('mousemove',move,{passive:false}); window.addEventListener('touchmove',move,{passive:false});
  window.addEventListener('mouseup',up); window.addEventListener('touchend',up);

  // “fun modes” (apply to wrapper so video stays clean)
  function setMode(next){
    carrieWrap.classList.remove('carrie--bob','carrie--dance','carrie--pace','carrie--wave');
    if(next==='bob')   carrieWrap.classList.add('carrie--bob');
    if(next==='dance') carrieWrap.classList.add('carrie--dance');
    if(next==='pace')  carrieWrap.classList.add('carrie--pace');
    if(next==='wave')  carrieWrap.classList.add('carrie--wave');
  }
  const modes = ['bob','dance','pace','wave']; let idx=0; setMode(modes[0]);
  setInterval(()=>{ idx=(idx+1)%modes.length; setMode(modes[idx]); }, 12000);
  carrieWrap.addEventListener('dblclick', e=>{ e.preventDefault(); idx=(idx+1)%modes.length; setMode(modes[idx]); });

  // hover swap (optional): show business while hovered on non-business pages
  carrieWrap.addEventListener('mouseenter', ()=>{
    if (!isBusinessPage) { carrie.dataset.src = carrie.currentSrc; carrie.src = BUSINESS_SRC; carrie.play().catch(()=>{}); }
  });
  carrieWrap.addEventListener('mouseleave', ()=>{
    if (!isBusinessPage && carrie.dataset.src) { carrie.src = CASUAL_SRC; carrie.removeAttribute('data-src'); carrie.play().catch(()=>{}); }
  });

  // --------- optional: init ads on pages that have the markup ---------
  const track = document.getElementById('adTrack');
  if (track){
    const prev = document.getElementById('adPrev');
    const next = document.getElementById('adNext');
    const pause= document.getElementById('adPause');
    const ads = [
      {img:'assets/images/ad_banner_1.jpg', url:'#'},
      {img:'assets/images/ad_banner_2.jpg', url:'#'},
      {img:'assets/images/ad_banner_3.jpg', url:'#'},
      {img:'assets/images/ad_banner_4.jpg', url:'#'},
      {img:'assets/images/ad_banner_5.jpg', url:'#'}
    ];
    let i=0, paused=false, t=null;
    function make(idx){
      const a=document.createElement('a'); a.className='ad-slide'; a.href=ads[idx].url||'#'; a.target='_blank'; a.rel='noopener';
      const img=new Image(); img.src=ads[idx].img; img.alt='Ad'; a.appendChild(img); return a;
    }
    function show(idx){
      i=(idx+ads.length)%ads.length;
      const old=track.querySelector('.ad-slide.show');
      const neu=make(i); track.appendChild(neu);
      requestAnimationFrame(()=>neu.classList.add('show'));
      if(old){ setTimeout(()=>old.remove(),380); }
    }
    function auto(){ if(paused) return; show(i+1); schedule(); }
    function schedule(){ clearTimeout(t); t=setTimeout(auto,5000); }
    if(prev) prev.onclick = ()=>{ if(!paused){ paused=true; if(pause) pause.textContent='Play'; } show(i-1); };
    if(next) next.onclick = ()=>{ if(!paused){ paused=true; if(pause) pause.textContent='Play'; } show(i+1); };
    if(pause) pause.onclick = ()=>{ paused=!paused; pause.textContent = paused ? 'Play' : 'Pause'; if(!paused) schedule(); else clearTimeout(t); };
    show(0); schedule();
  }
})();
</script>

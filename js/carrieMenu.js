(function(){
  // 8BFR Carrie Menu & Footer v8.1 (standalone file, all tags closed)

  const STATE = {
    idleTimer: null,
    idleMs: 20000,
    sidebarOpen: false,
  };

  const isBizPage = /(^|\/)(admin|owner|studio)/i.test(location.pathname);
  const scriptEl = document.currentScript || document.querySelector('script[src*="carrieMenu.js"]');
  const scriptSrc = scriptEl ? scriptEl.getAttribute('src') : './js/carrieMenu.js';
  const assetBase = (function(){
    const prefix = scriptSrc.split('/').slice(0,-2).join('/') || '.';
    return prefix + '/assets';
  })();

  function buildCarrie() {
    const wrapper = document.createElement('div');
    wrapper.id = '__carrie-root';
    wrapper.className = 'fixed bottom-5 right-5 z-[60] flex items-end gap-3';

    const fab = document.createElement('button');
    fab.id = '__carrie-fab';
    fab.className = 'size-14 rounded-full glass shadow-glow animate-pulseGlow flex items-center justify-center ring-1 ring-white/10 hover:ring-white/20 transition outline-none';
    fab.setAttribute('aria-label', 'Open 8BFR Menu');
    fab.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-white"><path d="M3.75 6.75h16.5v1.5H3.75zM3.75 11.25h16.5v1.5H3.75zM3.75 15.75h16.5v1.5H3.75z"/></svg>';

    const carrie = document.createElement('img');
    carrie.id = '__carrie-avatar';
    carrie.alt = 'Carrie — 8BFR Assistant';
    carrie.src = assetBase + '/' + (isBizPage ? 'Carrie_Business.png' : 'Carrie_Casual.png');
    carrie.className = 'w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl animate-floaty select-none pointer-events-none';

    wrapper.appendChild(carrie);
    wrapper.appendChild(fab);
    document.body.appendChild(wrapper);

    const setVisible = (visible) => {
      wrapper.style.opacity = visible ? '1' : '0';
      wrapper.style.pointerEvents = visible ? 'auto' : 'none';
    };
    function resetIdleTimer(){
      setVisible(true);
      if (STATE.idleTimer) clearTimeout(STATE.idleTimer);
      STATE.idleTimer = setTimeout(()=>setVisible(false), STATE.idleMs);
    }
    ['mousemove','keydown','scroll','touchstart'].forEach(evt=>document.addEventListener(evt, resetIdleTimer, {passive:true}));
    resetIdleTimer();

    fab.addEventListener('click', toggleSidebar);
  }

  function buildSidebar(){
    const side = document.createElement('aside');
    side.id = '__carrie-sidebar';
    side.className = 'fixed bottom-24 right-5 md:right-6 w-[86vw] sm:w-[380px] max-h-[70vh] overflow-hidden glass rounded-mega shadow-glow z-[70] translate-x-[120%] opacity-0';

    const header = [
      '<div class="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">',
      '  <div class="flex items-center gap-2">',
      '    <span class="inline-block size-2 rounded-full bg-b8-accent shadow-glow"></span>',
      '    <strong>8BFR Menu</strong>',
      '  </div>',
      '  <button id="__carrie-close" class="p-2 rounded-lg hover:bg-white/10" aria-label="Close">',
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M6.225 4.811 4.811 6.225 9.586 11l-4.775 4.775 1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z"/></svg>',
      '  </button>',
      '</div>'
    ].join('');

    const sections = [
      {
        title: 'Home & Community',
        links: [
          ['Home','./index.html'],
          ['Newsroom','./news.html'],
          ['Community Hub','./community.html'],
          ['Discord','https://discord.gg/', true],
          ['Events','./events.html'],
          ['Leaderboard','./leaderboard.html'],
          ['Forums','./forums.html'],
          ['Profiles','./profiles.html'],
          ['Messages 🔒','./paywall.html', true, true],
          ['Membership','./upgrade.html'],
        ]
      },
      {
        title: 'Music & AI Tools',
        links: [
          ['Studio','./studio.html'],
          ['Beat Maker','./tools/beat-maker.html'],
          ['Sampler','./tools/sampler.html'],
          ['Stem Splitter','./tools/stem-splitter.html'],
          ['Mastering AI','./tools/mastering-ai.html'],
          ['Vocal Tuner','./tools/vocal-tuner.html'],
          ['Cover Art AI','./tools/cover-art.html'],
          ['Text-to-Music','./tools/text-to-music.html'],
          ['Lyric Wizard','./tools/lyric-wizard.html'],
          ['Collab Finder','./tools/collab-finder.html'],
        ]
      },
      {
        title: 'Games',
        links: [
          ['Arcade','./games/index.html'],
          ['Rhythm Run','./games/rhythm-run.html'],
          ['Beat Blox','./games/beat-blox.html'],
          ['Trivia Night','./games/trivia.html'],
          ['Sound Quest','./games/sound-quest.html'],
          ['Puzzle Remix 🔒','./paywall.html', true, true],
        ]
      },
      {
        title: 'Studios & Panels',
        links: [
          ['Creator Studio','./studio/creator.html'],
          ['A&R Panel','./studio/ar-panel.html'],
          ['Mix Lab','./studio/mix-lab.html'],
          ['FX Rack','./studio/fx-rack.html'],
          ['Instruments','./studio/instruments.html'],
          ['Sample Packs','./studio/sample-packs.html'],
          ['Owner Dashboard','./owner/index.html'],
          ['Admin Tools','./admin.html'],
          ['Debug','./debug.html'],
        ]
      },
      {
        title: 'Store & Coins',
        links: [
          ['Storefront','./store/index.html'],
          ['8BFR Coins','./store/coins.html'],
          ['Merch','./store/merch.html'],
          ['Bundles','./store/bundles.html'],
          ['Cart','./store/cart.html'],
          ['Orders','./store/orders.html'],
          ['Creator Payouts','./store/payouts.html'],
          ['Licenses','./store/licenses.html'],
          ['Donations','./store/donate.html'],
          ['Gift Codes 🔒','./paywall.html', true, true],
        ]
      },
      {
        title: 'Info & Legal',
        links: [
          ['About','./about.html'],
          ['Contact','./contact.html'],
          ['Careers','./careers.html'],
          ['Press Kit','./press.html'],
          ['Roadmap','./roadmap.html'],
          ['Changelog','./changelog.html'],
          ['Privacy','./legal/privacy.html'],
          ['Terms','./legal/terms.html'],
          ['DMCA','./legal/dmca.html'],
          ['Attribution','./legal/attribution.html'],
        ]
      },
      {
        title: 'Learning',
        links: [
          ['Guides','./learn/guides.html'],
          ['Tutorials','./learn/tutorials.html'],
          ['Workshops','./learn/workshops.html'],
          ['Docs','./learn/docs.html'],
          ['API Reference','./learn/api.html'],
          ['FAQ','./learn/faq.html'],
          ['Support','./learn/support.html'],
          ['Status','./status.html'],
          ['Release Notes','./releases.html'],
        ]
      },
      {
        title: 'Community Projects',
        links: [
          ['Open Collabs','./projects/collabs.html'],
          ['Remix Contests','./projects/remix.html'],
          ['Mixtapes','./projects/mixtapes.html'],
          ['Playlists','./projects/playlists.html'],
          ['Showcase','./projects/showcase.html'],
          ['Hall of Fame','./projects/hof.html'],
        ]
      },
    ];

    const totalLinks = sections.reduce((n,s)=>n+s.links.length,0);

    const listHtml = sections.map((sec, i)=>{
      const items = sec.links.map(([label, href, external, locked])=>{
        const attrs = (external ? ' target="_blank" rel="noopener"' : '');
        const lockedAttr = locked ? ' data-locked="true" title="Upgrade Required"' : '';
        return [
          '<li>',
          `  <a class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 group" href="${href}"${attrs}${lockedAttr}>`,
          '    <span>' + label + '</span>',
          '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 opacity-60 group-hover:opacity-100"><path d="M13.5 4.5 21 12l-7.5 7.5-1.06-1.06L18.38 12l-5.94-5.94zM3 11.25h15v1.5H3z"/></svg>',
          '  </a>',
          '</li>'
        ].join('');
      }).join('');
      return [
        '<details class="border-b border-white/10" ' + (i===0 ? 'open' : '') + '>',
        '  <summary class="cursor-pointer select-none px-4 py-3 hover:bg-white/5 flex items-center justify-between">',
        `    <span class="font-semibold">${sec.title}</span>`,
        '    <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>',
        '  </summary>',
        '  <ul class="px-2 pb-3 space-y-1">' + items + '</ul>',
        '</details>'
      ].join('');
    }).join('');

    side.innerHTML = [
      header,
      '<div class="max-h-[55vh] overflow-y-auto thin-scroll">',
      `  <div class="px-3 pt-2 text-xs text-white/60">${totalLinks}+ links • Glow on hover • Locked entries show "Upgrade Required"</div>`,
      listHtml,
      '</div>'
    ].join('');

    document.body.appendChild(side);

    side.querySelector('#__carrie-close').addEventListener('click', toggleSidebar);
    side.addEventListener('click', (e)=>{
      const a = e.target.closest('a[data-locked="true"]');
      if (a) {
        e.preventDefault();
        alert('🔒 Upgrade required to access this feature.');
      }
    });
  }

  function toggleSidebar(){
    const side = document.getElementById('__carrie-sidebar');
    if (!side) return;
    STATE.sidebarOpen = !STATE.sidebarOpen;
    if (STATE.sidebarOpen) {
      side.classList.remove('sidebar-exit','sidebar-exit-active');
      side.classList.add('sidebar-enter');
      side.getBoundingClientRect();
      side.classList.add('sidebar-enter-active');
      setTimeout(()=> side.classList.remove('sidebar-enter','sidebar-enter-active'), 260);
    } else {
      side.classList.remove('sidebar-enter','sidebar-enter-active');
      side.classList.add('sidebar-exit');
      side.getBoundingClientRect();
      side.classList.add('sidebar-exit-active');
      setTimeout(()=> side.classList.remove('sidebar-exit','sidebar-exit-active'), 260);
    }
  }

  function buildFooter(){
    const mount = document.getElementById('__8bfr-footer') || document.body.appendChild(document.createElement('div'));
    const footer = document.createElement('footer');
    footer.className = 'mt-16 border-t border-white/10 bg-white/5';
    footer.innerHTML = [
      '<div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">',
      '  <section>',
      '    <h4 class="font-bold mb-3">Quick Links</h4>',
      '    <ul class="space-y-2 text-white/80">',
      '      <li><a class="hover:text-white" href="./index.html">Home</a></li>',
      '      <li><a class="hover:text-white" href="./studio.html">Studio</a></li>',
      '      <li><a class="hover:text-white" href="./store/index.html">Store</a></li>',
      '      <li><a class="hover:text-white" href="./community.html">Community</a></li>',
      '    </ul>',
      '  </section>',
      '  <section>',
      '    <h4 class="font-bold mb-3">Community & Contact</h4>',
      '    <ul class="space-y-2 text-white/80">',
      '      <li><a class="hover:text-white" href="mailto:8bfr.music@gmail.com">8bfr.music@gmail.com</a></li>',
      '      <li><a class="hover:text-white" href="https://github.com/8bfr/8bfr-Music-Network" target="_blank" rel="noopener">GitHub Repo</a></li>',
      '      <li class="flex gap-3 mt-2">',
      '        <a aria-label="YouTube" class="hover:opacity-100 opacity-80" href="#" target="_blank" rel="noopener">▶️</a>',
      '        <a aria-label="Instagram" class="hover:opacity-100 opacity-80" href="#" target="_blank" rel="noopener">📷</a>',
      '        <a aria-label="X" class="hover:opacity-100 opacity-80" href="#" target="_blank" rel="noopener">𝕏</a>',
      '        <a aria-label="Discord" class="hover:opacity-100 opacity-80" href="#" target="_blank" rel="noopener">💬</a>',
      '      </li>',
      '    </ul>',
      '  </section>',
      '  <section>',
      '    <h4 class="font-bold mb-3">Legal & About</h4>',
      '    <ul class="space-y-2 text-white/80">',
      '      <li><a class="hover:text-white" href="./legal/privacy.html">Privacy</a></li>',
      '      <li><a class="hover:text-white" href="./legal/terms.html">Terms</a></li>',
      '      <li><a class="hover:text-white" href="./about.html">About</a></li>',
      '    </ul>',
      '    <p class="text-sm text-white/60 mt-4 italic">“Infinity in sound, unity in creation.”</p>',
      '  </section>',
      '</div>',
      '<div class="text-center text-xs text-white/50 pb-8">© <span id="__year"></span> 8BFR Music Network — Empowering creators, connecting the world.</div>'
    ].join('');

    const mountParent = mount.parentNode;
    if (mountParent) {
      mountParent.replaceChild(footer, mount);
    } else {
      document.body.appendChild(footer);
    }
    const y = footer.querySelector('#__year');
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function(){
    buildCarrie();
    buildSidebar();
    buildFooter();
  });
})();
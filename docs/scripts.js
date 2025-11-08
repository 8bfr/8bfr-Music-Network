(function(){
  if(document.getElementById('fab')) return; // already injected

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

  /* Carrie */
  #carrieWrap{
    position:fixed; right:14px; bottom:16px; z-index:9997;
    transition:transform .25s ease; user-select:none; touch-action:none
  }
  #carrieWrap.aside{ transform:translateX(-260px) }
  #carrie{
    width:min(42vw,290px); height:auto; border-radius:0; background:transparent!important;
    filter:drop-shadow(0 10px 28px rgba(124,58,237,.35)) drop-shadow(0 4px 10px rgba(0,0,0,.45));
    display:block
  }
  .bob{ animation:bob 3.5s ease-in-out infinite }
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  /* Small screens: nudge items slightly */
  @media (max-width: 420px){
    #fab{ top:90px }
    #contactFab{ top:156px }
    #donateFab{ top:222px }
    #topFab{ top:288px }
    #menu{ top:170px; max-height:calc(100vh - 186px) }
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
      <details class="group" open><summary>Home</summary>
        <a href="index.html">Dashboard</a><a href="home.html">Home (alt)</a><a href="featured.html">Featured</a>
        <a href="feed.html">Community Feed</a><a href="radio.html">Radio</a><a href="podcast.html">Podcast</a>
        <a href="contact.html">Contact</a><a href="about.html">About</a>
      </details>
      <details class="group"><summary>Studio & AI</summary>
        <a href="studio-tools.html">All Tools</a><a href="

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>8BFR Music Network | Create • Connect • Collab</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background: radial-gradient(circle at top, #18002a 0, #030008 45%, #000 100%);
      color: #f9f5ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      min-height: 100vh;
    }
    .glass {
      background: rgba(5, 0, 20, 0.8);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(167, 139, 250, 0.5);
    }
    .neon-border {
      box-shadow: 0 0 25px rgba(129, 140, 248, 0.4),
                  0 0 40px rgba(56, 189, 248, 0.25);
    }
    .floating-menu-btn {
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 50;
    }
    .carrie-avatar {
      position: fixed;
      right: 1.25rem;
      bottom: 1.25rem;
      width: 72px;
      height: 72px;
      border-radius: 9999px;
      overflow: hidden;
      border: 2px solid rgba(129, 140, 248, 0.9);
      box-shadow: 0 0 20px rgba(129, 140, 248, 0.7);
      cursor: pointer;
      z-index: 40;
      background: radial-gradient(circle at 30% 0%, #a855f7, #0f172a 60%, #000);
    }
    .carrie-avatar video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 9999px;
    }
    .carrie-avatar-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: #22c55e;
      border-radius: 9999px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      border: 2px solid #020617;
    }
    .floating-menu-panel {
      position: fixed;
      right: 5.75rem;
      bottom: 1.25rem;
      z-index: 45;
      transform-origin: bottom right;
      transition: opacity 0.18s ease-out, transform 0.18s ease-out;
    }
    .floating-menu-panel.hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.92) translateY(6px);
    }
    .floating-menu-panel.visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    .page-gradient {
      background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.3), transparent 55%),
                  radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.25), transparent 55%);
    }
  </style>
</head>
<body class="page-gradient text-slate-50">

  <!-- Floating hamburger -->
  <button id="hamburger-btn"
    class="floating-menu-btn inline-flex items-center justify-center rounded-full bg-purple-600/90 hover:bg-purple-500 w-11 h-11 shadow-lg shadow-purple-500/40 border border-purple-300/60 transition"
    aria-label="Toggle main menu">
    <span class="block w-5 h-[2px] bg-slate-100 rounded-sm mb-[4px]"></span>
    <span class="block w-4 h-[2px] bg-slate-100 rounded-sm mb-[4px]"></span>
    <span class="block w-3 h-[2px] bg-slate-100 rounded-sm"></span>
  </button>

  <header class="w-full pt-6 pb-4">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
      <div>
        <p class="text-xs tracking-[0.3em] uppercase text-purple-300/80">8BFR Music Network</p>
        <h1 class="text-3xl font-semibold text-slate-50">Where Music Meets Influence</h1>
      </div>
      <div class="hidden sm:flex flex-col items-end text-right text-xs text-slate-300/80">
        <span class="font-medium text-purple-200">Create • Connect • Collab</span>
        <span>by James J. Siburt (8BFR)</span>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 pb-28 space-y-10">

    <section class="glass neon-border rounded-3xl p-6 sm:p-8 mt-2">
      <h2 class="text-2xl font-semibold text-purple-200 mb-2">Empowering creators, connecting the world.</h2>
      <p class="text-sm text-slate-200/90 mb-4">
        8BFR Music Network is your hub for artists, beatmakers, influencers, and fans —
        built to showcase talent, spark collaborations, and give independent creators a real lane.
      </p>
      <div class="flex gap-3">
        <a href="#advertising" class="px-4 py-2.5 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/40 transition">Advertise</a>
        <a href="#network" class="px-4 py-2.5 rounded-full text-sm font-semibold border border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/10 transition">Explore</a>
      </div>
    </section>

    <section id="network" class="grid md:grid-cols-3 gap-5">
      <div class="glass rounded-2xl p-4 border border-purple-500/50">
        <h3 class="text-lg font-semibold text-purple-200 mb-1">Artists & Beatmakers</h3>
        <p class="text-sm text-slate-200/90">Profiles, drops, and collabs. Host your catalog and get heard.</p>
      </div>
      <div class="glass rounded-2xl p-4 border border-cyan-400/50">
        <h3 class="text-lg font-semibold text-cyan-200 mb-1">Influence & Monetization</h3>
        <p class="text-sm text-slate-200/90">Sponsorships, ad placements, and branded campaigns that fit culture.</p>
      </div>
      <div class="glass rounded-2xl p-4 border border-purple-400/60">
        <h3 class="text-lg font-semibold text-purple-100 mb-1">Community & Tournaments</h3>
        <p class="text-sm text-slate-200/90">Events and tournaments that reward grind and creativity.</p>
      </div>
    </section>

    <!-- Advertising -->
    <section id="advertising" class="max-w-3xl mx-auto mt-4">
      <div class="glass rounded-3xl p-6 sm:p-8 border border-purple-500/70 shadow-lg shadow-purple-500/30">
        <h2 class="text-2xl font-semibold text-purple-200 mb-2">Advertise on 8BFR Music Network</h2>
        <p class="text-sm text-slate-200/90 mb-5">
          Put your music, brand, event, or service in front of a targeted creative community.
        </p>
        <div class="flex flex-wrap gap-3 mb-3">
          <button id="ads-info-btn"
            class="px-5 py-2.5 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/40 transition">
            About Ads / Pricing
          </button>
          <button id="ads-buy-btn"
            class="px-5 py-2.5 rounded-full text-sm font-semibold border border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/10 transition">
            Buy an Ad Spot
          </button>
        </div>
        <p class="text-xs text-slate-400">
          Use “About Ads / Pricing” to see package ideas, or “Buy an Ad Spot” to email 8BFR directly.
        </p>
      </div>
    </section>

  </main>

  <!-- Animated Carrie avatar -->
  <div id="carrie-avatar" class="carrie-avatar" title="Need help? Carrie has you.">
    <video src="assets/videos/carrie_casual_animate_3_1.webm"
      autoplay loop muted playsinline class="w-full h-full object-cover rounded-full"></video>
    <div class="carrie-avatar-badge">💬</div>
  </div>

  <!-- Floating menu -->
  <div id="floating-menu-panel" class="floating-menu-panel hidden">
    <div class="glass neon-border rounded-2xl px-4 py-3 w-60 text-xs text-slate-100">
      <p class="uppercase tracking-[0.25em] text-[10px] text-purple-300 mb-2">8BFR quick menu</p>
      <ul class="space-y-1.5">
        <li><a href="#network" class="hover:text-purple-300">🎧 Network Overview</a></li>
        <li><a href="#advertising" class="hover:text-purple-300">💰 Advertising & Ads</a></li>
        <li><a href="pages/artists.html" class="hover:text-purple-300">👤 Artist Directory</a></li>
        <li><a href="pages/tournaments.html" class="hover:text-purple-300">🏆 Tournaments</a></li>
        <li><a href="pages/contact.html" class="hover:text-purple-300">📩 Contact / Support</a></li>
      </ul>
      <p class="mt-3 text-[10px] text-slate-400">“Empowering creators, connecting the world — 8BFR Music Network.”</p>
    </div>
  </div>

  <!-- Ads modal -->
  <div id="ads-modal" class="fixed inset-0 z-40 hidden items-center justify-center">
    <div id="ads-modal-backdrop"
      class="absolute inset-0 bg-black/70 backdrop-blur-sm"
      data-close-ads-modal></div>

    <div class="relative z-10 max-w-lg w-[92%] glass rounded-2xl p-6 sm:p-8 neon-border border-purple-500/80">
      <div class="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 class="text-xl font-semibold text-purple-200">Ad Packages & Info</h3>
          <p class="text-xs text-slate-400 mt-1">Flexible placements for artists, brands, studios, and platforms.</p>
        </div>
        <button class="text-slate-400 hover:text-slate-100 text-xl leading-none" data-close-ads-modal>✕</button>
      </div>

      <ul class="space-y-3 text-sm text-slate-100 mb-4">
        <li><span class="font-semibold text-purple-300">🎧 Basic Shoutout</span><br />Mention in rotation area.</li>
        <li><span class="font-semibold text-purple-300">🚀 Featured Banner</span><br />Graphic or text banner slot.</li>
        <li><span class="font-semibold text-purple-300">🌌 Network Takeover</span><br />Premium placement & duration.</li>
      </ul>

      <div class="flex flex-wrap gap-3">
        <a href="mailto:8bfr.music@gmail.com?subject=8BFR%20Ad%20Inquiry"
          class="px-4 py-2.5 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/40 transition">Email 8BFR About Ads</a>
        <a href="https://www.paypal.me/Musicby8bfr" target="_blank"
          class="px-4 py-2.5 rounded-full text-sm font-semibold border border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/10 transition">Open PayPal (Musicby8bfr)</a>
      </div>
    </div>
  </div>

  <script src="scripts.js"></script>
</body>
</html>

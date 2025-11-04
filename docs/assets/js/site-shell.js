(function(){
  const header = `
  <header class="w-full bg-gradient-to-r from-[#110022] to-black text-white border-b border-purple-600/40 shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-purple-600/30 backdrop-blur border border-purple-500/40 flex items-center justify-center font-bold">8</div>
        <div>
          <h1 class="text-xl md:text-2xl font-bold">8BFR Music Network</h1>
          <p class="text-xs md:text-sm text-purple-300">Create • Connect • Collab</p>
        </div>
      </div>
      <nav class="hidden md:flex gap-4 text-sm text-purple-200">
        <a href="index.html" class="hover:text-white">Home</a>
        <a href="about.html" class="hover:text-white">About</a>
        <a href="explore.html" class="hover:text-white">Explore</a>
        <a href="artists.html" class="hover:text-white">Artists</a>
        <a href="beats.html" class="hover:text-white">Beats</a>
        <a href="studio.html" class="hover:text-white">Studio</a>
        <a href="upload.html" class="hover:text-white">Upload</a>
        <a href="tournaments.html" class="hover:text-white">Tournaments</a>
        <a href="donate.html" class="hover:text-white">Donate</a>
      </nav>
    </div>
    <div class="w-full overflow-hidden bg-black/60 border-t border-purple-500/20">
      <marquee class="py-2 text-purple-200">🚀 Empowering creators, connecting the world — 8BFR Music Network • New glassy neon build • Supabase-ready stubs • </marquee>
    </div>
  </header>`;
  const footer = `
  <footer class="mt-16 border-t border-purple-700/40 bg-black/70 text-purple-200">
    <div class="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
      <div><h3 class="text-white font-semibold mb-2">8BFR</h3>
        <p class="text-sm">Create • Connect • Collab</p>
        <p class="mt-3 text-xs">“Empowering creators, connecting the world — 8BFR Music Network.”</p>
      </div>
      <div><h4 class="text-white font-semibold mb-2">Create</h4>
        <ul class="text-sm space-y-1">
          <li><a href="studio.html" class="hover:text-white">Studio</a></li>
          <li><a href="collabs.html" class="hover:text-white">Collabs</a></li>
          <li><a href="upload.html" class="hover:text-white">Upload</a></li>
          <li><a href="beats.html" class="hover:text-white">Beats</a></li>
        </ul>
      </div>
      <div><h4 class="text-white font-semibold mb-2">Connect</h4>
        <ul class="text-sm space-y-1">
          <li><a href="feed.html" class="hover:text-white">Feed</a></li>
          <li><a href="messages.html" class="hover:text-white">Messages</a></li>
          <li><a href="events.html" class="hover:text-white">Events</a></li>
          <li><a href="tournaments.html" class="hover:text-white">Tournaments</a></li>
        </ul>
      </div>
      <div><h4 class="text-white font-semibold mb-2">More</h4>
        <ul class="text-sm space-y-1">
          <li><a href="about.html" class="hover:text-white">About</a></li>
          <li><a href="privacy.html" class="hover:text-white">Privacy</a></li>
          <li><a href="terms.html" class="hover:text-white">Terms</a></li>
          <li><a href="donate.html" class="hover:text-white">Donate</a></li>
        </ul>
      </div>
    </div>
    <div class="px-4 py-4 bg-black/60 text-center text-xs text-purple-300">
      © <span id="year"></span> 8BFR Music Network • GitHub Pages + Supabase
    </div>
  </footer>`;
  const headerMount = document.querySelector("#site-header");
  const footerMount = document.querySelector("#site-footer");
  if (headerMount) headerMount.innerHTML = header;
  if (footerMount) footerMount.innerHTML = footer;
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();

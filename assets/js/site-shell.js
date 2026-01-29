(function() {
  // Header + marquee
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
      <marquee class="py-2 text-purple-200">🚀 Empowering creators, connecting the world — 8BFR Music Network • Glassy neon build • Supabase-ready stubs • </marquee>
    </div>
  </header>`;

  // Footer
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

  // Mount header/footer
  const headerMount = document.querySelector("#site-header");
  const footerMount = document.querySelector("#site-footer");
  if (headerMount) headerMount.innerHTML = header; else document.body.insertAdjacentHTML("afterbegin", header);
  if (footerMount) footerMount.innerHTML = footer; else document.body.insertAdjacentHTML("beforeend", footer);
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Carrie avatar
  const carrie = document.createElement("div");
  carrie.id = "carrie-avatar";
  carrie.innerHTML = `
    <div class="fixed bottom-6 right-6 z-40 transition-transform duration-300" style="transform: translateX(0);">
      <div class="w-20 h-20 rounded-full border border-purple-500/60 shadow-lg bg-black/40 flex items-center justify-center">Carrie</div>
    </div>`;
  document.body.appendChild(carrie);

  // Floating menu button + drawer
  const menu = document.createElement("div");
  menu.innerHTML = `
    <button id="fab" class="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-purple-600 text-white shadow-xl border border-purple-400/40">☰</button>
    <aside id="drawer" class="fixed bottom-6 right-24 z-40 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-black/80 backdrop-blur border border-purple-600/40 shadow-2xl p-4 translate-x-0 opacity-0 pointer-events-none transition-all duration-300">
      <input id="menuSearch" placeholder="Search pages..." class="w-full mb-3 px-3 py-2 rounded-lg bg-black/40 border border-purple-500/30 text-sm outline-none" />
      <div id="menuList" class="space-y-2 text-sm"></div>
    </aside>`;
  document.body.appendChild(menu);

  // Pages list (60+)
  const pages = [
    ["Home","index.html","Core"],["About 8BFR","about.html","Core"],["Donate","donate.html","Core"],["Contact","contact.html","Core"],["Explore","explore.html","Core"],
    ["Login","login.html","Auth"],["Register","register.html","Auth"],["Verify Email","verify.html","Auth"],["Reset Password","reset-password.html","Auth"],
    ["Profile","profile.html","Profile"],["Settings","settings.html","Profile"],["Billing","billing.html","Profile"],
    ["Feed","feed.html","Social"],["Messages","messages.html","Social"],["Notifications","notifications.html","Social"],["Friends","friends.html","Social"],["Following","following.html","Social"],["Followers","followers.html","Social"],
    ["Artists","artists.html","Music"],["Albums","albums.html","Music"],["Singles","singles.html","Music"],["Playlists","playlists.html","Music"],["Playlist Details","playlist-details.html","Music"],["Genres","genres.html","Music"],["Tags","tags.html","Music"],["Beats","beats.html","Music"],["Beat Store","beat-store.html","Music"],
    ["Studio","studio.html","Create"],["Collabs","collabs.html","Create"],["Upload","upload.html","Create"],
    ["Tournaments","tournaments.html","Events"],["Tournament Details","tournament-details.html","Events"],["Leaderboard","leaderboard.html","Events"],["Events","events.html","Events"],["Event Details","event-details.html","Events"],
    ["Marketplace","marketplace.html","Commerce"],["Shop","shop.html","Commerce"],["Cart","cart.html","Commerce"],["Checkout","checkout.html","Commerce"],["Subscriptions","subscriptions.html","Commerce"],["Plans","plans.html","Commerce"],
    ["Search","search.html","Utility"],["Charts","charts.html","Utility"],["FAQ","faq.html","Utility"],["Support","support.html","Utility"],["Privacy Policy","privacy.html","Utility"],["Terms of Service","terms.html","Utility"],["Community Guidelines","community.html","Utility"],["Press","press.html","Utility"],["Careers","careers.html","Utility"],
    ["Admin Dashboard","admin.html","Admin"],["Admin Users","admin-users.html","Admin"],["Admin Posts","admin-posts.html","Admin"],["Admin Reports","admin-reports.html","Admin"],["Admin Ads","admin-ads.html","Admin"],
    ["Developer Docs","dev.html","Dev"],["API Reference","api.html","Dev"],
    ["Blog","blog.html","Blog"],["Blog Post","blog-post.html","Blog"],
    ["Partners","partners.html","Info"],["Ads","ads.html","Info"]
  ];

  const menuList = document.getElementById("menuList");
  const groups = [...new Set(pages.map(p => p[2]))];
  groups.forEach(group => {
    const details = document.createElement("details");
    details.className = "rounded-xl border border-purple-600/30 bg-black/30";
    details.innerHTML = `<summary class="cursor-pointer select-none px-3 py-2 text-purple-200">${group}</summary>`;
    const wrap = document.createElement("div"); wrap.className="p-2";
    pages.filter(p=>p[2]===group).forEach(([label,href])=>{
      const a = document.createElement("a"); a.href = href; a.textContent = label;
      a.className = "block px-2 py-1 rounded hover:bg-purple-600/20 hover:text-white";
      wrap.appendChild(a);
    });
    details.appendChild(wrap); menuList.appendChild(details);
  });

  // FAB toggle + Carrie slide
  const fab = document.getElementById("fab");
  const drawer = document.getElementById("drawer");
  const carrieDiv = document.getElementById("carrie-avatar");
  let open = false;
  const setOpen = v => {
    open = v;
    drawer.style.opacity = v ? "1" : "0";
    drawer.style.pointerEvents = v ? "auto" : "none";
    if (carrieDiv) carrieDiv.firstElementChild.style.transform = v ? "translateX(-90px)" : "translateX(0)";
  };
  fab.addEventListener("click", ()=> setOpen(!open));
  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") setOpen(false); });

  // Search filter
  document.getElementById("menuSearch").addEventListener("input",(e)=>{
    const q = e.target.value.toLowerCase();
    [...menuList.querySelectorAll("a")].forEach(a=>{
      a.parentElement.parentElement.open = true;
      a.style.display = a.textContent.toLowerCase().includes(q) ? "block":"none";
    });
  });

  // Idle fade
  let idle; const reset=()=>{ clearTimeout(idle); if(carrieDiv) carrieDiv.style.opacity="1"; idle=setTimeout(()=>{ if(carrieDiv) carrieDiv.style.opacity="0.2"; },20000); };
  ["mousemove","keydown","touchstart","scroll"].forEach(ev=>document.addEventListener(ev,reset)); reset();
})();

#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/8bfr_network
echo "🎵 Updating 8BFR collapsible floating menu across all pages..."

mkdir -p partials

# ───────────────────────────────────────────────
# 1️⃣ Create the collapsible menu HTML partial
# ───────────────────────────────────────────────
cat > partials/nav.html <<'HTML'
<!-- 🎵 8BFR Floating Menu -->
<style>
.music-menu {
  position: fixed; top: 20px; right: 20px;
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(145deg,#6200ff,#3b0080);
  box-shadow: 0 0 15px #6200ff80;
  color: #fff; font-size: 28px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:2000;transition:0.3s;
}
.music-menu:hover { transform:scale(1.1); }

.menu-panel {
  position:fixed;top:0;right:-320px;width:300px;height:100%;
  background:rgba(10,0,25,0.96);overflow-y:auto;
  box-shadow:-4px 0 25px #5a00c880;z-index:1999;
  transition:right 0.4s ease;
  scrollbar-width:thin;scrollbar-color:#6200ff transparent;
}
.menu-panel.open { right:0; }
.menu-section { border-bottom:1px solid #320054; }
.menu-section h3 {
  margin:0;padding:12px 20px;
  background:rgba(60,0,100,0.6);
  color:#b47cff;font-size:1.1em;cursor:pointer;
  transition:0.3s;
}
.menu-section h3:hover { background:rgba(90,0,150,0.8); }
.menu-links {
  max-height:0; overflow:hidden;
  transition:max-height 0.35s ease;
}
.menu-links a {
  display:block;padding:8px 30px;color:#ccc;
  text-decoration:none;font-size:0.95em;
}
.menu-links a:hover {
  background:#3b0066;color:#fff;
}
.menu-links.open { max-height:400px; }
@media (max-width:600px){
  .menu-panel{width:85%;right:-85%;}
}
</style>

<div class="music-menu" onclick="toggleMenu()">🎵</div>
<nav id="menuPanel" class="menu-panel">
  <!-- 🏠 MAIN -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">🏠 Main</h3>
    <div class="menu-links">
      <a href="index.html">Home</a>
      <a href="login.html">Login</a>
      <a href="reset-password.html">Reset Password</a>
      <a href="feed.html">Feed</a>
      <a href="radio.html">Radio</a>
      <a href="chat.html">Chat</a>
      <a href="#" onclick="doLogout()">Logout</a>
    </div>
  </div>

  <!-- 🎸 CREATORS -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">🎸 Creators</h3>
    <div class="menu-links">
      <a href="artist-studio.html">Artist Studio</a>
      <a href="author-hub.html">Author Hub</a>
      <a href="influencer-hub.html">Influencer Hub</a>
      <a href="profiles.html">Profiles</a>
      <a href="profile.html">Profile</a>
    </div>
  </div>

  <!-- 🎮 GAMES -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">🎮 Games</h3>
    <div class="menu-links">
      <a href="game-hub.html">Game Hub</a>
      <a href="pool-8-ball.html">8-Ball Pool</a>
      <a href="pool-9-ball.html">9-Ball Pool</a>
      <a href="trickshot-pool.html">Trickshot Pool</a>
      <a href="game-leaderboards.html">Leaderboards</a>
      <a href="game-tournaments.html">Tournaments</a>
      <a href="game-music.html">Game Music</a>
      <a href="arcade.html">Arcade</a>
    </div>
  </div>

  <!-- 🛒 STORE -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">🛒 Store</h3>
    <div class="menu-links">
      <a href="store.html">Main Store</a>
      <a href="shop-upgrades.html">Upgrades</a>
      <a href="game-coin-shop.html">Coin Shop</a>
      <a href="shop-stickers.html">Stickers</a>
      <a href="pricing.html">Pricing</a>
    </div>
  </div>

  <!-- 👪 COMMUNITY -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">👪 Community</h3>
    <div class="menu-links">
      <a href="kids-zone.html">Kids Zone</a>
      <a href="stories.html">Stories</a>
      <a href="contests.html">Contests</a>
      <a href="help.html">Help / FAQ</a>
      <a href="rules.html">Rules</a>
      <a href="blog.html">Blog / Announcements</a>
    </div>
  </div>

  <!-- 👑 PANELS -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">👑 Panels</h3>
    <div class="menu-links">
      <a href="owner-panel.html">Owner Panel</a>
      <a href="admin-panel.html">Admin Panel</a>
      <a href="mod-panel.html">Mod Panel</a>
      <a href="admin-guide.html">Admin Guide</a>
      <a href="system.html">System / Integration</a>
    </div>
  </div>

  <!-- 💌 ABOUT -->
  <div class="menu-section">
    <h3 onclick="toggleSection(this)">💌 About & Info</h3>
    <div class="menu-links">
      <a href="about.html">About</a>
      <a href="dedications.html">Dedications</a>
      <a href="credits.html">Credits</a>
      <a href="contact.html">Contact</a>
      <a href="stats.html">Stats</a>
      <a href="terms.html">Terms</a>
      <a href="privacy.html">Privacy</a>
    </div>
  </div>
</nav>

<script>
function toggleMenu(){
  const panel=document.getElementById('menuPanel');
  panel.classList.toggle('open');
  document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : 'auto';
}
function toggleSection(el){
  const open=document.querySelector('.menu-links.open');
  const next=el.nextElementSibling;
  if(open && open!==next) open.classList.remove('open');
  next.classList.toggle('open');
  next.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function doLogout(){
  alert('You have been logged out (demo).');
  localStorage.clear();
  window.location.href='login.html';
}
</script>
HTML

# ───────────────────────────────────────────────
# 2️⃣ Replace old menu and fix links
# ───────────────────────────────────────────────
find docs -type f -name "*.html" -exec sed -i 's|href="docs/|href="|g' {} \;

# ───────────────────────────────────────────────
# 3️⃣ Inject menu partial loader (if not already)
# ───────────────────────────────────────────────
find docs -type f -name "*.html" ! -name "index.html" -exec grep -q "loadPartials.js" {} \; \
  || find docs -type f -name "*.html" -exec sed -i '/<\/body>/i <script src="../partials/loadPartials.js"></script>' {} \;

echo "✅ Collapsible floating menu installed on all pages with smooth scroll + logout!"

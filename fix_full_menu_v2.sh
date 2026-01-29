#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/8bfr_network
echo "🎵 Installing advanced collapsible floating menu with idle auto-close..."

mkdir -p partials

# ───────────────────────────────────────────────
# 1️⃣  Create updated menu partial
# ───────────────────────────────────────────────
cat > partials/nav.html <<'HTML'
<!-- 🎵 8BFR Floating Menu (v2) -->
<style>
.music-menu {
  position: fixed; top: 20px; right: 20px;
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(145deg,#6200ff,#3b0080);
  box-shadow: 0 0 15px #6200ff80;
  color:#fff;font-size:28px;display:flex;
  align-items:center;justify-content:center;
  cursor:pointer;z-index:2000;transition:.3s;
}
.music-menu:hover{transform:scale(1.1);}
.menu-panel{
  position:fixed;top:0;right:-320px;width:300px;height:100%;
  background:rgba(10,0,25,0.96);overflow-y:auto;
  box-shadow:-4px 0 25px #5a00c880;z-index:1999;
  transition:right .4s ease;scrollbar-width:thin;
  scrollbar-color:#6200ff transparent;
}
.menu-panel.open{right:0;}
.menu-section{border-bottom:1px solid #320054;}
.menu-section h3{
  margin:0;padding:12px 20px;
  background:rgba(60,0,100,0.6);color:#b47cff;
  font-size:1.1em;cursor:pointer;transition:.3s;
}
.menu-section h3:hover{background:rgba(90,0,150,0.8);}
.menu-links{max-height:0;overflow:hidden;transition:max-height .35s ease;}
.menu-links a{
  display:block;padding:8px 30px;color:#ccc;
  text-decoration:none;font-size:.95em;
}
.menu-links a:hover{background:#3b0066;color:#fff;}
.menu-links.open{max-height:400px;}
@media(max-width:600px){.menu-panel{width:85%;right:-85%;}}
</style>

<div class="music-menu" onclick="toggleMenu()">🎵</div>
<nav id="menuPanel" class="menu-panel"></nav>

<script>
// Build sections dynamically
const menuData = {
  "🏠 Main": [
    ["Home","index.html"],
    ["Login","login.html"],
    ["Reset Password","reset-password.html"],
    ["Feed","feed.html"],
    ["Radio","radio.html"],
    ["Chat","chat.html"],
    ["Logout","#logout"]
  ],
  "🎸 Creators": [
    ["Artist Studio","artist-studio.html"],
    ["Author Hub","author-hub.html"],
    ["Influencer Hub","influencer-hub.html"],
    ["Profiles","profiles.html"],
    ["Profile","profile.html"]
  ],
  "🎮 Games": [
    ["Game Hub","game-hub.html"],
    ["8-Ball Pool","pool-8-ball.html"],
    ["9-Ball Pool","pool-9-ball.html"],
    ["Trickshot Pool","trickshot-pool.html"],
    ["Leaderboards","game-leaderboards.html"],
    ["Tournaments","game-tournaments.html"],
    ["Game Music","game-music.html"],
    ["Arcade","arcade.html"]
  ],
  "🛒 Store": [
    ["Main Store","store.html"],
    ["Upgrades","shop-upgrades.html"],
    ["Coin Shop","game-coin-shop.html"],
    ["Stickers","shop-stickers.html"],
    ["Pricing","pricing.html"]
  ],
  "👪 Community": [
    ["Kids Zone","kids-zone.html"],
    ["Stories","stories.html"],
    ["Contests","contests.html"],
    ["Help / FAQ","help.html"],
    ["Rules","rules.html"],
    ["Blog","blog.html"]
  ],
  "👑 Panels": [
    ["Owner Panel","owner-panel.html"],
    ["Admin Panel","admin-panel.html"],
    ["Mod Panel","mod-panel.html"],
    ["Admin Guide","admin-guide.html"],
    ["System / Integration","system.html"]
  ],
  "💌 About & Info": [
    ["About","about.html"],
    ["Dedications","dedications.html"],
    ["Credits","credits.html"],
    ["Contact","contact.html"],
    ["Stats","stats.html"],
    ["Terms","terms.html"],
    ["Privacy","privacy.html"]
  ]
};

const panel = document.getElementById("menuPanel");
Object.entries(menuData).forEach(([title,links])=>{
  const sec=document.createElement("div");sec.className="menu-section";
  const h3=document.createElement("h3");h3.textContent=title;
  const div=document.createElement("div");div.className="menu-links";
  links.forEach(([txt,href])=>{
    const a=document.createElement("a");a.textContent=txt;
    a.href=href; if(href==="#logout") a.onclick=()=>doLogout();
    div.appendChild(a);
  });
  h3.onclick=()=>toggleSection(h3);
  sec.append(h3,div); panel.appendChild(sec);
});

// Menu toggle
let menuOpen=false, idleTimer;
function toggleMenu(force){
  const p=document.getElementById("menuPanel");
  if(force==="close"){p.classList.remove("open");menuOpen=false;return;}
  menuOpen=!menuOpen;
  p.classList.toggle("open",menuOpen);
  document.body.style.overflow=menuOpen?"hidden":"auto";
  localStorage.setItem("menuOpen",menuOpen);
  resetIdleTimer();
}
function toggleSection(el){
  const open=document.querySelector(".menu-links.open");
  const next=el.nextElementSibling;
  if(open && open!==next) open.classList.remove("open");
  next.classList.toggle("open");
  next.scrollIntoView({behavior:"smooth",block:"nearest"});
}
// Restore state
window.addEventListener("load",()=>{
  if(localStorage.getItem("menuOpen")==="true")
    document.getElementById("menuPanel").classList.add("open");
  resetIdleTimer();
});
// Idle timer
function resetIdleTimer(){
  clearTimeout(idleTimer);
  if(menuOpen) idleTimer=setTimeout(()=>toggleMenu("close"),20000);
}
["click","scroll","mousemove","touchstart","keydown"].forEach(evt=>
  document.addEventListener(evt,resetIdleTimer)
);
// Logout
function doLogout(){
  alert("You have been logged out (demo).");
  localStorage.clear();
  window.location.href="login.html";
}
</script>
HTML

# ───────────────────────────────────────────────
# 2️⃣  Inject loader if needed
# ───────────────────────────────────────────────
find docs -type f -name "*.html" -exec sed -i 's|href="docs/|href="|g' {} \;

echo "✅ Floating collapsible menu (v2) with idle-close installed."

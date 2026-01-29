#!/usr/bin/env bash
set -e
DOCS="$HOME/8bfr_network/docs"
mkdir -p "$DOCS"

write_css(){ cat <<'CSS' > "$DOCS/style.css"
/* Core 8BFR styling */
:root{--black:#000;--purple:#9F00FF;--blue:#00A3FF;--silver:#A8C7FF}
html{scroll-behavior:smooth}
body{margin:0;font-family:Poppins,system-ui,sans-serif;background:radial-gradient(circle at top,#1a001f,#000);color:#fff}
a{color:var(--silver);text-decoration:none}a:hover{text-decoration:underline}
.container{width:min(1100px,92%);margin:0 auto;padding:24px 0}
.header{background:linear-gradient(90deg,#320054,#120014);border-bottom:2px solid #5a00c8;box-shadow:0 0 25px #7000ff40;text-align:center;padding:24px 10px}
.header h1{margin:0;font-size:clamp(1.6rem,4vw,2.5rem);color:#b47cff;text-shadow:0 0 14px #8b2aff}
.nav{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px}
.nav a{background:#1a0033;border:1px solid #5a00c8;padding:8px 12px;border-radius:999px;transition:.2s}.nav a:hover{background:#2a0055}
.card{background:#120022;border:1px solid #5a00c8;border-radius:16px;padding:16px;box-shadow:0 0 20px #3b006630}
.btn{display:inline-block;background:linear-gradient(145deg,#9F00FF,#5e00aa);color:#fff;padding:10px 16px;border-radius:10px;border:none;cursor:pointer;font-weight:600;box-shadow:0 0 10px #9F00FF80;transition:.25s}.btn:hover{transform:translateY(-1px) scale(1.02)}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.footer{text-align:center;padding:24px 10px;color:#aaa;border-top:1px solid #3b0066;background:#0d0013}
.marquee{overflow:hidden;white-space:nowrap;background:linear-gradient(90deg,#0b0015,#1a0033);color:#b47cff;box-shadow:0 0 15px #5a00c8}
.marquee span{display:inline-block;padding:10px;animation:scrollText 30s linear infinite}
@keyframes scrollText{from{transform:translateX(100%)}to{transform:translateX(-100%)}}
CSS
}

write_js(){ cat <<'JS' > "$DOCS/scripts.js"
// Minimal helpers + Supabase placeholders (replace keys as needed)
const SUPABASE_URL="https://qjzcoybmcrmonzjctama.supabase.co";
const SUPABASE_ANON_KEY="84af9f28b30df5230d52cd0d4de26c8394de3ef318761ed1fe99ab6ef5f6cf3b";
const sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
async function api(path,method="GET",query="",body=null){const url=new URL(`${SUPABASE_URL}/rest/v1/${path}${query}`);const r=await fetch(url,{method,headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Prefer":"return=representation"},body:body?JSON.stringify(body):null});if(!r.ok)throw new Error(await r.text());return r.json()}
async function getPosts(){try{const p=await api("posts","GET","?select=*&order=created_at.desc&limit=20");const el=document.getElementById("feed");if(!el)return;el.innerHTML=p.map(x=>`<div class="card"><b>@${x.username}</b><p>${x.text||""}</p></div>`).join("")}catch(e){console.error(e)}}
window._8bfr={api,getPosts};console.log("8BFR scripts.js loaded");
JS
}

template(){ cat <<'HTML'
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{{TITLE}} | 8BFR Music Network</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css"/>
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script defer src="scripts.js"></script>
</head><body>
<header class="header"><h1>8BFR Music Network</h1><p>Create • Connect • Collab</p>
<nav class="nav">
<a href="index.html">Home</a><a href="feed.html">Feed</a><a href="radio.html">Radio</a><a href="games.html">Games</a><a href="store.html">Store</a><a href="profile.html">Profile</a><a href="admin.html">Admin</a><a href="debug.html">Debug</a><a href="help.html">Help</a>
</nav></header>
<main class="container">
<section class="card"><h2>{{TITLE}}</h2><p>Page placeholder. Hook this to Supabase as needed.</p><div id="feed"></div></section>
</main>
<div class="marquee"><span>💜 Promote your drop • 80% to creators • Be kind, create boldly.</span></div>
<footer class="footer">© 2025 8BFR Music Network — “Empowering creators, connecting the world — 8BFR Music Network.”</footer>
</body></html>
HTML
}

write(){ file="$1"; title="$2"; template | sed "s|{{TITLE}}|$title|g" > "$DOCS/$file"; }

# --- Create shared assets ---
write_css
write_js

# --- Key custom pages with small custom bodies ---
cat > "$DOCS/index.html" <<'HTML'
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Home | 8BFR Music Network</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="style.css"/><script src="https://unpkg.com/@supabase/supabase-js@2"></script><script defer src="scripts.js"></script></head><body><header class="header"><h1>8BFR Music Network</h1><p>Create • Connect • Collab</p><nav class="nav"><a href="index.html">Home</a><a href="feed.html">Feed</a><a href="radio.html">Radio</a><a href="games.html">Games</a><a href="store.html">Store</a><a href="profile.html">Profile</a><a href="admin.html">Admin</a><a href="debug.html">Debug</a><a href="help.html">Help</a></nav></header><main class="container"><section class="grid"><div class="card"><h2>Featured Songs</h2><div id="featured-songs" class="grid"></div><p style="margin-top:10px"><a class="btn" href="radio.html">▶️ Open Radio</a></p></div><div class="card"><h2>Donate</h2><p>Support independent creators. 80% to artists, 20% platform (25% tax reserve on platform share).</p><p><a class="btn" target="_blank" href="https://www.paypal.com/donate?business=8bfr.music@gmail.com">💖 Donate via PayPal</a></p></div><div class="card"><h2>Buy Ad Space</h2><p>Promote your drop in the rotating banner. Reviewed before going live.</p><p><a class="btn" href="store.html#ads">📝 Purchase Ad Slot</a></p></div></section><section class="card" style="margin-top:16px"><h2>Public Feed</h2><form onsubmit="_8bfr.api(\posts',\POST',\', { text:this.text.value, username:guest }).then(()=>{this.reset();_8bfr.getPosts()});return false" class="grid" style="margin-bottom:12px"><div><label>Text</label><textarea name="text" rows="2" placeholder="Say something dope…"></textarea></div><div style="align-self:end"><button class="btn" type="submit">Post</button></div></form><div id="feed" class="grid"></div></section></main><div class="marquee"><span>💜 Promote your drop • 80% to creators • Be kind, create boldly.</span></div><footer class="footer">© 2025 8BFR Music Network — “Empowering creators, connecting the world — 8BFR Music Network.”</footer><script>_8bfr.getPosts()</script></body></html>
HTML

write admin.html "Admin Panel"
write debug.html "Debug"
write help.html "Help & Guidelines"

# --- Bulk generate 60+ pages ---
PAGES=(
feed.html "Feed"
radio.html "Radio"
games.html "Game Hub"
contests.html "Contests"
leaderboard.html "Leaderboards"
coinshop.html "Coin Shop"
upgrades.html "Upgrades"
stickers.html "Stickers, Hats & Frames"
arcade.html "Arcade Room"
game_pool_8ball.html "8-Ball Pool"
game_pool_9ball.html "9-Ball Pool"
game_pool_trick.html "Trickshot Pool"
owner.html "Owner Panel"
admin_panel.html "Admin Panel"
mod_panel.html "Mod Panel"
admin_guide.html "Admin Guide"
pricing.html "Pricing"
privacy.html "Privacy Policy"
terms.html "Terms of Use"
stats.html "Stats & Analytics"
faq.html "FAQ"
rules.html "Rules & Community Guidelines"
contact.html "Contact & Support"
login.html "Login"
reset_password.html "Reset Password"
profile.html "Profile"
profile_artist.html "Artist Profile"
profile_influencer.html "Influencer Hub"
artist.html "Artist Studio"
author.html "Author & Illustrator"
influencer.html "Influencer Hub"
kids.html "Kids Zone"
store.html "Store"
blog.html "Blog & Announcements"
posts.html "All Posts"
stories.html "Stories (24h)"
dm.html "Private Messages"
ads.html "Ads Center"
featured.html "Featured Artists"
featured_songs.html "Featured Songs"
donate.html "Donate & Sponsors"
about.html "About — Earth Angel → Guardian Angel"
dedication.html "Dedication — Missing You"
owner_picks.html "Owner’s Picks"
press.html "Press & Media Kit"
affiliates.html "Affiliate Partners"
awards.html "8BFR Music Awards"
podcast.html "8BFR LIVE Sessions"
studio_tools.html "AI Studio Tools"
creator_tools.html "AI Creator Tools"
translate.html "AI Translation"
lyric_ai.html "AI Lyrics"
master_ai.html "AI Mastering"
cover_ai.html "AI Album Covers"
kids_games.html "Kids Games"
kids_stories.html "Kids Stories"
thank_you.html "Thank You"
tos_updates.html "Policy Updates"
)

i=0; while [ $i -lt ${#PAGES[@]} ]; do f="${PAGES[$i]}"; t="${PAGES[$((i+1))]}"; write "$f" "$t"; i=$((i+2)); done

# --- Git commit & push ---
cd "$DOCS"
git add . && git commit -m "Generate 60+ static pages (8BFR site scaffold)" || true
git push -u origin main

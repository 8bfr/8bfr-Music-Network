#!/data/data/com.termux/files/usr/bin/bash
# 🎧 8BFR MUSIC NETWORK — FULL STATIC SITE AUTO-BUILDER
# Author: James J. Siburt (8BFR)
# Description: Creates every static HTML page, CSS, and JS base in one command

set -e
ROOT=~/8bfr_network
mkdir -p $ROOT/{pages,css,js,media}

echo "🎶 Building full 8BFR site structure..."
echo "→ Root: $ROOT"

# ---------------------------------------------------------------------
# STYLE SHEET
cat > $ROOT/css/style.css <<'EOF'
body { font-family: 'Poppins', sans-serif; background-color: #000; color: #fff; margin:0; padding:0; }
header, footer { background:#111; color:#A8C7FF; text-align:center; padding:1rem; }
nav ul { display:flex; justify-content:center; flex-wrap:wrap; gap:1rem; padding:0; list-style:none; }
nav a { color:#00A3FF; text-decoration:none; font-weight:600; }
nav a:hover { color:#9F00FF; }
main { padding:2rem; background:#0b0b0b; min-height:70vh; }
button, input, textarea { background:#111; color:#A8C7FF; border:1px solid #320054; padding:0.5rem; border-radius:4px; }
button:hover { background:#320054; }
EOF

# ---------------------------------------------------------------------
# JAVASCRIPT (simple base)
cat > $ROOT/js/scripts.js <<'EOF'
console.log("🎧 8BFR Network JS Loaded");

function navActive(page){document.querySelectorAll('nav a').forEach(a=>{
 if(a.href.includes(page)){a.style.color='#9F00FF';}});}
EOF

# ---------------------------------------------------------------------
# FUNCTION TO CREATE STANDARD PAGE TEMPLATE
make_page () {
  local filename=$1
  local title=$2
  local content=$3
  cat > $ROOT/pages/${filename}.html <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} • 8BFR Network</title>
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/scripts.js"></script>
</head>
<body>
<header>
  <h1>${title}</h1>
  <nav>
    <ul>
      <li><a href="../index.html">Home</a></li>
      <li><a href="feed.html">Feed</a></li>
      <li><a href="radio.html">Radio</a></li>
      <li><a href="chat.html">Chat</a></li>
      <li><a href="store.html">Store</a></li>
      <li><a href="games.html">Games</a></li>
      <li><a href="profile.html">Profile</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </nav>
</header>
<main>
${content}
</main>
<footer>© 2025 8BFR Music Network</footer>
</body>
</html>
EOF
}

# ---------------------------------------------------------------------
# PAGE CREATION
make_page "about" "About" "<p>8BFR connects artists, beatmakers, and influencers — Create • Connect • Collab.</p>"
make_page "feed" "Feed" "<div id='feed'>Latest posts will appear here.</div>"
make_page "radio" "Radio" "<iframe src='https://open.spotify.com/embed' width='100%' height='380'></iframe>"
make_page "chat" "Chat" "<div id='chatBox'>Global chat loading...</div>"
make_page "store" "Store" "<p>Shop badges, stickers, bundles, and merch.</p>"
make_page "games" "Games" "<ul><li>8-Ball Pool</li><li>Rhythm Challenge</li><li>Beat Hero</li></ul>"
make_page "profile" "Profile" "<p>User profile area with uploads, bio, and badges.</p>"
make_page "admin" "Admin Panel" "<p>Admin tools: edit HTML, approve posts, manage ads.</p>"
make_page "debug" "Debug" "<p>Supabase connectivity check tools will load here.</p>"
make_page "contact" "Contact" "<form><input placeholder='Name'><input placeholder='Email'><textarea placeholder='Message'></textarea><button>Send</button></form>"
make_page "help" "Help & How-To" "<ol><li>Login</li><li>Upload music</li><li>Join chat</li></ol>"
#!/data/data/com.termux/files/usr/bin/bash
echo "🎶 Building 8BFR Music Network full site..."
OUTDIR="$HOME/8bfr_network"
mkdir -p "$OUTDIR"

# -------------------------------
# index.html
# -------------------------------
cat > "$OUTDIR/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>8BFR Music Network</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
  <header class="text-center py-6 bg-black border-b border-purple-600">
    <h1 class="text-3xl font-bold text-purple-400">🎧 8BFR Music Network</h1>
    <p class="text-sm text-blue-300">Where Music Meets Influence</p>
  </header>

  <main class="p-6 space-y-6">
    <section>
      <h2 class="text-2xl font-semibold mb-2">Featured Music</h2>
      <p>Listen to top tracks and discover new artists.</p>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-2">Donate or Support</h2>
      <div class="flex flex-col md:flex-row gap-4">
        <button class="bg-purple-700 px-4 py-2 rounded">💜 Donate</button>
        <button class="bg-green-600 px-4 py-2 rounded">🎧 Spotify</button>
        <button class="bg-blue-700 px-4 py-2 rounded">🛒 Buy Ad</button>
      </div>
    </section>
  </main>

  <footer class="text-center py-4 border-t border-purple-700">
    <p class="text-sm text-gray-400">© 2025 8BFR Music Network — Create • Connect • Collab</p>
  </footer>
</body>
</html>
EOF

# -------------------------------
# style.css
# -------------------------------
cat > "$OUTDIR/style.css" <<'EOF'
body {
  font-family: 'Poppins', sans-serif;
  background: #000;
  color: #fff;
}
h1, h2 {
  color: #9F00FF;
}
EOF

# -------------------------------
# scripts.js
# -------------------------------
cat > "$OUTDIR/scripts.js" <<'EOF'
console.log("8BFR site loaded successfully!");
EOF

echo "✅ Build complete — files are in $OUTDIR"
EOFmake_page "contests" "Contests" "<p>Monthly creator challenges, prizes, and leaderboards.</p>"
make_page "influencer" "Influencer Hub" "<p>Brand tools, affiliate links, and AI Ad Creator.</p>"
make_page "artist" "Artist Studio" "<p>AI mastering, lyric generator, and DAW utilities.</p>"
make_page "author" "Author Hub" "<p>Story publishing + AI illustration tools.</p>"
make_page "kids" "Kids Zone" "<p>Safe learning area + music mini-games.</p>"
make_page "terms" "Terms of Use" "<p>Use respectfully. Copyright belongs to creators.</p>"
make_page "privacy" "Privacy Policy" "<p>Your data is private and not sold.</p>"
make_page "rules" "Rules & Guidelines" "<p>Be respectful. No hate, no spam, keep it creative.</p>"
make_page "blog" "Blog & Announcements" "<p>Platform updates, patch notes, and features.</p>"

echo "✅ All 20+ pages created successfully!"
echo "🌍 Open with: termux-open ~/8bfr_network/pages/about.html"

#!/data/data/com.termux/files/usr/bin/bash
echo "🎧 Building full 8BFR Infinity Network pages..."

PAGES=(
login reset-password contact chat home profiles stories radio store shop-upgrades
game-coin-shop shop-stickers feed contest owner-studio artist-studio influencer-hub
author-hub game-hub game-leaderboards game-tournaments pool-9-ball pool-8-ball
trickshot-pool arcade game-music blog announcements kids-zone owner-panel
admin-panel mod-panel admin-guide help faq rules pricing privacy terms stats
about dedications credits system integration
)

for PAGE in "${PAGES[@]}"; do
cat > "${PAGE}.html" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>8BFR | ${PAGE^}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header style="text-align:center;padding:2rem;background:#15001e;">
    <h1>8BFR Network — ${PAGE^}</h1>
    <p>🎵 Part of the 8BFR Infinity System</p>
    <nav>
      <a href="index.html">Home</a> •
      <a href="feed.html">Feed</a> •
      <a href="chat.html">Chat</a> •
      <a href="radio.html">Radio</a> •
      <a href="store.html">Store</a>
    </nav>
  </header>

  <main style="text-align:center;padding:2rem;">
    <h2>${PAGE^}</h2>
    <p>This is the <strong>${PAGE^}</strong> section of the 8BFR Music Network.</p>
    <p>Dynamic content will load here later (Supabase / AI modules).</p>
  </main>

  <footer style="text-align:center;padding:1rem;color:#aaa;">
    <a href="index.html">⬅ Back to Home</a>
  </footer>
</body>
</html>
HTML
done

echo "✅ Created ${#PAGES[@]} extended pages in $(pwd)"

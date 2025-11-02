#!/data/data/com.termux/files/usr/bin/bash
# 🎧 Auto Builder: 8BFR Music Network

echo "🎶 Building full 8BFR site..."

mkdir -p ~/8bfr_network/{css,js,pages,media}

# Copy existing index.html as base
cp ~/8bfr_network/index.html ~/8bfr_network/pages/home.html

# Create additional pages
cat > ~/8bfr_network/pages/about.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About • 8BFR Network</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header><h1>About 8BFR Music Network</h1></header>
  <main>
    <p>8BFR Music Network connects artists, beatmakers, influencers, and fans across the globe.</p>
    <p>Tagline: Create • Connect • Collab 🎧</p>
  </main>
  <footer>© 2025 8BFR Network</footer>
</body>
</html>
EOF

cat > ~/8bfr_network/pages/contact.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact • 8BFR Network</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header><h1>Contact 8BFR Network</h1></header>
  <main>
    <form>
      <input type="text" placeholder="Name" required><br>
      <input type="email" placeholder="Email" required><br>
      <textarea placeholder="Message"></textarea><br>
      <button type="submit">Send Message</button>
    </form>
  </main>
  <footer>help.8bfr.music@gmail.com</footer>
</body>
</html>
EOF

cat > ~/8bfr_network/pages/profile.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile • 8BFR Network</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header><h1>User Profile</h1></header>
  <main>
    <img src="../media/owner_profile.jpg" alt="Profile Photo" width="200">
    <h2>8BFR (James J. Siburt)</h2>
    <p>Creator, Artist, Founder of 8BFR Music Network.</p>
  </main>
  <footer>© 2025 8BFR Network</footer>
</body>
</html>
EOF

echo "✅ Pages created successfully!"

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // ------------------- THEMES -------------------
  const themes = {
    dark: {
      background: "radial-gradient(circle at top, #1a0022, #000)",
      text: "#fff",
      accent: "#a020f0",
    },
    light: {
      background: "linear-gradient(180deg, #f0f0f5, #ccc)",
      text: "#111",
      accent: "#6a00c8",
    },
    blue: {
      background: "linear-gradient(180deg, #000428, #004e92)",
      text: "#fff",
      accent: "#00c6ff",
    },
  };

  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const colors = themes[theme];
    document.body.style.background = colors.background;
    document.body.style.color = colors.text;
  }, [theme]);

  // ------------------- THEME TOGGLES -------------------
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const randomTheme = () => {
    const keys = Object.keys(themes);
    setTheme(keys[Math.floor(Math.random() * keys.length)]);
  };

  // ------------------- AUTOPLAY MUSIC -------------------
  useEffect(() => {
    const audio = new Audio(
      "https://p.scdn.co/mp3-preview/b2c74088e7f2c2b64dfd4e44256d77f6e40bcd74"
    );
    audio.volume = 0.3;
    audio.loop = true;
    const play = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", play);
    };
    document.addEventListener("click", play);
  }, []);

  // ------------------- MENU CATEGORIES -------------------
  const categories = {
    "🎵 Music": [
      "🏠 Home",
      "📻 Radio",
      "🎸 Artist-Studio",
      "🥁 Beats",
      "📚 Stories",
    ],
    "🎮 Games": [
      "🎱 8BFR Game Hub",
      "🎱 8-Ball Pool",
      "🎱 9-Ball Pool",
      "🔥 Trickshot Pool",
      "🎵 Game Music",
      "🎮 Arcade Room",
    ],
    "👥 Community": [
      "💬 Chat",
      "🖥 Feed",
      "📚 Blog & Announcements",
      "🥇 Contest",
      "👪 Kids Zone",
    ],
    "⚙️ Management": [
      "👑 Owner Panel",
      "📛 Admin Panel",
      "⛔ Mod Panel",
      "📜 Admin Guide",
    ],
    "💲 Info": [
      "💲 Pricing",
      "🔏 Privacy",
      "📃 Terms",
      "📊 Stats",
      "❔ FAQ",
      "🚫 Rules & Guidelines",
      "📨 Contact",
    ],
  };

  // ------------------- MAIN APP -------------------
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", textAlign: "center" }}>
      {/* 🔝 Scrolling Banner */}
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "10px 0",
          whiteSpace: "nowrap",
          overflow: "hidden",
          borderBottom: "1px solid #333",
        }}
      >
        <div
          style={{
            display: "inline-block",
            animation: "scroll 25s linear infinite",
          }}
        >
          <span style={{ margin: "0 40px", color: themes[theme].accent }}>
            🔥 Promote your music — Buy Ad Space $5/week 🔥
          </span>
          <span style={{ margin: "0 40px", color: themes[theme].accent }}>
            🎶 Join our Featured Artist Program today! 🎶
          </span>
          <span style={{ margin: "0 40px", color: themes[theme].accent }}>
            💎 Upgrade to Pro — Earn Game Coins and Badges! 💎
          </span>
        </div>
      </div>

      {/* 🔮 Header */}
      <header style={{ textAlign: "center", padding: "20px 10px" }}>
        <h1
          style={{
            color: themes[theme].accent,
            textShadow: "0 0 15px " + themes[theme].accent,
          }}
        >
          🎵 8BFR Music Network
        </h1>
        <p>Create • Connect • Collab</p>
        <button onClick={toggleTheme}>🌓 Toggle Theme</button>
        <button onClick={randomTheme} style={{ marginLeft: "10px" }}>
          🎨 Random Theme
        </button>
      </header>

      {/* ⭐ Featured Artists */}
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ color: themes[theme].accent }}>⭐ Featured Artists</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {["8BFR (Owner)", "Sample Artist", "Guest Performer"].map((artist) => (
            <div
              key={artist}
              style={{
                background: "#200040",
                borderRadius: "12px",
                width: "200px",
                padding: "15px",
                boxShadow: "0 0 10px " + themes[theme].accent,
              }}
            >
              <p style={{ fontWeight: "bold" }}>{artist}</p>
              <p style={{ fontSize: "0.9em", color: "#ccc" }}>Hip-Hop / Rap</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎵 Featured Songs */}
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ color: themes[theme].accent }}>🎵 Featured Songs</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {["Sample Hit #1", "Sample Hit #2", "Sample Hit #3"].map((song) => (
            <div
              key={song}
              style={{
                background: "#150030",
                borderRadius: "12px",
                width: "200px",
                padding: "15px",
                boxShadow: "0 0 10px " + themes[theme].accent,
              }}
            >
              <p style={{ fontWeight: "bold" }}>{song}</p>
              <p style={{ fontSize: "0.9em", color: "#ccc" }}>Artist Name</p>
            </div>
          ))}
        </div>

        {/* 🎧 Now Playing */}
        <div style={{ marginTop: "30px" }}>
          <h3>🎧 Now Playing — “Killa Bees” by 8BFR</h3>
          <video
            src="https://drive.google.com/uc?export=download&id=17nfr_HNPEhkrhDkpEfnAd18XNOr6egTT"
            controls
            autoPlay
            loop
            muted={false}
            style={{
              width: "320px",
              borderRadius: "12px",
              boxShadow: "0 0 15px " + themes[theme].accent,
            }}
          ></video>
        </div>
      </section>

      {/* ❤️ Donate / Ad Button */}
      <section style={{ textAlign: "center", padding: "30px 20px" }}>
        <form
          action="https://www.paypal.com/donate"
          method="post"
          target="_blank"
        >
          <input type="hidden" name="business" value="8bfr.music@gmail.com" />
          <button
            type="submit"
            style={{
              background: themes[theme].accent,
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              padding: "12px 24px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 10px " + themes[theme].accent,
            }}
          >
            ❤️ Donate via PayPal
          </button>
        </form>
      </section>
{/* 🔚 Footer */}
<footer
  style={{
    background: "#100022",
    padding: "20px",
    fontSize: "0.8em",
    color: "#ccc",
    borderTop: "1px solid #2b0050",
    boxShadow: "0 -2px 8px rgba(160,32,240,0.3)",
  }}
>
  <p>© 2025 8BFR Music Network | All Rights Reserved</p>
  <p>
    <a href="#top" style={{ color: themes[theme].accent }}>
      ↑ Back to Top
    </a>
  </p>
</footer>
</div>
  );
}

export default App;

      

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
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
    red: {
      background: "linear-gradient(180deg, #2b0000, #800000)",
      text: "#fff",
      accent: "#ff4d4d",
    },
    green: {
      background: "linear-gradient(180deg, #001a00, #003300)",
      text: "#fff",
      accent: "#00ff88",
    },
  };

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const colors = themes[theme];
    document.body.style.background = colors.background;
    document.body.style.color = colors.text;
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const randomTheme = () => {
    const keys = Object.keys(themes);
    setTheme(keys[Math.floor(Math.random() * keys.length)]);
  };

  // 🎧 Default Music AutoPlay (Killa Bees)
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

      {/* 🔮 Site Header */}
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

      {/* 🍔 Main Menu */}
      <nav
        style={{
          background: "#150030",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "10px",
          gap: "10px",
          boxShadow: "0 0 10px " + themes[theme].accent,
        }}
      >
        {[
          "🏠 Home",
          "📚 Stories",
          "📻 Radio",
          "💬 Chat",
          "🖥 Feed",
          "🎸 Artist-Studio",
          "👪 Kids-Zone",
          "🎮 Game-Hub",
          "📛 Admin-Panel",
          "👑 Owner-Panel",
          "💲 Pricing",
          "📜 Terms",
        ].map((page) => (
          <button
            key={page}
            style={{
              background: "transparent",
              border: "1px solid " + themes[theme].accent,
              borderRadius: "8px",
              color: "white",
              padding: "8px 14px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={() => alert(`Opening ${page} (placeholder)`)}
            onMouseOver={(e) =>
              (e.target.style.background = themes[theme].accent)
            }
            onMouseOut={(e) => (e.target.style.background = "transparent")}
          >
            {page}
          </button>
        ))}
      </nav>

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

        {/* 🎧 Default Track */}
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

        <button
          style={{
            marginLeft: "10px",
            background: "#0072ff",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            padding: "12px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px " + themes[theme].accent,
          }}
          onClick={() => alert("Buy Ad Space feature coming soon")}
        >
          📢 Buy Ad Space
        </button>
      </section>

      {/* 🔚 Footer */}
      <footer
        style={{
          background: "#100022",
          padding: "20px",
          fontSize: "0.8em",
          color: "#ccc",
          borderTop: "1px solid #2b0050",
          marginTop: "40px",
        }}
      >
        © 2025 8BFR Music Network | All Rights Reserved | Create • Connect • Collab
      </footer>

      {/* 🔁 Banner Animation */}
      <style>
        {`@keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }`}
      </style>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 🎵 THEME SYSTEM
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
  const [customColor, setCustomColor] = useState(null);

  // Apply chosen theme
  useEffect(() => {
    const body = document.body;
    const colors = themes[theme];
    body.style.background = colors.background;
    body.style.color = colors.text;
  }, [theme]);

  // 🎨 Random Theme Switcher
  const randomTheme = () => {
    const keys = Object.keys(themes);
    const next = keys[Math.floor(Math.random() * keys.length)];
    setTheme(next);
  };

  // 🌓 Toggle Light / Dark
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 🎧 Default Music AutoPlay (Killa Bees)
  useEffect(() => {
    const audio = new Audio("https://p.scdn.co/mp3-preview/b2c74088e7f2c2b64dfd4e44256d77f6e40bcd74");
    audio.volume = 0.2;
    audio.loop = true;
    const play = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", play);
    };
    document.addEventListener("click", play);
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: themes[theme].accent, textShadow: "0 0 15px " + themes[theme].accent }}>
        🎵 8BFR Music Network
      </h1>

      <p>Welcome to 8BFR — Create • Connect • Collab</p>

      <div style={{ margin: "20px 0" }}>
        <button onClick={toggleTheme}>🌓 Toggle Dark / Light</button>
        <button onClick={randomTheme} style={{ marginLeft: "10px" }}>
          🎨 Random Theme
        </button>
      </div>

      <p>Loading layout… (Part 2 will add navigation, featured artists, and ad banners)</p>
    </div>
  );
}

export default App;

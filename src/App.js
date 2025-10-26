import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    window.onerror = (msg, src, line, col, err) => {
      setError(`${msg} @ ${src}:${line}:${col}`);
    };
  }, []);

  try {
    // 🟣 Import your existing code here
    return (
      <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
        <h1>🎵 8BFR Music Network (Debug Mode)</h1>
        <p>✅ React loaded successfully!</p>
        <p>If this disappears — your code runs fine.</p>

        {error && (
          <div
            style={{
              background: "rgba(255,0,0,0.2)",
              padding: "10px",
              marginTop: "20px",
              borderRadius: "10px",
              color: "#ff8080",
              fontFamily: "monospace",
            }}
          >
            ❌ JS Error: {error}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div
        style={{
          background: "black",
          color: "red",
          padding: "20px",
          fontFamily: "monospace",
        }}
      >
        ⚠️ React crashed: {err.message}
      </div>
    );
  }
}

export default App;

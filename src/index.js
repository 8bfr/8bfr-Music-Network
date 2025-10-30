import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

function showError(message) {
  const div = document.createElement("div");
  div.style.cssText = "background:black;color:red;padding:20px;white-space:pre-wrap;";
  div.innerText = "🔥 Startup Error:\n\n" + message;
  document.body.innerHTML = "";
  document.body.appendChild(div);
}

try {
  console.log("🎵 Starting 8BFR Music Network app...");
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  console.log("✅ App render attempted");
} catch (err) {
  console.error("❌ Render failed:", err);
  showError(err.message || String(err));
}

// If even this script fails before running, show a static message
window.addEventListener("error", e => {
  showError(e.message || e.error?.message || "Unknown JS Error");
});

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("✅ index.js started");

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  console.log("✅ App render attempted");
} catch (error) {
  console.error("❌ Render failed:", error);
  document.body.innerHTML = `<pre style="color:red;background:black;padding:20px">${error}</pre>`;
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./supabaseClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log so we know it's loading
console.log("✅ 8BFR Music Network loaded successfully");

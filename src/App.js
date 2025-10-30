import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [status, setStatus] = useState("Checking Supabase connection...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("test").select("*").limit(1);
        if (error) throw error;
        setStatus("✅ Supabase connected successfully! Data: " + JSON.stringify(data));
      } catch (err) {
        console.error("❌ Supabase connection failed:", err);
        setStatus("❌ Supabase connection failed: " + err.message);
      }
    }
    testConnection();
  }, []);

  return (
    <div
      style={{
        background: "radial-gradient(circle at top, #1a0022, #000)",
        color: "#a020f0",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <h1>🎵 8BFR Music Network</h1>
      <p>{status}</p>
      <p style={{ fontSize: "0.8em", marginTop: "20px", color: "#888" }}>
        If you see a blank screen, press <strong>Ctrl+C</strong> in Termux and rebuild.
      </p>
    </div>
  );
}

export default App;

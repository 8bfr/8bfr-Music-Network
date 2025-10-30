import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
console.log("✅ App.js loaded successfully");
function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const fetchMessage = async () => {
      const { data, error } = await supabase
        .from("test")
        .select("message")
        .limit(1)
        .single();

      if (error) {
        console.error("❌ Supabase fetch error:", error.message);
        setMessage("Connection failed.");
      } else {
        setMessage(data.message);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "40px" }}>
      <h1>🎵 8BFR Music Network</h1>
      <h3>Supabase Test:</h3>
      <p>{message}</p>
    </div>
  );
}

export default App;

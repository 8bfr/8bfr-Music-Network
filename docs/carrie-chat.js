// carrie-chat.js — minimal local chat (no API)
// Saves chat + mode to localStorage so refresh keeps it.

(function () {
  const $ = (s) => document.querySelector(s);

  const chatStream = $("#chatStream");
  const chatInput = $("#chatInput");
  const sendBtn = $("#sendBtn");
  const clearBtn = $("#clearChat");

  const modePro = $("#modePro");
  const modeFun = $("#modeFun");
  const modeLabel = $("#modeLabel");

  const carrieBubble = $("#carrieBubble");
  const carrieAvatar = $("#carrieAvatar");

  const STORE_KEY = "carrieChatState_v1";

  const state = {
    mode: "pro", // "pro" | "fun"
    messages: []
  };

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e){}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      if (data.mode) state.mode = data.mode;
      if (Array.isArray(data.messages)) state.messages = data.messages;
    } catch (e) {}
  }

  function setMode(mode) {
    state.mode = mode;

    modePro.classList.toggle("active", mode === "pro");
    modeFun.classList.toggle("active", mode === "fun");
    modeLabel.textContent = (mode === "pro") ? "Professional" : "Personal";

    // swap avatar if you have both files:
    if (mode === "pro") {
      carrieAvatar.src = "assets/images/Carrie_Business.png";
      carrieBubble.textContent = "Professional mode: I can help with music + tools.";
    } else {
      carrieAvatar.src = "assets/images/Carrie_Casual.png";
      carrieBubble.textContent = "Personal mode: I’m here for vibes + fun too 💜";
    }

    save();
    render();
  }

  function addMsg(role, text) {
    state.messages.push({ role, text, t: Date.now() });
    save();
    render();
  }

  function replyFor(text) {
    const msg = (text || "").toLowerCase().trim();

    // simple built-in replies (safe beta)
    if (!msg) return "Say something and I’ll respond 🙂";

    if (msg.includes("closet")) return "Use the Closet to dress your avatar. It’s separate from chat so it won’t break this page.";
    if (msg.includes("spotify")) return "8BFR is on Spotify — you can link it on your featured section anytime.";
    if (msg.includes("help") || msg.includes("how")) {
      return (state.mode === "pro")
        ? "Tell me what you’re building (song, beat, page, or feature) and I’ll guide you step-by-step."
        : "Tell me what you want to do and I’ll hype you up and help you get it done 💜";
    }

    return (state.mode === "pro")
      ? "Got it. Describe the exact problem and paste the snippet you want to change."
      : "Okayyy 😄 tell me more — what are we making today?";
  }

  function render() {
    chatStream.innerHTML = "";
    state.messages.forEach((m) => {
      const row = document.createElement("div");
      row.className = "msg " + (m.role === "user" ? "user" : "assistant");

      const role = document.createElement("div");
      role.className = "role";
      role.textContent = m.role;

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = m.text;

      row.appendChild(role);
      row.appendChild(bubble);
      chatStream.appendChild(row);
    });

    chatStream.scrollTop = chatStream.scrollHeight;
  }

  function send() {
    const text = (chatInput.value || "").trim();
    if (!text) return;

    chatInput.value = "";
    addMsg("user", text);

    // small delay for natural feel
    setTimeout(() => {
      addMsg("assistant", replyFor(text));
    }, 150);
  }

  // boot
  load();
  render();

  // default greeting if empty
  if (state.messages.length === 0) {
    addMsg("assistant", "Hi James 👋 I’m Carrie. Ask me anything (beta chat).");
  }

  setMode(state.mode || "pro");

  sendBtn.addEventListener("click", send);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  clearBtn.addEventListener("click", () => {
    state.messages = [];
    save();
    render();
    addMsg("assistant", "Chat cleared ✅");
  });

  modePro.addEventListener("click", () => setMode("pro"));
  modeFun.addEventListener("click", () => setMode("fun"));
})();

// carrie-chat.js — minimal local chat (no API)
// Saves chat + mode to localStorage so refresh keeps it.
// NOW WITH FLOATING AVATAR SUPPORT

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

    if (modePro) modePro.classList.toggle("active", mode === "pro");
    if (modeFun) modeFun.classList.toggle("active", mode === "fun");
    if (modeLabel) modeLabel.textContent = (mode === "pro") ? "Professional" : "Personal";

    // swap avatar if you have both files:
    if (carrieAvatar) {
      if (mode === "pro") {
        carrieAvatar.src = "assets/images/Carrie_Business.png";
        if (carrieBubble) carrieBubble.textContent = "Professional mode: I can help with music + tools.";
      } else {
        carrieAvatar.src = "assets/images/Carrie_Casual.png";
        if (carrieBubble) carrieBubble.textContent = "Personal mode: I'm here for vibes + fun too 💜";
      }
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
    if (!msg) return "Say something and I'll respond 🙂";

    if (msg.includes("closet")) return "Use the Closet to dress your avatar. It's separate from chat so it won't break this page.";
    if (msg.includes("spotify")) return "8BFR is on Spotify — you can link it on your featured section anytime.";
    if (msg.includes("help") || msg.includes("how")) {
      return (state.mode === "pro")
        ? "Tell me what you're building (song, beat, page, or feature) and I'll guide you step-by-step."
        : "Tell me what you want to do and I'll hype you up and help you get it done 💜";
    }

    return (state.mode === "pro")
      ? "Got it. Describe the exact problem and paste the snippet you want to change."
      : "Okayyy 😄 tell me more — what are we making today?";
  }

  function render() {
    if (!chatStream) return;
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
    if (!chatInput) return;
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
    addMsg("assistant", "Hi James 👋 I'm Carrie. Ask me anything (beta chat).");
  }

  setMode(state.mode || "pro");

  if (sendBtn) sendBtn.addEventListener("click", send);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.messages = [];
      save();
      render();
      addMsg("assistant", "Chat cleared ✅");
    });
  }

  if (modePro) modePro.addEventListener("click", () => setMode("pro"));
  if (modeFun) modeFun.addEventListener("click", () => setMode("fun"));

  // ========== FLOATING AVATAR CODE ==========
  const wrapper = $("#floatingAvatarWrapper");
  const inner = $("#floatingAvatarInner");
  const container = $("#closetPreviewInner");
  const zoomIn = $("#avatarZoomIn");
  const zoomOut = $("#avatarZoomOut");
  const reset = $("#avatarReset");
  
  if (wrapper && inner && container) {
    const AVATAR_KEY = 'carrieFloatingAvatar_v1';
    let avatarState = {
      x: window.innerWidth / 2 - 240,
      y: window.innerHeight / 2 - 400,
      zoom: 0.6
    };

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let lastTouchDist = 0;

    function saveAvatar() {
      try { localStorage.setItem(AVATAR_KEY, JSON.stringify(avatarState)); } catch(e) {}
    }

    function loadAvatar() {
      try {
        const data = localStorage.getItem(AVATAR_KEY);
        if (data) avatarState = JSON.parse(data);
      } catch(e) {}
    }

    function updateAvatar() {
      wrapper.style.left = avatarState.x + 'px';
      wrapper.style.top = avatarState.y + 'px';
      wrapper.style.transform = 'none';
      container.style.transform = `scale(${avatarState.zoom})`;
      saveAvatar();
    }

    // Drag
    inner.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      const rect = wrapper.getBoundingClientRect();
      dragStart.x = e.clientX - rect.left;
      dragStart.y = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      avatarState.x = e.clientX - dragStart.x;
      avatarState.y = e.clientY - dragStart.y;
      updateAvatar();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      saveAvatar();
    });

    // Touch drag & pinch
    inner.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = wrapper.getBoundingClientRect();
        isDragging = true;
        dragStart.x = touch.clientX - rect.left;
        dragStart.y = touch.clientY - rect.top;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        avatarState.x = touch.clientX - dragStart.x;
        avatarState.y = touch.clientY - dragStart.y;
        updateAvatar();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist > 0) {
          const delta = dist - lastTouchDist;
          avatarState.zoom = Math.max(0.3, Math.min(2.0, avatarState.zoom + delta * 0.005));
          updateAvatar();
        }
        lastTouchDist = dist;
        e.preventDefault();
      }
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
      lastTouchDist = 0;
      saveAvatar();
    });

    // Zoom buttons
    if (zoomIn) {
      zoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.zoom = Math.min(avatarState.zoom + 0.1, 2.0);
        updateAvatar();
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.zoom = Math.max(avatarState.zoom - 0.1, 0.3);
        updateAvatar();
      });
    }

    if (reset) {
      reset.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.x = window.innerWidth / 2 - 240;
        avatarState.y = window.innerHeight / 2 - 400;
        avatarState.zoom = 0.6;
        updateAvatar();
      });
    }

    // Init avatar
    loadAvatar();
    updateAvatar();
  }
})();

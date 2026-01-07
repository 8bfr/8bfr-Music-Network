// carrie-chat.js — Floating avatar with closet-matched positioning

(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // Chat DOM refs
  const chatStream = $("#chatStream");
  const chatInput = $("#chatInput");
  const sendBtn = $("#sendBtn");
  const clearBtn = $("#clearChat");
  const modePro = $("#modePro");
  const modeFun = $("#modeFun");
  const modeLabel = $("#modeLabel");

  // Floating avatar refs
  const floatingWrapper = $("#floatingAvatarWrapper");
  const floatingInner = $("#floatingAvatarInner");
  const closetBaseImg = $("#closetBaseImg");
  const overlayHost = $("#closetOverlayHost");
  const avatarZoomIn = $("#avatarZoomIn");
  const avatarZoomOut = $("#avatarZoomOut");
  const avatarReset = $("#avatarReset");

  // Gender/skin controls
  const genderFemale = $("#genderFemale");
  const genderMale = $("#genderMale");
  const skinLight = $("#skinLight");
  const skinDark = $("#skinDark");

  const CHAT_KEY = "carrieChatState_v1";
  const CLOSET_KEY = "carrieClosetState_v1";
  const AVATAR_KEY = "carrieAvatarPos_v1";

  const chatState = { mode: "pro", messages: [] };
  const closetState = { gender: "female", skin: "light", coins: 999999, ownedItems: [], equipped: {} };
  const avatarState = { x: 100, y: 100, zoom: 0.6 };

  // Z-index by slot (matches closet)
  const zBySlot = { 
    shoes: 10, 
    bottom: 30, 
    belly: 35, 
    top: 40, 
    necklace: 45, 
    eyes: 50, 
    ears: 55, 
    hair: 60 
  };

  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let lastTouchDist = 0;

  // STORAGE
  function saveChat() {
    try { localStorage.setItem(CHAT_KEY, JSON.stringify(chatState)); } catch(e) {}
  }
  function loadChat() {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.mode) chatState.mode = data.mode;
      if (Array.isArray(data.messages)) chatState.messages = data.messages;
    } catch (e) {}
  }
  function saveCloset() {
    try { localStorage.setItem(CLOSET_KEY, JSON.stringify(closetState)); } catch(e) {}
  }
  function loadCloset() {
    try {
      const raw = localStorage.getItem(CLOSET_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.gender) closetState.gender = data.gender;
      if (data.skin) closetState.skin = data.skin;
      if (typeof data.coins === "number") closetState.coins = data.coins;
      if (Array.isArray(data.ownedItems)) closetState.ownedItems = data.ownedItems;
      if (data.equipped) closetState.equipped = data.equipped;
    } catch (e) {}
  }
  function saveAvatar() {
    try { localStorage.setItem(AVATAR_KEY, JSON.stringify(avatarState)); } catch(e) {}
  }
  function loadAvatar() {
    try {
      const raw = localStorage.getItem(AVATAR_KEY);
      if (raw) Object.assign(avatarState, JSON.parse(raw));
    } catch (e) {}
  }

  // ITEMS
  function getItems() { return window.CARRIE_CHAT_ITEMS || []; }

  // AVATAR DISPLAY
  function updateBaseImage() {
    if (closetBaseImg) {
      closetBaseImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
    }
    document.body.dataset.gender = closetState.gender;
    document.body.dataset.skin = closetState.skin;
  }

  function renderAvatarOverlays() {
    if (!overlayHost) return;
    overlayHost.innerHTML = "";
    const items = getItems();
    
    Object.keys(closetState.equipped).forEach(slot => {
      const itemId = closetState.equipped[slot];
      if (!itemId) return;
      const item = items.find(it => it.id === itemId);
      if (!item) return;

      // Use closet positioning classes that match your CSS
      if (slot === "eyes" || slot === "ears") {
        const left = document.createElement("img");
        left.src = item.imgLeft || item.img;
        left.className = `layer-overlay layer-left item-${item.id}`;
        left.style.zIndex = zBySlot[slot];
        const right = document.createElement("img");
        right.src = item.imgRight || item.img;
        right.className = `layer-overlay layer-right item-${item.id}`;
        right.style.zIndex = zBySlot[slot];
        overlayHost.appendChild(left);
        overlayHost.appendChild(right);
      } else if (slot === "shoes") {
        const left = document.createElement("img");
        left.src = item.imgLeft || item.img;
        left.className = `layer-overlay layer-shoes-left item-${item.id}`;
        left.style.zIndex = zBySlot.shoes;
        const right = document.createElement("img");
        right.src = item.imgRight || item.img;
        right.className = `layer-overlay layer-shoes-right item-${item.id}`;
        right.style.zIndex = zBySlot.shoes;
        overlayHost.appendChild(left);
        overlayHost.appendChild(right);
      } else {
        const overlay = document.createElement("img");
        overlay.src = item.img;
        overlay.className = `layer-overlay item-${item.id}`;
        overlay.style.zIndex = zBySlot[slot] || 20;
        overlayHost.appendChild(overlay);
      }
    });
  }

  // FLOATING AVATAR CONTROLS
  function updateAvatarPosition() {
    if (!floatingWrapper) return;
    const maxX = window.innerWidth - 480;
    const maxY = window.innerHeight - 800;
    avatarState.x = Math.max(0, Math.min(avatarState.x, maxX));
    avatarState.y = Math.max(0, Math.min(avatarState.y, maxY));
    floatingWrapper.style.left = avatarState.x + 'px';
    floatingWrapper.style.top = avatarState.y + 'px';
    if (floatingInner) {
      floatingInner.style.transform = `scale(${avatarState.zoom})`;
    }
    saveAvatar();
  }

  function setupFloatingAvatar() {
    if (!floatingWrapper || !floatingInner) return;
    
    // Mouse drag
    floatingInner.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      const rect = floatingWrapper.getBoundingClientRect();
      dragStart.x = e.clientX - rect.left;
      dragStart.y = e.clientY - rect.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      avatarState.x = e.clientX - dragStart.x;
      avatarState.y = e.clientY - dragStart.y;
      updateAvatarPosition();
    });
    document.addEventListener('mouseup', () => { isDragging = false; saveAvatar(); });

    // Touch drag and pinch zoom
    floatingInner.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = floatingWrapper.getBoundingClientRect();
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
        updateAvatarPosition();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist > 0) {
          const delta = dist - lastTouchDist;
          avatarState.zoom = Math.max(0.3, Math.min(2.0, avatarState.zoom + delta * 0.005));
          updateAvatarPosition();
        }
        lastTouchDist = dist;
        e.preventDefault();
      }
    });
    document.addEventListener('touchend', () => { isDragging = false; lastTouchDist = 0; saveAvatar(); });

    // Button zoom
    if (avatarZoomIn) {
      avatarZoomIn.addEventListener('click', () => {
        avatarState.zoom = Math.min(avatarState.zoom + 0.1, 2.0);
        updateAvatarPosition();
      });
    }
    if (avatarZoomOut) {
      avatarZoomOut.addEventListener('click', () => {
        avatarState.zoom = Math.max(avatarState.zoom - 0.1, 0.3);
        updateAvatarPosition();
      });
    }
    if (avatarReset) {
      avatarReset.addEventListener('click', () => {
        avatarState.x = 100;
        avatarState.y = 100;
        avatarState.zoom = 0.6;
        updateAvatarPosition();
      });
    }

    loadAvatar();
    updateAvatarPosition();
  }

  // GENDER/SKIN CONTROLS
  function setupGenderSkinControls() {
    if (genderFemale) {
      genderFemale.addEventListener("click", () => {
        closetState.gender = "female";
        updateBaseImage();
        renderAvatarOverlays();
        updateGenderSkinUI();
        saveCloset();
      });
    }
    if (genderMale) {
      genderMale.addEventListener("click", () => {
        closetState.gender = "male";
        updateBaseImage();
        renderAvatarOverlays();
        updateGenderSkinUI();
        saveCloset();
      });
    }
    if (skinLight) {
      skinLight.addEventListener("click", () => {
        closetState.skin = "light";
        updateBaseImage();
        renderAvatarOverlays();
        updateGenderSkinUI();
        saveCloset();
      });
    }
    if (skinDark) {
      skinDark.addEventListener("click", () => {
        closetState.skin = "dark";
        updateBaseImage();
        renderAvatarOverlays();
        updateGenderSkinUI();
        saveCloset();
      });
    }
  }

  function updateGenderSkinUI() {
    $$("[data-gender]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.gender === closetState.gender);
    });
    $$("[data-skin]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.skin === closetState.skin);
    });
  }

  // CHAT
  function setMode(mode) {
    chatState.mode = mode;
    if (modePro) modePro.classList.toggle("active", mode === "pro");
    if (modeFun) modeFun.classList.toggle("active", mode === "fun");
    if (modeLabel) modeLabel.textContent = mode === "pro" ? "Professional" : "Personal";
    saveChat();
    renderChat();
  }

  function addMsg(role, text) {
    chatState.messages.push({ role, text, t: Date.now() });
    saveChat();
    renderChat();
  }

  function replyFor(text) {
    const msg = (text || "").toLowerCase().trim();
    if (!msg) return "Say something 🙂";
    if (msg.includes("closet")) return "Use Closet to preview items!";
    if (msg.includes("avatar")) return "Drag me anywhere! Pinch or use buttons to zoom! 👗";
    if (msg.includes("help")) return chatState.mode === "pro" ? "Tell me what you're building." : "Tell me what you want to do 💜";
    return chatState.mode === "pro" ? "Got it. What's the problem?" : "Okayyy 😄 tell me more!";
  }

  function renderChat() {
    if (!chatStream) return;
    chatStream.innerHTML = "";
    chatState.messages.forEach((m) => {
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
    setTimeout(() => addMsg("assistant", replyFor(text)), 150);
  }

  // CLEAR CHAT
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Delete all chat history?")) {
        chatState.messages = [];
        saveChat();
        renderChat();
        addMsg("assistant", "Chat cleared ✅");
      }
    });
  }

  // INIT
  function init() {
    loadChat();
    loadCloset();
    updateBaseImage();
    setupGenderSkinControls();
    updateGenderSkinUI();
    setupFloatingAvatar();
    renderAvatarOverlays();
    renderChat();

    if (chatState.messages.length === 0) {
      addMsg("assistant", "Hi! 👋 Drag my avatar anywhere! Pinch to zoom!");
    }

    setMode(chatState.mode || "pro");

    if (sendBtn) sendBtn.addEventListener("click", send);
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
      });
    }

    if (modePro) modePro.addEventListener("click", () => setMode("pro"));
    if (modeFun) modeFun.addEventListener("click", () => setMode("fun"));

    console.log("✅ Floating avatar ready!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

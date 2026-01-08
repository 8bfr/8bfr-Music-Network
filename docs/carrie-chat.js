// carrie-chat.js — Floating avatar with closet integration

(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // Chat/Closet DOM refs
  const chatLog = $("#chatLog");
  const carrieInput = $("#carrieInput");
  const carrieForm = $("#carrieForm");
  const typingRow = $("#typingRow");
  const statusText = $("#statusText");
  const modeBusinessBtn = $("#modeBusinessBtn");
  const modePersonalBtn = $("#modePersonalBtn");
  const modeBFGFBtn = $("#modeBFGFBtn");
  const ownerControls = $("#ownerControls");
  const coinBalance = $("#coinBalance");
  const coinItemsLabel = $("#coinItemsLabel");

  // Floating avatar refs
  const floatingWrapper = $("#floatingAvatarWrapper");
  const floatingInner = $("#floatingAvatarInner");
  const closetBaseImg = $("#closetBaseImg");
  const closetOverlayHost = $("#closetOverlayHost");
  const chatAvatarSmall = $("#chatAvatarSmall");
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

  const chatState = { mode: "business", messages: [] };
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

  let isOwner = false;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let lastTouchDist = 0;
  let carrieMode = "business";

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
    if (chatAvatarSmall) {
      chatAvatarSmall.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
    }
    document.body.dataset.gender = closetState.gender;
    document.body.dataset.skin = closetState.skin;
  }

  function renderAvatarOverlays() {
    if (!closetOverlayHost) return;
    closetOverlayHost.innerHTML = "";
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
        closetOverlayHost.appendChild(left);
        closetOverlayHost.appendChild(right);
      } else if (slot === "shoes") {
        const left = document.createElement("img");
        left.src = item.imgLeft || item.img;
        left.className = `layer-overlay layer-shoes-left item-${item.id}`;
        left.style.zIndex = zBySlot.shoes;
        const right = document.createElement("img");
        right.src = item.imgRight || item.img;
        right.className = `layer-overlay layer-shoes-right item-${item.id}`;
        right.style.zIndex = zBySlot.shoes;
        closetOverlayHost.appendChild(left);
        closetOverlayHost.appendChild(right);
      } else {
        const overlay = document.createElement("img");
        overlay.src = item.img;
        overlay.className = `layer-overlay item-${item.id}`;
        overlay.style.zIndex = zBySlot[slot] || 20;
        closetOverlayHost.appendChild(overlay);
      }
    });
  }

  // FLOATING AVATAR CONTROLS - Keep within viewport
  function updateAvatarPosition() {
    if (!floatingWrapper) return;
    
    // Get current size based on zoom
    const currentWidth = 480 * avatarState.zoom;
    const currentHeight = 800 * avatarState.zoom;
    
    // Keep within viewport bounds
    const maxX = Math.max(0, window.innerWidth - currentWidth);
    const maxY = Math.max(0, window.innerHeight - currentHeight);
    
    avatarState.x = Math.max(0, Math.min(avatarState.x, maxX));
    avatarState.y = Math.max(0, Math.min(avatarState.y, maxY));
    
    floatingWrapper.style.left = avatarState.x + 'px';
    floatingWrapper.style.top = avatarState.y + 'px';
    
    if (floatingInner) {
      floatingInner.style.transform = `scale(${avatarState.zoom})`;
      floatingInner.style.transformOrigin = 'top left';
    }
    
    saveAvatar();
  }

  function setupFloatingAvatar() {
    if (!floatingWrapper || !floatingInner) return;
    
    // Mouse drag
    floatingInner.addEventListener('mousedown', (e) => {
      // Don't drag if clicking a button
      if (e.target.closest('button')) return;
      
      isDragging = true;
      dragStart.x = e.clientX - avatarState.x;
      dragStart.y = e.clientY - avatarState.y;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      avatarState.x = e.clientX - dragStart.x;
      avatarState.y = e.clientY - dragStart.y;
      updateAvatarPosition();
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        saveAvatar();
      }
    });

    // Touch drag and pinch zoom
    floatingInner.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        isDragging = true;
        dragStart.x = touch.clientX - avatarState.x;
        dragStart.y = touch.clientY - avatarState.y;
        e.preventDefault();
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
        e.preventDefault();
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        avatarState.x = touch.clientX - dragStart.x;
        avatarState.y = touch.clientY - dragStart.y;
        updateAvatarPosition();
        e.preventDefault();
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
    
    document.addEventListener('touchend', () => {
      isDragging = false;
      lastTouchDist = 0;
      saveAvatar();
    });

    // Button zoom
    if (avatarZoomIn) {
      avatarZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.zoom = Math.min(avatarState.zoom + 0.1, 2.0);
        updateAvatarPosition();
      });
    }
    if (avatarZoomOut) {
      avatarZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.zoom = Math.max(avatarState.zoom - 0.1, 0.3);
        updateAvatarPosition();
      });
    }
    if (avatarReset) {
      avatarReset.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarState.x = 100;
        avatarState.y = 100;
        avatarState.zoom = 0.6;
        updateAvatarPosition();
      });
    }

    // Window resize handler
    window.addEventListener('resize', () => {
      updateAvatarPosition();
    });

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
  function updateModeUI() {
    modeBusinessBtn?.classList.toggle("active", carrieMode === "business");
    modePersonalBtn?.classList.toggle("active", carrieMode === "personal");
    modeBFGFBtn?.classList.toggle("active", carrieMode === "bfgf");
  }

  function addMsg(role, text) {
    chatState.messages.push({ role, text, t: Date.now() });
    saveChat();
    renderChat();
  }

  function replyFor(text) {
    const msg = (text || "").toLowerCase().trim();
    if (!msg) return "Say something 🙂";
    if (msg.includes("closet") || msg.includes("outfit")) return "Check out the Carrie Closet to customize my look! 🎀";
    if (msg.includes("avatar") || msg.includes("drag")) return "Drag me anywhere! Pinch or use the + − buttons to zoom! 👗";
    if (msg.includes("help")) return carrieMode === "business" ? "I can help with 8BFR features, music, and site questions!" : "Tell me what you want to do 💜";
    return carrieMode === "business" ? "Got it. What else can I help with?" : "Okayyy 😄 tell me more!";
  }

  function renderChat() {
    if (!chatLog) return;
    chatLog.innerHTML = "";
    chatState.messages.forEach((m) => {
      const row = document.createElement("div");
      row.className = "msg-row " + (m.role === "user" ? "user" : "assistant");
      
      const avatar = document.createElement("div");
      avatar.className = "msg-avatar";
      const avatarImg = document.createElement("img");
      if (m.role === "user") {
        avatarImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
      } else {
        avatarImg.src = "assets/images/Carrie_Business.png";
      }
      avatar.appendChild(avatarImg);
      
      const bubble = document.createElement("div");
      bubble.className = "msg-bubble";
      bubble.textContent = m.text;
      
      if (m.role === "user") {
        row.appendChild(bubble);
        row.appendChild(avatar);
      } else {
        row.appendChild(avatar);
        row.appendChild(bubble);
      }
      
      chatLog.appendChild(row);
    });
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function send() {
    if (!carrieInput) return;
    const text = (carrieInput.value || "").trim();
    if (!text) return;
    carrieInput.value = "";
    addMsg("user", text);
    
    if (typingRow) typingRow.classList.remove("hidden");
    
    setTimeout(() => {
      if (typingRow) typingRow.classList.add("hidden");
      addMsg("assistant", replyFor(text));
    }, 600 + Math.random() * 400);
  }

  // OWNER MODE
  function enableOwnerMode() {
    isOwner = true;
    closetState.coins = 999999;
    closetState.ownedItems = getItems().map(it => it.id);
    
    if (statusText) statusText.textContent = "Owner Mode ✨";
    if (ownerControls) ownerControls.classList.remove("hidden");
    if (modeBFGFBtn) {
      modeBFGFBtn.disabled = false;
      modeBFGFBtn.innerHTML = '💕 BF/GF';
    }
    if (coinBalance) coinBalance.textContent = "999,999";
    if (coinItemsLabel) coinItemsLabel.innerHTML = '✨ Your Premium Items (All Unlocked)';
    
    // Unlock all outfit items
    $$('.outfit-thumb.locked').forEach(item => {
      item.classList.remove('locked');
      const lockOverlay = item.querySelector('.outfit-lock-overlay');
      if (lockOverlay) lockOverlay.remove();
      const badge = item.querySelector('.outfit-thumb-badge');
      if (badge) {
        badge.classList.remove('coins');
        badge.classList.add('unlocked');
        badge.textContent = 'OWNED';
      }
    });
    
    saveCloset();
    console.log("👑 Owner mode enabled!");
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

    carrieMode = chatState.mode || "business";
    updateModeUI();

    if (carrieForm) {
      carrieForm.addEventListener("submit", (e) => {
        e.preventDefault();
        send();
      });
    }

    if (carrieInput) {
      carrieInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
    }

    if (modeBusinessBtn) modeBusinessBtn.addEventListener("click", () => {
      carrieMode = "business";
      updateModeUI();
      addMsg("assistant", "Switched to Site / Pro mode. I'll help with 8BFR features!");
    });
    
    if (modePersonalBtn) modePersonalBtn.addEventListener("click", () => {
      carrieMode = "personal";
      updateModeUI();
      addMsg("assistant", "Switched to Personal mode. Let's talk about your goals! 💜");
    });
    
    if (modeBFGFBtn) modeBFGFBtn.addEventListener("click", () => {
      if (isOwner) {
        carrieMode = "bfgf";
        updateModeUI();
        addMsg("assistant", "Switched to BF/GF mode. Hey babe 💜");
      }
    });

    // Enable owner mode automatically
    enableOwnerMode();
    
    console.log("✅ Carrie chat ready!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

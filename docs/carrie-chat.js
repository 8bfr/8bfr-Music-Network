// carrie-chat.js — Enhanced with FLOATING, DRAGGABLE, ZOOMABLE avatar
// NO background, NO box - just floating avatar that can be moved and zoomed
// Works with carrie-chat-data.js for items

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

  // Floating Avatar refs
  const floatingAvatar = $("#floatingAvatar");
  const avatarContainer = $("#avatarContainer");
  const overlayHost = $("#overlayHost");
  const baseImg = $("#baseImg");
  const zoomIn = $("#zoomIn");
  const zoomOut = $("#zoomOut");
  const resetPos = $("#resetPos");

  // Item controls
  const skinToneButtons = $("#skinToneButtons");
  const coinDisplay = $("#coinDisplay");
  const ownedSection = $("#ownedSection");
  const ownedItemsGrid = $("#ownedItemsGrid");
  const shopItemsGrid = $("#shopItemsGrid");
  const ownedCount = $("#ownedCount");
  const shopCount = $("#shopCount");
  const btnBuyCoins = $("#btnBuyCoins");
  const ownerBadge = $("#ownerBadge");

  // Storage keys
  const CHAT_KEY = "carrieChatState_v1";
  const CLOSET_KEY = "carrieClosetState_v1";

  // Chat state
  const chatState = {
    mode: "pro",
    messages: []
  };

  // Closet state
  const closetState = {
    gender: "female",
    skin: "light",
    coins: 0,
    ownedItems: [],
    equipped: {},
    avatarPos: { x: 100, y: 100 }, // Position
    avatarZoom: 1.0 // Zoom level
  };

  const zBySlot = { 
    shoes: 10, bottom: 30, belly: 35, top: 40, 
    necklace: 45, eyes: 50, ears: 55, hair: 60 
  };

  let isOwner = false;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };

  // ========== STORAGE ==========
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
      if (data.avatarPos) closetState.avatarPos = data.avatarPos;
      if (data.avatarZoom) closetState.avatarZoom = data.avatarZoom;
    } catch (e) {}
  }

  // ========== FLOATING AVATAR CONTROLS ==========
  function updateAvatarTransform() {
    if (!floatingAvatar) return;
    floatingAvatar.style.left = closetState.avatarPos.x + "px";
    floatingAvatar.style.top = closetState.avatarPos.y + "px";
    
    if (avatarContainer) {
      avatarContainer.style.transform = `scale(${closetState.avatarZoom})`;
    }
    saveCloset();
  }

  function setupDragging() {
    if (!floatingAvatar) return;

    floatingAvatar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".avatar-controls")) return; // Don't drag if clicking controls
      isDragging = true;
      dragStart.x = e.clientX - closetState.avatarPos.x;
      dragStart.y = e.clientY - closetState.avatarPos.y;
      floatingAvatar.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      closetState.avatarPos.x = e.clientX - dragStart.x;
      closetState.avatarPos.y = e.clientY - dragStart.y;
      updateAvatarTransform();
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        floatingAvatar.style.cursor = "grab";
        saveCloset();
      }
    });

    // Touch support
    floatingAvatar.addEventListener("touchstart", (e) => {
      if (e.target.closest(".avatar-controls")) return;
      const touch = e.touches[0];
      isDragging = true;
      dragStart.x = touch.clientX - closetState.avatarPos.x;
      dragStart.y = touch.clientY - closetState.avatarPos.y;
      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      closetState.avatarPos.x = touch.clientX - dragStart.x;
      closetState.avatarPos.y = touch.clientY - dragStart.y;
      updateAvatarTransform();
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
      saveCloset();
    });
  }

  function setupZoom() {
    if (zoomIn) {
      zoomIn.addEventListener("click", () => {
        closetState.avatarZoom = Math.min(closetState.avatarZoom + 0.1, 2.0);
        updateAvatarTransform();
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener("click", () => {
        closetState.avatarZoom = Math.max(closetState.avatarZoom - 0.1, 0.3);
        updateAvatarTransform();
      });
    }

    if (resetPos) {
      resetPos.addEventListener("click", () => {
        closetState.avatarPos = { x: 100, y: 100 };
        closetState.avatarZoom = 1.0;
        updateAvatarTransform();
      });
    }
  }

  // ========== ITEMS ==========
  function getItems() {
    return window.CARRIE_CHAT_ITEMS || [];
  }

  function filterByGender(items) {
    return items.filter(it => it.gender === "unisex" || it.gender === closetState.gender);
  }

  // ========== COIN SYSTEM ==========
  function updateCoinDisplay() {
    if (coinDisplay) coinDisplay.textContent = closetState.coins.toLocaleString();
  }

  function buyItem(item) {
    if (closetState.ownedItems.includes(item.id)) {
      alert("You already own this item!");
      return;
    }
    if (closetState.coins < item.coins) {
      alert(`Not enough coins! Need ${item.coins}, have ${closetState.coins}.`);
      return;
    }
    if (confirm(`Buy "${item.name}" for ${item.coins} coins?`)) {
      closetState.coins -= item.coins;
      closetState.ownedItems.push(item.id);
      saveCloset();
      updateCoinDisplay();
      renderItems();
      alert(`✅ Purchased "${item.name}"!`);
    }
  }

  // ========== AVATAR DISPLAY ==========
  function updateBaseImage() {
    if (baseImg) {
      baseImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
    }
    document.body.dataset.gender = closetState.gender;
    document.body.dataset.skin = closetState.skin;
  }

  function buildSkinButtons() {
    if (!skinToneButtons) return;
    skinToneButtons.innerHTML = "";
    
    const skins = [
      { key: "light", label: "☀️ Light" },
      { key: "dark", label: "🌙 Dark" }
    ];

    skins.forEach(s => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seg-btn" + (closetState.skin === s.key ? " active" : "");
      btn.textContent = s.label;
      btn.dataset.skin = s.key;
      
      btn.addEventListener("click", () => {
        closetState.skin = s.key;
        $$(".seg-btn[data-skin]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateBaseImage();
        renderAvatarOverlays();
        saveCloset();
      });
      
      skinToneButtons.appendChild(btn);
    });
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

      // Handle dual items
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

  // ========== EQUIP ==========
  function toggleEquip(item) {
    if (closetState.equipped[item.slot] === item.id) {
      closetState.equipped[item.slot] = null;
    } else {
      closetState.equipped[item.slot] = item.id;
    }
    saveCloset();
    renderItems();
    renderAvatarOverlays();
  }

  // ========== RENDER ITEMS ==========
  function renderItems() {
    const items = getItems();
    const filtered = filterByGender(items);
    const owned = filtered.filter(it => closetState.ownedItems.includes(it.id));
    const shop = filtered.filter(it => !closetState.ownedItems.includes(it.id));

    if (ownedSection) {
      ownedSection.style.display = owned.length > 0 ? "block" : "none";
      if (ownedCount) ownedCount.textContent = `${owned.length} items`;
    }
    if (shopCount) shopCount.textContent = `${shop.length} items`;

    if (ownedItemsGrid) {
      ownedItemsGrid.innerHTML = "";
      owned.forEach(item => ownedItemsGrid.appendChild(createItemCard(item, true)));
    }

    if (shopItemsGrid) {
      shopItemsGrid.innerHTML = "";
      shop.forEach(item => shopItemsGrid.appendChild(createItemCard(item, false)));
    }
  }

  function createItemCard(item, isOwned) {
    const div = document.createElement("div");
    div.className = "mini-item" + (isOwned ? "" : " locked");
    
    const isActive = closetState.equipped[item.slot] === item.id;
    if (isActive) div.classList.add("active");

    const badge = isActive ? '<div class="badge-mini badge-active">ON</div>' :
                  isOwned ? '<div class="badge-mini badge-owned">OWNED</div>' : '';

    div.innerHTML = `
      <div class="mini-item-img">
        <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
        ${badge}
      </div>
      <div class="mini-item-name">${item.name}</div>
      ${isOwned ? '' : `<div class="item-price-mini">${item.coins} 💰</div><button class="btn-buy-mini">Buy</button>`}
    `;

    if (isOwned) {
      div.addEventListener("click", () => toggleEquip(item));
    } else {
      const buyBtn = div.querySelector(".btn-buy-mini");
      if (buyBtn) {
        buyBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          buyItem(item);
        });
      }
    }

    return div;
  }

  // ========== GENDER CONTROLS ==========
  function setupGenderControls() {
    $$("[data-gender]").forEach(btn => {
      btn.addEventListener("click", function() {
        $$("[data-gender]").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        closetState.gender = this.dataset.gender;
        updateBaseImage();
        renderItems();
        renderAvatarOverlays();
        saveCloset();
      });
    });
  }

  // ========== CHAT ==========
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
    if (msg.includes("closet")) return "Use Closet to preview items! Click items in 'Your Collection' to dress me.";
    if (msg.includes("buy") || msg.includes("coin")) return "Buy items from Shop with coins. Click 'Buy More' if needed!";
    if (msg.includes("outfit") || msg.includes("dress")) return "Click items in 'Your Collection' to equip/unequip! 👗";
    if (msg.includes("move") || msg.includes("drag")) return "You can drag me anywhere! Use zoom buttons to resize me.";
    if (msg.includes("help")) return chatState.mode === "pro" ? "Tell me what you're building." : "Tell me what you want to do 💜";
    return chatState.mode === "pro" ? "Got it. What's the exact problem?" : "Okayyy 😄 tell me more!";
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

  // ========== OWNER MODE ==========
  function enableOwnerMode() {
    isOwner = true;
    closetState.coins = 999999;
    closetState.ownedItems = getItems().map(it => it.id);
    if (ownerBadge) ownerBadge.style.display = "inline-flex";
    saveCloset();
    updateCoinDisplay();
    renderItems();
    console.log("👑 Owner mode!");
  }

  // ========== INIT ==========
  function init() {
    console.log("🎬 Carrie Chat initializing...");

    loadChat();
    loadCloset();

    updateBaseImage();
    buildSkinButtons();
    setupGenderControls();
    setupDragging();
    setupZoom();
    updateAvatarTransform();
    updateCoinDisplay();
    renderItems();
    renderAvatarOverlays();
    renderChat();

    if (chatState.messages.length === 0) {
      addMsg("assistant", "Hi! 👋 I'm Carrie. Drag me anywhere, zoom me, dress me up, or just chat! 💜");
    }

    setMode(chatState.mode || "pro");

    if (sendBtn) sendBtn.addEventListener("click", send);
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        chatState.messages = [];
        saveChat();
        renderChat();
        addMsg("assistant", "Chat cleared ✅");
      });
    }
    if (modePro) modePro.addEventListener("click", () => setMode("pro"));
    if (modeFun) modeFun.addEventListener("click", () => setMode("fun"));
    if (btnBuyCoins) {
      btnBuyCoins.addEventListener("click", () => {
        const amount = prompt("Add coins:", "1000");
        if (amount && !isNaN(amount)) {
          closetState.coins += parseInt(amount);
          saveCloset();
          updateCoinDisplay();
          alert(`✅ Added ${amount} coins!`);
        }
      });
    }

    enableOwnerMode(); // Auto-enable for testing
    console.log("✅ Ready!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

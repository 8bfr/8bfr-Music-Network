// carrie-chat.js — Enhanced with closet integration
// Manages chat, avatar display, and item purchasing/equipping
// Works with carrie-chat-data.js for items
// DOES NOT modify carrie-closet files

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
  const carrieBubble = $("#carrieBubble");
  const carrieAvatar = $("#carrieAvatar");

  // Closet DOM refs
  const closetBaseImg = $("#closetBaseImg");
  const overlayHost = $("#closetOverlayHost");
  const skinToneButtons = $("#skinToneButtons");
  const coinDisplay = $("#coinDisplay");
  const ownedSection = $("#ownedSection");
  const ownedItemsGrid = $("#ownedItemsGrid");
  const shopItemsGrid = $("#shopItemsGrid");
  const ownedCount = $("#ownedCount");
  const shopCount = $("#shopCount");
  const btnBuyCoins = $("#btnBuyCoins");
  const ownerBadge = $("#ownerBadge");
  const ownerControls = $("#ownerControls");

  // Storage keys
  const CHAT_KEY = "carrieChatState_v1";
  const CLOSET_KEY = "carrieClosetState_v1";

  // Chat state
  const chatState = {
    mode: "pro", // "pro" | "fun"
    messages: []
  };

  // Closet state
  const closetState = {
    gender: "female",
    skin: "light",
    coins: 0,
    ownedItems: [],
    equipped: {}
  };

  // Z-index by slot (from closet)
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

  // ========== STORAGE ==========
  function saveChat() {
    try { 
      localStorage.setItem(CHAT_KEY, JSON.stringify(chatState)); 
    } catch(e) {
      console.warn("Could not save chat:", e);
    }
  }

  function loadChat() {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      if (data.mode) chatState.mode = data.mode;
      if (Array.isArray(data.messages)) chatState.messages = data.messages;
    } catch (e) {
      console.warn("Could not load chat:", e);
    }
  }

  function saveCloset() {
    try {
      localStorage.setItem(CLOSET_KEY, JSON.stringify(closetState));
    } catch(e) {
      console.warn("Could not save closet:", e);
    }
  }

  function loadCloset() {
    try {
      const raw = localStorage.getItem(CLOSET_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      if (data.gender) closetState.gender = data.gender;
      if (data.skin) closetState.skin = data.skin;
      if (typeof data.coins === "number") closetState.coins = data.coins;
      if (Array.isArray(data.ownedItems)) closetState.ownedItems = data.ownedItems;
      if (data.equipped) closetState.equipped = data.equipped;
    } catch (e) {
      console.warn("Could not load closet:", e);
    }
  }

  // ========== ITEMS ==========
  function getItems() {
    return window.CARRIE_CHAT_ITEMS || [];
  }

  function filterByGender(items) {
    return items.filter(it => 
      it.gender === "unisex" || it.gender === closetState.gender
    );
  }

  // ========== COIN SYSTEM ==========
  function updateCoinDisplay() {
    if (coinDisplay) {
      coinDisplay.textContent = closetState.coins.toLocaleString();
    }
  }

  function addCoins(amount) {
    closetState.coins += amount;
    saveCloset();
    updateCoinDisplay();
  }

  function buyItem(item) {
    if (closetState.ownedItems.includes(item.id)) {
      alert("You already own this item!");
      return;
    }

    if (closetState.coins < item.coins) {
      alert(`Not enough coins! You need ${item.coins} coins but only have ${closetState.coins}.`);
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
    if (closetBaseImg) {
      closetBaseImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
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

      // Handle dual items (eyes, ears, shoes)
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
        // Single item
        const overlay = document.createElement("img");
        overlay.src = item.img;
        overlay.className = `layer-overlay item-${item.id}`;
        overlay.style.zIndex = zBySlot[slot] || 20;
        overlayHost.appendChild(overlay);
      }
    });
  }

  // ========== EQUIP/UNEQUIP ==========
  function toggleEquip(item) {
    if (closetState.equipped[item.slot] === item.id) {
      // Unequip
      closetState.equipped[item.slot] = null;
    } else {
      // Equip
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

    // Separate owned and shop items
    const owned = filtered.filter(it => closetState.ownedItems.includes(it.id));
    const shop = filtered.filter(it => !closetState.ownedItems.includes(it.id));

    // Show/hide owned section
    if (ownedSection) {
      if (owned.length > 0) {
        ownedSection.style.display = "block";
        if (ownedCount) ownedCount.textContent = `${owned.length} items`;
      } else {
        ownedSection.style.display = "none";
      }
    }

    if (shopCount) shopCount.textContent = `${shop.length} items`;

    // Render owned items
    if (ownedItemsGrid) {
      ownedItemsGrid.innerHTML = "";
      owned.forEach(item => {
        const card = createItemCard(item, true);
        ownedItemsGrid.appendChild(card);
      });
    }

    // Render shop items
    if (shopItemsGrid) {
      shopItemsGrid.innerHTML = "";
      shop.forEach(item => {
        const card = createItemCard(item, false);
        shopItemsGrid.appendChild(card);
      });
    }
  }

  function createItemCard(item, isOwned) {
    const div = document.createElement("div");
    div.className = "mini-item" + (isOwned ? "" : " locked");
    
    const isActive = closetState.equipped[item.slot] === item.id;
    if (isActive) div.classList.add("active");

    const badge = isActive ? 
      '<div class="badge-mini badge-active">ON</div>' :
      isOwned ? '<div class="badge-mini badge-owned">OWNED</div>' : '';

    const priceHTML = isOwned ? '' : `<div class="item-price-mini">${item.coins} 💰</div>`;
    const buttonHTML = isOwned ? '' : `<button class="btn-buy-mini">Buy</button>`;

    div.innerHTML = `
      <div class="mini-item-img">
        <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
        ${badge}
      </div>
      <div class="mini-item-name">${item.name}</div>
      ${priceHTML}
      ${buttonHTML}
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

  // ========== CHAT FUNCTIONS ==========
  function setMode(mode) {
    chatState.mode = mode;

    if (modePro) modePro.classList.toggle("active", mode === "pro");
    if (modeFun) modeFun.classList.toggle("active", mode === "fun");
    if (modeLabel) modeLabel.textContent = (mode === "pro") ? "Professional" : "Personal";

    // Swap avatar if you have both files
    if (carrieAvatar) {
      if (mode === "pro") {
        carrieAvatar.src = "assets/images/Carrie_Business.png";
      } else {
        carrieAvatar.src = "assets/images/Carrie_Casual.png";
      }
    }

    if (carrieBubble) {
      if (mode === "pro") {
        carrieBubble.textContent = "Professional mode: I can help with music + tools.";
      } else {
        carrieBubble.textContent = "Personal mode: I'm here for vibes + fun too 💜";
      }
    }

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

    if (!msg) return "Say something and I'll respond 🙂";

    if (msg.includes("closet")) {
      return "Use the Closet to preview items before buying! Click items in 'Your Collection' to dress me up.";
    }
    
    if (msg.includes("buy") || msg.includes("purchase") || msg.includes("coin")) {
      return "You can buy items from the Shop section with coins. Click 'Buy More Coins' if you need more!";
    }

    if (msg.includes("outfit") || msg.includes("dress") || msg.includes("clothes")) {
      return "Click any item in 'Your Collection' to equip or unequip it. My avatar updates instantly! 👗";
    }

    if (msg.includes("spotify")) {
      return "8BFR is on Spotify — you can link it on your featured section anytime.";
    }
    
    if (msg.includes("help") || msg.includes("how")) {
      return (chatState.mode === "pro")
        ? "Tell me what you're building (song, beat, page, or feature) and I'll guide you step-by-step."
        : "Tell me what you want to do and I'll hype you up and help you get it done 💜";
    }

    return (chatState.mode === "pro")
      ? "Got it. Describe the exact problem and paste the snippet you want to change."
      : "Okayyy 😄 tell me more — what are we making today?";
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

    setTimeout(() => {
      addMsg("assistant", replyFor(text));
    }, 150);
  }

  // ========== OWNER MODE ==========
  function enableOwnerMode() {
    isOwner = true;
    closetState.coins = 999999;
    
    // Unlock all items
    const items = getItems();
    closetState.ownedItems = items.map(it => it.id);
    
    if (ownerBadge) ownerBadge.style.display = "inline-flex";
    if (ownerControls) ownerControls.style.display = "flex";
    
    saveCloset();
    updateCoinDisplay();
    renderItems();
    
    console.log("👑 Owner mode enabled!");
  }

  // ========== INIT ==========
  function init() {
    console.log("🎬 Carrie Chat + Closet initializing...");

    // Load saved state
    loadChat();
    loadCloset();

    // Setup UI
    updateBaseImage();
    buildSkinButtons();
    setupGenderControls();
    updateCoinDisplay();
    renderItems();
    renderAvatarOverlays();
    renderChat();

    // Default greeting if empty
    if (chatState.messages.length === 0) {
      addMsg("assistant", "Hi! 👋 I'm Carrie. Click items to dress me up, or just chat with me! 💜");
    }

    setMode(chatState.mode || "pro");

    // Chat event listeners
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

    // Buy coins button
    if (btnBuyCoins) {
      btnBuyCoins.addEventListener("click", () => {
        const amount = prompt("How many coins to add?", "1000");
        if (amount && !isNaN(amount)) {
          addCoins(parseInt(amount));
          alert(`✅ Added ${amount} coins!`);
        }
      });
    }

    // Auto-enable owner mode for testing
    // Comment this out in production
    enableOwnerMode();

    console.log("✅ Carrie Chat ready!");
  }

  // Boot on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

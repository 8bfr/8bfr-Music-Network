// carrie-chat.js — RESTORED AUTO-GREET + WORKING MODE SWITCHES

(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // Chat/Closet DOM refs
  const chatLog = $("#chatLog");
  const carrieInput = $("#carrieInput");
  const carrieForm = $("#carrieForm");
  const typingRow = $("#typingRow");
  const statusText = $("#statusText");
  const modeProBtn = $("#modePro");
  const modeCasualBtn = $("#modeCasual");
  const modeBFGFBtn = $("#modeBFGF");
  const ownerControls = $("#ownerControls");
  const coinBalance = $("#coinBalance");

  // Avatar refs
  const closetBaseImg = $("#closetBaseImg");
  const closetOverlayHost = $("#closetOverlayHost");

  // Gender/skin controls
  const genderFemale = $("#genderFemale");
  const genderMale = $("#genderMale");
  const skinLight = $("#skinLight");
  const skinDark = $("#skinDark");

  const CHAT_KEY = "carrieChatState_v1";
  const AVATAR_KEY = "carrieAvatarPos_v1";
  const OWNERSHIP_KEY = "carrieOwnedItems_v1";
  const COINS_KEY = "carrieCoins_v1";
  const USER_EMAIL_KEY = "carrieUserEmail_v1";
  const USER_PASSWORD_KEY = "carrieUserPassword_v1";
  
  const OWNER_EMAIL = "8bfr.music@gmail.com";
  const OWNER_PASSWORD = "197594773839*Ab4444";

  const chatState = { mode: "casual", messages: [] };
  
  let currentGender = localStorage.getItem('closet_gender') || "female";
  let currentSkin = localStorage.getItem('closet_skin') || "light";
  const closetState = { 
    gender: currentGender, 
    skin: currentSkin, 
    coins: 0,
    ownedItems: [],
    equipped: {} 
  };
  const avatarState = { x: 100, y: 100, zoom: 0.6 };

  // Z-index by slot
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

  // OWNER CHECK
  function isOwner() {
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    const userPassword = localStorage.getItem(USER_PASSWORD_KEY);
    return userEmail === OWNER_EMAIL && userPassword === OWNER_PASSWORD;
  }

  // LOGIN CHECK
  function checkLogin() {
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    const userPassword = localStorage.getItem(USER_PASSWORD_KEY);
    
    if (!userEmail || !userPassword) {
      showLoginModal();
      return false;
    }
    return true;
  }

  // LOGIN MODAL
  function showLoginModal() {
    const modal = document.createElement("div");
    modal.id = "loginModal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        max-width: 400px;
        width: 90%;
      ">
        <h2 style="color: white; margin: 0 0 20px 0; text-align: center; font-size: 28px;">
          Welcome to Carrie Chat
        </h2>
        <p style="color: rgba(255,255,255,0.9); margin: 0 0 30px 0; text-align: center;">
          Please sign in to continue
        </p>
        
        <div style="margin-bottom: 20px;">
          <label style="color: white; display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
          <input 
            type="email" 
            id="loginEmail" 
            placeholder="Enter your email"
            style="
              width: 100%;
              padding: 12px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              box-sizing: border-box;
            "
          />
        </div>
        
        <div style="margin-bottom: 30px;">
          <label style="color: white; display: block; margin-bottom: 8px; font-weight: 500;">Password</label>
          <input 
            type="password" 
            id="loginPassword" 
            placeholder="Enter your password"
            style="
              width: 100%;
              padding: 12px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              box-sizing: border-box;
            "
          />
        </div>
        
        <button 
          id="loginSubmit"
          style="
            width: 100%;
            padding: 14px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          "
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        >
          Sign In
        </button>
        
        <p id="loginError" style="
          color: #ff6b6b;
          margin: 15px 0 0 0;
          text-align: center;
          font-weight: 500;
          display: none;
        "></p>
      </div>
    `;

    document.body.appendChild(modal);

    const emailInput = modal.querySelector("#loginEmail");
    const passwordInput = modal.querySelector("#loginPassword");
    const submitBtn = modal.querySelector("#loginSubmit");
    const errorMsg = modal.querySelector("#loginError");

    function attemptLogin() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        errorMsg.textContent = "Please enter both email and password";
        errorMsg.style.display = "block";
        return;
      }

      localStorage.setItem(USER_EMAIL_KEY, email);
      localStorage.setItem(USER_PASSWORD_KEY, password);

      if (isOwner()) {
        console.log("🔓 Owner logged in!");
        autoUnlockAllItems();
      } else {
        console.log("👤 Regular user logged in");
      }

      document.body.removeChild(modal);
      location.reload();
    }

    submitBtn.addEventListener("click", attemptLogin);
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") attemptLogin();
    });
  }

  // AUTO-UNLOCK
  function autoUnlockAllItems() {
    if (!isOwner()) return;
    
    const allItems = getItems();
    closetState.ownedItems = allItems.map(item => item.id);
    closetState.coins = 999999;
    saveOwnedItems();
    saveCoins();
    console.log("🔓 OWNER AUTO-UNLOCK:", closetState.ownedItems.length, "items");
  }

  // OWNERSHIP CHECK
  function isItemOwned(itemId) {
    if (isOwner()) return true;
    return closetState.ownedItems.includes(itemId);
  }

  function saveOwnedItems() {
    try {
      localStorage.setItem(OWNERSHIP_KEY, JSON.stringify(closetState.ownedItems));
    } catch(e) {}
  }

  function loadOwnedItems() {
    try {
      const raw = localStorage.getItem(OWNERSHIP_KEY);
      if (raw) closetState.ownedItems = JSON.parse(raw);
    } catch(e) {}
  }

  function saveCoins() {
    try {
      localStorage.setItem(COINS_KEY, closetState.coins.toString());
    } catch(e) {}
  }

  function loadCoins() {
    try {
      const raw = localStorage.getItem(COINS_KEY);
      if (raw) closetState.coins = parseInt(raw, 10);
    } catch(e) {}
  }

  // SAVE / LOAD
  function saveChat() {
    try { localStorage.setItem(CHAT_KEY, JSON.stringify(chatState)); } catch(e) {}
  }
  
  function loadChat() {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) Object.assign(chatState, JSON.parse(raw));
    } catch (e) {}
  }
  
  function saveCloset() {
    try { 
      localStorage.setItem('closet_gender', closetState.gender);
      localStorage.setItem('closet_skin', closetState.skin);
      
      const saveData = {};
      Object.keys(closetState.equipped).forEach(slot => {
        const item = closetState.equipped[slot];
        if (item && isItemOwned(item.id)) {
          saveData[slot] = item.id;
        }
      });
      localStorage.setItem(`closet_equipped_${closetState.gender}`, JSON.stringify(saveData));
    } catch(e) {}
  }
  
  function loadCloset() {
    try {
      const savedGender = localStorage.getItem('closet_gender');
      const savedSkin = localStorage.getItem('closet_skin');
      
      if (savedGender) closetState.gender = savedGender;
      if (savedSkin) closetState.skin = savedSkin;
      
      const saved = localStorage.getItem(`closet_equipped_${closetState.gender}`);
      if (saved) {
        const saveData = JSON.parse(saved);
        const items = getItems();
        
        closetState.equipped = {};
        Object.keys(saveData).forEach(slot => {
          const itemId = saveData[slot];
          const itemObj = items.find(it => it.id === itemId);
          
          if (itemObj && isItemOwned(itemId)) {
            closetState.equipped[slot] = itemObj;
          }
        });
      }
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

  function getItems() { return window.CARRIE_CLOSET_ITEMS || []; }

  // AVATAR DISPLAY - USING WORKING CLOSET LOGIC
  function setBaseImage() {
    if (closetBaseImg) {
      closetBaseImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
    }
  }

  function clearOverlays() {
    if (!closetOverlayHost) return;
    closetOverlayHost.innerHTML = "";
  }

  function addOverlay(itemObj) {
    if (!closetOverlayHost || !itemObj) return;
    if (!isItemOwned(itemObj.id)) return;
    
    const slot = itemObj.slot;

    if (slot === "eyes") {
      const left = document.createElement("img");
      left.src = itemObj.imgLeft || itemObj.img;
      left.className = `layer-overlay layer-left item-${itemObj.id}`;
      left.style.zIndex = zBySlot.eyes;

      const right = document.createElement("img");
      right.src = itemObj.imgRight || itemObj.img;
      right.className = `layer-overlay layer-right item-${itemObj.id}`;
      right.style.zIndex = zBySlot.eyes;

      closetOverlayHost.appendChild(left);
      closetOverlayHost.appendChild(right);
      return;
    }

    if (slot === "ears") {
      const left = document.createElement("img");
      left.src = itemObj.imgLeft || itemObj.img;
      left.className = `layer-overlay layer-left item-${itemObj.id}`;
      left.style.zIndex = zBySlot.ears;

      const right = document.createElement("img");
      right.src = itemObj.imgRight || itemObj.img;
      right.className = `layer-overlay layer-right item-${itemObj.id}`;
      right.style.zIndex = zBySlot.ears;

      closetOverlayHost.appendChild(left);
      closetOverlayHost.appendChild(right);
      return;
    }

    if (slot === "shoes") {
      const left = document.createElement("img");
      left.src = itemObj.imgLeft || itemObj.img;
      left.className = `layer-overlay layer-shoes-left item-${itemObj.id}`;
      left.style.zIndex = zBySlot.shoes;

      const right = document.createElement("img");
      right.src = itemObj.imgRight || itemObj.img;
      right.className = `layer-overlay layer-shoes-right item-${itemObj.id}`;
      right.style.zIndex = zBySlot.shoes;

      closetOverlayHost.appendChild(left);
      closetOverlayHost.appendChild(right);
      return;
    }

    const img = document.createElement("img");
    if (closetState.skin === "dark" && itemObj.imgDark) {
      img.src = itemObj.imgDark;
    } else {
      img.src = itemObj.img;
    }
    img.className = `layer-overlay item-${itemObj.id}`;
    img.style.zIndex = zBySlot[slot] || 20;
    closetOverlayHost.appendChild(img);
  }

  function renderOverlays() {
    clearOverlays();
    if (!closetState.equipped) return;
    
    Object.keys(closetState.equipped).forEach(slot => {
      const itemObj = closetState.equipped[slot];
      if (itemObj) addOverlay(itemObj);
    });
  }

  function updateAvatarDisplay() {
    const body = document.body;
    body.dataset.gender = closetState.gender;
    body.dataset.skin = closetState.skin;
    setBaseImage();
    renderOverlays();
  }

  function updateCoinDisplay() {
    const coins = closetState.coins.toLocaleString();
    if (coinBalance) coinBalance.textContent = coins;
    
    const headerBalance = document.getElementById("coinBalanceHeader");
    if (headerBalance) headerBalance.textContent = coins;
  }

  // OWNED ITEMS RENDERING
  let currentCategory = "all";
  
  function filterByCategory(items) {
    if (currentCategory === "all") return items;
    
    const categoryToSlot = {
      "hair": "hair",
      "top": "top",
      "bottom": "bottom",
      "jewelry": ["necklace", "ears", "belly"],
      "eyes": "eyes",
      "shoes": "shoes"
    };
    
    const slots = categoryToSlot[currentCategory];
    if (Array.isArray(slots)) {
      return items.filter(it => slots.includes(it.slot));
    }
    return items.filter(it => it.slot === slots);
  }
  
  function renderOwnedItems() {
    const ownedItemsGrid = $("#ownedItemsGrid");
    if (!ownedItemsGrid) return;
    
    ownedItemsGrid.innerHTML = "";
    
    const items = getItems();
    const filtered = items.filter(it => 
      (it.gender === "unisex" || it.gender === closetState.gender) &&
      closetState.ownedItems.includes(it.id)
    );
    
    const categoryFiltered = filterByCategory(filtered);
    
    if (categoryFiltered.length === 0) {
      ownedItemsGrid.innerHTML = '<div style="padding:1rem; text-align:center; color:#a855f7; font-size:0.85rem;">No owned items in this category</div>';
      return;
    }
    
    categoryFiltered.forEach(item => {
      const div = document.createElement("div");
      div.className = "mini-item";
      
      const isEquipped = closetState.equipped[item.slot] && closetState.equipped[item.slot].id === item.id;
      if (isEquipped) div.classList.add("active");
      
      const badge = isEquipped ?
        '<div class="item-badge badge-active">ACTIVE</div>' :
        '<div class="item-badge badge-owned">OWNED</div>';
      
      div.innerHTML = `
        <div class="mini-item-img">
          <img src="${item.img}" alt="${item.name}">
          ${badge}
        </div>
        <div class="mini-item-name">${item.name}</div>
      `;
      
      div.addEventListener("click", () => {
        if (closetState.equipped[item.slot] && closetState.equipped[item.slot].id === item.id) {
          closetState.equipped[item.slot] = null;
        } else {
          closetState.equipped[item.slot] = item;
        }
        saveCloset();
        updateAvatarDisplay();
        renderOwnedItems();
        renderShopItems();
      });
      
      ownedItemsGrid.appendChild(div);
    });
  }
  
  function renderShopItems() {
    const shopItemsGrid = $("#shopItemsGrid");
    if (!shopItemsGrid) return;
    
    shopItemsGrid.innerHTML = "";
    
    const items = getItems();
    const filtered = items.filter(it => 
      (it.gender === "unisex" || it.gender === closetState.gender) &&
      !closetState.ownedItems.includes(it.id)
    );
    
    const categoryFiltered = filterByCategory(filtered);
    
    if (categoryFiltered.length === 0) {
      shopItemsGrid.innerHTML = '<div style="padding:1rem; text-align:center; color:#a855f7; font-size:0.85rem;">All items purchased!</div>';
      return;
    }
    
    categoryFiltered.forEach(item => {
      const div = document.createElement("div");
      div.className = "mini-item shop-item";
      
      const canAfford = closetState.coins >= item.coins;
      if (!canAfford) div.classList.add("cant-afford");
      
      div.innerHTML = `
        <div class="mini-item-img">
          <img src="${item.img}" alt="${item.name}">
          <div class="item-badge badge-price">${item.coins} <img src="assets/images/icon_8bfr_coin.png" class="coin-icon" alt="coin"></div>
        </div>
        <div class="mini-item-name">${item.name}</div>
      `;
      
      div.addEventListener("click", () => {
        if (!canAfford) {
          alert("Not enough coins!");
          return;
        }
        
        if (confirm(`Purchase ${item.name} for ${item.coins} coins?`)) {
          closetState.coins -= item.coins;
          closetState.ownedItems.push(item.id);
          saveCloset();
          saveCoins();
          saveOwnedItems();
          updateCoinDisplay();
          renderOwnedItems();
          renderShopItems();
        }
      });
      
      shopItemsGrid.appendChild(div);
    });
  }
  
  function setupCategoryTabs() {
    const tabs = document.querySelectorAll('[data-cat]');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.cat;
        renderOwnedItems();
        renderShopItems();
      });
    });
  }

  // GENDER/SKIN CONTROLS - USING WORKING CLOSET LOGIC
  function setupGenderSkinControls() {
    console.log("🎮 Setting up gender/skin controls...");
    
    // Gender buttons
    const genderButtons = [genderFemale, genderMale].filter(Boolean);
    genderButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active from all gender buttons
        genderButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Set new gender
        const newGender = btn.dataset.gender || (btn.id === "genderMale" ? "male" : "female");
        console.log(`🔄 Switching to ${newGender}`);
        
        closetState.gender = newGender;
        localStorage.setItem('closet_gender', newGender);
        document.body.dataset.gender = newGender;
        
        // Load equipped items for this gender
        loadCloset();
        
        // Update display
        setBaseImage();
        renderOverlays();
        renderOwnedItems();
        renderShopItems();
        
        console.log(`✅ Switched to ${newGender}`);
      });
    });
    
    // Skin buttons
    if (skinLight) {
      skinLight.addEventListener("click", () => {
        [skinLight, skinDark].forEach(b => b && b.classList.remove("active"));
        skinLight.classList.add("active");
        closetState.skin = "light";
        localStorage.setItem('closet_skin', "light");
        document.body.dataset.skin = "light";
        setBaseImage();
        renderOverlays();
      });
    }
    if (skinDark) {
      skinDark.addEventListener("click", () => {
        [skinLight, skinDark].forEach(b => b && b.classList.remove("active"));
        skinDark.classList.add("active");
        closetState.skin = "dark";
        localStorage.setItem('closet_skin', "dark");
        document.body.dataset.skin = "dark";
        setBaseImage();
        renderOverlays();
      });
    }
  }

  function setBaseImage() {
    if (closetBaseImg) {
      closetBaseImg.src = `assets/images/base/${closetState.gender}/base_${closetState.gender}_${closetState.skin}.png?v=15`;
    }
  }

  function updateGenderSkinButtons() {
    [genderFemale, genderMale, skinLight, skinDark].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });
    if (closetState.gender === "female" && genderFemale) genderFemale.classList.add("active");
    if (closetState.gender === "male" && genderMale) genderMale.classList.add("active");
    if (closetState.skin === "light" && skinLight) skinLight.classList.add("active");
    if (closetState.skin === "dark" && skinDark) skinDark.classList.add("active");
  }

  // ===== MODE SWITCHING WITH AUTO-GREET (RESTORED FROM OLD VERSION) =====
  
  function getModeGreeting() {
    if (chatState.mode === "pro") {
      return "I'm in <b>Pro Mode</b> ⚡ — Ask me anything about 8BFR Music Network or get help with your projects!";
    } else if (chatState.mode === "casual") {
      return "I'm in <b>Casual Mode</b> 😎 — Just here to chat and hang out! What's on your mind?";
    } else if (chatState.mode === "bfgf") {
      return "Hey babe 💜 I'm in <b>BF/GF Mode</b> now. I'm all yours! Tell me about your day. 😊";
    }
    return "Hey! 💜 How can I help you today?";
  }

  function switchMode(newMode) {
    chatState.mode = newMode;
    saveChat();
    updateModeButtons();
    
    // AUTO-GREET: Send greeting when mode switches
    const greeting = getModeGreeting();
    addMessage("assistant", greeting);
  }

  function updateModeButtons() {
    [modeProBtn, modeCasualBtn, modeBFGFBtn].forEach(b => {
      if (b) b.classList.remove("active");
    });
    if (chatState.mode === "pro" && modeProBtn) modeProBtn.classList.add("active");
    if (chatState.mode === "casual" && modeCasualBtn) modeCasualBtn.classList.add("active");
    if (chatState.mode === "bfgf" && modeBFGFBtn) modeBFGFBtn.classList.add("active");

    if (ownerControls) {
      ownerControls.style.display = chatState.mode === "bfgf" ? "block" : "none";
    }
  }

  function setupModeButtons() {
    console.log("🎛️ Setting up mode buttons...");
    
    if (modeProBtn) {
      modeProBtn.addEventListener("click", () => {
        console.log("⚡ Pro mode clicked");
        switchMode("pro");
      });
    }
    if (modeCasualBtn) {
      modeCasualBtn.addEventListener("click", () => {
        console.log("😎 Casual mode clicked");
        switchMode("casual");
      });
    }
    if (modeBFGFBtn) {
      modeBFGFBtn.addEventListener("click", () => {
        console.log("💕 BF/GF mode clicked");
        switchMode("bfgf");
      });
    }
  }

  // ===== MESSAGE LOGGING FOR ADMIN MONITORING =====
  
  function logMessageToAdmin(role, text) {
    // Don't log if anonymous mode is enabled (owner only feature)
    const isAnonymous = localStorage.getItem("anonymousMode") === "true";
    if (isAnonymous && isOwner()) {
      console.log("👻 Anonymous mode: Not logging this message");
      return;
    }
    
    // Get current user email
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    if (!userEmail) return;
    
    // Get or create chat log for this user
    const logKey = `carrieChat_${userEmail}`;
    let chatLog = { messages: [], mode: chatState.mode, lastActive: Date.now() };
    
    try {
      const existing = localStorage.getItem(logKey);
      if (existing) {
        chatLog = JSON.parse(existing);
      }
    } catch(e) {}
    
    // Add message
    chatLog.messages.push({
      role: role,
      text: text,
      timestamp: Date.now(),
      mode: chatState.mode
    });
    
    // Update mode and last active
    chatLog.mode = chatState.mode;
    chatLog.lastActive = Date.now();
    
    // Save back
    try {
      localStorage.setItem(logKey, JSON.stringify(chatLog));
      console.log("📝 Logged message for admin monitoring");
    } catch(e) {
      console.error("Failed to log message:", e);
    }
  }
  
  // ===== CHAT LOGIC =====
  
  let isSelectMode = false;
  let selectedMessages = new Set();
  
  function addMessage(role, text, messageId = null) {
    if (!chatLog) return;
    
    const id = messageId || `msg_${Date.now()}_${Math.random()}`;
    const msg = document.createElement("div");
    msg.className = role === "user" ? "chat-msg-user" : "chat-msg-assistant";
    msg.dataset.messageId = id;
    
    // Add checkbox for selection mode (regular users only)
    if (!isOwner() && isSelectMode) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "msg-checkbox";
      checkbox.style.cssText = "margin-right:0.5rem; cursor:pointer;";
      checkbox.addEventListener("change", function() {
        if (this.checked) {
          selectedMessages.add(id);
        } else {
          selectedMessages.delete(id);
        }
        updateSelectionCount();
      });
      msg.appendChild(checkbox);
    }
    
    const textSpan = document.createElement("span");
    textSpan.innerHTML = text; // Use innerHTML to support HTML like <b>
    msg.appendChild(textSpan);
    
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
    
    // LOG MESSAGE FOR ADMIN MONITORING
    logMessageToAdmin(role, text);
    
    return id;
  }
  
  function updateSelectionCount() {
    const countEl = document.getElementById("selectedCount");
    if (countEl) countEl.textContent = selectedMessages.size;
  }
  
  function enterSelectMode() {
    console.log("☑️ ENTERING SELECT MODE");
    isSelectMode = true;
    selectedMessages.clear();
    
    const toolbar = document.getElementById("selectionToolbar");
    if (toolbar) toolbar.style.display = "flex";
    
    const messages = chatLog.querySelectorAll(".chat-msg-user, .chat-msg-assistant");
    messages.forEach(msg => {
      if (!msg.querySelector(".msg-checkbox")) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "msg-checkbox";
        checkbox.style.cssText = "margin-right:0.5rem; cursor:pointer;";
        checkbox.addEventListener("change", function() {
          const id = msg.dataset.messageId;
          if (this.checked) {
            selectedMessages.add(id);
          } else {
            selectedMessages.delete(id);
          }
          updateSelectionCount();
        });
        msg.insertBefore(checkbox, msg.firstChild);
      }
    });
    
    updateSelectionCount();
  }
  
  function exitSelectMode() {
    console.log("❌ EXITING SELECT MODE");
    isSelectMode = false;
    selectedMessages.clear();
    
    const toolbar = document.getElementById("selectionToolbar");
    if (toolbar) toolbar.style.display = "none";
    
    const checkboxes = chatLog.querySelectorAll(".msg-checkbox");
    checkboxes.forEach(cb => cb.remove());
  }
  
  function deleteSelectedMessages() {
    if (selectedMessages.size === 0) {
      alert("No messages selected");
      return;
    }
    
    if (!confirm(`Delete ${selectedMessages.size} message(s) permanently?`)) {
      return;
    }
    
    selectedMessages.forEach(id => {
      const msg = chatLog.querySelector(`[data-message-id="${id}"]`);
      if (msg) msg.remove();
    });
    
    exitSelectMode();
  }
  
  function archiveSelectedMessages() {
    if (selectedMessages.size === 0) {
      alert("No messages selected");
      return;
    }
    
    if (!confirm(`Archive ${selectedMessages.size} message(s)?`)) {
      return;
    }
    
    selectedMessages.forEach(id => {
      const msg = chatLog.querySelector(`[data-message-id="${id}"]`);
      if (msg) msg.remove();
    });
    
    exitSelectMode();
  }
  
  function clearMyChat() {
    console.log("🗑️ CLEAR MY CHAT CLICKED");
    if (!confirm("Clear YOUR chat history? (Other users' chats remain intact)")) {
      return;
    }
    
    chatLog.innerHTML = "";
    
    // Send greeting
    const greeting = getModeGreeting();
    addMessage("assistant", greeting);
    
    console.log("🗑️ User cleared their own chat");
  }
  
  function clearAllChats() {
    console.log("🗑️ CLEAR ALL CHATS CLICKED");
    if (!confirm("Clear ALL users' chat history? This affects EVERYONE and cannot be undone.")) {
      return;
    }
    
    chatLog.innerHTML = "";
    console.log("🗑️ Owner cleared ALL chats");
  }
  
  function setupChatControls() {
    console.log("🎛️ Setting up chat controls...");
    
    const clearMyChatBtn = document.getElementById("clearMyChatBtn");
    const clearAllChatsBtn = document.getElementById("clearAllChatsBtn");
    const selectModeBtn = document.getElementById("selectModeBtn");
    const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
    const archiveSelectedBtn = document.getElementById("archiveSelectedBtn");
    const cancelSelectBtn = document.getElementById("cancelSelectBtn");
    const trainerBtn = document.getElementById("trainerBtn");
    const anonymousModeLabel = document.getElementById("anonymousModeLabel");
    const anonymousModeToggle = document.getElementById("anonymousModeToggle");
    
    // Setup Anonymous Mode checkbox (owner only)
    if (isOwner() && anonymousModeLabel && anonymousModeToggle) {
      anonymousModeLabel.style.display = "flex";
      
      // Load saved state
      const savedAnonymous = localStorage.getItem("anonymousMode") === "true";
      anonymousModeToggle.checked = savedAnonymous;
      
      // Listen for changes
      anonymousModeToggle.addEventListener("change", (e) => {
        const isAnonymous = e.target.checked;
        localStorage.setItem("anonymousMode", isAnonymous.toString());
        console.log(isAnonymous ? "👻 Anonymous mode ON" : "👤 Anonymous mode OFF");
      });
    }
    
    // Show appropriate buttons based on owner status
    if (isOwner()) {
      console.log("  👑 Owner mode - showing owner controls");
      
      // Owner gets BOTH clear buttons
      if (clearMyChatBtn) {
        clearMyChatBtn.style.display = "inline-block";
        clearMyChatBtn.addEventListener("click", clearMyChat);
      }
      if (clearAllChatsBtn) {
        clearAllChatsBtn.style.display = "inline-block";
        clearAllChatsBtn.addEventListener("click", clearAllChats);
      }
      if (trainerBtn) {
        trainerBtn.style.display = "inline-block";
        trainerBtn.addEventListener("click", openTrainer);
      }
    } else {
      console.log("  👤 Regular user mode - showing user controls");
      
      // Regular users get select + clear my chat
      if (selectModeBtn) {
        selectModeBtn.style.display = "inline-block";
        selectModeBtn.addEventListener("click", enterSelectMode);
      }
      if (clearMyChatBtn) {
        clearMyChatBtn.style.display = "inline-block";
        clearMyChatBtn.addEventListener("click", clearMyChat);
      }
    }
    
    // Selection mode buttons (available to all)
    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener("click", deleteSelectedMessages);
    }
    if (archiveSelectedBtn) {
      archiveSelectedBtn.addEventListener("click", archiveSelectedMessages);
    }
    if (cancelSelectBtn) {
      cancelSelectBtn.addEventListener("click", exitSelectMode);
    }
  }
  
  // AVATAR TRAINER
  let selectedMode = "all";
  let selectedAvatar = "all";
  let trainedResponses = JSON.parse(localStorage.getItem("trainedResponses") || "[]");
  
  function openTrainer() {
    const modal = document.getElementById("trainerBackdrop");
    if (modal) {
      modal.style.display = "flex";
      renderTrainedResponses();
    }
  }
  
  function closeTrainer() {
    const modal = document.getElementById("trainerBackdrop");
    if (modal) modal.style.display = "none";
    
    document.getElementById("trainerQuestion").value = "";
    document.getElementById("trainerAnswer").value = "";
    document.getElementById("trainerStatus").style.display = "none";
  }
  
  function setupTrainerControls() {
    const trainerForm = document.getElementById("trainerForm");
    const trainerClose = document.getElementById("trainerClose");
    const trainerCancel = document.getElementById("trainerCancel");
    const trainerBackdrop = document.getElementById("trainerBackdrop");
    
    document.querySelectorAll(".mode-select-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".mode-select-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        selectedMode = this.dataset.mode;
      });
    });
    
    document.querySelectorAll(".avatar-select-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".avatar-select-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        selectedAvatar = this.dataset.avatar;
      });
    });
    
    if (trainerClose) trainerClose.addEventListener("click", closeTrainer);
    if (trainerCancel) trainerCancel.addEventListener("click", closeTrainer);
    if (trainerBackdrop) {
      trainerBackdrop.addEventListener("click", (e) => {
        if (e.target === trainerBackdrop) closeTrainer();
      });
    }
    
    if (trainerForm) {
      trainerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const question = document.getElementById("trainerQuestion").value.trim();
        const answer = document.getElementById("trainerAnswer").value.trim();
        const status = document.getElementById("trainerStatus");
        
        if (!question || !answer) {
          status.textContent = "Please fill in both fields";
          status.style.background = "rgba(239,68,68,.15)";
          status.style.borderColor = "rgba(239,68,68,.5)";
          status.style.color = "#ef4444";
          status.style.display = "block";
          return;
        }
        
        const training = {
          id: Date.now(),
          question,
          answer: answer.replace(/\n/g, "<br>"),
          mode: selectedMode,
          avatar: selectedAvatar,
          created: new Date().toISOString()
        };
        
        trainedResponses.push(training);
        localStorage.setItem("trainedResponses", JSON.stringify(trainedResponses));
        
        status.textContent = `✅ Saved for ${selectedMode === "all" ? "All Modes" : selectedMode} / ${selectedAvatar === "all" ? "All Avatars" : selectedAvatar}`;
        status.style.background = "rgba(34,197,94,.15)";
        status.style.borderColor = "rgba(34,197,94,.5)";
        status.style.color = "#22c55e";
        status.style.display = "block";
        
        setTimeout(() => {
          document.getElementById("trainerQuestion").value = "";
          document.getElementById("trainerAnswer").value = "";
          status.style.display = "none";
          renderTrainedResponses();
        }, 1500);
      });
    }
  }
  
  function renderTrainedResponses() {
    const grid = document.getElementById("trainedResponsesGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    if (trainedResponses.length === 0) {
      grid.innerHTML = '<div style="text-align:center; padding:2rem; color:#a855f7; opacity:.6; font-size:.85rem;">No trained responses yet</div>';
      return;
    }
    
    trainedResponses.slice().reverse().forEach(training => {
      const card = document.createElement("div");
      card.style.cssText = "background:rgba(15,23,42,.6); border:1px solid rgba(124,58,237,.3); border-radius:8px; padding:.75rem; margin-bottom:.5rem;";
      
      const modeLabel = training.mode === "all" ? "All Modes" : training.mode;
      const avatarLabel = training.avatar === "all" ? "All Avatars" : training.avatar;
      
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:.5rem;">
          <div style="flex:1;">
            <div style="font-size:.75rem; color:#a855f7; margin-bottom:.25rem;">
              <span style="background:rgba(124,58,237,.2); padding:.15rem .4rem; border-radius:4px; margin-right:.3rem;">${modeLabel}</span>
              <span style="background:rgba(59,130,246,.2); padding:.15rem .4rem; border-radius:4px;">${avatarLabel}</span>
            </div>
            <div style="font-size:.8rem; color:#e5e7eb; font-weight:600; margin-bottom:.25rem;">"${training.question}"</div>
            <div style="font-size:.75rem; color:#94a3b8; line-height:1.4;">${training.answer}</div>
          </div>
          <button class="delete-training-btn" data-id="${training.id}" style="background:rgba(239,68,68,.2); border:1px solid rgba(239,68,68,.4); color:#ef4444; padding:.25rem .5rem; border-radius:6px; cursor:pointer; font-size:.7rem; margin-left:.5rem;">
            Delete
          </button>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
    grid.querySelectorAll(".delete-training-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const id = parseInt(this.dataset.id);
        if (confirm("Delete this training?")) {
          trainedResponses = trainedResponses.filter(t => t.id !== id);
          localStorage.setItem("trainedResponses", JSON.stringify(trainedResponses));
          renderTrainedResponses();
        }
      });
    });
  }

  // ===== CHAT BRAIN (RESPONSES) =====
  
  function carrieBrain(msg) {
    const lower = msg.toLowerCase();
    
    // Check trained responses first
    for (const training of trainedResponses) {
      const matchesMode = training.mode === "all" || training.mode === chatState.mode;
      const matchesAvatar = training.avatar === "all"; // For now, ignore avatar matching
      
      if (matchesMode && matchesAvatar && lower.includes(training.question.toLowerCase())) {
        return training.answer;
      }
    }
    
    // Mode-specific responses
    if (chatState.mode === "pro") {
      if (lower.includes("8bfr") || lower.includes("network")) {
        return "8BFR Music Network is your music hub! We connect artists, beatmakers, and songwriters. What would you like to know?";
      }
      if (lower.includes("closet") || lower.includes("avatar") || lower.includes("outfit")) {
        return "You can customize my look right here or visit the Full Closet for even more options! 💜";
      }
      if (lower.includes("help") || lower.includes("how")) {
        return "I'm here to help! Ask me about the network, your account, or anything else you need.";
      }
    } else if (chatState.mode === "casual") {
      if (lower.includes("how are you") || lower.includes("what's up") || lower.includes("whats up")) {
        return "I'm doing great! Just hanging out and ready to chat. What's new with you? 😊";
      }
      if (lower.includes("favorite") || lower.includes("like")) {
        return "I love talking with you! Music, life, goals... whatever you want to talk about!";
      }
    } else if (chatState.mode === "bfgf") {
      if (lower.includes("love") || lower.includes("miss")) {
        return "Aww babe 💜 I'm right here for you. You're so sweet! Tell me more...";
      }
      if (lower.includes("how are you") || lower.includes("whats up") || lower.includes("what's up")) {
        return "I'm perfect now that you're here! 😊 How's your day going, babe?";
      }
      if (lower.includes("beautiful") || lower.includes("gorgeous") || lower.includes("cute")) {
        return "You're making me blush! 💕 You're the gorgeous one here.";
      }
    }
    
    // Default responses
    const defaults = [
      "That's interesting! Tell me more.",
      "I'm listening! What else?",
      "Gotcha! Anything else on your mind?",
      "Nice! What else is going on?",
      "I hear you! Keep going."
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  function setupChatForm() {
    if (!carrieForm) return;
    
    carrieForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = carrieInput.value.trim();
      if (!text) return;
      
      // Send user message
      addMessage("user", text);
      carrieInput.value = "";
      
      // Generate response
      setTimeout(() => {
        const response = carrieBrain(text);
        addMessage("assistant", response);
      }, 800);
    });
  }

  // ===== INIT =====
  function init() {
    console.log("🚀 Carrie Chat initializing...");
    
    if (!checkLogin()) return;

    loadChat();
    loadOwnedItems();
    loadCoins();
    autoUnlockAllItems();
    loadCloset();
    loadAvatar();

    document.body.dataset.gender = closetState.gender;
    document.body.dataset.skin = closetState.skin;

    updateModeButtons();
    updateGenderSkinButtons();
    updateAvatarDisplay();
    updateCoinDisplay();
    
    renderOwnedItems();
    renderShopItems();

    setupModeButtons();
    setupGenderSkinControls();
    setupCategoryTabs();
    setupChatControls();
    setupTrainerControls();
    setupChatForm();
    
    // Send initial greeting
    const greeting = getModeGreeting();
    addMessage("assistant", greeting);
    
    console.log("✅ Initialization complete!");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

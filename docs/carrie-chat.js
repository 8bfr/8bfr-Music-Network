// carrie-chat.js — Floating avatar with closet integration - OWNER AUTO-UNLOCK (EMAIL + PASSWORD)

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

  // Avatar refs - SAME as closet
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
  
  const OWNER_EMAIL = "8bfr.music@gmail.com"; // Owner's email
  const OWNER_PASSWORD = "197594773839*Ab4444"; // Owner's password

  const chatState = { mode: "business", messages: [] };
  
  // SYNCED: Use same localStorage keys as closet page
  let currentGender = localStorage.getItem('closet_gender') || "female";
  let currentSkin = localStorage.getItem('closet_skin') || "light";
  const closetState = { 
    gender: currentGender, 
    skin: currentSkin, 
    coins: 0, // Start at 0 coins for non-owners
    ownedItems: [], // Array of item IDs the user owns
    equipped: {} 
  };
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

  // OWNER CHECK - Requires both email AND password
  function isOwner() {
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    const userPassword = localStorage.getItem(USER_PASSWORD_KEY);
    return userEmail === OWNER_EMAIL && userPassword === OWNER_PASSWORD;
  }

  // LOGIN CHECK - Show login modal if not logged in
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

      // Save credentials
      localStorage.setItem(USER_EMAIL_KEY, email);
      localStorage.setItem(USER_PASSWORD_KEY, password);

      // Check if owner
      if (isOwner()) {
        console.log("🔓 Owner logged in!");
        autoUnlockAllItems();
        updateCoinDisplay();
        updateAvatarDisplay();
      } else {
        console.log("👤 Regular user logged in");
      }

      // Close modal
      document.body.removeChild(modal);
    }

    submitBtn.addEventListener("click", attemptLogin);
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") attemptLogin();
    });
  }

  // AUTO-UNLOCK: Grant all items and max coins (OWNER ONLY)
  function autoUnlockAllItems() {
    if (!isOwner()) {
      console.log("👤 Regular user - no auto-unlock");
      return;
    }
    
    const allItems = getItems();
    closetState.ownedItems = allItems.map(item => item.id);
    closetState.coins = 999999;
    saveOwnedItems();
    saveCoins();
    console.log("🔓 OWNER AUTO-UNLOCK: All items granted! Total:", closetState.ownedItems.length, "items");
  }

  // OWNERSHIP CHECK
  function isItemOwned(itemId) {
    // Owner has everything
    if (isOwner()) return true;
    
    // Check if item is in the ownedItems array
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
      if (raw) {
        closetState.ownedItems = JSON.parse(raw);
      }
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
      if (raw) {
        closetState.coins = parseInt(raw, 10);
      }
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
  
  // SYNCED: Save/load using same keys as closet page
  function saveCloset() {
    try { 
      localStorage.setItem('closet_gender', closetState.gender);
      localStorage.setItem('closet_skin', closetState.skin);
      
      // Save equipped items per gender (only save owned items)
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
      // Load gender and skin
      const savedGender = localStorage.getItem('closet_gender');
      const savedSkin = localStorage.getItem('closet_skin');
      
      if (savedGender) closetState.gender = savedGender;
      if (savedSkin) closetState.skin = savedSkin;
      
      // Load equipped items for current gender
      const saved = localStorage.getItem(`closet_equipped_${closetState.gender}`);
      if (saved) {
        const saveData = JSON.parse(saved);
        const items = getItems();
        
        closetState.equipped = {};
        Object.keys(saveData).forEach(slot => {
          const itemId = saveData[slot];
          const itemObj = items.find(it => it.id === itemId);
          
          // ONLY equip if the item is owned (or if owner)
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

  // SYNCED: Use CLOSET items instead of CHAT items
  function getItems() { return window.CARRIE_CLOSET_ITEMS || []; }

  // AVATAR DISPLAY
  function updateBaseImage() {
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
    
    // OWNERSHIP CHECK: Only show overlay if item is owned
    if (!isItemOwned(itemObj.id)) return;
    
    const slot = itemObj.slot;

    // Eyes (dual)
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

    // Ears (dual)
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

    // Shoes (dual)
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

    // Single overlay
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
      if (closetState.equipped[slot]) addOverlay(closetState.equipped[slot]);
    });
  }

  function updateAvatarDisplay() {
    const body = document.body;
    body.dataset.gender = closetState.gender;
    body.dataset.skin = closetState.skin;
    updateBaseImage();
    renderOverlays();
  }

  function updateCoinDisplay() {
    if (coinBalance) coinBalance.textContent = closetState.coins.toLocaleString();
  }

  // OWNED ITEMS RENDERING
  let currentCategory = "all";
  
  function filterByCategory(items) {
    if (currentCategory === "all") return items;
    
    // Map category names to slot names
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
    if (!ownedItemsGrid) {
      console.log("❌ ownedItemsGrid not found!");
      return;
    }
    
    ownedItemsGrid.innerHTML = "";
    
    const items = getItems();
    console.log("📦 Total items available:", items.length);
    console.log("✅ Owned item IDs:", closetState.ownedItems.length);
    
    const filtered = items.filter(it => 
      (it.gender === "unisex" || it.gender === closetState.gender) &&
      closetState.ownedItems.includes(it.id)
    );
    console.log("🔍 Filtered owned items for", closetState.gender + ":", filtered.length);
    
    const categoryFiltered = filterByCategory(filtered);
    console.log("📂 Category filtered (", currentCategory, "):", categoryFiltered.length);
    
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
          // Unequip
          closetState.equipped[item.slot] = null;
        } else {
          // Equip
          closetState.equipped[item.slot] = item;
        }
        saveCloset();
        updateAvatarDisplay();
        renderOwnedItems();
        renderShopItems();
      });
      
      ownedItemsGrid.appendChild(div);
    });
    
    console.log("✅ Rendered", categoryFiltered.length, "owned items");
  }
  
  function renderShopItems() {
    const shopItemsGrid = $("#shopItemsGrid");
    if (!shopItemsGrid) {
      console.log("❌ shopItemsGrid not found!");
      return;
    }
    
    shopItemsGrid.innerHTML = "";
    
    const items = getItems();
    const filtered = items.filter(it => 
      (it.gender === "unisex" || it.gender === closetState.gender) &&
      !closetState.ownedItems.includes(it.id)
    );
    console.log("🛒 Shop items for", closetState.gender + ":", filtered.length);
    
    const categoryFiltered = filterByCategory(filtered);
    
    if (categoryFiltered.length === 0) {
      shopItemsGrid.innerHTML = '<div style="padding:1rem; text-align:center; color:#a855f7; font-size:0.85rem;">All items purchased!</div>';
      return;
    }
    
    categoryFiltered.forEach(item => {
      const div = document.createElement("div");
      div.className = "mini-item shop-item";
      
      const canAfford = closetState.coins >= item.price;
      if (!canAfford) div.classList.add("cant-afford");
      
      div.innerHTML = `
        <div class="mini-item-img">
          <img src="${item.img}" alt="${item.name}">
          <div class="item-badge badge-price">${item.price} 🪙</div>
        </div>
        <div class="mini-item-name">${item.name}</div>
      `;
      
      div.addEventListener("click", () => {
        if (!canAfford) {
          alert("Not enough coins!");
          return;
        }
        
        if (confirm(`Purchase ${item.name} for ${item.price} coins?`)) {
          closetState.coins -= item.price;
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
    
    console.log("✅ Rendered", categoryFiltered.length, "shop items");
  }
  
  function setupCategoryTabs() {
    const tabs = document.querySelectorAll('[data-cat]');
    console.log("🏷️ Found", tabs.length, "category tabs");
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        console.log("📂 Category clicked:", this.dataset.cat);
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.cat;
        renderOwnedItems();
        renderShopItems();
      });
    });
  }

  // CONTROLS
  function setupGenderSkinControls() {
    if (genderFemale) {
      genderFemale.addEventListener("click", () => {
        closetState.gender = "female";
        loadCloset(); // Reload equipped items for new gender
        saveCloset();
        updateAvatarDisplay();
        updateGenderSkinButtons();
        renderOwnedItems(); // Update items for new gender
        renderShopItems(); // Update shop for new gender
      });
    }
    if (genderMale) {
      genderMale.addEventListener("click", () => {
        closetState.gender = "male";
        loadCloset(); // Reload equipped items for new gender
        saveCloset();
        updateAvatarDisplay();
        updateGenderSkinButtons();
        renderOwnedItems(); // Update items for new gender
        renderShopItems(); // Update shop for new gender
      });
    }
    
    if (skinLight) {
      skinLight.addEventListener("click", () => {
        closetState.skin = "light";
        saveCloset();
        updateAvatarDisplay();
        updateGenderSkinButtons();
      });
    }
    if (skinDark) {
      skinDark.addEventListener("click", () => {
        closetState.skin = "dark";
        saveCloset();
        updateAvatarDisplay();
        updateGenderSkinButtons();
      });
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

  // DRAGGABLE AVATAR
  let isDragging = false;
  let startX = 0, startY = 0;

  function setupDrag() {
    if (!floatingWrapper) return;

    floatingWrapper.addEventListener("mousedown", (e) => {
      if (e.target.closest("#avatarZoomIn, #avatarZoomOut, #avatarReset")) return;
      isDragging = true;
      startX = e.clientX - avatarState.x;
      startY = e.clientY - avatarState.y;
      floatingWrapper.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      avatarState.x = e.clientX - startX;
      avatarState.y = e.clientY - startY;
      updateAvatarPosition();
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        floatingWrapper.style.cursor = "grab";
        saveAvatar();
      }
    });
  }

  function updateAvatarPosition() {
    if (!floatingWrapper) return;
    floatingWrapper.style.left = avatarState.x + "px";
    floatingWrapper.style.top = avatarState.y + "px";
    if (floatingInner) floatingInner.style.transform = `scale(${avatarState.zoom})`;
  }

  function setupZoom() {
    if (avatarZoomIn) {
      avatarZoomIn.addEventListener("click", () => {
        avatarState.zoom = Math.min(avatarState.zoom + 0.1, 2);
        updateAvatarPosition();
        saveAvatar();
      });
    }
    if (avatarZoomOut) {
      avatarZoomOut.addEventListener("click", () => {
        avatarState.zoom = Math.max(avatarState.zoom - 0.1, 0.3);
        updateAvatarPosition();
        saveAvatar();
      });
    }
    if (avatarReset) {
      avatarReset.addEventListener("click", () => {
        avatarState.x = 100;
        avatarState.y = 100;
        avatarState.zoom = 0.6;
        updateAvatarPosition();
        saveAvatar();
      });
    }
  }

  // CHAT MODE
  function updateModeButtons() {
    [modeBusinessBtn, modePersonalBtn, modeBFGFBtn].forEach(b => {
      if (b) b.classList.remove("active");
    });
    if (chatState.mode === "business" && modeBusinessBtn) modeBusinessBtn.classList.add("active");
    if (chatState.mode === "personal" && modePersonalBtn) modePersonalBtn.classList.add("active");
    if (chatState.mode === "bfgf" && modeBFGFBtn) modeBFGFBtn.classList.add("active");

    if (ownerControls) {
      ownerControls.style.display = chatState.mode === "bfgf" ? "block" : "none";
    }
  }

  function setupModeButtons() {
    if (modeBusinessBtn) {
      modeBusinessBtn.addEventListener("click", () => {
        chatState.mode = "business";
        saveChat();
        updateModeButtons();
      });
    }
    if (modePersonalBtn) {
      modePersonalBtn.addEventListener("click", () => {
        chatState.mode = "personal";
        saveChat();
        updateModeButtons();
      });
    }
    if (modeBFGFBtn) {
      modeBFGFBtn.addEventListener("click", () => {
        chatState.mode = "bfgf";
        saveChat();
        updateModeButtons();
      });
    }
  }

  // CHAT LOGIC (stub)
  function addMessage(role, text) {
    if (!chatLog) return;
    const msg = document.createElement("div");
    msg.className = role === "user" ? "chat-msg-user" : "chat-msg-assistant";
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setupChatForm() {
    if (!carrieForm) return;
    carrieForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = carrieInput.value.trim();
      if (!text) return;
      addMessage("user", text);
      carrieInput.value = "";
      
      // Stub response
      setTimeout(() => {
        addMessage("assistant", "Hi! This is a demo response.");
      }, 800);
    });
  }

  // INIT
  function init() {
    console.log("🚀 Carrie Chat initializing...");
    console.log("📊 closetState:", closetState);
    
    // Check if user is logged in
    if (!checkLogin()) {
      console.log("❌ Not logged in - showing login modal");
      return; // Login modal will show
    }
    
    console.log("✅ User logged in");

    loadChat();
    loadOwnedItems(); // Load which items user owns
    loadCoins(); // Load coin balance
    
    console.log("💾 After loading - Owned items:", closetState.ownedItems.length);
    console.log("💾 After loading - Coins:", closetState.coins);
    
    // AUTO-UNLOCK: Give all items and max coins if owner
    autoUnlockAllItems();
    
    console.log("🔓 After auto-unlock - Owned items:", closetState.ownedItems.length);
    console.log("🔓 After auto-unlock - Coins:", closetState.coins);
    
    loadCloset();
    loadAvatar();

    // Set body attributes
    document.body.dataset.gender = closetState.gender;
    document.body.dataset.skin = closetState.skin;
    console.log("🎨 Set body attributes: gender=" + closetState.gender + ", skin=" + closetState.skin);

    updateModeButtons();
    updateGenderSkinButtons();
    updateAvatarDisplay();
    updateCoinDisplay();
    
    console.log("📦 About to render items...");
    renderOwnedItems(); // Show owned items
    renderShopItems(); // Show shop items

    setupModeButtons();
    setupGenderSkinControls();
    setupCategoryTabs(); // Setup category filtering
    setupChatForm();
    
    // Log status
    if (isOwner()) {
      console.log("🔓 Owner mode - auto-unlock enabled!");
      console.log("💰 Coins:", closetState.coins);
      console.log("📦 Owned items:", closetState.ownedItems.length);
    } else {
      console.log("👤 Regular user mode");
      console.log("💰 Coins:", closetState.coins);
      console.log("📦 Owned items:", closetState.ownedItems.length);
    }
    
    console.log("✅ Initialization complete!");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

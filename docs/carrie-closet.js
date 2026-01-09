// carrie-closet.js - Main closet logic
(function() {
  // DOM shortcuts
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // DON'T assign these yet - elements don't exist!
  let grid, emptyMsg, errBox, overlayHost, previewLabel, closetGenderLabel, skinToneButtons;

  let currentGender = localStorage.getItem('closet_gender') || "female";
  let currentSkin = localStorage.getItem('closet_skin') || "light";
  let currentCat = "hair";

  const equippedSets = {
    female: { hair: null, top: null, bottom: null, eyes: null, shoes: null, necklace: null, ears: null, belly: null },
    male: { hair: null, top: null, bottom: null, eyes: null, shoes: null, necklace: null, ears: null, belly: null }
  };

  let equipped = equippedSets[currentGender];

  const zBySlot = { shoes: 10, bottom: 30, belly: 35, top: 40, necklace: 45, eyes: 50, ears: 55, hair: 60 };

  function safeItems() {
    const items = window.CARRIE_CLOSET_ITEMS;
    return Array.isArray(items) ? items : null;
  }

  function setBaseImage() {
    const baseImg = $("#closetBaseImg");
    if (baseImg) {
      baseImg.src = `assets/images/base/${currentGender}/base_${currentGender}_${currentSkin}.png?v=15`;
    }
  }

  function updateLabels() {
    const gLabel = currentGender === "female" ? "Female" : "Male";
    const sLabel = currentSkin === "light" ? "Light skin" : "Dark skin";
    if (previewLabel) previewLabel.textContent = `${gLabel} • ${sLabel} • Bikini base`;
    if (closetGenderLabel) closetGenderLabel.innerHTML = `Showing items for <b>${gLabel}</b> avatar`;
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
      btn.className = "seg-btn" + (currentSkin === s.key ? " active" : "");
      btn.textContent = s.label;
      btn.dataset.skin = s.key;
      btn.addEventListener("click", () => {
        currentSkin = s.key;
        localStorage.setItem('closet_skin', currentSkin);
        document.body.dataset.skin = currentSkin;
        $$("#skinToneButtons .seg-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        setBaseImage();
        updateLabels();
        renderOverlays();
      });
      skinToneButtons.appendChild(btn);
    });
  }

  function filterItems(items) {
    return items.filter(it => {
      const gOK = it.gender === "unisex" || it.gender === currentGender;
      if (!gOK) return false;
      if (currentCat === "all") return true;
      return it.category === currentCat || it.cat === currentCat;
    });
  }

  function cardForItem(itemObj) {
    const card = document.createElement("div");
    card.className = "closet-item-card";

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "closet-item-thumb";
    const t = document.createElement("img");
    t.src = itemObj.img;
    t.alt = itemObj.name || itemObj.id;
    thumbWrap.appendChild(t);

    const meta = document.createElement("div");
    meta.className = "flex-1 min-w-0";
    const title = document.createElement("div");
    title.className = "text-[12px] font-semibold truncate";
    title.textContent = itemObj.name || itemObj.id;
    const sub = document.createElement("div");
    sub.className = "text-[10px] text-purple-200/70 truncate";
    sub.textContent = itemObj.label || itemObj.category;
    meta.appendChild(title);
    meta.appendChild(sub);

    card.appendChild(thumbWrap);
    card.appendChild(meta);

    const slot = itemObj.slot;
    const isOn = equipped[slot] && equipped[slot].id === itemObj.id;
    if (isOn) card.classList.add("active");

    card.addEventListener("click", () => {
      if (equipped[slot] && equipped[slot].id === itemObj.id) {
        equipped[slot] = null;
      } else {
        equipped[slot] = itemObj;
      }
      renderItems();
      renderOverlays();
      saveEquipped();
    });

    return card;
  }

  function saveEquipped() {
    const saveData = {};
    Object.keys(equipped).forEach(slot => {
      if (equipped[slot]) saveData[slot] = equipped[slot].id;
    });
    localStorage.setItem(`closet_equipped_${currentGender}`, JSON.stringify(saveData));
  }

  function loadEquipped() {
    const saved = localStorage.getItem(`closet_equipped_${currentGender}`);
    if (!saved) return;
    
    try {
      const saveData = JSON.parse(saved);
      const items = safeItems();
      if (!items) return;
      
      Object.keys(saveData).forEach(slot => {
        const itemId = saveData[slot];
        const itemObj = items.find(it => it.id === itemId);
        if (itemObj) equipped[slot] = itemObj;
      });
    } catch (e) {
      console.error("Error loading saved outfit:", e);
    }
  }

  function renderItems() {
    const items = safeItems();
    if (!items || !grid) {
      if (errBox) errBox.classList.remove("hidden");
      return;
    }
    const list = filterItems(items);
    grid.innerHTML = "";
    if (list.length === 0) {
      if (emptyMsg) emptyMsg.classList.remove("hidden");
    } else {
      if (emptyMsg) emptyMsg.classList.add("hidden");
      list.forEach(it => grid.appendChild(cardForItem(it)));
    }
  }

  function clearOverlays() {
    if (!overlayHost) return;
    overlayHost.innerHTML = "";
  }

  function addOverlayImg(itemObj) {
    if (!overlayHost || !itemObj) return;
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

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
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

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
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

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
      return;
    }

    const img = document.createElement("img");
    if (currentSkin === "dark" && itemObj.imgDark) {
      img.src = itemObj.imgDark;
    } else {
      img.src = itemObj.img;
    }
    img.className = `layer-overlay item-${itemObj.id}`;
    img.style.zIndex = zBySlot[slot] || 20;
    overlayHost.appendChild(img);
  }

  function renderOverlays() {
    clearOverlays();
    Object.keys(equipped).forEach(slot => {
      if (equipped[slot]) addOverlayImg(equipped[slot]);
    });
  }

  function initTabs() {
    $$(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCat = btn.dataset.cat || "hair";
        renderItems();
      });
    });
  }

  function initGenderButtons() {
    $$(".seg-btn[data-gender]").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".seg-btn[data-gender]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentGender = btn.dataset.gender === "male" ? "male" : "female";
        localStorage.setItem('closet_gender', currentGender);
        document.body.dataset.gender = currentGender;
        equipped = equippedSets[currentGender];
        loadEquipped();
        setBaseImage();
        updateLabels();
        renderItems();
        renderOverlays();
      });
    });
  }

  function init() {
    // NOW assign the DOM elements - they exist now!
    grid = $("#closetItemsGrid");
    emptyMsg = $("#closetEmpty");
    errBox = $("#closetError");
    overlayHost = $("#closetOverlayHost");
    previewLabel = $("#closetPreviewLabel");
    closetGenderLabel = $("#closetGenderLabel");
    skinToneButtons = $("#skinToneButtons");

    const items = safeItems();
    if (!items) {
      if (errBox) errBox.classList.remove("hidden");
      return;
    }
    if (errBox) errBox.classList.add("hidden");

    document.body.dataset.gender = currentGender;
    document.body.dataset.skin = currentSkin;

    initTabs();
    initGenderButtons();
    buildSkinButtons();
    
    $$(".seg-btn[data-gender]").forEach(btn => {
      if (btn.dataset.gender === currentGender) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    
    setBaseImage();
    updateLabels();
    loadEquipped();
    renderItems();
    renderOverlays();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

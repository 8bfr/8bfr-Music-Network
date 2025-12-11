// carrie-closet.js
// Logic to drive the Carrie Closet page using window.CARRIE_CLOSET_ITEMS

(function () {
  // --- DOM refs ---
  const body = document.body;
  const baseImg = document.getElementById("closetBaseImg");
  const overlayHost = document.getElementById("closetOverlayHost");

  const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
  const skinToneButtonsHost = document.getElementById("skinToneButtons");

  const previewLabel = document.getElementById("closetPreviewLabel");
  const genderLabel = document.getElementById("closetGenderLabel");

  const tabButtons = document.querySelectorAll(".tab-btn[data-cat]");
  const itemsGrid = document.getElementById("closetItemsGrid");
  const errorBox = document.getElementById("closetError");
  const emptyBox = document.getElementById("closetEmpty");

  // --- Safety: check data ---
  const ALL_ITEMS = Array.isArray(window.CARRIE_CLOSET_ITEMS)
    ? window.CARRIE_CLOSET_ITEMS
    : [];

  if (!ALL_ITEMS.length) {
    if (errorBox) errorBox.classList.remove("hidden");
    console.warn("CARRIE_CLOSET_ITEMS is empty or missing.");
    return;
  } else {
    if (errorBox) errorBox.classList.add("hidden");
  }

  // --- State ---
  let currentGender = body.dataset.gender === "male" ? "male" : "female";

  // We’ll keep tones simple: light / medium / dark
  const SKIN_TONES = {
    female: ["light", "dark"],
    male: ["light",  "dark"],
  };

  let currentTone = "light";

  // Which category tab is active
  let currentCategory = "hair";

  // Equipped items by slot
  // slot = hair / top / bottom / eyes / shoes / necklace / ears / belly
  const equippedBySlot = {};

  // Layer order: earlier = behind, later = in front
  const SLOT_ORDER = [
    "shoes",
    "bottom",
    "top",
    "belly",
    "necklace",
    "eyes",
    "hair",
    "ears",
  ];

  // --- Base images for each gender + tone ---
  const BASE_IMAGES = {
    female: {
      light: "assets/images/base/female/base_female_light.png?v=15",
      dark: "assets/images/base/female/base_female_dark.png?v=15",
    },
    male: {
      light: "assets/images/base/male/base_male_light.png?v=15",
      dark: "assets/images/base/male/base_male_dark.png?v=15",
    },
  };

  // If some images don't exist yet, it's ok – they'll 404 but not break JS.

  // --- Helpers ---

  function updateBodyGender() {
    body.dataset.gender = currentGender;
  }

  function updateBase() {
    const genderMap = BASE_IMAGES[currentGender] || {};
    const src = genderMap[currentTone] || genderMap["light"];
    if (baseImg && src) {
      baseImg.src = src;
    }
  }

  function updatePreviewLabel() {
    if (!previewLabel) return;
    const toneText =
      currentTone === "light"
        ? "Light skin"
        : "Dark skin";

    const baseText =
      currentGender === "female" ? "Bikini base" : "Shorts base";

    previewLabel.textContent =
      (currentGender === "female" ? "Female" : "Male") +
      " • " +
      toneText +
      " • " +
      baseText;
  }

  function updateGenderLabel() {
    if (!genderLabel) return;
    genderLabel.innerHTML =
      'Showing items for <b>' +
      (currentGender === "female" ? "Female" : "Male") +
      "</b> avatar";
  }

  function renderSkinToneButtons() {
    if (!skinToneButtonsHost) return;
    skinToneButtonsHost.innerHTML = "";

    const tones = SKIN_TONES[currentGender] || [];
    tones.forEach((tone) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent =
        tone === "light" ? "Light" : tone === "Dark";
      btn.className =
        "seg-btn text-[10px]" +
        (tone === currentTone ? " active" : "");

      btn.dataset.tone = tone;

      btn.addEventListener("click", () => {
        currentTone = tone;
        // Re-render tone buttons for active state
        renderSkinToneButtons();
        updateBase();
        updatePreviewLabel();
      });

      skinToneButtonsHost.appendChild(btn);
    });
  }

  function getFilteredItems() {
    return ALL_ITEMS.filter((item) => {
      // gender filter
      if (item.gender !== "unisex" && item.gender !== currentGender) {
        return false;
      }

      // category filter
      if (currentCategory !== "all" && item.category !== currentCategory) {
        return false;
      }

      return true;
    });
  }

  function renderItemsGrid() {
    if (!itemsGrid) return;
    const items = getFilteredItems();

    itemsGrid.innerHTML = "";

    if (!items.length) {
      if (emptyBox) emptyBox.classList.remove("hidden");
      return;
    } else {
      if (emptyBox) emptyBox.classList.add("hidden");
    }

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "closet-item-card text-left";

      // Mark active if equipped
      if (equippedBySlot[item.slot] === item.id) {
        card.classList.add("active");
      }

      card.dataset.itemId = item.id;

      const thumb = document.createElement("div");
      thumb.className = "closet-item-thumb";

      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name || item.id;

      thumb.appendChild(img);

      const textWrap = document.createElement("div");
      textWrap.className = "flex flex-col";

      const title = document.createElement("div");
      title.className = "text-[11px] font-semibold text-slate-50";
      title.textContent = item.name || "Item";

      const meta = document.createElement("div");
      meta.className = "text-[10px] text-purple-200/80";
      meta.textContent = item.label || "";

      textWrap.appendChild(title);
      textWrap.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(textWrap);

      card.addEventListener("click", () => {
        handleItemToggle(item);
      });

      itemsGrid.appendChild(card);
    });
  }

  function handleItemToggle(item) {
    const slot = item.slot;
    if (!slot) return;

    // Toggle: if already equipped in this slot, remove it. Otherwise equip this item.
    if (equippedBySlot[slot] === item.id) {
      delete equippedBySlot[slot];
    } else {
      equippedBySlot[slot] = item.id;
    }

    // Re-render overlays + item cards (for active state)
    renderOverlays();
    renderItemsGrid();
  }

  function renderOverlays() {
    if (!overlayHost) return;
    overlayHost.innerHTML = "";

    // Build ordered list of equipped items by SLOT_ORDER
    const equippedItems = [];

    SLOT_ORDER.forEach((slot) => {
      const id = equippedBySlot[slot];
      if (!id) return;
      const found = ALL_ITEMS.find((it) => it.id === id);
      if (found) equippedItems.push(found);
    });

    equippedItems.forEach((item) => {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name || item.id;

      // Classes: base overlay + item-specific class for CSS transforms
      img.className = "layer-overlay item-" + item.id;

      overlayHost.appendChild(img);
    });
  }

  // --- Event wiring ---

  // Gender buttons
  genderButtons.forEach((btn) => {
    const g = btn.dataset.gender;
    btn.addEventListener("click", () => {
      if (!g || (g !== "female" && g !== "male")) return;

      currentGender = g;
      updateBodyGender();

      genderButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Reset equipped items on gender change
      Object.keys(equippedBySlot).forEach((key) => delete equippedBySlot[key]);

      renderSkinToneButtons();
      updateBase();
      updatePreviewLabel();
      updateGenderLabel();
      renderItemsGrid();
      renderOverlays();
    });
  });

  // Category tabs
  tabButtons.forEach((btn) => {
    const cat = btn.dataset.cat;
    btn.addEventListener("click", () => {
      if (!cat) return;
      currentCategory = cat;

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      renderItemsGrid();
    });
  });

  // --- Initial boot ---
  function init() {
    updateBodyGender();
    renderSkinToneButtons();
    updateBase();
    updatePreviewLabel();
    updateGenderLabel();
    renderItemsGrid();
    renderOverlays();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

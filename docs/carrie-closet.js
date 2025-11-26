// docs/carrie-closet.js
// Front-end logic for Carrie Closet (preview + filters + overlays)

(function () {
  const baseImg = document.getElementById("closetBaseImg");
  const overlayHost = document.getElementById("closetOverlayHost");
  const previewLabelEl = document.getElementById("closetPreviewLabel");
  const genderLabelEl = document.getElementById("closetGenderLabel");
  const skinToneButtonsWrap = document.getElementById("skinToneButtons");
  const errorEl = document.getElementById("closetError");
  const emptyEl = document.getElementById("closetEmpty");
  const itemsGridEl = document.getElementById("closetItemsGrid");

  const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
  const categoryButtons = document.querySelectorAll(".tab-btn[data-cat]");

  // If data is missing, show error and bail
  if (!window.CARRIE_CLOSET_ITEMS || !Array.isArray(window.CARRIE_CLOSET_ITEMS)) {
    if (errorEl) {
      errorEl.classList.remove("hidden");
    }
    return;
  }

  // -----------------------------
  // CONSTANTS + STATE
  // -----------------------------
  const LAYER_SLOTS = [
    "hair",
    "eyes",
    "top",
    "bottom",
    "necklace",
    "ears",
    "belly",
    "shoes",
  ];

  const SKIN_TONES = {
    female: [
      {
        id: "light",
        label: "Light",
        baseLabel: "Light skin • Bikini base",
        src: "assets/images/base/female/base_female_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        baseLabel: "Medium skin • Bikini base",
        src: "assets/images/base/female/base_female_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        baseLabel: "Dark skin • Bikini base",
        src: "assets/images/base/female/base_female_dark.png",
      },
    ],
    male: [
      {
        id: "light",
        label: "Light",
        baseLabel: "Light skin • Shorts base",
        src: "assets/images/base/male/base_male_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        baseLabel: "Medium skin • Shorts base",
        src: "assets/images/base/male/base_male_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        baseLabel: "Dark skin • Shorts base",
        src: "assets/images/base/male/base_male_dark.png",
      },
    ],
  };

  let currentGender = "female";
  let currentSkinToneId = "light";
  let currentCategory = "hair"; // "hair", "top", "bottom", "jewelry", "eyes", "shoes", "all"

  // slot -> itemId
  let selectedBySlot = {};

  // slot -> <img> overlay element
  const slotLayers = {};

  // -----------------------------
  // OVERLAY LAYERS
  // -----------------------------
  function initOverlayLayers() {
    if (!overlayHost) return;
    overlayHost.innerHTML = "";

    LAYER_SLOTS.forEach((slot) => {
      const img = document.createElement("img");
      img.className = "layer-overlay layer-" + slot;
      img.style.display = "none";
      img.setAttribute("data-slot", slot);
      overlayHost.appendChild(img);
      slotLayers[slot] = img;
    });
  }

  function clearAllOverlays() {
    Object.keys(slotLayers).forEach((slot) => {
      const img = slotLayers[slot];
      if (!img) return;
      img.src = "";
      img.style.display = "none";
    });
    selectedBySlot = {};
  }

  function applyItemToOverlay(item) {
    const slot = item.slot;
    const layer = slotLayers[slot];
    if (!layer) return;
    layer.src = item.src;
    layer.style.display = "block";
    selectedBySlot[slot] = item.id;
  }

  // -----------------------------
  // GENDER + SKIN TONE
  // -----------------------------
  function getSkinToneConfig() {
    const list = SKIN_TONES[currentGender] || SKIN_TONES.female;
    let tone = list.find((t) => t.id === currentSkinToneId);
    if (!tone) {
      tone = list[0];
      currentSkinToneId = tone.id;
    }
    return tone;
  }

  function updateBasePreview() {
    const tone = getSkinToneConfig();
    if (baseImg) {
      baseImg.src = tone.src;
    }
    if (previewLabelEl) {
      const genderLabel = currentGender === "male" ? "Male" : "Female";
      previewLabelEl.textContent =
        genderLabel + " • " + tone.baseLabel;
    }
  }

  function updateGenderLabel() {
    if (!genderLabelEl) return;
    genderLabelEl.innerHTML =
      'Showing items for <b>' +
      (currentGender === "male" ? "Male" : "Female") +
      "</b> avatar";
  }

  function renderSkinToneButtons() {
    if (!skinToneButtonsWrap) return;
    const tones = SKIN_TONES[currentGender] || [];
    skinToneButtonsWrap.innerHTML = "";
    tones.forEach((tone) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = tone.label;
      btn.className =
        "seg-btn" + (tone.id === currentSkinToneId ? " active" : "");
      btn.setAttribute("data-skin", tone.id);
      btn.addEventListener("click", function () {
        currentSkinToneId = tone.id;
        updateBasePreview();
        renderSkinToneButtons();
      });
      skinToneButtonsWrap.appendChild(btn);
    });
  }

  function setGender(newGender) {
    if (newGender !== "female" && newGender !== "male") return;
    currentGender = newGender;
    currentSkinToneId = "light"; // default each time

    // Update segmented buttons
    genderButtons.forEach((btn) => {
      const g = btn.getAttribute("data-gender");
      if (g === currentGender) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    clearAllOverlays();
    updateBasePreview();
    renderSkinToneButtons();
    updateGenderLabel();
    renderItems();
  }

  // -----------------------------
  // CATEGORY / TABS
  // -----------------------------
  function setCategory(cat) {
    currentCategory = cat;
    categoryButtons.forEach((btn) => {
      const c = btn.getAttribute("data-cat");
      if (c === currentCategory) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    renderItems();
  }

  // -----------------------------
  // ITEMS GRID
  // -----------------------------
  function filterItems() {
    const gender = currentGender;
    const cat = currentCategory;

    return window.CARRIE_CLOSET_ITEMS.filter((item) => {
      // Gender filter: female/male + unisex
      if (item.gender !== "unisex" && item.gender !== gender) return false;

      // Category filter
      if (cat !== "all" && item.category !== cat) return false;

      return true;
    });
  }

  function renderItems() {
    if (!itemsGridEl) return;

    const items = filterItems();
    itemsGridEl.innerHTML = "";

    if (items.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    } else if (emptyEl) {
      emptyEl.classList.add("hidden");
    }

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "closet-item-card";
      card.setAttribute("data-item-id", item.id);

      const thumb = document.createElement("div");
      thumb.className = "closet-item-thumb";
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label;
      thumb.appendChild(img);

      const info = document.createElement("div");
      info.className = "flex-1";

      const title = document.createElement("div");
      title.className = "text-xs font-semibold";
      title.textContent = item.label;

      const meta = document.createElement("div");
      meta.className = "text-[10px] text-purple-100/80 mt-0.5";

      const rarity = item.rarity || "common";
      const coins = item.coins || 0;

      meta.textContent =
        coins +
        " coins • " +
        rarity.charAt(0).toUpperCase() +
        rarity.slice(1);

      info.appendChild(title);
      info.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(info);

      // Active state
      if (selectedBySlot[item.slot] === item.id) {
        card.classList.add("active");
      }

      card.addEventListener("click", function () {
        // Select or re-select item for its slot
        applyItemToOverlay(item);
        // Re-render to update active highlighting
        renderItems();
      });

      itemsGridEl.appendChild(card);
    });
  }

  // -----------------------------
  // WIRING
  // -----------------------------
  function wireGenderButtons() {
    genderButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const g = btn.getAttribute("data-gender");
        setGender(g);
      });
    });
  }

  function wireCategoryButtons() {
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const c = btn.getAttribute("data-cat");
        setCategory(c);
      });
    });
  }

  // -----------------------------
  // INIT
  // -----------------------------
  function init() {
    initOverlayLayers();
    wireGenderButtons();
    wireCategoryButtons();

    // Default: female, light, hair tab
    setGender("female");
    setCategory("hair");
  }

  init();
})();

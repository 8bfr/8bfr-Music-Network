// carrie-closet.js
// Front-end logic for Carrie Closet (visual only for now).

(function () {
  const baseImg          = document.getElementById("closetBaseImg");
  const overlayHost      = document.getElementById("closetOverlayHost");
  const itemsGrid        = document.getElementById("closetItemsGrid");
  const errorBox         = document.getElementById("closetError");
  const emptyBox         = document.getElementById("closetEmpty");
  const previewLabel     = document.getElementById("closetPreviewLabel");
  const genderLabel      = document.getElementById("closetGenderLabel");
  const genderButtons    = document.querySelectorAll("[data-gender]");
  const skinToneContainer= document.getElementById("skinToneButtons");
  const tabButtons       = document.querySelectorAll(".tab-btn");

  if (!baseImg || !overlayHost || !itemsGrid) {
    console.warn("Carrie Closet: required DOM elements missing.");
    return;
  }

  const catalog = window.CARRIE_CLOSET_ITEMS || [];
  if (!Array.isArray(catalog) || catalog.length === 0) {
    if (errorBox) {
      errorBox.classList.remove("hidden");
      errorBox.textContent =
        "Closet data failed to load. Please check carrie-closet-data.js.";
    }
    return;
  }

  // --- State ---

  let currentGender = "female"; // female | male
  let currentTone   = "light";  // light | dark
  let currentCat    = "hair";   // hair/top/bottom/jewelry/eyes/shoes/all

  // One equipped item per overlay slot
  const equipped = {
    hair: null,
    top: null,
    bottom: null,
    eyes: null,
    shoes: null,
    necklace: null,
    ears: null,
    belly: null
  };

  // Map gender + tone -> base PNG (light/dark only)
  const BASES = {
    female: {
      light: "assets/images/base/female/base_female_light.png",
      dark:  "assets/images/base/female/base_female_dark.png"
    },
    male: {
      light: "assets/images/base/male/base_male_light.png",
      dark:  "assets/images/base/male/base_male_dark.png"
    }
  };

  const TONES = [
    { id: "light", label: "Light" },
    { id: "dark",  label: "Dark"  }
  ];

  // Only shoes and ears are “pair” slots now.
  const PAIR_SLOTS = ["shoes", "ears"];

  // --- Helpers ---

  function updateBase() {
    const src =
      (BASES[currentGender] && BASES[currentGender][currentTone]) ||
      (BASES[currentGender] && BASES[currentGender].light);
    if (src) {
      baseImg.src = src;
    }

    if (previewLabel) {
      const toneLabel = currentTone === "light" ? "Light skin" : "Dark skin";
      const genderLabelText = currentGender === "female" ? "Female" : "Male";
      previewLabel.textContent =
        genderLabelText + " • " + toneLabel + " • Bikini / Shorts base";
    }
  }

  function updateGenderLabel() {
    if (!genderLabel) return;
    genderLabel.innerHTML =
      'Showing items for <b>' +
      (currentGender === "female" ? "Female" : "Male") +
      "</b> avatar";
  }

  // Create / update overlay elements for a slot.
  // For normal slots (hair, eyes, top, bottom, necklace, belly) we create ONE img.
  // For PAIR_SLOTS (shoes, ears), we create LEFT + RIGHT copies.
  function setOverlay(slot, imgSrc) {
    // Remove any existing layers for this slot
    const existing = overlayHost.querySelectorAll("[data-slot='" + slot + "']");
    existing.forEach((el) => el.remove());

    if (!imgSrc) return;

    if (PAIR_SLOTS.includes(slot)) {
      ["left", "right"].forEach((side) => {
        const layer = document.createElement("img");
        layer.className = "layer-overlay layer-" + slot + "-" + side;
        layer.alt = slot + " " + side + " overlay";
        layer.dataset.slot = slot;
        layer.src = imgSrc;
        overlayHost.appendChild(layer);
      });
    } else {
      const layer = document.createElement("img");
      layer.className = "layer-overlay layer-" + slot;
      layer.alt = slot + " overlay";
      layer.dataset.slot = slot;
      layer.src = imgSrc;
      overlayHost.appendChild(layer);
    }
  }

  function clearSlot(slot) {
    equipped[slot] = null;

    // Remove ANY overlay elements tied to this slot
    const layers = overlayHost.querySelectorAll("[data-slot='" + slot + "']");
    layers.forEach((layer) => layer.remove());

    // Un-highlight cards for this slot
    const cards = itemsGrid.querySelectorAll("[data-slot='" + slot + "']");
    cards.forEach((c) => c.classList.remove("active"));
  }

  function equipItem(item) {
    if (!item || !item.slot) return;

    // If this item is already equipped, unequip it
    if (equipped[item.slot] && equipped[item.slot].id === item.id) {
      clearSlot(item.slot);
      return;
    }

    // Equip
    equipped[item.slot] = item;
    setOverlay(item.slot, item.img || item.image || "");

    // Highlight selected card in the grid for that slot
    const cards = itemsGrid.querySelectorAll(".closet-item-card");
    cards.forEach((card) => {
      const cid  = card.getAttribute("data-id");
      const slot = card.getAttribute("data-slot");
      if (slot === item.slot && cid === item.id) {
        card.classList.add("active");
      } else if (slot === item.slot) {
        card.classList.remove("active");
      }
    });
  }

  function matchesGender(item) {
    if (!item) return false;
    if (item.gender === "unisex") return true;
    return item.gender === currentGender;
  }

  function matchesCategory(item) {
    if (!item) return false;
    if (currentCat === "all") return true;
    return item.cat === currentCat;
  }

  function buildSkinToneButtons() {
    if (!skinToneContainer) return;
    skinToneContainer.innerHTML = "";
    TONES.forEach((tone) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = tone.label;
      btn.className = "seg-btn" + (tone.id === currentTone ? " active" : "");
      btn.dataset.tone = tone.id;
      btn.addEventListener("click", () => {
        currentTone = tone.id;
        const all = skinToneContainer.querySelectorAll("button");
        all.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateBase();
      });
      skinToneContainer.appendChild(btn);
    });
  }

  function renderItems() {
    if (!itemsGrid) return;

    const filtered = catalog.filter(
      (it) => matchesGender(it) && matchesCategory(it)
    );

    itemsGrid.innerHTML = "";

    if (!filtered.length) {
      if (emptyBox) emptyBox.classList.remove("hidden");
      return;
    } else if (emptyBox) {
      emptyBox.classList.add("hidden");
    }

    // "None" card for this category – clears slot(s)
    if (currentCat !== "all") {
      const noneCard = document.createElement("button");
      noneCard.type = "button";
      noneCard.className =
        "closet-item-card !bg-slate-900/80 !border-slate-500/60";
      noneCard.innerHTML = `
        <div class="closet-item-thumb flex items-center justify-center">
          <span class="text-xs text-purple-200/80">✖</span>
        </div>
        <div class="flex-1">
          <div class="text-[11px] font-semibold text-slate-50">
            Remove ${currentCat === "hair" ? "hair" : currentCat}
          </div>
          <div class="text-[10px] text-slate-300/80">
            Clear this slot and go back to the base.
          </div>
        </div>
      `;
      noneCard.addEventListener("click", () => {
        // map cat -> slot(s)
        const map = {
          hair:    ["hair"],
          top:     ["top"],
          bottom:  ["bottom"],
          jewelry: ["necklace", "ears", "belly"],
          eyes:    ["eyes"],
          shoes:   ["shoes"]
        };
        const slots = map[currentCat] || [];
        slots.forEach(clearSlot);
      });
      itemsGrid.appendChild(noneCard);
    }

    filtered.forEach((it) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "closet-item-card";
      card.dataset.id = it.id;
      card.dataset.slot = it.slot || "";

      const thumbSrc = it.thumb || it.img || it.image || "";

      card.innerHTML = `
        <div class="closet-item-thumb">
          ${
            thumbSrc
              ? `<img src="${thumbSrc}" alt="${it.name || "Item"}">`
              : '<span class="text-[11px] text-purple-200/80">no preview</span>'
          }
        </div>
        <div class="flex-1 text-left">
          <div class="text-[11px] font-semibold text-slate-50">
            ${it.name || "Item"}
          </div>
          <div class="text-[10px] text-slate-300/80">
            ${it.label || ""}
          </div>
          <div class="text-[10px] text-emerald-300/85 mt-0.5">
            🪙 ${it.coins || 0} coins
            ${
              it.rarity && it.rarity !== "common"
                ? `<span class="ml-1 text-[9px] uppercase tracking-[0.12em] text-purple-300/80">${it.rarity}</span>`
                : ""
            }
          </div>
        </div>
      `;

      card.addEventListener("click", () => equipItem(it));
      itemsGrid.appendChild(card);
    });
  }

  function initGenderButtons() {
    genderButtons.forEach((btn) => {
      const g = btn.getAttribute("data-gender");
      btn.addEventListener("click", () => {
        currentGender = g === "male" ? "male" : "female";
        genderButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateGenderLabel();
        updateBase();
        renderItems();
      });
    });
  }

  function initTabs() {
    tabButtons.forEach((btn) => {
      const cat = btn.getAttribute("data-cat");
      btn.addEventListener("click", () => {
        currentCat = cat || "hair";
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderItems();
      });
    });
  }

  // --- Init ---

  function init() {
    updateBase();
    updateGenderLabel();
    buildSkinToneButtons();
    initGenderButtons();
    initTabs();
    renderItems();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

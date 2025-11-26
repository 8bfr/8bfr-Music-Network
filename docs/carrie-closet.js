// carrie-closet.js
// Logic for Carrie Closet visual avatar builder (no coins yet)

// ---------- State ----------

let closetGender = "female"; // "female" | "male"
let closetSkinId = "light";
let closetCategory = "hair"; // default tab

// layer -> itemId
const closetSelections = {
  hair: null,
  top: null,
  bottom: null,
  necklace: null,
  ears: null,
  belly: null,
  eyes: null,
  shoes: null,
};

// ---------- DOM refs ----------

const baseImgEl = document.getElementById("closetBaseImg");
const overlayHostEl = document.getElementById("closetOverlayHost");
const previewLabelEl = document.getElementById("closetPreviewLabel");
const genderLabelEl = document.getElementById("closetGenderLabel");
const skinToneButtonsEl = document.getElementById("skinToneButtons");
const itemsGridEl = document.getElementById("closetItemsGrid");
const errorEl = document.getElementById("closetError");
const emptyEl = document.getElementById("closetEmpty");

const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
const tabButtons = document.querySelectorAll(".tab-btn[data-cat]");

// ---------- Helpers ----------

function getBaseConfig() {
  if (!window.CARRIE_BASE_CONFIG) return null;
  return window.CARRIE_BASE_CONFIG[closetGender] || null;
}

function safeItems() {
  if (!Array.isArray(window.CARRIE_CLOSET_ITEMS)) return [];
  return window.CARRIE_CLOSET_ITEMS;
}

function updateBaseImage() {
  const cfg = getBaseConfig();
  if (!cfg || !baseImgEl) return;

  const skin = cfg.skins.find((s) => s.id === closetSkinId) || cfg.skins[0];
  if (!skin) return;

  baseImgEl.src = skin.src;
  const genderLabel = cfg.label;
  const skinLabel = skin.label;
  const baseDesc = cfg.baseDesc || "Base";

  if (previewLabelEl) {
    previewLabelEl.textContent =
      genderLabel + " • " + skinLabel + " skin • " + baseDesc;
  }
  if (genderLabelEl) {
    genderLabelEl.innerHTML =
      'Showing items for <b>' + genderLabel + "</b> avatar";
  }
}

function renderSkinToneButtons() {
  const cfg = getBaseConfig();
  if (!cfg || !skinToneButtonsEl) return;

  skinToneButtonsEl.innerHTML = "";

  cfg.skins.forEach((skin) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = skin.label;
    btn.className =
      "seg-btn" +
      (skin.id === closetSkinId ? " active" : "");

    btn.addEventListener("click", () => {
      closetSkinId = skin.id;
      updateBaseImage();
      renderSkinToneButtons();
    });

    skinToneButtonsEl.appendChild(btn);
  });
}

// Each layer gets ONE img in overlay host
function getOrCreateLayerImg(layer) {
  if (!overlayHostEl) return null;
  let img = overlayHostEl.querySelector('img[data-layer="' + layer + '"]');
  if (!img) {
    img = document.createElement("img");
    img.className = "layer-overlay layer-" + layer;
    img.dataset.layer = layer;
    overlayHostEl.appendChild(img);
  }
  return img;
}

function clearLayer(layer) {
  if (!overlayHostEl) return;
  const img = overlayHostEl.querySelector('img[data-layer="' + layer + '"]');
  if (img) {
    img.remove();
  }
  closetSelections[layer] = null;
}

// Apply chosen item to its layer
function applySelection(item) {
  const layer = item.layer;
  if (!layer) return;

  closetSelections[layer] = item.id;
  const img = getOrCreateLayerImg(layer);
  if (!img) return;

  img.src = item.src;
  img.alt = item.label || "";
}

// Filter items by current gender + category
function filteredItems() {
  const all = safeItems();
  const byGender = all.filter((it) => {
    return it.gender === "unisex" || it.gender === closetGender;
  });

  if (closetCategory === "all") return byGender;
  return byGender.filter((it) => it.category === closetCategory);
}

// ---------- Render items grid ----------

function renderItemsGrid() {
  if (!itemsGridEl || !errorEl || !emptyEl) return;

  const dataOk =
    window.CARRIE_BASE_CONFIG &&
    Array.isArray(window.CARRIE_CLOSET_ITEMS);

  if (!dataOk) {
    errorEl.classList.remove("hidden");
    emptyEl.classList.add("hidden");
    itemsGridEl.innerHTML = "";
    return;
  } else {
    errorEl.classList.add("hidden");
  }

  const items = filteredItems();

  if (!items.length) {
    emptyEl.classList.remove("hidden");
    itemsGridEl.innerHTML = "";
    return;
  } else {
    emptyEl.classList.add("hidden");
  }

  itemsGridEl.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "closet-item-card";
    card.dataset.itemId = item.id;
    card.dataset.layer = item.layer;

    const thumb = document.createElement("div");
    thumb.className = "closet-item-thumb";
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.label || "";
    thumb.appendChild(img);

    const textWrap = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = item.label || "Item";
    title.className = "text-xs font-semibold";

    const meta = document.createElement("div");
    meta.className = "text-[10px] text-purple-100/80";
    const cat =
      item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const price = item.price != null ? item.price : 0;
    meta.textContent = cat + " • " + price + " coins";

    textWrap.appendChild(title);
    textWrap.appendChild(meta);

    card.appendChild(thumb);
    card.appendChild(textWrap);

    // Active state if this item is selected for its layer
    if (closetSelections[item.layer] === item.id) {
      card.classList.add("active");
    }

    card.addEventListener("click", () => {
      const current = closetSelections[item.layer];
      if (current === item.id) {
        // clicking again clears that layer
        clearLayer(item.layer);
      } else {
        applySelection(item);
      }
      renderItemsGrid(); // refresh active highlighting only
    });

    itemsGridEl.appendChild(card);
  });
}

// ---------- Event wiring ----------

function initGenderButtons() {
  genderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.getAttribute("data-gender");
      if (!g || g === closetGender) return;

      closetGender = g;
      // reset selections on gender switch
      Object.keys(closetSelections).forEach((k) => (closetSelections[k] = null));
      const cfg = getBaseConfig();
      closetSkinId = cfg ? cfg.defaultSkinId || "light" : "light";

      // update UI
      genderButtons.forEach((b) =>
        b.classList.toggle(
          "active",
          b.getAttribute("data-gender") === closetGender
        )
      );

      updateBaseImage();
      renderSkinToneButtons();
      // clear overlays
      if (overlayHostEl) overlayHostEl.innerHTML = "";
      renderItemsGrid();
    });
  });
}

function initTabButtons() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-cat");
      if (!cat || cat === closetCategory) return;
      closetCategory = cat;
      tabButtons.forEach((b) =>
        b.classList.toggle(
          "active",
          b.getAttribute("data-cat") === closetCategory
        )
      );
      renderItemsGrid();
    });
  });
}

// ---------- Init ----------

(function initCarrieCloset() {
  if (!baseImgEl || !overlayHostEl) {
    console.warn("Carrie Closet: base or overlay host missing");
    return;
  }

  // Initial state
  const cfg = getBaseConfig();
  if (cfg) {
    closetSkinId = cfg.defaultSkinId || "light";
  }

  updateBaseImage();
  renderSkinToneButtons();
  initGenderButtons();
  initTabButtons();
  renderItemsGrid();

  console.log("Carrie Closet initialized.");
})();

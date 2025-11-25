// carrie-closet.js
// Logic for Carrie Closet: preview + filters + item application.

// ---- DOM references ----
const baseImgEl = document.getElementById("closetBaseImg");
const overlayHostEl = document.getElementById("closetOverlayHost");
const previewLabelEl = document.getElementById("closetPreviewLabel");
const genderLabelEl = document.getElementById("closetGenderLabel");
const skinToneButtonsHost = document.getElementById("skinToneButtons");
const itemsGridEl = document.getElementById("closetItemsGrid");
const errorEl = document.getElementById("closetError");
const emptyEl = document.getElementById("closetEmpty");

const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
const tabButtons = document.querySelectorAll(".tab-btn[data-cat]");

// ---- State ----
let currentGender = "female";
let currentSkinId = "female_light";
let currentCategory = "hair";

// each slot holds at most one overlay (so they don't stack)
const currentSlots = {
  hair: null,
  eyes: null,
  top: null,
  bottom: null,
  necklace: null,
  ears: null,
  belly: null,
  shoes: null,
};

// ---- Base images / skin tones ----
const BASES = {
  female: {
    female_light: "assets/images/base/female/base_female_light.png",
    female_medium: "assets/images/base/female/base_female_medium.png",
    female_dark: "assets/images/base/female/base_female_dark.png",
  },
  male: {
    male_light: "assets/images/base/male/base_male_light.png",
    male_medium: "assets/images/base/male/base_male_medium.png",
    male_dark: "assets/images/base/male/base_male_medium.png",
  },
};

const SKIN_TONES = {
  female: [
    { id: "female_light", label: "Light" },
    { id: "female_medium", label: "Medium" },
    { id: "female_dark", label: "Dark" },
  ],
  male: [
    { id: "male_light", label: "Light" },
    { id: "male_medium", label: "Medium" },
    { id: "male_dark", label: "Dark" },
  ],
};

// ---- Helpers ----

function safeItems() {
  if (!Array.isArray(window.CARRIE_CLOSET_ITEMS)) return [];
  return window.CARRIE_CLOSET_ITEMS;
}

function setBase(gender, skinId) {
  const genderBases = BASES[gender];
  if (!genderBases) return;
  const src = genderBases[skinId] || genderBases[Object.keys(genderBases)[0]];
  if (!src) return;

  baseImgEl.src = src;

  const toneConfig = (SKIN_TONES[gender] || []).find((t) => t.id === skinId);
  const toneLabel = toneConfig ? toneConfig.label : "Skin";

  if (previewLabelEl) {
    const genderLabel = gender === "female" ? "Female" : "Male";
    const baseText =
      gender === "female" ? "Bikini base" : "Shorts (no shirt) base";
    previewLabelEl.textContent =
      genderLabel + " • " + toneLabel + " skin" + " • " + baseText;
  }
}

function renderSkinButtons() {
  if (!skinToneButtonsHost) return;
  const tones = SKIN_TONES[currentGender] || [];
  skinToneButtonsHost.innerHTML = "";

  tones.forEach((tone) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "seg-btn" + (tone.id === currentSkinId ? " active" : "");
    btn.textContent = tone.label;
    btn.dataset.skinId = tone.id;
    btn.addEventListener("click", () => {
      currentSkinId = tone.id;
      setBase(currentGender, currentSkinId);
      renderSkinButtons();
    });
    skinToneButtonsHost.appendChild(btn);
  });
}

function clearOverlaySlot(slot) {
  if (!overlayHostEl) return;
  const existing = overlayHostEl.querySelectorAll(
    '.layer-overlay[data-slot="' + slot + '"]'
  );
  existing.forEach((el) => el.remove());
  currentSlots[slot] = null;
}

function applyItem(item) {
  if (!overlayHostEl || !item || !item.slot) return;
  const slot = item.slot;

  // remove previous overlay for this slot
  clearOverlaySlot(slot);

  // create new overlay image
  const img = document.createElement("img");
  img.src = item.overlay;
  img.alt = item.name || slot;
  img.className = "layer-overlay layer-" + slot;
  img.dataset.slot = slot;

  overlayHostEl.appendChild(img);
  currentSlots[slot] = item.id;

  // update active card styling for that slot
  const cards = itemsGridEl
    ? itemsGridEl.querySelectorAll(
        '.closet-item-card[data-slot="' + slot + '"]'
      )
    : [];
  cards.forEach((card) => {
    if (card.dataset.itemId === item.id) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

function buildItemCard(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "closet-item-card";
  card.dataset.itemId = item.id;
  card.dataset.slot = item.slot;

  const thumb = document.createElement("div");
  thumb.className = "closet-item-thumb";

  const img = document.createElement("img");
  img.src = item.overlay;
  img.alt = item.name || item.id;
  thumb.appendChild(img);

  const textWrap = document.createElement("div");
  const title = document.createElement("div");
  title.textContent = item.name || "Item";
  title.style.fontSize = "11px";
  title.style.fontWeight = "600";

  const sub = document.createElement("div");
  sub.style.fontSize = "10px";
  sub.style.opacity = "0.75";
  const coinText =
    typeof item.coins === "number" ? item.coins + " coins" : "8BFR coins";
  sub.textContent = coinText;

  textWrap.appendChild(title);
  textWrap.appendChild(sub);

  card.appendChild(thumb);
  card.appendChild(textWrap);

  card.addEventListener("click", () => applyItem(item));

  return card;
}

function filteredItems() {
  const all = safeItems();
  if (!all.length) return [];

  return all.filter((item) => {
    // gender
    if (item.gender !== "unisex" && item.gender !== currentGender) {
      return false;
    }

    // category
    if (currentCategory === "all") return true;
    return item.category === currentCategory;
  });
}

function renderItemsGrid() {
  if (!itemsGridEl) return;

  const all = safeItems();
  if (!Array.isArray(all) || !all.length) {
    if (errorEl) errorEl.classList.remove("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
    itemsGridEl.innerHTML = "";
    return;
  } else {
    if (errorEl) errorEl.classList.add("hidden");
  }

  const list = filteredItems();

  if (!list.length) {
    itemsGridEl.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  if (emptyEl) emptyEl.classList.add("hidden");
  itemsGridEl.innerHTML = "";

  list.forEach((item) => {
    const card = buildItemCard(item);
    itemsGridEl.appendChild(card);
  });
}

// ---- Wiring: gender + category tabs ----

genderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const g = btn.dataset.gender === "male" ? "male" : "female";
    currentGender = g;

    // update gender button active states
    genderButtons.forEach((b) =>
      b.classList.toggle("active", b === btn)
    );

    // set default skin for this gender if currentSkinId doesn't match
    const tones = SKIN_TONES[currentGender] || [];
    if (!tones.find((t) => t.id === currentSkinId)) {
      currentSkinId =
        tones.length > 0 ? tones[0].id : currentGender + "_light";
    }

    setBase(currentGender, currentSkinId);
    renderSkinButtons();
    renderItemsGrid();

    if (genderLabelEl) {
      genderLabelEl.innerHTML =
        'Showing items for <b>' +
        (currentGender === "female" ? "Female" : "Male") +
        "</b> avatar";
    }

    // clear overlays when switching gender so you don't get weird combos
    Object.keys(currentSlots).forEach(clearOverlaySlot);
  });
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat || "all";
    currentCategory = cat;

    tabButtons.forEach((b) =>
      b.classList.toggle("active", b === btn)
    );

    renderItemsGrid();
  });
});

// ---- Init ----
(function initCarrieCloset() {
  // if data failed entirely
  if (!Array.isArray(window.CARRIE_CLOSET_ITEMS)) {
    if (errorEl) errorEl.classList.remove("hidden");
  }

  setBase(currentGender, currentSkinId);
  renderSkinButtons();
  renderItemsGrid();
})();

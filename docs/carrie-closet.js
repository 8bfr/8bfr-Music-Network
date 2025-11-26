// carrie-closet.js
// Self-contained: includes its own data and logic. No dependency on carrie-closet--data.js.

// ---------- Base config ----------

const CLOSET_BASE_CONFIG = {
  female: {
    label: "Female",
    defaultSkinId: "light",
    baseDesc: "Bikini base",
    skins: [
      {
        id: "light",
        label: "Light",
        src: "assets/images/base/female/base_female_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        src: "assets/images/base/female/base_female_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        src: "assets/images/base/female/base_female_dark.png",
      },
    ],
  },
  male: {
    label: "Male",
    defaultSkinId: "light",
    baseDesc: "Shorts base",
    skins: [
      {
        id: "light",
        label: "Light",
        src: "assets/images/base/male/base_male_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        src: "assets/images/base/male/base_male_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        src: "assets/images/base/male/base_male_dark.png",
      },
    ],
  },
};

// ---------- Items (pulled from your folder names) ----------
// gender: "female" | "male" | "unisex"
// category: "hair" | "top" | "bottom" | "jewelry" | "eyes" | "shoes"
// layer: "hair" | "top" | "bottom" | "necklace" | "ears" | "belly" | "eyes" | "shoes"

const CLOSET_ITEMS = [
  // FEMALE HAIR – STRAIGHT
  {
    id: "hair_f_straight_blonde",
    label: "Straight Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_blonde.png",
    price: 60,
  },
  {
    id: "hair_f_straight_brown",
    label: "Straight Brown",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_brown.png",
    price: 60,
  },
  {
    id: "hair_f_straight_copper",
    label: "Straight Copper",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_copper.png",
    price: 60,
  },
  {
    id: "hair_f_straight_ginger",
    label: "Straight Ginger",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_ginger.png",
    price: 60,
  },
  {
    id: "hair_f_straight_pastel_blue",
    label: "Straight Pastel Blue",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_blue.png",
    price: 70,
  },
  {
    id: "hair_f_straight_pastel_pink",
    label: "Straight Pastel Pink",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_pink.png",
    price: 70,
  },
  {
    id: "hair_f_straight_pastel_purple",
    label: "Straight Pastel Purple",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_purple.png",
    price: 70,
  },
  {
    id: "hair_f_straight_platinum",
    label: "Straight Platinum Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_platinum_blonde.png",
    price: 70,
  },

  // FEMALE HAIR – WAVY
  {
    id: "hair_f_wavy_blonde",
    label: "Wavy Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_blonde.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_brown",
    label: "Wavy Brown",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_brown.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_copper",
    label: "Wavy Copper",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_copper.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_ginger",
    label: "Wavy Ginger",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_ginger.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_pastel_blue",
    label: "Wavy Pastel Blue",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_pastel_blue.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_pastel_pink",
    label: "Wavy Pastel Pink",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_pastel_pink.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_pastel_purple",
    label: "Wavy Pastel Purple",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_pastel_purple.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_platinum",
    label: "Wavy Platinum Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_platinum_blonde.png",
    price: 75,
  },

  // FEMALE CLOTHING (BOTTOMS)
  {
    id: "bottom_f_shorts",
    label: "Shorts",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_shorts.png",
    price: 40,
  },
  {
    id: "bottom_f_skirt",
    label: "Skirt",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_skirt.png",
    price: 45,
  },
  {
    id: "bottom_f_bikini",
    label: "Bikini (default)",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_bikini.png",
    price: 0,
  },

  // FEMALE JEWELRY
  {
    id: "jewelry_f_necklace",
    label: "Gold Necklace",
    gender: "female",
    category: "jewelry",
    layer: "necklace",
    src: "assets/images/female_jewlery/female_gold_necklace.png",
    price: 80,
  },
  {
    id: "jewelry_f_earrings",
    label: "Gold Earrings",
    gender: "female",
    category: "jewelry",
    layer: "ears",
    src: "assets/images/female_jewlery/female_gold_ear-ring.png",
    price: 70,
  },
  {
    id: "jewelry_f_belly_ring",
    label: "Gold Belly Ring",
    gender: "female",
    category: "jewelry",
    layer: "belly",
    src: "assets/images/female_jewlery/female_gold_belly-ring.png",
    price: 70,
  },

  // MALE JEWELRY
  {
    id: "jewelry_m_necklace",
    label: "Gold Necklace (M)",
    gender: "male",
    category: "jewelry",
    layer: "necklace",
    src: "assets/images/male_jewlery/male_gold_necklace.png",
    price: 80,
  },

  // UNISEX TOPS
  {
    id: "top_unisex_tank",
    label: "Tank Top",
    gender: "unisex",
    category: "top",
    layer: "top",
    src: "assets/images/unisex/cloths/unisex_tank-top.png",
    price: 40,
  },
  {
    id: "top_unisex_tee",
    label: "Tee Shirt",
    gender: "unisex",
    category: "top",
    layer: "top",
    src: "assets/images/unisex/cloths/unisex_tee-shirt.png",
    price: 40,
  },

  // UNISEX EYES
  {
    id: "eyes_unisex_blue",
    label: "Blue Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_blue.png",
    price: 30,
  },
  {
    id: "eyes_unisex_brown",
    label: "Brown Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_brown.png",
    price: 30,
  },
  {
    id: "eyes_unisex_green",
    label: "Green Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_green.png",
    price: 30,
  },

  // UNISEX SHOES
  {
    id: "shoes_unisex_sneakers",
    label: "Sneakers",
    gender: "unisex",
    category: "shoes",
    layer: "shoes",
    src: "assets/images/unisex/shoes/unisex_shoes.png",
    price: 50,
  },
  {
    id: "shoes_unisex_sandals",
    label: "Sandals",
    gender: "unisex",
    category: "shoes",
    layer: "shoes",
    src: "assets/images/unisex/shoes/unisex_sandles.png",
    price: 40,
  },
];

// ---------- State ----------

let closetGender = "female";       // "female" | "male"
let closetSkinId = "light";        // "light" | "medium" | "dark"
let closetCategory = "hair";       // current tab

// layer -> itemId (current selection)
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

const baseImgEl         = document.getElementById("closetBaseImg");
const overlayHostEl     = document.getElementById("closetOverlayHost");
const previewLabelEl    = document.getElementById("closetPreviewLabel");
const genderLabelEl     = document.getElementById("closetGenderLabel");
const skinToneButtonsEl = document.getElementById("skinToneButtons");
const itemsGridEl       = document.getElementById("closetItemsGrid");
const errorEl           = document.getElementById("closetError");
const emptyEl           = document.getElementById("closetEmpty");

const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
const tabButtons    = document.querySelectorAll(".tab-btn[data-cat]");

// ---------- Helpers ----------

function getBaseConfig() {
  return CLOSET_BASE_CONFIG[closetGender] || null;
}

function safeItems() {
  return Array.isArray(CLOSET_ITEMS) ? CLOSET_ITEMS : [];
}

function updateBaseImage() {
  const cfg = getBaseConfig();
  if (!cfg || !baseImgEl) return;

  const skin = cfg.skins.find((s) => s.id === closetSkinId) || cfg.skins[0];
  if (!skin) return;

  baseImgEl.src = skin.src;

  const genderLabel = cfg.label;
  const skinLabel   = skin.label;
  const baseDesc    = cfg.baseDesc || "Base";

  if (previewLabelEl) {
    previewLabelEl.textContent =
      `${genderLabel} • ${skinLabel} skin • ${baseDesc}`;
  }
  if (genderLabelEl) {
    genderLabelEl.innerHTML =
      `Showing items for <b>${genderLabel}</b> avatar`;
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
      "seg-btn" + (skin.id === closetSkinId ? " active" : "");

    btn.addEventListener("click", () => {
      closetSkinId = skin.id;
      updateBaseImage();
      renderSkinToneButtons();
    });

    skinToneButtonsEl.appendChild(btn);
  });
}

// Each layer gets ONE overlay <img>
function getOrCreateLayerImg(layer) {
  if (!overlayHostEl) return null;
  let img = overlayHostEl.querySelector(`img[data-layer="${layer}"]`);
  if (!img) {
    img = document.createElement("img");
    img.className = `layer-overlay layer-${layer}`;
    img.dataset.layer = layer;
    overlayHostEl.appendChild(img);
  }
  return img;
}

function clearLayer(layer) {
  if (!overlayHostEl) return;
  const img = overlayHostEl.querySelector(`img[data-layer="${layer}"]`);
  if (img) img.remove();
  closetSelections[layer] = null;
}

function applySelection(item) {
  const layer = item.layer;
  if (!layer) return;

  closetSelections[layer] = item.id;
  const img = getOrCreateLayerImg(layer);
  if (!img) return;

  img.src = item.src;
  img.alt = item.label || "";
}

// Filter items by gender + category
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
  if (!itemsGridEl || !emptyEl) return;

  const items = filteredItems();

  if (!items.length) {
    emptyEl.classList.remove("hidden");
    itemsGridEl.innerHTML = "";
    return;
  }

  emptyEl.classList.add("hidden");
  itemsGridEl.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "closet-item-card";
    card.dataset.itemId = item.id;
    card.dataset.layer  = item.layer;

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
    meta.textContent = `${cat} • ${price} coins`;

    textWrap.appendChild(title);
    textWrap.appendChild(meta);

    card.appendChild(thumb);
    card.appendChild(textWrap);

    if (closetSelections[item.layer] === item.id) {
      card.classList.add("active");
    }

    card.addEventListener("click", () => {
      const current = closetSelections[item.layer];
      if (current === item.id) {
        clearLayer(item.layer);
      } else {
        applySelection(item);
      }
      renderItemsGrid();
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

      Object.keys(closetSelections).forEach(
        (k) => (closetSelections[k] = null)
      );

      const cfg = getBaseConfig();
      closetSkinId = cfg ? cfg.defaultSkinId || "light" : "light";

      genderButtons.forEach((b) =>
        b.classList.toggle(
          "active",
          b.getAttribute("data-gender") === closetGender
        )
      );

      if (overlayHostEl) overlayHostEl.innerHTML = "";

      updateBaseImage();
      renderSkinToneButtons();
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
  try {
    if (!baseImgEl || !overlayHostEl) {
      console.warn("Carrie Closet: base or overlay host missing");
      if (errorEl) errorEl.classList.remove("hidden");
      return;
    }

    const cfg = getBaseConfig();
    if (cfg) {
      closetSkinId = cfg.defaultSkinId || "light";
    }

    updateBaseImage();
    renderSkinToneButtons();
    initGenderButtons();
    initTabButtons();
    renderItemsGrid();

    console.log(
      "Carrie Closet initialized with",
      safeItems().length,
      "items"
    );
  } catch (err) {
    console.error("Carrie Closet init error:", err);
    if (errorEl) {
      errorEl.classList.remove("hidden");
      errorEl.textContent =
        "Carrie Closet failed to initialize: " + String(err);
    }
  }
})();

// carrie-closet.js
// Front-end logic for Carrie Closet page (BF/GF wardrobe).

/* global window, document */

(function () {
  const items = window.CARRIE_CLOSET_ITEMS || [];

  // ------- DOM -------
  const genderFemaleBtn = document.getElementById("genderFemaleBtn");
  const genderMaleBtn = document.getElementById("genderMaleBtn");

  const categoryRow = document.getElementById("categoryRow");
  const itemsGrid = document.getElementById("itemsGrid");
  const itemCountLabel = document.getElementById("itemCountLabel");
  const previewSummary = document.getElementById("previewSummary");

  const imgBase = document.getElementById("avatarBase");
  const imgBottom = document.getElementById("avatarBottom");
  const imgTop = document.getElementById("avatarTop");
  const imgHair = document.getElementById("avatarHair");
  const imgEyes = document.getElementById("avatarEyes");
  const imgJewelry = document.getElementById("avatarJewelry");
  const imgShoes = document.getElementById("avatarShoes");

  if (!itemsGrid || !categoryRow || !imgBase) {
    console.warn("Carrie Closet: missing core DOM nodes.");
    return;
  }

  // ------- Categories (front-end only) -------
  const CATEGORIES = [
    { id: "skin", label: "Skin", slots: ["base"] },
    { id: "hair", label: "Hair", slots: ["hair"] },
    { id: "eyes", label: "Eyes", slots: ["eyes"] },
    { id: "tops", label: "Tops", slots: ["top"] },
    { id: "bottoms", label: "Bottoms", slots: ["bottom"] },
    { id: "jewelry", label: "Jewelry", slots: ["jewelry"] },
    { id: "shoes", label: "Shoes", slots: ["shoes"] },
  ];

  const DEFAULT_STATE = {
    gender: "female",
    equipped: {
      female: {
        base: "female_skin_light",
        bottom: "female_bottom_bikini",
        top: null,
        hair: null,
        eyes: null,
        jewelry: null,
        shoes: null,
      },
      male: {
        base: "male_skin_light",
        bottom: null, // shorts baked into base
        top: null,
        hair: null,
        eyes: null,
        jewelry: null,
        shoes: null,
      },
    },
  };

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem("carrie_closet_state_v1");
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        gender: parsed.gender === "male" ? "male" : "female",
        equipped: {
          female: { ...DEFAULT_STATE.equipped.female, ...(parsed.equipped?.female || {}) },
          male: { ...DEFAULT_STATE.equipped.male, ...(parsed.equipped?.male || {}) },
        },
      };
    } catch (e) {
      console.warn("Carrie Closet: failed to load state, reset.", e);
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    try {
      localStorage.setItem("carrie_closet_state_v1", JSON.stringify(state));
    } catch (e) {
      console.warn("Carrie Closet: failed to save state.", e);
    }
  }

  function getCurrentEquipped() {
    return state.gender === "male"
      ? state.equipped.male
      : state.equipped.female;
  }

  function findItemById(id) {
    if (!id) return null;
    return items.find((it) => it.id === id) || null;
  }

  function filterItemsForCategory(catId) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return [];
    const slots = cat.slots;
    const gender = state.gender;

    return items.filter((it) => {
      if (!slots.includes(it.slot)) return false;
      if (it.gender === "unisex") return true;
      return it.gender === gender;
    });
  }

  // ------- Rendering preview -------
  function renderPreview() {
    const eq = getCurrentEquipped();

    const baseItem = findItemById(eq.base);
    const bottomItem = findItemById(eq.bottom);
    const topItem = findItemById(eq.top);
    const hairItem = findItemById(eq.hair);
    const eyesItem = findItemById(eq.eyes);
    const jewelryItem = findItemById(eq.jewelry);
    const shoesItem = findItemById(eq.shoes);

    setImg(imgBase, baseItem && baseItem.src);
    setImg(imgBottom, bottomItem && bottomItem.src);
    setImg(imgTop, topItem && topItem.src);
    setImg(imgHair, hairItem && hairItem.src);
    setImg(imgEyes, eyesItem && eyesItem.src);
    setImg(imgJewelry, jewelryItem && jewelryItem.src);
    setImg(imgShoes, shoesItem && shoesItem.src);

    if (previewSummary) {
      const genderLabel = state.gender === "male" ? "Male avatar" : "Female avatar";
      const parts = [];
      if (hairItem) parts.push(hairItem.name);
      if (topItem) parts.push(topItem.name);
      if (bottomItem) parts.push(bottomItem.name);
      if (jewelryItem) parts.push(jewelryItem.name);
      if (shoesItem) parts.push(shoesItem.name);

      const outfitText = parts.length
        ? parts.join(" • ")
        : "Default look with base skin and built-in outfit.";

      previewSummary.textContent =
        genderLabel + " • " + outfitText;
    }
  }

  function setImg(el, src) {
    if (!el) return;
    if (src) {
      el.src = src;
      el.style.opacity = "1";
    } else {
      el.removeAttribute("src");
      el.style.opacity = "0";
    }
  }

  // ------- Rendering categories -------
  let activeCategoryId = "skin";

  function renderCategories() {
    categoryRow.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cat.label;
      btn.className =
        "category-button" + (cat.id === activeCategoryId ? " active" : "");
      btn.dataset.categoryId = cat.id;
      categoryRow.appendChild(btn);
    });
  }

  function renderItems() {
    const list = filterItemsForCategory(activeCategoryId);
    itemsGrid.innerHTML = "";

    if (itemCountLabel) {
      itemCountLabel.textContent =
        list.length === 0
          ? "No items for this category yet."
          : `${list.length} item${list.length === 1 ? "" : "s"} available`;
    }

    const eq = getCurrentEquipped();

    list.forEach((item) => {
      const isPremium = item.rarity === "rare" || item.rarity === "vip";
      const isEquipped = eq[item.slot] === item.id;

      const card = document.createElement("div");
      card.className = "item-card" + (isPremium ? " premium" : "");

      const thumb = document.createElement("div");
      thumb.className = "item-thumb";
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.name;
      thumb.appendChild(img);

      const titleRow = document.createElement("div");
      titleRow.className = "flex items-center justify-between gap-1";

      const nameEl = document.createElement("div");
      nameEl.textContent = item.name;
      nameEl.className = "font-medium text-[0.8rem]";

      const coinEl = document.createElement("div");
      coinEl.className = "text-[0.7rem] text-amber-200 flex items-center gap-1";
      coinEl.innerHTML = `🪙 <span>${item.coins}</span>`;

      titleRow.appendChild(nameEl);
      titleRow.appendChild(coinEl);

      const metaRow = document.createElement("div");
      metaRow.className = "flex items-center justify-between gap-1 text-[0.7rem]";

      const vibeEl = document.createElement("span");
      vibeEl.className = "text-purple-200/80";
      const vibeParts = [];
      if (item.vibe) vibeParts.push(item.vibe);
      if (item.sexy) vibeParts.push("sexy");
      if (item.rarity === "rare" || item.rarity === "vip") {
        vibeParts.push(item.rarity);
      }
      vibeEl.textContent = vibeParts.join(" • ") || "basic";

      const equipBtn = document.createElement("button");
      equipBtn.type = "button";
      equipBtn.className =
        "item-equip" + (isEquipped ? " active" : "");
      equipBtn.textContent = isEquipped ? "Equipped" : "Equip";

      equipBtn.addEventListener("click", () => {
        equipItem(item);
      });

      metaRow.appendChild(vibeEl);
      metaRow.appendChild(equipBtn);

      card.appendChild(thumb);
      card.appendChild(titleRow);
      card.appendChild(metaRow);

      itemsGrid.appendChild(card);
    });
  }

  function equipItem(item) {
    if (!item) return;
    const eq = getCurrentEquipped();
    eq[item.slot] = item.id;
    saveState();
    renderPreview();
    renderItems();
  }

  // ------- Gender toggle -------
  function setGender(g) {
    state.gender = g === "male" ? "male" : "female";

    if (genderFemaleBtn) {
      genderFemaleBtn.classList.toggle("active", state.gender === "female");
    }
    if (genderMaleBtn) {
      genderMaleBtn.classList.toggle("active", state.gender === "male");
    }

    // If active category has no items for this gender, bump to Skin
    const list = filterItemsForCategory(activeCategoryId);
    if (!list.length) {
      activeCategoryId = "skin";
    }

    saveState();
    renderPreview();
    renderCategories();
    renderItems();
  }

  if (genderFemaleBtn) {
    genderFemaleBtn.addEventListener("click", () => setGender("female"));
  }
  if (genderMaleBtn) {
    genderMaleBtn.addEventListener("click", () => setGender("male"));
  }

  // ------- Category click handling -------
  categoryRow.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category-id]");
    if (!btn) return;
    const id = btn.dataset.categoryId;
    if (!id || id === activeCategoryId) return;
    activeCategoryId = id;
    renderCategories();
    renderItems();
  });

  // ------- Init -------
  function init() {
    // Ensure defaults exist in case old state was from before we had items
    if (!findItemById(state.equipped.female.base)) {
      state.equipped.female.base = "female_skin_light";
    }
    if (!findItemById(state.equipped.male.base)) {
      state.equipped.male.base = "male_skin_light";
    }
    if (!findItemById(state.equipped.female.bottom)) {
      state.equipped.female.bottom = "female_bottom_bikini";
    }

    renderCategories();
    setGender(state.gender || "female");
  }

  init();
})();

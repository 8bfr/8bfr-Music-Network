// carrie-closet.js
// Renders Carrie Closet using window.CARRIE_CLOSET_DATA

(function () {
  const DATA = window.CARRIE_CLOSET_DATA || { items: [], categories: [] };

  const avatarStage   = document.getElementById("avatarStage");
  const categoryBar   = document.getElementById("categoryBar");
  const itemGrid      = document.getElementById("itemGrid");
  const catTitleEl    = document.getElementById("categoryTitle");
  const genderLabelEl = document.getElementById("genderLabel");
  const genderFemaleBtn = document.getElementById("genderFemaleBtn");
  const genderMaleBtn   = document.getElementById("genderMaleBtn");

  if (!avatarStage || !categoryBar || !itemGrid) {
    console.warn("Carrie Closet – required DOM nodes missing.");
    return;
  }

  // ----- state -----
  let currentGender = "female"; // "female" | "male"
  let currentCategory = DATA.categories[0]?.id || "skin";

  // For each gender, remember selected item id per category
  const selections = {
    female: {},
    male: {}
  };

  // helper: filter items by gender + category
  function itemsForCurrent() {
    return DATA.items.filter((it) => {
      if (it.category !== currentCategory) return false;
      if (it.gender === "unisex") return true;
      return it.gender === currentGender;
    });
  }

  // helper: get current selection object for gender
  function getGenderSelections() {
    return currentGender === "male" ? selections.male : selections.female;
  }

  // find default item for category/gender
  function defaultItemFor(catId) {
    const items = DATA.items.filter((it) => {
      if (it.category !== catId) return false;
      if (it.gender === "unisex") return true;
      return it.gender === currentGender;
    });
    if (!items.length) return null;
    // prefer default flag
    const def = items.find((i) => i.default);
    return def || items[0];
  }

  // ----- avatar rendering -----

  // Create or update the avatar DOM
  function renderAvatar() {
    const gSel = getGenderSelections();

    // base skin item
    let baseItem = gSel.skin
      ? DATA.items.find((it) => it.id === gSel.skin)
      : null;
    if (!baseItem) {
      baseItem = defaultItemFor("skin");
      if (baseItem) gSel.skin = baseItem.id;
    }

    // compute active items for all categories
    const active = {
      base: baseItem,
      hair: findActiveSlotItem(gSel, "hair"),
      eyes: findActiveSlotItem(gSel, "eyes"),
      top: findActiveSlotItem(gSel, "top"),
      bottom: findActiveSlotItem(gSel, "bottom"),
      shoes: findActiveSlotItem(gSel, "shoes"),
      necklace: findActiveSlotItem(gSel, "jewelry", "necklace"),
      belly: findActiveSlotItem(gSel, "jewelry", "belly"),
      earrings: findActiveSlotItem(gSel, "jewelry", "earrings")
    };

    // clear stage
    avatarStage.innerHTML = "";

    if (!active.base) {
      const msg = document.createElement("p");
      msg.className = "text-xs text-purple-200";
      msg.textContent = "No base avatar found for this gender.";
      avatarStage.appendChild(msg);
      return;
    }

    // container relative box
    const box = document.createElement("div");
    box.style.width = "100%";
    box.style.height = "100%";
    box.style.position = "relative";
    avatarStage.appendChild(box);

    // base image
    const baseImg = document.createElement("img");
    baseImg.src = active.base.img;
    baseImg.alt = "Base avatar";
    baseImg.className = "avatar-base";
    box.appendChild(baseImg);

    // helper to add overlay
    function addLayer(slotName, item) {
      if (!item) return;
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.label;
      img.className = "avatar-layer slot-" + slotName;
      box.appendChild(img);
    }

    addLayer("hair", active.hair);
    addLayer("eyes", active.eyes);
    addLayer("top", active.top);
    addLayer("bottom", active.bottom);
    addLayer("shoes", active.shoes);
    addLayer("necklace", active.necklace);
    addLayer("belly", active.belly);
    addLayer("earrings", active.earrings);
  }

  function findActiveSlotItem(gSel, categoryId, slotFilter) {
    // selection for this category?
    const selectedId = gSel[categoryId];
    if (selectedId) {
      const found = DATA.items.find((it) => it.id === selectedId);
      if (found) return found;
    }

    // else fall back to default for that category, respecting slot if provided
    const items = DATA.items.filter((it) => {
      if (it.category !== categoryId) return false;
      if (slotFilter && it.slot !== slotFilter) return false;
      if (it.gender === "unisex") return true;
      return it.gender === currentGender;
    });
    if (!items.length) return null;
    const def = items.find((it) => it.default);
    return def || items[0];
  }

  // ----- category rendering -----

  function renderCategories() {
    categoryBar.innerHTML = "";
    DATA.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "cat-pill" +
        (cat.id === currentCategory ? " cat-pill-active" : "");
      btn.dataset.category = cat.id;

      const em = document.createElement("span");
      em.className = "emoji";
      em.textContent = cat.emoji;
      const span = document.createElement("span");
      span.textContent = cat.label;

      btn.appendChild(em);
      btn.appendChild(span);
      categoryBar.appendChild(btn);
    });

    categoryBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-category]");
      if (!btn) return;
      const catId = btn.dataset.category;
      if (!catId || catId === currentCategory) return;
      currentCategory = catId;
      renderCategories();
      renderItems();
    });
  }

  // ----- item list rendering -----

  function renderItems() {
    const cat = DATA.categories.find((c) => c.id === currentCategory);
    catTitleEl.textContent = cat ? cat.label : "Category";

    const gSel = getGenderSelections();
    const activeId = gSel[currentCategory];

    const items = itemsForCurrent();
    itemGrid.innerHTML = "";

    if (!items.length) {
      const msg = document.createElement("p");
      msg.className = "text-xs text-purple-200/80";
      msg.textContent = "No items yet in this category for this avatar.";
      itemGrid.appendChild(msg);
      renderAvatar();
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "item-card" + (item.id === activeId ? " selected" : "");
      card.dataset.itemId = item.id;

      const thumb = document.createElement("div");
      thumb.className = "item-thumb";
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.label;
      thumb.appendChild(img);

      const textWrap = document.createElement("div");
      const name = document.createElement("div");
      name.className = "item-name";
      name.textContent = item.label;

      const meta = document.createElement("div");
      meta.className = "item-meta";
      const coinSpan = document.createElement("span");
      coinSpan.textContent = item.coins + " coins";
      meta.appendChild(coinSpan);

      textWrap.appendChild(name);
      textWrap.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(textWrap);

      itemGrid.appendChild(card);
    });

    // click handler
    itemGrid.onclick = (e) => {
      const card = e.target.closest("button[data-item-id]");
      if (!card) return;
      const itemId = card.dataset.itemId;
      const item = DATA.items.find((it) => it.id === itemId);
      if (!item) return;

      const gSel2 = getGenderSelections();
      gSel2[item.category] = item.id;

      renderItems();  // re-highlight selection
      renderAvatar(); // re-draw avatar
    };

    renderAvatar();
  }

  // ----- gender switching -----

  function setGender(newGender) {
    if (newGender !== "female" && newGender !== "male") return;
    currentGender = newGender;

    // update label + buttons
    if (genderLabelEl) {
      genderLabelEl.textContent =
        newGender === "female" ? "Female avatar" : "Male avatar";
    }
    if (genderFemaleBtn && genderMaleBtn) {
      if (newGender === "female") {
        genderFemaleBtn.classList.add(
          "bg-purple-600/60",
          "text-white",
          "border-purple-400/60"
        );
        genderMaleBtn.classList.remove(
          "bg-slate-800",
          "border-sky-400/60"
        );
      } else {
        genderMaleBtn.classList.add(
          "bg-slate-800",
          "border-sky-400/60",
          "text-sky-100"
        );
        genderFemaleBtn.classList.remove(
          "bg-purple-600/60",
          "border-purple-400/60"
        );
      }
    }

    // ensure we have defaults for this gender
    const gSel = getGenderSelections();
    DATA.categories.forEach((cat) => {
      if (!gSel[cat.id]) {
        const def = defaultItemFor(cat.id);
        if (def) gSel[cat.id] = def.id;
      }
    });

    renderItems();
  }

  if (genderFemaleBtn) {
    genderFemaleBtn.addEventListener("click", () => setGender("female"));
  }
  if (genderMaleBtn) {
    genderMaleBtn.addEventListener("click", () => setGender("male"));
  }

  // ----- init -----

  try {
    renderCategories();
    setGender("female");
  } catch (err) {
    console.error("Carrie Closet init failed", err);
    if (avatarStage) {
      avatarStage.innerHTML =
        '<p class="text-xs text-red-300">Closet failed to load. Check the console for details.</p>';
    }
  }
})();

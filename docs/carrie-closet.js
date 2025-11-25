// carrie-closet.js
// Logic for Carrie Closet (preview + items)

(function () {
  const items = window.CARRIE_CLOSET_ITEMS || [];

  const baseImg = document.getElementById("closetBaseImg");
  const overlayHost = document.getElementById("closetOverlayHost");
  const previewLabel = document.getElementById("closetPreviewLabel");
  const genderLabel = document.getElementById("closetGenderLabel");
  const skinToneButtonsWrap = document.getElementById("skinToneButtons");
  const itemsGrid = document.getElementById("closetItemsGrid");
  const errorEl = document.getElementById("closetError");
  const emptyEl = document.getElementById("closetEmpty");

  const genderButtons = document.querySelectorAll("[data-gender]");
  const tabButtons = document.querySelectorAll("[data-cat]");

  if (!baseImg || !overlayHost || !itemsGrid) {
    console.warn("Carrie Closet: missing required DOM nodes.");
    return;
  }

  if (!window.CARRIE_CLOSET_ITEMS) {
    if (errorEl) errorEl.classList.remove("hidden");
    return;
  }

  // --- base avatars (skin) ---

  const BASES = {
    female: [
      {
        id: "female_light",
        label: "Light",
        src: "assets/images/base/female/base_female_light.png",
        desc: "Light skin • bikini base",
      },
      {
        id: "female_medium",
        label: "Medium",
        src: "assets/images/base/female/base_female_medium.png",
        desc: "Medium skin • bikini base",
      },
      {
        id: "female_dark",
        label: "Dark",
        src: "assets/images/base/female/base_female_dark.png",
        desc: "Dark skin • bikini base",
      },
    ],
    male: [
      {
        id: "male_light",
        label: "Light",
        src: "assets/images/base/male/base_male_light.png",
        desc: "Light skin • shorts base",
      },
      {
        id: "male_medium",
        label: "Medium",
        src: "assets/images/base/male/base_male_medium.png",
        desc: "Medium skin • shorts base",
      },
      {
        id: "male_dark",
        label: "Dark",
        src: "assets/images/base/male/base_male_dark.png",
        desc: "Dark skin • shorts base",
      },
    ],
  };

  const defaultState = {
    gender: "female",
    baseId: "female_light",
    activeCat: "hair",
    equipped: {
      hair: null,
      top: null,
      bottom: null,
      necklace: null,
      ears: null,
      belly: null,
      eyes: null,
      shoes: null,
    },
  };

  let state = { ...defaultState, equipped: { ...defaultState.equipped } };

  function getBaseList() {
    return BASES[state.gender] || [];
  }

  function getCurrentBase() {
    const list = getBaseList();
    return list.find((b) => b.id === state.baseId) || list[0] || null;
  }

  // --- render preview ---

  function renderBase() {
    const base = getCurrentBase();
    if (!base) return;
    baseImg.src = base.src;
    if (previewLabel) {
      const genderText = state.gender === "female" ? "Female" : "Male";
      previewLabel.textContent = `${genderText} • ${base.desc}`;
    }
  }

  function renderOverlays() {
    overlayHost.innerHTML = "";

    const orderedSlots = [
      "hair",
      "eyes",
      "top",
      "bottom",
      "necklace",
      "ears",
      "belly",
      "shoes",
    ];

    orderedSlots.forEach((slot) => {
      const id = state.equipped[slot];
      if (!id) return;
      const item = items.find((it) => it.id === id);
      if (!item) return;

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label || slot;
      img.className = "layer-overlay layer-" + slot;

      overlayHost.appendChild(img);
    });
  }

  function renderPreview() {
    renderBase();
    renderOverlays();
  }

  // --- render skin tone buttons ---

  function renderSkinToneButtons() {
    if (!skinToneButtonsWrap) return;
    const list = getBaseList();
    skinToneButtonsWrap.innerHTML = "";

    list.forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "seg-btn" + (b.id === state.baseId ? " active" : "");
      btn.dataset.baseId = b.id;
      btn.textContent = b.label;
      skinToneButtonsWrap.appendChild(btn);
    });
  }

  // --- render items list ---

  function renderItems() {
    itemsGrid.innerHTML = "";

    if (errorEl) errorEl.classList.add("hidden");

    let filtered = items.filter((it) => {
      if (it.gender !== "any" && it.gender !== state.gender) return false;
      if (state.activeCat && state.activeCat !== "all") {
        if (it.category !== state.activeCat) return false;
      }
      return true;
    });

    if (!filtered.length) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    } else if (emptyEl) {
      emptyEl.classList.add("hidden");
    }

    filtered.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "closet-item-card" +
        (state.equipped[item.slot] === item.id ? " active" : "");
      card.dataset.itemId = item.id;

      const thumb = document.createElement("div");
      thumb.className = "closet-item-thumb";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label || item.id;
      thumb.appendChild(img);

      const body = document.createElement("div");
      body.className = "flex flex-col min-w-0";

      const label = document.createElement("div");
      label.className = "text-xs font-semibold text-purple-50 truncate";
      label.textContent = item.label || item.id;

      const meta = document.createElement("div");
      meta.className = "text-[10px] text-purple-200/80 flex justify-between gap-2";
      const left = document.createElement("span");
      left.textContent = item.category;
      const right = document.createElement("span");
      right.textContent = item.price + " coins (future)";

      meta.appendChild(left);
      meta.appendChild(right);

      body.appendChild(label);
      body.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(body);

      itemsGrid.appendChild(card);
    });
  }

  // --- equip / unequip ---

  function equipItem(itemId) {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;

    const slot = item.slot;
    if (!slot) return;

    // toggle: click again to remove
    if (state.equipped[slot] === item.id) {
      state.equipped[slot] = null;
    } else {
      state.equipped[slot] = item.id;
    }

    renderPreview();
    renderItems();
  }

  // --- event wiring ---

  // gender buttons
  genderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.gender === "male" ? "male" : "female";
      state.gender = g;

      // reset base + equipped when switching gender
      state.baseId = g === "female" ? "female_light" : "male_light";
      state.equipped = { ...defaultState.equipped };

      genderButtons.forEach((b) =>
        b.classList.toggle("active", b === btn)
      );

      if (genderLabel) {
        genderLabel.innerHTML =
          'Showing items for <b>' +
          (g === "female" ? "Female" : "Male") +
          "</b> avatar";
      }

      renderSkinToneButtons();
      renderPreview();
      renderItems();
    });
  });

  // skin tone buttons (event delegation)
  if (skinToneButtonsWrap) {
    skinToneButtonsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-base-id]");
      if (!btn) return;
      const id = btn.dataset.baseId;
      if (!id) return;
      state.baseId = id;
      renderSkinToneButtons();
      renderPreview();
    });
  }

  // category tabs
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat || "all";
      state.activeCat = cat;
      tabButtons.forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderItems();
    });
  });

  // item click (equip)
  itemsGrid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-item-id]");
    if (!card) return;
    const id = card.dataset.itemId;
    equipItem(id);
  });

  // --- init ---

  function init() {
    if (!items || !items.length) {
      if (errorEl) {
        errorEl.classList.remove("hidden");
        errorEl.textContent =
          "Closet data failed to load. No items found in CARRIE_CLOSET_ITEMS.";
      }
      return;
    }

    if (genderLabel) {
      genderLabel.innerHTML = 'Showing items for <b>Female</b> avatar';
    }

    renderSkinToneButtons();
    renderPreview();
    renderItems();
  }

  init();
})();

// carrie-closet.js
// Front-end logic for Carrie Closet: preview + simple equip system

(function () {
  const data = window.CARRIE_CLOSET_DATA;
  const errorEl = document.getElementById("closetError");
  const baseImg = document.getElementById("closetBaseImg");
  const overlayHost = document.getElementById("closetOverlayHost");
  const summaryEl = document.getElementById("closetSummary");
  const skinListEl = document.getElementById("closetSkinList");
  const categoryBarEl = document.getElementById("closetCategoryBar");
  const itemsGridEl = document.getElementById("closetItemsGrid");
  const genderBtnFemale = document.getElementById("genderBtnFemale");
  const genderBtnMale = document.getElementById("genderBtnMale");

  if (!data || !baseImg || !overlayHost) {
    if (errorEl) {
      errorEl.classList.remove("hidden");
      errorEl.textContent =
        "Closet data failed to load. Please check carrie-closet--data.js.";
    }
    return;
  }

  // --- State ---

  const state = {
    gender: "female",
    baseId: null,
    equipped: {}, // slot -> item
    category: "hair", // default tab
  };

  const SLOT_CLASS = {
    hair: "layer-overlay layer-hair",
    eyes: "layer-overlay layer-eyes",
    top: "layer-overlay layer-top",
    bottom: "layer-overlay layer-bottom",
    necklace: "layer-overlay layer-necklace",
    ears: "layer-overlay layer-ears",
    belly: "layer-overlay layer-belly",
    shoes: "layer-overlay layer-shoes",
  };

  const SLOT_Z = {
    hair: 40,
    eyes: 35,
    ears: 34,
    necklace: 33,
    top: 30,
    belly: 27,
    bottom: 25,
    shoes: 20,
  };

  const CATEGORY_LABELS = {
    hair: "Hair",
    tops: "Tops",
    bottoms: "Bottoms",
    jewelry: "Jewelry",
    eyes: "Eyes",
    shoes: "Shoes",
  };

  // --- Helpers ---

  function getBaseList(gender) {
    return data.baseAvatars[gender] || [];
  }

  function getDefaultBaseId(gender) {
    const list = getBaseList(gender);
    if (!list.length) return null;
    const found = list.find((b) => b.default);
    return (found || list[0]).id;
  }

  function getBaseById(baseId) {
    const f = data.baseAvatars.female || [];
    const m = data.baseAvatars.male || [];
    return f.concat(m).find((b) => b.id === baseId) || null;
  }

  function getVisibleItems() {
    return data.items.filter((item) => {
      if (item.gender !== "any" && item.gender !== state.gender) return false;
      if (state.category && item.category !== state.category) return false;
      return true;
    });
  }

  function updateGenderButtons() {
    if (!genderBtnFemale || !genderBtnMale) return;
    if (state.gender === "female") {
      genderBtnFemale.classList.add("bg-purple-600", "border-purple-300");
      genderBtnFemale.classList.remove("bg-slate-800", "border-slate-500");
      genderBtnMale.classList.add("bg-slate-800", "border-slate-500");
      genderBtnMale.classList.remove("bg-purple-600", "border-purple-300");
    } else {
      genderBtnMale.classList.add("bg-purple-600", "border-purple-300");
      genderBtnMale.classList.remove("bg-slate-800", "border-slate-500");
      genderBtnFemale.classList.add("bg-slate-800", "border-slate-500");
      genderBtnFemale.classList.remove("bg-purple-600", "border-purple-300");
    }
  }

  function updateSummary() {
    if (!summaryEl) return;
    const base = getBaseById(state.baseId);
    const genderLabel = state.gender === "female" ? "Female" : "Male";
    const skinLabel = base ? base.label.split("•")[1]?.trim() || base.label : "";
    const parts = [genderLabel];
    if (skinLabel) parts.push(skinLabel);

    const equippedSlots = Object.values(state.equipped);
    if (equippedSlots.length) {
      parts.push(
        equippedSlots
          .map((i) => i.label)
          .slice(0, 3)
          .join(", ") + (equippedSlots.length > 3 ? "…" : "")
      );
    }

    summaryEl.textContent = parts.join(" • ");
  }

  // --- Render: base + overlays ---

  function renderBaseAvatar() {
    const base = getBaseById(state.baseId);
    if (!base || !base.src) {
      if (errorEl) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "No base avatar found for this gender.";
      }
      return;
    }
    if (errorEl) errorEl.classList.add("hidden");
    baseImg.src = base.src;
  }

  function renderOverlays() {
    overlayHost.innerHTML = "";
    const items = Object.values(state.equipped);
    items.forEach((item) => {
      if (!item || !item.src) return;
      const img = document.createElement("img");
      img.src = item.src;
      const cls = SLOT_CLASS[item.slot] || "layer-overlay";
      img.className = cls;
      const z = SLOT_Z[item.slot];
      if (z != null) img.style.zIndex = String(z);
      overlayHost.appendChild(img);
    });
  }

  // --- Render: skin selectors ---

  function renderSkinList() {
    if (!skinListEl) return;
    skinListEl.innerHTML = "";
    const list = getBaseList(state.gender);
    if (!list.length) {
      const p = document.createElement("p");
      p.className = "text-[11px] text-purple-200/80";
      p.textContent = "No base avatars configured for this gender yet.";
      skinListEl.appendChild(p);
      return;
    }

    list.forEach((base) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const active = base.id === state.baseId;
      btn.className =
        "px-2 py-1 rounded-full border text-[11px] mr-1 mb-1 " +
        (active
          ? "border-purple-300 bg-purple-700/70 text-purple-50"
          : "border-slate-500 bg-slate-900/90 text-slate-200");
      btn.textContent = base.label.split("•")[1]?.trim() || base.label;
      btn.addEventListener("click", () => {
        state.baseId = base.id;
        renderBaseAvatar();
        updateSummary();
      });
      skinListEl.appendChild(btn);
    });
  }

  // --- Render: category tabs + item cards ---

  function renderCategoryBar() {
    if (!categoryBarEl) return;
    categoryBarEl.innerHTML = "";

    const cats = ["hair", "tops", "bottoms", "jewelry", "eyes", "shoes"];
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const active = state.category === cat;
      btn.dataset.cat = cat;
      btn.className =
        "px-2 py-1 rounded-full border text-[11px] mr-1 mb-1 " +
        (active
          ? "border-purple-300 bg-purple-700/70 text-purple-50"
          : "border-slate-600 bg-slate-900/80 text-slate-200");
      btn.textContent = CATEGORY_LABELS[cat] || cat;
      btn.addEventListener("click", () => {
        state.category = cat;
        renderCategoryBar();
        renderItemsGrid();
      });
      categoryBarEl.appendChild(btn);
    });
  }

  function renderItemsGrid() {
    if (!itemsGridEl) return;
    itemsGridEl.innerHTML = "";

    const visible = getVisibleItems();
    if (!visible.length) {
      const p = document.createElement("p");
      p.className = "text-[11px] text-purple-200/80";
      p.textContent =
        "No items configured for this category yet. More outfits will be added soon.";
      itemsGridEl.appendChild(p);
      return;
    }

    visible.forEach((item) => {
      const isEquipped = state.equipped[item.slot]?.id === item.id;

      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "w-full text-left rounded-xl border px-3 py-2 mb-2 bg-slate-950/80 hover:bg-slate-900/90 transition " +
        (isEquipped ? "border-emerald-300/80" : "border-slate-700");

      card.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="text-[12px] font-semibold text-purple-50 truncate">
              ${item.label}
            </div>
            <div class="text-[10px] text-purple-200/80">
              ${item.gender === "any" ? "Unisex" : item.gender === "female" ? "Female only" : "Male only"} 
              • Slot: ${item.slot}
            </div>
          </div>
          <div class="text-right">
            <div class="text-[12px] text-emerald-300">
              🪙 ${item.price}
            </div>
            <div class="text-[10px] text-slate-200">
              ${isEquipped ? "Equipped" : "Tap to equip"}
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (isEquipped) {
          delete state.equipped[item.slot];
        } else {
          state.equipped[item.slot] = item;
        }
        renderOverlays();
        renderItemsGrid();
        updateSummary();
      });

      itemsGridEl.appendChild(card);
    });
  }

  // --- Initial wiring ---

  function setGender(gender) {
    if (gender !== "female" && gender !== "male") return;
    if (state.gender === gender) return;
    state.gender = gender;
    state.baseId = getDefaultBaseId(gender);
    state.equipped = {}; // reset per gender (simpler)
    updateGenderButtons();
    renderBaseAvatar();
    renderOverlays();
    renderSkinList();
    renderItemsGrid();
    updateSummary();
  }

  function initGenderButtons() {
    if (genderBtnFemale) {
      genderBtnFemale.addEventListener("click", () => setGender("female"));
    }
    if (genderBtnMale) {
      genderBtnMale.addEventListener("click", () => setGender("male"));
    }
  }

  // --- Init ---

  (function init() {
    // default gender + base
    state.gender = "female";
    state.baseId = getDefaultBaseId("female");

    if (!state.baseId) {
      if (errorEl) {
        errorEl.classList.remove("hidden");
        errorEl.textContent =
          "Closet is missing base avatars. Please check base_female_* and base_male_* images.";
      }
      return;
    }

    initGenderButtons();
    updateGenderButtons();
    renderBaseAvatar();
    renderOverlays();
    renderSkinList();
    renderCategoryBar();
    renderItemsGrid();
    updateSummary();
  })();
})();

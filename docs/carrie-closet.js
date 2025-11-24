// carrie-closet.js
// Front-end logic for carrie-closet.html
// Uses window.CARRIE_CLOSET_DATA defined in carrie-closet--data.js

(function () {
  document.addEventListener("DOMContentLoaded", initCarrieCloset);

  function initCarrieCloset() {
    const loadingEl = document.getElementById("closetLoading");
    const errorEl = document.getElementById("closetError");
    const mainEl = document.getElementById("closetMain");
    const itemsGrid = document.getElementById("closetItemsGrid");
    const emptyEl = document.getElementById("closetEmpty");
    const genderFilterEl = document.getElementById("closetGenderFilter");
    const typeFilterEl = document.getElementById("closetTypeFilter");
    const coinEl = document.getElementById("closetCoinBalance");
    const genderLabelEl = document.getElementById("closetGenderLabel");

    const layerEls = {
      skin: document.getElementById("layer-skin"),
      eyes: document.getElementById("layer-eyes"),
      hair: document.getElementById("layer-hair"),
      top: document.getElementById("layer-top"),
      bottom: document.getElementById("layer-bottom"),
      shoes: document.getElementById("layer-shoes"),
      jewelry: document.getElementById("layer-jewelry"),
    };

    // Check that data exists
    const data = window.CARRIE_CLOSET_DATA;
    if (!data || !Array.isArray(data.items)) {
      if (loadingEl) loadingEl.style.display = "none";
      if (errorEl) errorEl.classList.remove("hidden");
      console.error("Carrie Closet: CARRIE_CLOSET_DATA not found or invalid.");
      return;
    }

    const allItems = data.items.slice();
    const itemById = new Map();
    allItems.forEach((item) => {
      if (item && item.id) {
        itemById.set(item.id, item);
      }
    });

    // ---------- State

    let state = loadState();
    let ownedSet = new Set(state.owned || []);

    // Initialize UI from state
    if (genderFilterEl) genderFilterEl.value = state.gender || "female";
    if (typeFilterEl) typeFilterEl.value = "all";

    updateCoinLabel();
    updateGenderLabel();
    applyEquippedToPreview();
    renderItems();

    if (loadingEl) loadingEl.style.display = "none";
    if (mainEl) mainEl.classList.remove("hidden");

    // ---------- Event wiring

    if (genderFilterEl) {
      genderFilterEl.addEventListener("change", () => {
        state.gender = genderFilterEl.value || "female";
        saveState();
        updateGenderLabel();
        renderItems();
      });
    }

    if (typeFilterEl) {
      typeFilterEl.addEventListener("change", () => {
        renderItems();
      });
    }

    // ---------- Core helpers

    function loadState() {
      const DEFAULT_COINS = 500;
      let baseGender = data.defaultGender || "female";
      let baseSkinId = data.defaultSkinId || null;
      let baseEyesId = data.defaultEyesId || null;
      let baseOutfitId = data.defaultOutfitId || null;

      try {
        const raw = localStorage.getItem("carrie_closet_state_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          // Very basic sanity check
          if (parsed && typeof parsed === "object") {
            if (!parsed.equipped) parsed.equipped = {};
            if (!parsed.gender) parsed.gender = baseGender;
            if (!Array.isArray(parsed.owned)) parsed.owned = [];
            if (typeof parsed.coins !== "number") parsed.coins = DEFAULT_COINS;
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Carrie Closet: failed to load state", e);
      }

      // Fallback default
      const equipped = {
        skin: baseSkinId,
        eyes: baseEyesId,
        hair: null,
        top: null,
        bottom: null,
        shoes: null,
        jewelry: null,
      };

      if (baseOutfitId && itemById.has(baseOutfitId)) {
        const outfit = itemById.get(baseOutfitId);
        if (outfit && outfit.type && equipped.hasOwnProperty(outfit.type)) {
          equipped[outfit.type] = baseOutfitId;
        }
      }

      // Free items (coins === 0) auto-owned, plus defaults
      const ownedIds = [];
      allItems.forEach((it) => {
        if (it.coins === 0) ownedIds.push(it.id);
      });
      if (baseSkinId && !ownedIds.includes(baseSkinId)) ownedIds.push(baseSkinId);
      if (baseEyesId && !ownedIds.includes(baseEyesId)) ownedIds.push(baseEyesId);
      if (baseOutfitId && !ownedIds.includes(baseOutfitId)) ownedIds.push(baseOutfitId);

      return {
        gender: baseGender,
        coins: DEFAULT_COINS,
        owned: ownedIds,
        equipped,
      };
    }

    function saveState() {
      try {
        const toSave = {
          gender: state.gender,
          coins: state.coins,
          owned: Array.from(ownedSet),
          equipped: state.equipped || {},
        };
        localStorage.setItem("carrie_closet_state_v1", JSON.stringify(toSave));
      } catch (e) {
        console.warn("Carrie Closet: failed to save state", e);
      }
    }

    function updateCoinLabel() {
      if (!coinEl) return;
      const span = coinEl.querySelector("span:last-child");
      if (span) span.textContent = String(state.coins ?? 0);
    }

    function updateGenderLabel() {
      if (!genderLabelEl) return;
      const isFemale = (state.gender || "female") === "female";
      genderLabelEl.innerHTML = "";
      const icon = document.createElement("span");
      icon.textContent = isFemale ? "♀" : "♂";
      const txt = document.createElement("span");
      txt.textContent = isFemale ? "Female" : "Male";
      genderLabelEl.appendChild(icon);
      genderLabelEl.appendChild(txt);
    }

    function applyEquippedToPreview() {
      if (!state.equipped) state.equipped = {};

      const layers = ["skin", "eyes", "hair", "top", "bottom", "shoes", "jewelry"];
      layers.forEach((layerName) => {
        const img = layerEls[layerName];
        if (!img) return;
        const itemId = state.equipped[layerName];
        if (!itemId || !itemById.has(itemId)) {
          img.removeAttribute("src");
          img.style.opacity = 0;
          return;
        }
        const item = itemById.get(itemId);
        img.src = item.src;
        img.style.opacity = 1;
      });
    }

    function isOwned(itemId) {
      return ownedSet.has(itemId);
    }

    function isEquipped(item) {
      if (!item || !item.type || !state.equipped) return false;
      return state.equipped[item.type] === item.id;
    }

    function canSeeItem(item) {
      const g = state.gender || "female";
      if (item.gender === "unisex") return true;
      return item.gender === g;
    }

    function typeMatchesFilter(itemType, filterValue) {
      if (!filterValue || filterValue === "all") return true;
      return itemType === filterValue;
    }

    function renderItems() {
      if (!itemsGrid) return;
      itemsGrid.innerHTML = "";
      if (emptyEl) emptyEl.classList.add("hidden");

      const filterGender = state.gender || "female";
      const filterType = typeFilterEl ? typeFilterEl.value : "all";

      const filtered = allItems.filter((item) => {
        if (!canSeeItem(item)) return false;
        if (!typeMatchesFilter(item.type, filterType)) return false;
        return true;
      });

      if (!filtered.length) {
        if (emptyEl) emptyEl.classList.remove("hidden");
        return;
      }

      filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";

        const thumb = document.createElement("div");
        thumb.className = "item-thumb";
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.label || "";
        thumb.appendChild(img);

        const nameRow = document.createElement("div");
        nameRow.className = "flex justify-between items-center gap-2";
        const label = document.createElement("div");
        label.className = "font-medium text-[11px]";
        label.textContent = item.label || item.id;

        const cost = document.createElement("div");
        cost.className = "coin-tag";
        const coinEmoji = document.createElement("span");
        coinEmoji.textContent = "🪙";
        const costText = document.createElement("span");
        costText.textContent = String(item.coins ?? 0);
        cost.appendChild(coinEmoji);
        cost.appendChild(costText);

        nameRow.appendChild(label);
        nameRow.appendChild(cost);

        const metaRow = document.createElement("div");
        metaRow.className = "item-meta";

        const leftMeta = document.createElement("div");
        leftMeta.className = "flex flex-wrap gap-1";

        // Status tags
        const owned = isOwned(item.id);
        const equipped = isEquipped(item);

        if (equipped) {
          const tag = document.createElement("div");
          tag.className = "status-tag";
          tag.textContent = "Equipped";
          leftMeta.appendChild(tag);
        } else if (owned) {
          const tag = document.createElement("div");
          tag.className = "status-tag";
          tag.textContent = "Owned";
          leftMeta.appendChild(tag);
        } else {
          const tag = document.createElement("div");
          tag.className = "status-tag status-locked";
          tag.textContent = "Locked";
          leftMeta.appendChild(tag);
        }

        const typeTag = document.createElement("div");
        typeTag.className = "text-[10px] opacity-80";
        typeTag.textContent = prettyType(item.type);
        leftMeta.appendChild(typeTag);

        metaRow.appendChild(leftMeta);

        // Right meta: button
        const btnWrap = document.createElement("div");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-mini";

        if (equipped) {
          btn.textContent = "Equipped";
          btn.disabled = true;
        } else if (owned) {
          btn.textContent = "Equip";
          btn.addEventListener("click", () => {
            equipItem(item);
          });
        } else {
          btn.textContent = "Buy";
          if (state.coins < (item.coins ?? 0)) {
            btn.disabled = true;
            btn.title = "Not enough coins";
          }
          btn.addEventListener("click", () => {
            buyAndEquip(item);
          });
        }

        btnWrap.appendChild(btn);
        metaRow.appendChild(btnWrap);

        card.appendChild(thumb);
        card.appendChild(nameRow);
        card.appendChild(metaRow);

        itemsGrid.appendChild(card);
      });
    }

    function prettyType(type) {
      switch (type) {
        case "skin":
          return "Skin tone";
        case "hair":
          return "Hair";
        case "top":
          return "Top";
        case "bottom":
          return "Bottom";
        case "eyes":
          return "Eyes";
        case "jewelry":
          return "Jewelry";
        case "shoes":
          return "Shoes";
        default:
          return type || "";
      }
    }

    function equipItem(item) {
      if (!item || !item.type) return;
      if (!state.equipped) state.equipped = {};
      state.equipped[item.type] = item.id;
      saveState();
      applyEquippedToPreview();
      renderItems();
    }

    function buyAndEquip(item) {
      if (!item) return;
      if (isOwned(item.id)) {
        equipItem(item);
        return;
      }

      const price = item.coins ?? 0;
      if (state.coins < price) {
        alert("Not enough coins for this item yet.");
        return;
      }

      state.coins -= price;
      ownedSet.add(item.id);
      saveState();
      updateCoinLabel();
      equipItem(item);
    }
  }
})();

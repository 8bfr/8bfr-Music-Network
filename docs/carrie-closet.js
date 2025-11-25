// carrie-closet.js
// Front-end logic for Carrie Closet

(function () {
  const data = window.CARRIE_CLOSET_DATA;
  const statusEl = document.getElementById("closetStatus");
  const appEl = document.getElementById("closetApp");
  const genderToggleBtns = document.querySelectorAll("[data-gender-toggle]");
  const slotButtonsContainer = document.getElementById("closetSlotButtons");
  const itemListEl = document.getElementById("closetItemList");
  const coinsEl = document.getElementById("closetCoins");
  const previewLayersEl = document.getElementById("closetPreviewLayers");

  if (!data || !data.slots || !data.items) {
    if (statusEl) {
      statusEl.textContent =
        "Closet data failed to load. Please check carrie-closet--data.js.";
    }
    return;
  }

  let currentGender = "female";
  let activeSlotId = "base";
  let coins = data.coinsStart || 500;

  // itemId -> true (already paid)
  const owned = {};
  // slotId -> itemId
  const equipped = {};

  const layerOrder = ["base", "outfit", "hair", "eyes", "jewelry", "shoes"];
  const layerElements = {};

  function initLayers() {
    if (!previewLayersEl) return;
    previewLayersEl.innerHTML = "";
    layerOrder.forEach((slotId) => {
      const img = document.createElement("img");
      img.className = "closet-layer closet-layer-" + slotId;
      img.alt = slotId + " layer";
      img.style.display = "none";
      previewLayersEl.appendChild(img);
      layerElements[slotId] = img;
    });
  }

  function formatPrice(item) {
    if (!item.price || item.price <= 0) return "Free";
    return item.price + " coins";
  }

  function rarityTag(rarity) {
    if (!rarity) return "";
    const r = rarity.toLowerCase();
    if (r === "default") return "Default";
    if (r === "common") return "Common";
    if (r === "rare") return "Rare";
    if (r === "epic") return "Epic";
    return rarity;
  }

  function isItemVisibleForGender(item, gender) {
    if (!item.gender || item.gender === "unisex") return true;
    return item.gender === gender;
  }

  function getItemsForSlot(slotId, gender) {
    return data.items.filter(
      (item) => item.slot === slotId && isItemVisibleForGender(item, gender)
    );
  }

  function updateCoinsDisplay() {
    if (!coinsEl) return;
    coinsEl.textContent = coins;
  }

  function setEquipped(slotId, itemId) {
    equipped[slotId] = itemId;
    const item = data.items.find((i) => i.id === itemId);
    const layer = layerElements[slotId];
    if (!item || !layer) return;
    layer.src = item.src;
    layer.style.display = "block";
  }

  function applyDefaultLoadout() {
    if (currentGender === "female") {
      setEquipped("base", "base_female_light");
      setEquipped("outfit", "outfit_female_bikini");
      setEquipped("hair", "hair_straight_brown");
      setEquipped("eyes", "eyes_brown");
      setEquipped("jewelry", "jewel_female_necklace");
      setEquipped("shoes", "shoes_sneakers");
    } else {
      setEquipped("base", "base_male_light");
      setEquipped("outfit", "outfit_unisex_tank");
      setEquipped("hair", null); // no male hair yet
      setEquipped("eyes", "eyes_brown");
      setEquipped("jewelry", "jewel_male_necklace");
      setEquipped("shoes", "shoes_sneakers");
    }

    // respect missing items
    layerOrder.forEach((slotId) => {
      if (!equipped[slotId]) return;
      const item = data.items.find((i) => i.id === equipped[slotId]);
      const layer = layerElements[slotId];
      if (item && layer) {
        layer.src = item.src;
        layer.style.display = "block";
      }
    });
  }

  function renderSlotButtons() {
    if (!slotButtonsContainer) return;
    slotButtonsContainer.innerHTML = "";

    data.slots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "closet-slot-btn" +
        (slot.id === activeSlotId ? " closet-slot-btn-active" : "");
      btn.dataset.slotId = slot.id;
      btn.innerHTML =
        `<span class="mr-1">${slot.icon || "•"}</span>` + slot.label;
      slotButtonsContainer.appendChild(btn);
    });
  }

  function renderItemsForActiveSlot() {
    if (!itemListEl) return;
    const slotId = activeSlotId;
    const items = getItemsForSlot(slotId, currentGender);

    itemListEl.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "text-xs text-purple-200/75";
      empty.textContent = "No items available for this slot yet.";
      itemListEl.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const ownedAlready = !!owned[item.id];
      const equippedHere = equipped[slotId] === item.id;

      const row = document.createElement("button");
      row.type = "button";
      row.className =
        "closet-item-row" + (equippedHere ? " closet-item-row-active" : "");
      row.dataset.itemId = item.id;

      const left = document.createElement("div");
      left.className = "flex flex-col";

      const title = document.createElement("span");
      title.className = "text-xs font-semibold";
      title.textContent = item.label;

      const meta = document.createElement("span");
      meta.className = "text-[10px] opacity-80";
      meta.textContent = rarityTag(item.rarity || "common");

      left.appendChild(title);
      left.appendChild(meta);

      const right = document.createElement("div");
      right.className = "text-right text-[11px] flex flex-col items-end";

      const priceSpan = document.createElement("span");
      priceSpan.textContent = formatPrice(item);

      const statusSpan = document.createElement("span");
      statusSpan.className = "text-[10px] opacity-80";
      if (equippedHere) {
        statusSpan.textContent = "Equipped";
      } else if (ownedAlready || item.price === 0) {
        statusSpan.textContent = "Owned";
      } else {
        statusSpan.textContent = "";
      }

      right.appendChild(priceSpan);
      right.appendChild(statusSpan);

      row.appendChild(left);
      row.appendChild(right);
      itemListEl.appendChild(row);
    });
  }

  function handleItemClick(itemId) {
    const item = data.items.find((i) => i.id === itemId);
    if (!item) return;
    const slotId = item.slot;

    if (!owned[itemId] && item.price && item.price > 0) {
      if (coins < item.price) {
        alert("Not enough coins for that item yet.");
        return;
      }
      coins -= item.price;
      owned[itemId] = true;
      updateCoinsDisplay();
    }

    equipped[slotId] = itemId;
    const layer = layerElements[slotId];
    if (layer) {
      layer.src = item.src;
      layer.style.display = "block";
    }

    renderItemsForActiveSlot();
  }

  function wireEvents() {
    // gender toggle
    genderToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.getAttribute("data-gender-toggle");
        if (!g || g === currentGender) return;
        currentGender = g;

        genderToggleBtns.forEach((b) => {
          if (b.getAttribute("data-gender-toggle") === currentGender) {
            b.classList.add("gender-pill-active");
          } else {
            b.classList.remove("gender-pill-active");
          }
        });

        // reset equipped for new gender
        Object.keys(equipped).forEach((slotId) => {
          equipped[slotId] = null;
          const layer = layerElements[slotId];
          if (layer) layer.style.display = "none";
        });
        applyDefaultLoadout();
        renderItemsForActiveSlot();
      });
    });

    // slot buttons
    if (slotButtonsContainer) {
      slotButtonsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".closet-slot-btn");
        if (!btn) return;
        const slotId = btn.dataset.slotId;
        if (!slotId || slotId === activeSlotId) return;
        activeSlotId = slotId;
        renderSlotButtons();
        renderItemsForActiveSlot();
      });
    }

    // items
    if (itemListEl) {
      itemListEl.addEventListener("click", (e) => {
        const row = e.target.closest(".closet-item-row");
        if (!row) return;
        const itemId = row.dataset.itemId;
        if (!itemId) return;
        handleItemClick(itemId);
      });
    }
  }

  function init() {
    if (statusEl) statusEl.textContent = "Carrie Closet (beta) ready.";
    if (appEl) appEl.classList.remove("hidden");

    initLayers();
    updateCoinsDisplay();
    applyDefaultLoadout();
    renderSlotButtons();
    renderItemsForActiveSlot();
    wireEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

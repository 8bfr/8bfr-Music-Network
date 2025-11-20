// carrie-closet.js
// Renders items from carrie-closet-data.js onto carrie-closet.html

(function () {
  const gridEl = document.getElementById("closetGrid");
  const emptyEl = document.getElementById("closetEmpty");
  const countEl = document.getElementById("closetItemCount");
  const filterRowPrimary = document.getElementById("filterRowPrimary");
  const filterResetBtn = document.getElementById("filterReset");

  // Safely read from data file
  const ALL_ITEMS = Array.isArray(window.CARRIE_CLOSET_ALL)
    ? window.CARRIE_CLOSET_ALL
    : [];

  // If nothing is loaded, show a quick message for debugging
  if (!ALL_ITEMS.length && countEl) {
    countEl.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
      <span>No closet items loaded (check carrie-closet-data.js is included before this script).</span>
    `;
  }

  // ------------- Filter state -------------

  let activeSlot = "all";   // outfit, hair, eyes, skin, accessory, makeup
  let activeStyle = "all";  // casual, conservative, sexy, swim, theme, etc.

  const SLOT_FILTERS = [
    { id: "all", label: "All" },
    { id: "outfit", label: "Outfits" },
    { id: "hair", label: "Hair" },
    { id: "eyes", label: "Eyes" },
    { id: "skin", label: "Skin" },
    { id: "accessory", label: "Accessories" },
    { id: "makeup", label: "Makeup" },
  ];

  const STYLE_FILTERS = [
    { id: "casual", label: "Casual" },
    { id: "conservative", label: "Conservative" },
    { id: "sexy", label: "Sexy" },
    { id: "street", label: "Street" },
    { id: "skirt", label: "Skirts" },
    { id: "swim", label: "Swim / Bikini" },
    { id: "sleep", label: "Sleep / Lounge" },
    { id: "theme", label: "Theme / Festival" },
  ];

  // ------------- Helpers -------------

  function rarityClass(rarity) {
    switch (rarity) {
      case "legendary":
        return "rarity-pill rarity-legendary";
      case "epic":
        return "rarity-pill rarity-epic";
      case "rare":
        return "rarity-pill rarity-rare";
      case "common":
      case "uncommon":
      default:
        return "rarity-pill rarity-common";
    }
  }

  function rarityLabel(rarity) {
    if (!rarity) return "Common";
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  }

  function slotLabel(slot) {
    switch (slot) {
      case "outfit":
        return "Outfit";
      case "hair":
        return "Hair";
      case "eyes":
        return "Eyes";
      case "skin":
        return "Skin";
      case "accessory":
        return "Accessory";
      case "makeup":
        return "Makeup";
      default:
        return "Item";
    }
  }

  function styleLabel(style) {
    if (!style) return "";
    if (style === "swim") return "Swim / Bikini";
    if (style === "sleep") return "Sleep / Lounge";
    if (style === "theme") return "Theme / Festival";
    return style.charAt(0).toUpperCase() + style.slice(1);
  }

  // ------------- Rendering -------------

  function renderFilters() {
    if (!filterRowPrimary) return;

    filterRowPrimary.innerHTML = "";

    // Slot filters
    SLOT_FILTERS.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "filter-pill " + (activeSlot === f.id ? "active" : "");
      btn.dataset.slot = f.id;
      btn.textContent = f.label;
      filterRowPrimary.appendChild(btn);
    });

    // Divider
    const dot = document.createElement("span");
    dot.className = "mx-1 text-[10px] text-purple-400/80";
    dot.textContent = "•";
    filterRowPrimary.appendChild(dot);

    // Style filters
    STYLE_FILTERS.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "filter-pill " + (activeStyle === f.id ? "active" : "");
      btn.dataset.style = f.id;
      btn.textContent = f.label;
      filterRowPrimary.appendChild(btn);
    });
  }

  function matchesFilters(item) {
    if (activeSlot !== "all") {
      if (item.slot !== activeSlot) return false;
    }
    if (activeStyle !== "all") {
      if (item.style !== activeStyle) return false;
    }
    return true;
  }

  function renderGrid() {
    if (!gridEl) return;

    const visible = ALL_ITEMS.filter(matchesFilters);

    gridEl.innerHTML = "";

    if (countEl) {
      const total = ALL_ITEMS.length;
      const visibleCount = visible.length;
      if (total === 0) {
        countEl.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          <span>No closet items loaded.</span>
        `;
      } else if (visibleCount === total) {
        countEl.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>${total} items in Carrie’s closet</span>
        `;
      } else {
        countEl.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>${visibleCount} of ${total} items shown</span>
        `;
      }
    }

    if (visible.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    } else {
      if (emptyEl) emptyEl.classList.add("hidden");
    }

    visible.forEach((item) => {
      const card = document.createElement("article");
      card.className = "closet-card";

      // Header row
      const header = document.createElement("div");
      header.className = "closet-card-header";

      const left = document.createElement("div");
      const title = document.createElement("h2");
      title.className = "closet-card-title";
      title.textContent = item.name;

      const slotSpan = document.createElement("span");
      slotSpan.className = "tag-chip";
      slotSpan.textContent = slotLabel(item.slot);

      left.appendChild(title);
      left.appendChild(slotSpan);

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.flexDirection = "column";
      right.style.alignItems = "flex-end";
      right.style.gap = "0.25rem";

      const coins = document.createElement("div");
      coins.className = "closet-card-coins";
      coins.innerHTML = `🪙 <span>${item.coins}</span>`;

      const rarity = document.createElement("div");
      rarity.className = rarityClass(item.rarity);
      rarity.textContent = rarityLabel(item.rarity);

      right.appendChild(coins);
      right.appendChild(rarity);

      header.appendChild(left);
      header.appendChild(right);

      // Description
      const desc = document.createElement("p");
      desc.className = "text-xs text-slate-200/90";
      desc.textContent = item.description || "";

      // Tags row
      const tagsRow = document.createElement("div");
      tagsRow.className = "flex flex-wrap gap-1 mt-1";

      if (item.style) {
        const styleTag = document.createElement("span");
        styleTag.className = "tag-chip";
        styleTag.textContent = styleLabel(item.style);
        tagsRow.appendChild(styleTag);
      }

      if (Array.isArray(item.tags)) {
        item.tags.slice(0, 3).forEach((t) => {
          const tag = document.createElement("span");
          tag.className = "tag-chip";
          tag.textContent = t;
          tagsRow.appendChild(tag);
        });
      }

      // Buttons
      const btnRow = document.createElement("div");
      btnRow.className = "mt-2 flex flex-wrap items-center justify-between gap-2";

      const previewBtn = document.createElement("button");
      previewBtn.type = "button";
      previewBtn.className = "btn-sm";
      previewBtn.textContent = "Preview (coming soon)";
      previewBtn.disabled = true;

      const buyBtn = document.createElement("button");
      buyBtn.type = "button";
      buyBtn.className = "btn-sm btn-sm-primary";
      buyBtn.innerHTML = `Buy for ${item.coins} 🪙`;
      buyBtn.disabled = true; // backend hook in future

      btnRow.appendChild(previewBtn);
      btnRow.appendChild(buyBtn);

      card.appendChild(header);
      card.appendChild(desc);
      card.appendChild(tagsRow);
      card.appendChild(btnRow);

      gridEl.appendChild(card);
    });
  }

  // ------------- Event wiring -------------

  function handleFilterClick(e) {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;

    const slot = btn.dataset.slot;
    const style = btn.dataset.style;

    if (slot !== undefined) {
      activeSlot = slot;
    }
    if (style !== undefined) {
      activeStyle = style;
    }

    renderFilters();
    renderGrid();
  }

  function handleReset() {
    activeSlot = "all";
    activeStyle = "all";
    renderFilters();
    renderGrid();
  }

  // ------------- Init -------------

  function init() {
    renderFilters();
    renderGrid();

    if (filterRowPrimary) {
      filterRowPrimary.addEventListener("click", handleFilterClick);
    }
    if (filterResetBtn) {
      filterResetBtn.addEventListener("click", handleReset);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

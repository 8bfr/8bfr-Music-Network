// carrie-closet.js
// Logic for Carrie Closet page

(function () {
  const baseImg = document.getElementById("closetBaseImg");
  const overlayHost = document.getElementById("closetOverlayHost");
  const previewLabel = document.getElementById("closetPreviewLabel");
  const genderLabel = document.getElementById("closetGenderLabel");
  const skinToneButtonsHost = document.getElementById("skinToneButtons");
  const itemsGrid = document.getElementById("closetItemsGrid");
  const errorBox = document.getElementById("closetError");
  const emptyBox = document.getElementById("closetEmpty");

  if (!baseImg || !overlayHost || !itemsGrid) {
    console.warn("Carrie Closet: required DOM nodes missing.");
    return;
  }

  // -------- Base config (paths must match your repo) --------

  const SKIN_CONFIG = {
    female: [
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
    male: [
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
  };

  const state = {
    gender: "female",
    skinToneId: "light",
    category: "hair",
    items: [],
    activeByLayer: {}, // { layer: itemId }
  };

  // -------- Helpers --------

  function setError(msg) {
    if (!errorBox) return;
    if (msg) {
      errorBox.textContent = msg;
      errorBox.classList.remove("hidden");
    } else {
      errorBox.classList.add("hidden");
    }
  }

  function setEmptyVisible(isEmpty) {
    if (!emptyBox) return;
    if (isEmpty) {
      emptyBox.classList.remove("hidden");
    } else {
      emptyBox.classList.add("hidden");
    }
  }

  function getCurrentSkinConfig() {
    const list = SKIN_CONFIG[state.gender] || [];
    return {
      list,
      current:
        list.find((s) => s.id === state.skinToneId) ||
        list[0] ||
        null,
    };
  }

  function updateBaseImage() {
    const cfg = getCurrentSkinConfig();
    if (!cfg.current) return;
    baseImg.src = cfg.current.src;

    if (previewLabel) {
      previewLabel.textContent =
        (state.gender === "female" ? "Female" : "Male") +
        " • " +
        cfg.current.label +
        " skin • Default base";
    }
  }

  function clearLayer(layer) {
    if (!overlayHost) return;
    const el = overlayHost.querySelector(".layer-" + layer);
    if (el) el.remove();
    delete state.activeByLayer[layer];
  }

  function setLayer(layer, src) {
    if (!overlayHost) return;

    // remove old element for this layer
    const existing = overlayHost.querySelector(".layer-" + layer);
    if (existing) existing.remove();

    if (!src) {
      delete state.activeByLayer[layer];
      return;
    }

    const img = document.createElement("img");
    img.className = "layer-overlay layer-" + layer;
    img.src = src;
    overlayHost.appendChild(img);

    state.activeByLayer[layer] = true;
  }

  function onItemClick(item, cardEl) {
    const layer = item.layer || "top";

    // If this layer already active with this same item, toggle off
    const isActive = cardEl.classList.contains("active");
    if (isActive) {
      clearLayer(layer);
      cardEl.classList.remove("active");
      return;
    }

    // Remove active from other cards in this category currently visible
    if (itemsGrid) {
      const cards = itemsGrid.querySelectorAll(
        ".closet-item-card[data-layer='" + layer + "']"
      );
      cards.forEach((c) => c.classList.remove("active"));
    }

    // Set new layer image
    setLayer(layer, item.src);

    // Mark active
    cardEl.classList.add("active");
  }

  // -------- Render skin tone buttons --------

  function renderSkinToneButtons() {
    if (!skinToneButtonsHost) return;
    const { list } = getCurrentSkinConfig();
    skinToneButtonsHost.innerHTML = "";

    list.forEach((tone) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = tone.label;
      btn.className =
        "seg-btn" + (tone.id === state.skinToneId ? " active" : "");
      btn.dataset.skinId = tone.id;
      btn.addEventListener("click", () => {
        state.skinToneId = tone.id;
        renderSkinToneButtons();
        updateBaseImage();
      });
      skinToneButtonsHost.appendChild(btn);
    });
  }

  // -------- Render items grid --------

  function renderItems() {
    if (!itemsGrid) return;
    if (!Array.isArray(state.items)) {
      setError("Closet item data missing or invalid.");
      return;
    }

    setError(null);

    // filter by gender + category
    const visible = state.items.filter((item) => {
      if (
        item.gender !== "unisex" &&
        item.gender !== state.gender
      ) {
        return false;
      }
      if (state.category === "all") return true;
      return item.category === state.category;
    });

    itemsGrid.innerHTML = "";

    if (visible.length === 0) {
      setEmptyVisible(true);
      return;
    }
    setEmptyVisible(false);

    visible.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "closet-item-card";
      card.dataset.layer = item.layer || "top";

      const thumb = document.createElement("div");
      thumb.className = "closet-item-thumb";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label || "";
      thumb.appendChild(img);

      const textWrap = document.createElement("div");
      const title = document.createElement("div");
      title.textContent = item.label || "Item";
      title.className = "text-xs font-semibold text-purple-50";

      const meta = document.createElement("div");
      meta.className = "text-[10px] text-purple-200/80";
      meta.textContent =
        (item.gender === "female"
          ? "Female"
          : item.gender === "male"
          ? "Male"
          : "Unisex") +
        " • " +
        item.category +
        " • " +
        item.coins +
        " coins";

      textWrap.appendChild(title);
      textWrap.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(textWrap);

      card.addEventListener("click", () => onItemClick(item, card));

      itemsGrid.appendChild(card);
    });
  }

  // -------- Wire gender buttons --------

  function wireGenderButtons() {
    const genderBtns = document.querySelectorAll("[data-gender]");
    genderBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.getAttribute("data-gender");
        if (!g || (g !== "female" && g !== "male")) return;
        state.gender = g;
        state.skinToneId = "light";
        state.activeByLayer = {};
        overlayHost.innerHTML = "";

        genderBtns.forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        if (genderLabel) {
          genderLabel.innerHTML =
            'Showing items for <b>' +
            (g === "female" ? "Female" : "Male") +
            "</b> avatar";
        }

        renderSkinToneButtons();
        updateBaseImage();
        renderItems();
      });
    });
  }

  // -------- Wire category tabs --------

  function wireCategoryTabs() {
    const tabs = document.querySelectorAll(".tab-btn[data-cat]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const cat = tab.getAttribute("data-cat") || "all";
        state.category = cat;

        tabs.forEach((t) =>
          t.classList.remove("active")
        );
        tab.classList.add("active");

        renderItems();
      });
    });
  }

  // -------- Init --------

  function init() {
    // Load items from data file
    if (!Array.isArray(window.CARRIE_CLOSET_ITEMS)) {
      setError(
        "Closet data failed to load. Check carrie-closet-data.js."
      );
      return;
    }

    state.items = window.CARRIE_CLOSET_ITEMS.slice();

    renderSkinToneButtons();
    updateBaseImage();
    wireGenderButtons();
    wireCategoryTabs();
    renderItems();

    console.log(
      "Carrie Closet initialized with",
      state.items.length,
      "items"
    );
  }

  // run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

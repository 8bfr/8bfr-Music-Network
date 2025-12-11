// carrie-closet.js
// Logic for Carrie Closet preview + item selection + saved state

(function () {
  const STORAGE_KEY = "carrieClosetState_v1";

  function init() {
    // ----- Data -----
    const items = Array.isArray(window.CARRIE_CLOSET_ITEMS)
      ? window.CARRIE_CLOSET_ITEMS
      : [];

    // ----- DOM refs -----
    const bodyEl             = document.body;
    const baseImgEl          = document.getElementById("closetBaseImg");
    const overlayHostEl      = document.getElementById("closetOverlayHost");
    const previewLabelEl     = document.getElementById("closetPreviewLabel");
    const genderLabelEl      = document.getElementById("closetGenderLabel");
    const genderButtons      = document.querySelectorAll(".seg-btn[data-gender]");
    const skinToneButtonsBox = document.getElementById("skinToneButtons");
    const tabButtons         = document.querySelectorAll(".tab-btn[data-cat]");
    const itemsGridEl        = document.getElementById("closetItemsGrid");
    const closetErrorEl      = document.getElementById("closetError");
    const closetEmptyEl      = document.getElementById("closetEmpty");

    // Safety check
    if (!items.length || !baseImgEl || !overlayHostEl || !itemsGridEl) {
      if (closetErrorEl) {
        closetErrorEl.classList.remove("hidden");
        closetErrorEl.textContent =
          "Closet data or key DOM elements are missing.";
      }
      console.warn("Carrie Closet: no items or missing DOM nodes.");
      return;
    } else if (closetErrorEl) {
      closetErrorEl.classList.add("hidden");
    }

    // ----- Base image paths -----
    const BASE_SRC = {
      female: {
        light: "assets/images/base/female/base_female_light.png?v=15",
        dark:  "assets/images/base/female/base_female_dark.png?v=15",
      },
      male: {
        light: "assets/images/base/male/base_male_light.png?v=15",
        dark:  "assets/images/base/male/base_male_dark.png?v=15",
      },
    };

    // Light / dark only
    const SKIN_TONES = [
      { id: "light", label: "Light" },
      { id: "dark",  label: "Dark" },
    ];

    // Layer order: earlier = behind, later = in front
    const SLOT_RENDER_ORDER = [
      "shoes",
      "bottom",
      "top",
      "belly",
      "necklace",
      "eyes",
      "hair",
      "ears",
    ];

    // ----- State (with restore from localStorage) -----
    let currentGender   = "female";
    let currentSkin     = "light";
    let currentCategory = "hair"; // default tab
    let selectedBySlot  = {};     // { slot: itemId }

    (function restoreState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return;

        if (parsed.gender === "female" || parsed.gender === "male") {
          currentGender = parsed.gender;
        }
        if (parsed.skin === "light" || parsed.skin === "dark") {
          currentSkin = parsed.skin;
        }
        if (parsed.selectedBySlot && typeof parsed.selectedBySlot === "object") {
          selectedBySlot = parsed.selectedBySlot;
        }
      } catch (e) {
        console.warn("Closet: could not restore state", e);
      }
    })();

    function saveState() {
      try {
        const payload = {
          gender: currentGender,
          skin: currentSkin,
          selectedBySlot,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn("Closet: could not save state", e);
      }
    }

    // ----- Helpers -----
    function capitalize(s) {
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
    }

    function skinToneLabel(id) {
      const tone = SKIN_TONES.find((t) => t.id === id);
      return tone ? tone.label : id;
    }

    function itemMatchesCurrentGender(item) {
      return item.gender === "unisex" || item.gender === currentGender;
    }

    function getVisibleItemsForCategory() {
      return items.filter((it) => {
        if (!itemMatchesCurrentGender(it)) return false;
        if (currentCategory === "all") return true;
        return it.category === currentCategory;
      });
    }

    function getItemById(id) {
      if (!id) return null;
      return items.find((it) => it.id === id) || null;
    }

    // ----- UI updates -----
    function updateBodyAttributes() {
      if (!bodyEl) return;
      bodyEl.setAttribute("data-gender", currentGender);
      bodyEl.setAttribute("data-skin", currentSkin);
    }

    function updateBaseImage() {
      const genderMap = BASE_SRC[currentGender] || BASE_SRC["female"];
      const src = genderMap[currentSkin] || genderMap["light"];
      if (baseImgEl && src) {
        baseImgEl.src = src;
      }

      if (previewLabelEl) {
        const baseText =
          currentGender === "female" ? "Bikini base" : "Shorts base";
        previewLabelEl.textContent =
          `${capitalize(currentGender)} • ${skinToneLabel(currentSkin)} skin • ${baseText}`;
      }
    }

    function updateGenderButtonsUI() {
      genderButtons.forEach((btn) => {
        const g = btn.getAttribute("data-gender");
        if (!g) return;
        if (g === currentGender) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      if (genderLabelEl) {
        genderLabelEl.innerHTML =
          `Showing items for <b>${capitalize(currentGender)}</b> avatar`;
      }
    }

    function renderSkinToneButtons() {
      if (!skinToneButtonsBox) return;
      skinToneButtonsBox.innerHTML = "";

      SKIN_TONES.forEach((tone) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "seg-btn text-[10px]" +
          (tone.id === currentSkin ? " active" : "");
        btn.setAttribute("data-skin", tone.id);
        btn.textContent = tone.label;

        btn.addEventListener("click", () => {
          if (currentSkin === tone.id) return;
          currentSkin = tone.id;
          renderSkinToneButtons(); // refresh active state
          updateBodyAttributes();
          updateBaseImage();
          renderOverlays(); // keep clothes, just swap base
          saveState();
        });

        skinToneButtonsBox.appendChild(btn);
      });
    }

    function updateTabsUI() {
      tabButtons.forEach((btn) => {
        const cat = btn.getAttribute("data-cat") || "all";
        if (cat === currentCategory) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // ----- Render overlays on the avatar -----
    function renderOverlays() {
      if (!overlayHostEl) return;
      overlayHostEl.innerHTML = "";

      updateBodyAttributes();

      SLOT_RENDER_ORDER.forEach((slot) => {
        const itemId = selectedBySlot[slot];
        if (!itemId) return;

        const item = getItemById(itemId);
        if (!item) return;
        if (!itemMatchesCurrentGender(item)) return;

        const src = item.img;
        if (!src) return;

        // Earrings: two copies (left + right)
        if (slot === "ears") {
          const left = document.createElement("img");
          left.src = src;
          left.alt = item.name || item.label || "Earrings";
          left.className = "layer-overlay layer-ears-left item-" + item.id;

          const right = document.createElement("img");
          right.src = src;
          right.alt = item.name || item.label || "Earrings";
          right.className = "layer-overlay layer-ears-right item-" + item.id;

          overlayHostEl.appendChild(left);
          overlayHostEl.appendChild(right);
          return;
        }

        // Shoes: two copies (left + right)
        if (slot === "shoes") {
          const left = document.createElement("img");
          left.src = src;
          left.alt = item.name || item.label || "Shoes";
          left.className = "layer-overlay layer-shoes-left item-" + item.id;

          const right = document.createElement("img");
          right.src = src;
          right.alt = item.name || item.label || "Shoes";
          right.className = "layer-overlay layer-shoes-right item-" + item.id;

          overlayHostEl.appendChild(left);
          overlayHostEl.appendChild(right);
          return;
        }

        // Normal single overlay (hair, top, bottom, eyes, necklace, belly)
        const imgEl = document.createElement("img");
        imgEl.src = src;
        imgEl.alt = item.name || item.label || slot;
        imgEl.className = "layer-overlay item-" + item.id;
        overlayHostEl.appendChild(imgEl);
      });
    }

    // ----- Render the item cards on the right -----
    function renderItemsGrid() {
      if (!itemsGridEl) return;
      itemsGridEl.innerHTML = "";

      const visible = getVisibleItemsForCategory();

      if (closetEmptyEl) {
        closetEmptyEl.classList.toggle("hidden", visible.length > 0);
      }

      if (!visible.length) return;

      visible.forEach((item) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "closet-item-card";

        const thumbWrap = document.createElement("div");
        thumbWrap.className = "closet-item-thumb";

        const imgEl = document.createElement("img");
        imgEl.src = item.thumb || item.img || "";
        imgEl.alt = item.name || item.label || "";
        thumbWrap.appendChild(imgEl);

        const textWrap = document.createElement("div");
        textWrap.style.flex = "1";

        const title = document.createElement("div");
        title.style.fontSize = "11px";
        title.style.fontWeight = "600";
        title.textContent = item.name || item.label || item.id;

        const meta = document.createElement("div");
        meta.style.fontSize = "10px";
        meta.style.opacity = "0.8";
        meta.textContent =
          (item.label || "") +
          (item.coins ? ` • ${item.coins}🪙` : "");

        textWrap.appendChild(title);
        textWrap.appendChild(meta);

        card.appendChild(thumbWrap);
        card.appendChild(textWrap);

        const isSelected = selectedBySlot[item.slot] === item.id;
        if (isSelected) {
          card.classList.add("active");
        }

        card.addEventListener("click", () => {
          const currentSelectedId = selectedBySlot[item.slot];
          if (currentSelectedId === item.id) {
            // Clicking again will clear this slot
            delete selectedBySlot[item.slot];
          } else {
            selectedBySlot[item.slot] = item.id;
          }

          saveState();
          renderOverlays();
          renderItemsGrid(); // refresh active states
        });

        itemsGridEl.appendChild(card);
      });
    }

    // ----- Event wiring -----
    function initEvents() {
      // Gender buttons
      genderButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const g = btn.getAttribute("data-gender");
          if (!g || g === currentGender) return;
          currentGender = g;
          updateGenderButtonsUI();
          updateBodyAttributes();
          updateBaseImage();
          renderOverlays();
          renderItemsGrid();
          saveState();
        });
      });

      // Category tabs
      tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = btn.getAttribute("data-cat") || "all";
          if (cat === currentCategory) return;
          currentCategory = cat;
          updateTabsUI();
          renderItemsGrid();
        });
      });
    }

    // ----- Initial boot -----
    updateBodyAttributes();
    updateGenderButtonsUI();
    renderSkinToneButtons();
    updateTabsUI();
    updateBaseImage();
    renderOverlays();
    renderItemsGrid();
    initEvents();
  }

  // Wait for DOM if needed
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

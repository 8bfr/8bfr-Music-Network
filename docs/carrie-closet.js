// carrie-closet.js v11 — works with body[data-gender] + separate scale/x/y CSS

(function () {
  // ---- pull closet data from carrie-closet-data.js ----
  const DATA =
    window.CARRIE_CLOSET_ITEMS ||
    window.carrieClosetItems ||
    window.closetItems ||
    [];

  const errorEl = document.getElementById("closetError");
  const emptyEl = document.getElementById("closetEmpty");
  const grid = document.getElementById("closetItemsGrid");
  const overlayHost = document.getElementById("closetOverlayHost");
  const baseImg = document.getElementById("closetBaseImg");
  const previewLabel = document.getElementById("closetPreviewLabel");
  const closetGenderLabel = document.getElementById("closetGenderLabel");
  const skinToneWrap = document.getElementById("skinToneButtons");

  const genderButtons = document.querySelectorAll(".seg-btn[data-gender]");
  const tabButtons = document.querySelectorAll(".tab-btn[data-cat]");

  if (!grid || !overlayHost || !baseImg) {
    console.warn("Carrie Closet: missing required HTML (grid/overlay/base).");
    return;
  }

  if (!Array.isArray(DATA) || DATA.length === 0) {
    console.warn(
      "Carrie Closet: no data found. Expected CARRIE_CLOSET_ITEMS / carrieClosetItems / closetItems."
    );
    if (errorEl) errorEl.classList.remove("hidden");
    return;
  }

  // ---- state ----
  const body = document.body;
  let currentGender =
    body.dataset.gender === "male" || body.dataset.gender === "female"
      ? body.dataset.gender
      : "female";

  let currentSkinTone = "light"; // matches base_female_light / base_male_light
  let currentCategory = "hair";
  let activeSelections = {}; // slot -> itemId

  const SKIN_TONES = [
    { id: "light", label: "Light" },
    { id: "tan", label: "Tan" },
    { id: "brown", label: "Brown" },
    { id: "dark", label: "Dark" },
  ];

  // ---- helpers ----

  function updateBodyDataset() {
    body.dataset.gender = currentGender;
    body.dataset.skinTone = currentSkinTone;
  }

  function updateBase() {
    const toneInfo = SKIN_TONES.find((t) => t.id === currentSkinTone);
    const toneLabel = toneInfo ? toneInfo.label : currentSkinTone;

    const src =
      currentGender === "male"
        ? `assets/images/base/male/base_male_${currentSkinTone}.png`
        : `assets/images/base/female/base_female_${currentSkinTone}.png`;

    baseImg.src = src;

    if (previewLabel) {
      const gLabel = currentGender === "male" ? "Male" : "Female";
      const baseDesc =
        currentGender === "male" ? "Shorts base" : "Bikini base";
      previewLabel.textContent = `${gLabel} • ${toneLabel} skin • ${baseDesc}`;
    }

    if (closetGenderLabel) {
      const gLabel = currentGender === "male" ? "Male" : "Female";
      closetGenderLabel.innerHTML = `Showing items for <b>${gLabel}</b> avatar`;
    }
  }

  function getFilteredItems() {
    return DATA.filter((item) => {
      if (!item) return false;

      const cat = (item.category || item.cat || item.slot || "").toLowerCase();
      const g = (item.gender || item.g || "unisex").toLowerCase();

      const catOk =
        currentCategory === "all" ? true : cat === currentCategory;

      const genderOk =
        g === "unisex" ||
        g === "u" ||
        g === "all" ||
        g === "both" ||
        g === currentGender;

      return catOk && genderOk;
    });
  }

  // ---- render items list (right side) ----

  function renderItems() {
    if (!grid) return;
    grid.innerHTML = "";

    const items = getFilteredItems();

    if (!items.length) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");

    items.forEach((item) => {
      if (!item.id) return;

      const id = item.id;
      const slot = item.slot || item.category || item.cat || "misc";
      const imgSrc = item.img || item.image || item.src;
      const thumbSrc = item.thumb || item.thumbnail || imgSrc;

      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "closet-item-card" +
        (activeSelections[slot] === id ? " active" : "");
      card.dataset.itemId = id;
      card.dataset.slot = slot;

      const thumb = document.createElement("div");
      thumb.className = "closet-item-thumb";
      if (thumbSrc) {
        const img = document.createElement("img");
        img.src = thumbSrc;
        img.alt = item.label || id;
        thumb.appendChild(img);
      }

      const info = document.createElement("div");
      info.className = "flex flex-col gap-0.5";

      const title = document.createElement("div");
      title.className = "text-[11px] font-semibold text-slate-50";
      title.textContent = item.label || id;

      const meta = document.createElement("div");
      meta.className = "text-[10px] text-purple-200/80";
      const catLabel = (item.category || item.cat || slot || "")
        .toString()
        .toUpperCase();
      meta.textContent = catLabel;

      info.appendChild(title);
      info.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(info);

      card.addEventListener("click", () => {
        if (activeSelections[slot] === id) {
          // toggle off
          delete activeSelections[slot];
        } else {
          // one item per slot
          activeSelections[slot] = id;
        }
        renderItems();   // refresh active highlight
        renderOverlays();
      });

      grid.appendChild(card);
    });
  }

  // ---- render overlays on avatar (left side) ----

  function renderOverlays() {
    if (!overlayHost) return;
    overlayHost.innerHTML = "";

    const slotOrder = [
      "bottom",
      "shoes",
      "top",
      "jewelry",
      "eyes",
      "hair",
      "misc",
    ];

    const ordered = Object.entries(activeSelections).sort((a, b) => {
      const [slotA] = a;
      const [slotB] = b;
      const ia = slotOrder.indexOf(slotA);
      const ib = slotOrder.indexOf(slotB);
      return ia - ib;
    });

    ordered.forEach(([slot, id]) => {
      const item = DATA.find((it) => it && it.id === id);
      if (!item) return;

      const imgSrc = item.img || item.image || item.src;
      if (!imgSrc) return;

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = item.label || id;

      // This class hooks into your CSS:
      // .layer-overlay.item-<ID> { ... }
      img.className = "layer-overlay item-" + id;

      if (typeof item.layer === "number") {
        img.style.zIndex = String(item.layer);
      }

      overlayHost.appendChild(img);
    });
  }

  // ---- skin tone buttons ----

  function buildSkinToneButtons() {
    if (!skinToneWrap) return;
    skinToneWrap.innerHTML = "";

    SKIN_TONES.forEach((tone) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "seg-btn" + (tone.id === currentSkinTone ? " active" : "");
      btn.dataset.skinTone = tone.id;
      btn.textContent = tone.label;

      btn.addEventListener("click", () => {
        currentSkinTone = tone.id;
        skinToneWrap
          .querySelectorAll(".seg-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateBodyDataset();
        updateBase();
        renderOverlays(); // keep clothing, just recolor base
      });

      skinToneWrap.appendChild(btn);
    });
  }

  // ---- gender buttons (♀ / ♂) ----

  function wireGenderButtons() {
    genderButtons.forEach((btn) => {
      const g = (btn.dataset.gender || "female").toLowerCase();
      if (g === currentGender) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        currentGender = g === "male" ? "male" : "female";

        genderButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // reset clothing when swapping body shape
        activeSelections = {};

        updateBodyDataset();
        updateBase();
        renderItems();
        renderOverlays();
      });
    });
  }

  // ---- category tabs (Hair / Tops / Bottoms / ...) ----

  function wireTabs() {
    tabButtons.forEach((btn) => {
      const cat = (btn.dataset.cat || "").toLowerCase();
      if (!cat) return;

      if (cat === currentCategory) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        currentCategory = cat;
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderItems();
      });
    });
  }

  // ---- init ----
  updateBodyDataset();
  buildSkinToneButtons();
  wireGenderButtons();
  wireTabs();
  updateBase();
  renderItems();
  renderOverlays();
})();

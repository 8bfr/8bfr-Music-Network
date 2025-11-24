// carrie-closet.js
// Front-end logic for Carrie Closet

(function () {
  const statusEl = document.getElementById("closetStatus");
  const listEl = document.getElementById("closetList");
  const coinsEl = document.getElementById("closetCoins");

  // Preview layers
  const previewBaseFemale = document.getElementById("previewBaseFemale");
  const previewBaseMale = document.getElementById("previewBaseMale");
  const previewHair = document.getElementById("previewHair");
  const previewOutfit = document.getElementById("previewOutfit");
  const previewEyes = document.getElementById("previewEyes");
  const previewJewelry = document.getElementById("previewJewelry");
  const previewShoes = document.getElementById("previewShoes");

  // Simple local coins for now (later hook to real wallet)
  let coins = 100;

  // Current avatar mode (for BF/GF later)
  let currentGender = "female"; // "female" or "male"
  let data = null;

  function safeSetStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function renderCoins() {
    if (!coinsEl) return;
    coinsEl.textContent = coins + " coins";
  }

  // --------- Data loader ---------
  function initData() {
    try {
      if (!window.CARRIE_CLOSET_DATA) {
        throw new Error("CARRIE_CLOSET_DATA is missing");
      }
      data = window.CARRIE_CLOSET_DATA;
    } catch (err) {
      console.error("Closet data error:", err);
      if (listEl) {
        listEl.innerHTML =
          '<p class="text-xs text-red-300/80">Closet data failed to load. Please check <code>carrie-closet--data.js</code> and make sure it is included before <code>carrie-closet.js</code>.</p>';
      }
      safeSetStatus("Closet data failed to load.");
      return false;
    }
    return true;
  }

  // --------- Utility: filter items by gender & slot ---------
  function filterItems(arr, slot) {
    if (!arr) return [];
    return arr.filter((item) => {
      const matchesSlot = !slot || item.slot === slot;
      if (!matchesSlot) return false;
      if (item.gender === "unisex") return true;
      return item.gender === currentGender;
    });
  }

  // --------- Build the inventory list ---------
  function renderList() {
    if (!listEl || !data) return;

    const sections = [];

    // Bases
    const baseKey = currentGender === "female" ? "female" : "male";
    const bases = (data.bases && data.bases[baseKey]) || [];
    if (bases.length) {
      sections.push({
        id: "bases",
        label: "Skin Tone",
        items: bases.map((b) => ({
          ...b,
          type: "base",
        })),
      });
    }

    // Outfits
    const outfits = filterItems(data.outfits, "outfit");
    if (outfits.length) {
      sections.push({
        id: "outfits",
        label: "Outfits",
        items: outfits.map((o) => ({
          ...o,
          type: "outfit",
        })),
      });
    }

    // Hair
    const hair = filterItems(data.hair, "hair");
    if (hair.length) {
      sections.push({
        id: "hair",
        label: "Hair",
        items: hair.map((h) => ({
          ...h,
          type: "hair",
        })),
      });
    }

    // Eyes
    const eyes = filterItems(data.eyes, "eyes");
    if (eyes.length) {
      sections.push({
        id: "eyes",
        label: "Eyes",
        items: eyes.map((e) => ({
          ...e,
          type: "eyes",
        })),
      });
    }

    // Jewelry
    const jewelry = filterItems(data.jewelry, "jewelry");
    if (jewelry.length) {
      sections.push({
        id: "jewelry",
        label: "Jewelry",
        items: jewelry.map((j) => ({
          ...j,
          type: "jewelry",
        })),
      });
    }

    // Shoes
    const shoes = filterItems(data.shoes, "shoes");
    if (shoes.length) {
      sections.push({
        id: "shoes",
        label: "Shoes",
        items: shoes.map((s) => ({
          ...s,
          type: "shoes",
        })),
      });
    }

    // Render it
    const frag = document.createDocumentFragment();

    sections.forEach((section) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mb-4";

      const title = document.createElement("h3");
      title.className =
        "text-[11px] font-semibold uppercase tracking-wide text-purple-200/80 mb-1";
      title.textContent = section.label;
      wrapper.appendChild(title);

      const row = document.createElement("div");
      row.className = "flex flex-wrap gap-1.5";

      section.items.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "closet-item-btn text-left rounded-lg border border-purple-500/40 bg-slate-900/80 hover:bg-slate-800/90 px-2 py-1.5 flex items-center gap-1.5 text-[11px]";
        btn.dataset.itemType = item.type;
        btn.dataset.itemId = item.id;

        const thumb = document.createElement("div");
        thumb.className =
          "w-8 h-8 rounded-md overflow-hidden bg-slate-950/80 border border-purple-500/50 flex items-center justify-center shrink-0";

        if (item.image) {
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.label;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          thumb.appendChild(img);
        } else {
          thumb.textContent = "?";
        }

        const meta = document.createElement("div");
        meta.className = "flex flex-col leading-tight";

        const labelSpan = document.createElement("span");
        labelSpan.textContent = item.label;
        labelSpan.className = "text-[11px] text-purple-50";
        meta.appendChild(labelSpan);

        if (typeof item.cost === "number") {
          const costSpan = document.createElement("span");
          costSpan.className = "text-[10px] text-emerald-300/80";
          costSpan.textContent = item.cost + " coins";
          meta.appendChild(costSpan);
        }

        btn.appendChild(thumb);
        btn.appendChild(meta);
        row.appendChild(btn);
      });

      wrapper.appendChild(row);
      frag.appendChild(wrapper);
    });

    listEl.innerHTML = "";
    listEl.appendChild(frag);

    safeSetStatus("Tap an item to preview — buying will use coins soon.");
  }

  // --------- Preview helpers ---------
  function setBase(id) {
    if (!data || (!previewBaseFemale && !previewBaseMale)) return;
    const list =
      currentGender === "female"
        ? data.bases.female || []
        : data.bases.male || [];
    const found = list.find((b) => b.id === id) || list.find((b) => b.default);
    if (!found) return;

    if (currentGender === "female") {
      if (previewBaseFemale) {
        previewBaseFemale.src = found.image;
        previewBaseFemale.style.display = "block";
      }
      if (previewBaseMale) previewBaseMale.style.display = "none";
    } else {
      if (previewBaseMale) {
        previewBaseMale.src = found.image;
        previewBaseMale.style.display = "block";
      }
      if (previewBaseFemale) previewBaseFemale.style.display = "none";
    }
  }

  function setLayer(imgEl, src) {
    if (!imgEl) return;
    if (!src) {
      imgEl.src = "";
      imgEl.style.display = "none";
      return;
    }
    imgEl.src = src;
    imgEl.style.display = "block";
  }

  // --------- Item click handler ---------
  function handleItemClick(e) {
    const btn = e.target.closest(".closet-item-btn");
    if (!btn) return;
    const type = btn.dataset.itemType;
    const id = btn.dataset.itemId;
    if (!type || !id) return;

    let collection = null;
    if (type === "base") collection = data.bases[currentGender] || [];
    else if (type === "outfit") collection = data.outfits || [];
    else if (type === "hair") collection = data.hair || [];
    else if (type === "eyes") collection = data.eyes || [];
    else if (type === "jewelry") collection = data.jewelry || [];
    else if (type === "shoes") collection = data.shoes || [];

    if (!collection) return;

    const item = collection.find((x) => x.id === id);
    if (!item) return;

    // For now, preview is free. Later we'll subtract coins on "Buy" button.
    if (type === "base") {
      setBase(id);
    } else if (type === "outfit") {
      setLayer(previewOutfit, item.image);
    } else if (type === "hair") {
      setLayer(previewHair, item.image);
    } else if (type === "eyes") {
      setLayer(previewEyes, item.image);
    } else if (type === "jewelry") {
      setLayer(previewJewelry, item.image);
    } else if (type === "shoes") {
      setLayer(previewShoes, item.image);
    }
  }

  // --------- Gender toggle ---------
  function setupGenderToggle() {
    const femaleBtn = document.getElementById("genderFemaleBtn");
    const maleBtn = document.getElementById("genderMaleBtn");
    if (!femaleBtn || !maleBtn) return;

    function refreshButtons() {
      femaleBtn.classList.toggle(
        "bg-purple-600",
        currentGender === "female"
      );
      femaleBtn.classList.toggle(
        "bg-slate-800",
        currentGender !== "female"
      );
      maleBtn.classList.toggle("bg-purple-600", currentGender === "male");
      maleBtn.classList.toggle("bg-slate-800", currentGender !== "male");
    }

    femaleBtn.addEventListener("click", () => {
      if (currentGender === "female") return;
      currentGender = "female";
      renderList();
      setBase(null);
      setLayer(previewHair, null);
      setLayer(previewOutfit, null);
      setLayer(previewEyes, null);
      setLayer(previewJewelry, null);
      setLayer(previewShoes, null);
      refreshButtons();
    });

    maleBtn.addEventListener("click", () => {
      if (currentGender === "male") return;
      currentGender = "male";
      renderList();
      setBase(null);
      setLayer(previewHair, null);
      setLayer(previewOutfit, null);
      setLayer(previewEyes, null);
      setLayer(previewJewelry, null);
      setLayer(previewShoes, null);
      refreshButtons();
    });

    refreshButtons();
  }

  // --------- Init ---------
  function init() {
    safeSetStatus("Loading Carrie Closet…");
    if (!initData()) return;

    renderCoins();
    setupGenderToggle();
    renderList();

    // Default female base & bikini so you see something right away
    setBase(null);
    const defaultBikini =
      (data.outfits || []).find((o) => o.id === "female_bikini") || null;
    if (defaultBikini) {
      setLayer(previewOutfit, defaultBikini.image);
    }

    if (listEl) {
      listEl.addEventListener("click", handleItemClick);
    }

    safeSetStatus("Carrie Closet is in beta • tap items to preview.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();

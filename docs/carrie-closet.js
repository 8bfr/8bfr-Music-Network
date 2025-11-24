// carrie-closet.js
// Front-end logic for Carrie Closet (no global 8BFR UI here)

(function () {
  const data = window.CARRIE_CLOSET_DATA || null;

  // DOM refs
  const loadingEl = document.getElementById("closetLoading");
  const errorEl = document.getElementById("closetError");
  const mainEl = document.getElementById("closetMain");
  const itemsEl = document.getElementById("closetItems");
  const coinsEl = document.getElementById("coinBalance");
  const genderSelect = document.getElementById("genderSelect");

  const previewBase = document.getElementById("previewBase");
  const previewOutfit = document.getElementById("previewOutfit");
  const previewHair = document.getElementById("previewHair");
  const previewJewelry = document.getElementById("previewJewelry");
  const previewUnisexTop = document.getElementById("previewUnisexTop");
  const previewShoes = document.getElementById("previewShoes");
  const previewEyes = document.getElementById("previewEyes");

  if (!loadingEl || !mainEl || !itemsEl || !data || !Array.isArray(data.items)) {
    if (loadingEl) loadingEl.style.display = "none";
    if (errorEl) errorEl.classList.remove("hidden");
    return;
  }

  // State
  let currentGender = data.defaults.gender || "female";
  let selected = {
    baseId: data.defaults.baseId,
    outfitId: data.defaults.outfitId,
    hairId: data.defaults.hairId,
    jewelryId: data.defaults.jewelryId,
    unisexTopId: data.defaults.unisexTopId,
    shoesId: data.defaults.shoesId,
    eyesId: data.defaults.eyesId,
  };

  const coins = data.previewCoins || 0;

  function getItem(id) {
    return data.items.find((it) => it.id === id) || null;
  }

  function itemsFor(slot) {
    return data.items.filter((it) => {
      if (it.slot !== slot) return false;
      if (it.gender === "unisex") return true;
      if (it.gender === currentGender) return true;
      return false;
    });
  }

  function setLayer(imgEl, itemId) {
    if (!imgEl) return;
    if (!itemId) {
      imgEl.src = "";
      imgEl.style.opacity = "0";
      return;
    }
    const item = getItem(itemId);
    if (!item) {
      imgEl.src = "";
      imgEl.style.opacity = "0";
      return;
    }
    imgEl.src = item.img;
    imgEl.style.opacity = "1";
  }

  function updatePreview() {
    // Always have a base
    const baseItem =
      getItem(selected.baseId) ||
      data.items.find((it) => it.slot === "base" && it.gender === currentGender) ||
      data.items.find((it) => it.slot === "base");

    if (baseItem && previewBase) {
      previewBase.src = baseItem.img;
      previewBase.style.opacity = "1";
    }

    setLayer(previewOutfit, selected.outfitId);
    setLayer(previewHair, selected.hairId);
    setLayer(previewJewelry, selected.jewelryId);
    setLayer(previewUnisexTop, selected.unisexTopId);
    setLayer(previewShoes, selected.shoesId);
    setLayer(previewEyes, selected.eyesId);
  }

  function makeItemCard(item, slotKey) {
    const div = document.createElement("button");
    div.type = "button";
    div.className =
      "closet-item border border-purple-500/40 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 transition flex flex-col text-left";

    const isSelected =
      (slotKey === "baseId" && selected.baseId === item.id) ||
      (slotKey === "outfitId" && selected.outfitId === item.id) ||
      (slotKey === "hairId" && selected.hairId === item.id) ||
      (slotKey === "jewelryId" && selected.jewelryId === item.id) ||
      (slotKey === "unisexTopId" && selected.unisexTopId === item.id) ||
      (slotKey === "shoesId" && selected.shoesId === item.id) ||
      (slotKey === "eyesId" && selected.eyesId === item.id);

    if (isSelected) {
      div.classList.add("ring-1", "ring-purple-400");
    }

    div.innerHTML = `
      <div class="w-full aspect-[3/4] overflow-hidden rounded-t-xl bg-slate-950/80 flex items-center justify-center">
        <img
          src="${item.img}"
          alt="${item.label}"
          class="max-h-full max-w-full object-contain"
          onerror="this.style.display='none';"
        />
      </div>
      <div class="px-2.5 py-2 flex justify-between items-center gap-2">
        <div class="text-[11px] leading-tight">
          <div class="font-semibold text-violet-50">${item.label}</div>
          <div class="text-[10px] text-purple-200/80">
            ${item.gender === "unisex" ? "Unisex" : item.gender === "female" ? "Female" : "Male"}
          </div>
        </div>
        <div class="text-right text-[10px]">
          ${
            item.price > 0
              ? `<div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-600/30 border border-emerald-400/60">
                   <span>🪙</span><span>${item.price}</span>
                 </div>`
              : `<span class="text-emerald-300/90 text-[10px]">Free</span>`
          }
        </div>
      </div>
    `;

    div.addEventListener("click", () => {
      // In future: check coin balance here before allowing.
      selected[slotKey] = item.id;
      updatePreview();
      buildItemsUI(); // rebuild list so highlight moves
    });

    return div;
  }

  function makeSection(title, slotKey, description) {
    const container = document.createElement("section");
    container.className = "mb-4";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-1.5";

    const titleEl = document.createElement("h3");
    titleEl.className = "text-xs font-semibold text-purple-100";
    titleEl.textContent = title;

    const descEl = document.createElement("p");
    descEl.className = "text-[10px] text-purple-200/70";
    descEl.textContent = description;

    header.appendChild(titleEl);

    const grid = document.createElement("div");
    grid.className =
      "grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1";

    let slotName;
    switch (slotKey) {
      case "baseId":
        slotName = "base";
        break;
      case "outfitId":
        slotName = "outfit";
        break;
      case "hairId":
        slotName = "hair";
        break;
      case "jewelryId":
        slotName = "jewelry";
        break;
      case "unisexTopId":
        slotName = "unisexTop";
        break;
      case "shoesId":
        slotName = "shoes";
        break;
      case "eyesId":
        slotName = "eyes";
        break;
      default:
        slotName = null;
    }

    const list = slotName ? itemsFor(slotName) : [];

    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "text-[11px] text-purple-200/70 mt-1";
      empty.textContent = "Coming soon for this avatar.";
      container.appendChild(header);
      container.appendChild(descEl);
      container.appendChild(empty);
      return container;
    }

    list.forEach((item) => {
      grid.appendChild(makeItemCard(item, slotKey));
    });

    container.appendChild(header);
    container.appendChild(descEl);
    container.appendChild(grid);

    return container;
  }

  function buildItemsUI() {
    itemsEl.innerHTML = "";

    if (currentGender === "male") {
      const note = document.createElement("p");
      note.className = "text-xs text-purple-100/80 mb-3";
      note.textContent =
        "Male closet is in early setup. Skin tones will preview, and additional clothes/jewelry will be added soon.";
      itemsEl.appendChild(note);
    }

    const sections = [
      {
        title: "Skin tone",
        slotKey: "baseId",
        description: "Pick the skin tone for your avatar.",
      },
      {
        title: "Outfits",
        slotKey: "outfitId",
        description: "Shorts, skirts, bikini and more.",
      },
      {
        title: "Tops (unisex)",
        slotKey: "unisexTopId",
        description: "Tank tops and tees usable across avatars.",
      },
      {
        title: "Hair styles",
        slotKey: "hairId",
        description: "Long straight and wavy styles in multiple colors.",
      },
      {
        title: "Jewelry",
        slotKey: "jewelryId",
        description: "Necklaces, earrings, belly rings and more.",
      },
      {
        title: "Shoes",
        slotKey: "shoesId",
        description: "Shoes and sandals (unisex).",
      },
      {
        title: "Eyes",
        slotKey: "eyesId",
        description: "Different eye colors for the avatar.",
      },
    ];

    sections.forEach((s) => {
      itemsEl.appendChild(
        makeSection(s.title, s.slotKey, s.description)
      );
    });
  }

  function onGenderChange() {
    currentGender = genderSelect.value === "male" ? "male" : "female";

    if (currentGender === "female") {
      selected.baseId = data.defaults.baseId;
      selected.outfitId = data.defaults.outfitId;
      selected.hairId = data.defaults.hairId;
      selected.jewelryId = data.defaults.jewelryId;
      selected.unisexTopId = data.defaults.unisexTopId;
      selected.shoesId = data.defaults.shoesId;
      selected.eyesId = data.defaults.eyesId;
    } else {
      // male: just switch base for now
      const maleDefault =
        data.items.find(
          (it) => it.slot === "base" && it.gender === "male"
        ) || data.items.find((it) => it.slot === "base");

      selected.baseId = maleDefault ? maleDefault.id : selected.baseId;
      selected.outfitId = null;
      selected.hairId = null;
      selected.jewelryId = null;
      selected.unisexTopId = null;
      selected.shoesId = null;
      selected.eyesId = null;
    }

    updatePreview();
    buildItemsUI();
  }

  // Init
  function init() {
    if (coinsEl) {
      coinsEl.textContent = coins.toString();
    }

    if (genderSelect) {
      genderSelect.value = currentGender;
      genderSelect.addEventListener("change", onGenderChange);
    }

    updatePreview();
    buildItemsUI();

    loadingEl.style.display = "none";
    mainEl.classList.remove("hidden");
  }

  document.addEventListener("DOMContentLoaded", init);
})();

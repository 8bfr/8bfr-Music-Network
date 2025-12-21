// ✅ Persist outfit across refresh (even if catalog loads late)
// ✅ Restores from saved "fallback item snapshot" if IDs aren't found yet
// ✅ Guard against double-loading

(function () {
  if (window.__CARRIE_CLOSET_ALREADY_RUNNING__) return;
  window.__CARRIE_CLOSET_ALREADY_RUNNING__ = true;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const grid = $("#closetItemsGrid");
  const emptyMsg = $("#closetEmpty");
  const errBox = $("#closetError");
  const overlayHost = $("#closetOverlayHost");

  const previewLabel = $("#closetPreviewLabel");
  const closetGenderLabel = $("#closetGenderLabel");
  const skinToneButtons = $("#skinToneButtons");

  let currentGender = document.body.dataset.gender || "female";
  let currentSkin = document.body.dataset.skin || "light";
  let currentCat = "hair";

  // ✅ Separate equipped sets per gender
  const equippedSets = {
    female: {
      hair: null, top: null, bottom: null, eyes: null, shoes: null,
      necklace: null, ears: null, belly: null
    },
    male: {
      hair: null, top: null, bottom: null, eyes: null, shoes: null,
      necklace: null, ears: null, belly: null
    }
  };

  let equipped = equippedSets[currentGender];

  const zBySlot = {
    shoes: 10,
    bottom: 30,
    belly: 35,
    top: 40,
    necklace: 45,
    eyes: 50,
    ears: 55,
    hair: 60
  };

  // ---------------------------
  // STORAGE
  // ---------------------------
  const STORE_KEY = "carrieClosetState_v6:" + location.pathname;

  function canUse(storage) {
    try {
      storage.setItem("__t", "1");
      storage.removeItem("__t");
      return true;
    } catch {
      return false;
    }
  }

  const hasLS = canUse(localStorage);

  function storageSet(val) {
    try { hasLS && localStorage.setItem(STORE_KEY, val); } catch {}
    try { document.cookie = `${STORE_KEY}=${encodeURIComponent(val)};path=/;max-age=31536000`; } catch {}
    try {
      const obj = JSON.parse(window.name || "{}");
      obj[STORE_KEY] = val;
      window.name = JSON.stringify(obj);
    } catch {}
  }

  function storageGet() {
    try {
      if (hasLS) {
        const v = localStorage.getItem(STORE_KEY);
        if (v) return v;
      }
    } catch {}
    try {
      const obj = JSON.parse(window.name || "{}");
      if (obj[STORE_KEY]) return obj[STORE_KEY];
    } catch {}
    try {
      const m = document.cookie.match(new RegExp(`${STORE_KEY}=([^;]+)`));
      return m ? decodeURIComponent(m[1]) : null;
    } catch {}
    return null;
  }

  function snapshotItem(obj) {
    if (!obj) return null;
    return {
      id: obj.id,
      slot: obj.slot,
      gender: obj.gender,
      category: obj.category,
      img: obj.img,
      imgDark: obj.imgDark,
      scale: obj.scale ?? 1,
      offsetX: obj.offsetX ?? 0,
      offsetY: obj.offsetY ?? 0
    };
  }

  function saveState() {
    const pack = (set) =>
      Object.fromEntries(Object.entries(set).map(([k, v]) => [k, v ? v.id : null]));

    const snap = (set) =>
      Object.fromEntries(Object.entries(set).map(([k, v]) => [k, snapshotItem(v)]));

    storageSet(JSON.stringify({
      gender: currentGender,
      skin: currentSkin,
      cat: currentCat,
      equippedByGender: {
        female: pack(equippedSets.female),
        male: pack(equippedSets.male)
      },
      equippedFallbackByGender: {
        female: snap(equippedSets.female),
        male: snap(equippedSets.male)
      }
    }));
  }

  function loadState(items) {
    const raw = storageGet();
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      currentGender = data.gender || currentGender;
      currentSkin = data.skin || currentSkin;
      currentCat = data.cat || currentCat;

      ["female", "male"].forEach((g) => {
        const ids = data.equippedByGender?.[g];
        const fb = data.equippedFallbackByGender?.[g];
        Object.keys(equippedSets[g]).forEach((slot) => {
          equippedSets[g][slot] =
            items?.find((i) => i.id === ids?.[slot]) ||
            fb?.[slot] ||
            null;
        });
      });

      equipped = equippedSets[currentGender];
    } catch {}
  }

  function safeItems() {
    return Array.isArray(window.CARRIE_CLOSET_ITEMS)
      ? window.CARRIE_CLOSET_ITEMS
      : null;
  }

  function pickImg(item) {
    return currentSkin === "dark" && item.imgDark ? item.imgDark : item.img;
  }

  function setBaseImage() {
    const base = $("#closetBaseImg");
    if (!base) return;
    base.src = `assets/images/base/${currentGender}/base_${currentGender}_${currentSkin}.png`;
  }

  function renderOverlays() {
    overlayHost.innerHTML = "";

    Object.values(equipped).forEach((item) => {
      if (!item) return;

      if (item.slot === "ears" || item.slot === "shoes") {
        ["left", "right"].forEach((side) => {
          const img = document.createElement("img");
          img.src = pickImg(item);
          img.className = `layer-overlay layer-${item.slot}-${side}`;
          img.style.zIndex = zBySlot[item.slot];
          overlayHost.appendChild(img);
        });
        return;
      }

      const img = document.createElement("img");
      img.src = pickImg(item);
      img.className = "layer-overlay";
      img.style.zIndex = zBySlot[item.slot] || 20;
      overlayHost.appendChild(img);
    });
  }

  function renderItems() {
    const items = safeItems();
    if (!items) return;

    grid.innerHTML = "";

    items
      .filter(i =>
        (i.gender === "unisex" || i.gender === currentGender) &&
        (currentCat === "all" || i.category === currentCat)
      )
      .forEach((item) => {
        const card = document.createElement("div");
        card.className = "closet-item-card";
        card.innerHTML = `<img src="${item.thumb || item.img}"><div>${item.name}</div>`;
        card.onclick = () => {
          equipped[item.slot] =
            equipped[item.slot]?.id === item.id ? null : item;
          renderOverlays();
          saveState();
        };
        grid.appendChild(card);
      });
  }

  function boot() {
    const items = safeItems();
    loadState(items);

    document.body.dataset.gender = currentGender;
    document.body.dataset.skin = currentSkin;

    setBaseImage();
    renderItems();
    renderOverlays();
  }

  window.addEventListener("beforeunload", saveState);
  document.addEventListener("DOMContentLoaded", boot);
})();

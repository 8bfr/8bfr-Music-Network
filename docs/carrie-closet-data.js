Here are all three files separately:

## 1. carrie-closet-data.js

```javascript
// carrie-closet-data.js
// Static closet catalog using your actual image paths / names.

(function () {
  const base = "assets/images";

  // Helper to build item objects with defaults
  function item(opts) {
    return Object.assign(
      {
        id: "",
        gender: "female",      // "female" | "male" | "unisex"
        category: "hair",      // UI category: hair/top/bottom/jewelry/eyes/shoes
        cat: "hair",           // alias for older/newer JS
        slot: "hair",          // overlay slot: hair/top/bottom/eyes/shoes/necklace/ears/belly
        name: "",
        label: "",
        coins: 0,
        rarity: "common",
        img: "",
        thumb: "",
        // per-item transform defaults (optional, for future logic)
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      opts
    );
  }

  const items = [
    // ---- FEMALE HAIR – STRAIGHT ----
    item({
      id: "f_hair_straight_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Blonde",
      label: "straight • blonde",
      coins: 20,
      rarity: "rare",
      img: base + "/hair/straight/female_straight_blonde.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -10
    }),
    item({
      id: "f_hair_straight_brown",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Brown",
      label: "straight • brown",
      coins: 15,
      img: base + "/hair/straight/female_straight_brown.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -10
    }),
    item({
      id: "f_hair_straight_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Copper",
      label: "straight • copper",
      coins: 18,
      img: base + "/hair/straight/female_straight_copper.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Ginger",
      label: "straight • ginger",
      coins: 18,
      img: base + "/hair/straight/female_straight_ginger.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Blue",
      label: "straight • pastel blue",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_blue.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Pink",
      label: "straight • pastel pink",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_pink.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Purple",
      label: "straight • pastel purple",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_purple.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_platinum",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Platinum",
      label: "straight • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: base + "/hair/straight/female_straight_platinum_blonde.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Black",
      label: "straight • black",
      coins: 18,
      img: base + "/hair/straight/female_straight_black.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),

    // ---- FEMALE HAIR – WAVY ----
    item({
      id: "f_hair_wavy_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Blonde",
      label: "wavy • blonde",
      coins: 20,
      img: base + "/hair/wavy/female_wavy_blonde.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_brown",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Brown",
      label: "wavy • brown",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_brown.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Copper",
      label: "wavy • copper",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_copper.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Ginger",
      label: "wavy • ginger",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_ginger.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Blue",
      label: "wavy • pastel blue",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_blue.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Pink",
      label: "wavy • pastel pink",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_pink.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Purple",
      label: "wavy • pastel purple",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_purple.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_platinum",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Platinum",
      label: "wavy • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: base + "/hair/wavy/female_wavy_platinum_blonde.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Black",
      label: "wavy • black",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_black.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),

    // ---- TOPS (unisex tank + tee + red bikini top) ----
    item({
      id: "u_top_tank",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tank Top",
      label: "unisex tank",
      coins: 15,
      img: base + "/unisex/cloths/unisex_tank-top_v1.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: 6
    }),
    item({
      id: "u_top_tee",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tee",
      label: "unisex tee",
      coins: 15,
      img: base + "/unisex/cloths/unisex_tee-shirt.png",
      scale: 0.9,
      offsetX: 0,
      offsetY: 5
    }),
    item({
      id: "f_top_bikini_red",
      gender: "female",
      category: "top",
      cat: "top",
      slot: "top",
      name: "Red Bikini Top",
      label: "bikini top • red",
      coins: 12,
      img: base + "/female_cloths/female_bikini-top_red.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: 6
    }),

    // ---- BOTTOMS (female shorts / skirt + red bikini bottom) ----
    item({
      id: "f_bottom_shorts",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Denim Shorts",
      label: "female shorts",
      coins: 15,
      img: base + "/female_cloths/female_shorts.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: -2
    }),
    item({
      id: "f_bottom_skirt",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Mini Skirt",
      label: "female skirt",
      coins: 18,
      img: base + "/female_cloths/female_skirt.png",
      scale: 1.06,
      offsetX: 0,
      offsetY: -4
    }),

    item({
      id: "f_bottom_bikini_red",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Red Bikini Bottom",
      label: "bikini bottom • red",
      coins: 12,
      img: base + "/female_cloths/female_bikini-bottom_redv2.png",
      imgDark: base + "/female_cloths/female_bikini-bottom_red_dark.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),

    // ---- JEWELRY – FEMALE ----
    item({
      id: "f_jewel_necklace",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Necklace",
      label: "necklace",
      coins: 20,
      img: base + "/female_jewlery/female_gold_necklace.png",
      imgDark: base + "/female_jewlery/female_gold_necklace_dark.png",
      scale: 0.82,
      offsetX: 0,
      offsetY: 8
    }),

    item({
      id: "f_jewel_belly",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "belly",
      name: "Belly Ring",
      label: "belly ring",
      coins: 15,
      img: base + "/female_jewlery/female_belly-ring.png",
      scale: 0.7,
      offsetX: 0,
      offsetY: -6
    }),

    item({
      id: "f_jewel_ears",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earrings",
      label: "ear rings",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_left.png",
      imgLeft: base + "/female_jewlery/female_gold_ear-ring_left.png",
      imgRight: base + "/female_jewlery/female_gold_ear-ring_right.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    // ---- JEWELRY – MALE ----
    item({
      id: "m_jewel_necklace",
      gender: "male",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Chain",
      label: "male necklace",
      coins: 20,
      img: base + "/male_jewlery/male_gold_necklace.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: 10
    }),

    // ---- EYES (unisex) ----
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      label: "blue",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_blue_left.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),
    item({
      id: "u_eyes_green",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Green Eyes",
      label: "green",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_green_left.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),
    item({
      id: "u_eyes_brown",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Brown Eyes",
      label: "brown",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_brown_left.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    // ---- SHOES (unisex) ----
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      label: "unisex shoes",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoes_left.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();
```

## 2. carrie-closet.js

```javascript
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

  // ✅ CHANGE: keep a separate equipped set per gender (so switching doesn't wipe)
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

  // ✅ CHANGE: this is the active equipped object used by the rest of the code
  let equipped = equippedSets[currentGender] || equippedSets.female;

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
  // ✅ PERSIST (LS + cookie + window.name fallback)
  // ---------------------------
  const STORE_KEY = "carrieClosetState_v6:" + location.pathname;

  function canUse(storage) {
    try {
      const k = "__t";
      storage.setItem(k, "1");
      storage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }
  const hasLS = canUse(window.localStorage);

  function cookieSet(val) {
    try {
      document.cookie =
        encodeURIComponent(STORE_KEY) +
        "=" +
        encodeURIComponent(val) +
        "; path=/; max-age=31536000; SameSite=Lax";
      return true;
    } catch (e) {
      return false;
    }
  }
  function cookieGet() {
    try {
      const key = encodeURIComponent(STORE_KEY) + "=";
      const parts = (document.cookie || "").split("; ");
      for (const p of parts) {
        if (p.indexOf(key) === 0) return decodeURIComponent(p.slice(key.length));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // ✅ window.name (survives localStorage.clear / some privacy wipes)
  function nameGet() {
    try {
      const raw = window.name || "";
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return null;
      return data[STORE_KEY] || null;
    } catch (e) {
      return null;
    }
  }
  function nameSet(val) {
    try {
      const raw = window.name || "";
      let data = {};
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") data = parsed;
      }
      data[STORE_KEY] = val;
      window.name = JSON.stringify(data);
      return true;
    } catch (e) {
      return false;
    }
  }

  function storageSet(val) {
    if (hasLS) {
      try { localStorage.setItem(STORE_KEY, val); } catch (e) {}
    }
    cookieSet(val);
    nameSet(val);
  }
  function storageGet() {
    if (hasLS) {
      try {
        const v = localStorage.getItem(STORE_KEY);
        if (v) return v;
      } catch (e) {}
    }
    const nv = nameGet();
    if (nv) return nv;

    return cookieGet();
  }

  function snapshotItem(obj) {
    if (!obj) return null;
    return {
      id: obj.id || null,
      gender: obj.gender || null,
      category: obj.category || obj.cat || null,
      cat: obj.cat || obj.category || null,
      slot: obj.slot || null,
      name: obj.name || null,
      label: obj.label || null,
      img: obj.img || null,
      imgDark: obj.imgDark || null,
      imgLeft: obj.imgLeft || null,
      imgRight: obj.imgRight || null,
      thumb: obj.thumb || null,
      scale: (typeof obj.scale === "number" ? obj.scale : 1),
      offsetX: (typeof obj.offsetX === "number" ? obj.offsetX : 0),
      offsetY: (typeof obj.offsetY === "number" ? obj.offsetY : 0)
    };
  }

  // ✅ CHANGE: save BOTH gender outfits (instead of just current)
  function saveState() {
    try {
      const makeIds = (setObj) =>
        Object.fromEntries(Object.entries(setObj).map(([slot, obj]) => [slot, obj ? obj.id : null]));

      const makeFallback = (setObj) =>
        Object.fromEntries(Object.entries(setObj).map(([slot, obj]) => [slot, obj ? snapshotItem(obj) : null]));

      const payload = {
        gender: currentGender,
        skin: currentSkin,
        cat: currentCat,
        equippedByGender: {
          female: makeIds(equippedSets.female),
          male: makeIds(equippedSets.male)
        },
        equippedFallbackByGender: {
          female: makeFallback(equippedSets.female),
          male: makeFallback(equippedSets.male)
        }
      };

      storageSet(JSON.stringify(payload));
    } catch (e) {}
  }

  // ✅ CHANGE: load BOTH gender outfits + set active "equipped" pointer
  function loadState(itemsMaybe) {
    try {
      const raw = storageGet();
      if (!raw) return;

      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;

      if (data.gender) currentGender = data.gender;
      if (data.skin) currentSkin = data.skin;
      if (data.cat) currentCat = data.cat;

      const items = Array.isArray(itemsMaybe) ? itemsMaybe : null;

      const restoreSet = (genderKey, idsObj, fallbackObj) => {
        const setObj = equippedSets[genderKey];
        if (!setObj) return;

        Object.keys(setObj).forEach((k) => (setObj[k] = null));

        if (items && idsObj && typeof idsObj === "object") {
          Object.entries(idsObj).forEach(([slot, id]) => {
            if (!id) return;
            const found = items.find((it) => it.id === id);
            if (found && slot in setObj) setObj[slot] = found;
          });
        }

        if (fallbackObj && typeof fallbackObj === "object") {
          Object.entries(fallbackObj).forEach(([slot, snap]) => {
            if (!(slot in setObj)) return;
            if (setObj[slot]) return;
            if (!snap || typeof snap !== "object") return;
            setObj[slot] = snap;
          });
        }
      };

      // New format
      if (data.equippedByGender || data.equippedFallbackByGender) {
        restoreSet("female",
          data.equippedByGender && data.equippedByGender.female,
          data.equippedFallbackByGender && data.equippedFallbackByGender.female
        );
        restoreSet("male",
          data.equippedByGender && data.equippedByGender.male,
          data.equippedFallbackByGender && data.equippedFallbackByGender.male
        );
      } else {
        // Backward compatibility (old single-set saves)
        const g = (data.gender === "male") ? "male" : "female";
        restoreSet(g, data.equippedIds, data.equippedFallback);
      }

      equipped = equippedSets[currentGender] || equippedSets.female;
    } catch (e) {}
  }

  function safeItems() {
    const items = window.CARRIE_CLOSET_ITEMS;
    if (!Array.isArray(items)) return null;
    return items;
  }

  function setBaseImage() {
    const baseImg = $("#closetBaseImg");
    if (!baseImg) return;

    const g = currentGender;
    const s = currentSkin;

    let src = "";
    if (g === "female") src = `assets/images/base/female/base_female_${s}.png?v=15`;
    else src = `assets/images/base/male/base_male_${s}.png?v=15`;

    baseImg.src = src;
  }

  function updateLabels() {
    const gLabel = currentGender === "female" ? "Female" : "Male";
    const sLabel = currentSkin === "light" ? "Light skin" : "Dark skin";

    if (previewLabel) previewLabel.textContent = `${gLabel} • ${sLabel} • Bikini base`;
    if (closetGenderLabel) closetGenderLabel.innerHTML = `Showing items for <b>${gLabel}</b> avatar`;
  }

  function buildSkinButtons() {
    if (!skinToneButtons) return;

    skinToneButtons.innerHTML = "";

    const skins = [
      { key: "light", label: "☀️ Light" },
      { key: "dark", label: "🌙 Dark" }
    ];

    skins.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seg-btn" + (currentSkin === s.key ? " active" : "");
      btn.textContent = s.label;
      btn.dataset.skin = s.key;

      btn.addEventListener("click", () => {
        currentSkin = s.key;
        document.body.dataset.skin = currentSkin;

        $$("#skinToneButtons .seg-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        setBaseImage();
        updateLabels();
        renderOverlays();
        renderItems();

        saveState();
      });

      skinToneButtons.appendChild(btn);
    });
  }

  // ✅ CHANGE: switching gender swaps outfits instead of clearing them
  function setGender(newGender) {
    saveState(); // save current outfit first

    currentGender = newGender;
    document.body.dataset.gender = currentGender;

    equipped = equippedSets[currentGender] || equippedSets.female; // swap to that gender's outfit

    setBaseImage();
    updateLabels();
    renderItems();
    renderOverlays();

    saveState();
  }

  function pickImgForSkin(itemObj) {
    if (currentSkin === "dark" && itemObj.imgDark) return itemObj.imgDark;
    return itemObj.img;
  }

  function cardForItem(itemObj) {
    const card = document.createElement("div");
    card.className = "closet-item-card";

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "closet-item-thumb";

    const t = document.createElement("img");
    t.src = itemObj.thumb || pickImgForSkin(itemObj);
    t.alt = itemObj.name || itemObj.id;
    thumbWrap.appendChild(t);

    const meta = document.createElement("div");
    meta.className = "min-w-0";

    const title = document.createElement("div");
    title.className = "text-[12px] font-semibold truncate";
    title.textContent = itemObj.name || itemObj.id;

    const sub = document.createElement("div");
    sub.className = "text-[10px] text-purple-200/70 truncate";
    sub.textContent = itemObj.label || itemObj.category;

    meta.appendChild(title);
    meta.appendChild(sub);

    card.appendChild(thumbWrap);
    card.appendChild(meta);

    const slot = itemObj.slot;
    const isOn = equipped[slot] && equipped[slot].id === itemObj.id;
    if (isOn) card.classList.add("active");

    card.addEventListener("click", () => {
      if (equipped[slot] && equipped[slot].id === itemObj.id) equipped[slot] = null;
      else equipped[slot] = itemObj;

      renderItems();
      renderOverlays();
      saveState();
    });

    return card;
  }

  function filterItems(items) {
    return items.filter((it) => {
      const gOK = it.gender === "unisex" || it.gender === currentGender;
      if (!gOK) return false;

      if (currentCat === "all") return true;
      return (it.category === currentCat || it

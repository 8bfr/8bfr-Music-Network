// carrie-closet.js
// Minimal working closet logic for your current HTML/CSS + carrie-closet-data.js
// Adds support for item.imgDark when body[data-skin="dark"].
// ✅ Persists equipped items + gender + skin + selected tab across refresh.

(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const grid = $("#closetItemsGrid");
  const emptyMsg = $("#closetEmpty");
  const errBox = $("#closetError");
  const overlayHost = $("#closetOverlayHost");

  const previewLabel = $("#closetPreviewLabel");
  const closetGenderLabel = $("#closetGenderLabel");
  const skinToneButtons = $("#skinToneButtons");

  // --- hard defaults ---
  let currentGender = document.body.dataset.gender || "female";
  let currentSkin = document.body.dataset.skin || "light";
  let currentCat = "hair";

  // Equipped items by slot
  const equipped = {
    hair: null,
    top: null,
    bottom: null,
    eyes: null,
    shoes: null,
    necklace: null,
    ears: null,
    belly: null
  };

  // Layer order (bigger number = on top)
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
  // ✅ PERSIST (so refresh keeps outfit)
  // ---------------------------
  const STORE_KEY = "carrieClosetState_v1";

  // ✅ Storage wrapper: localStorage → sessionStorage → cookie → URL hash fallback
  const STORAGE = (() => {
    const HASH_KEY = "cc"; // URL hash key: #cc=...

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
    const hasSS = canUse(window.sessionStorage);

    function cookieSet(val) {
      try {
        document.cookie =
          STORE_KEY +
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
        const m = document.cookie.match(new RegExp("(^| )" + STORE_KEY + "=([^;]+)"));
        return m ? decodeURIComponent(m[2]) : null;
      } catch (e) {
        return null;
      }
    }

    function hashSet(val) {
      try {
        const encoded = encodeURIComponent(val);
        const base = window.location.href.split("#")[0];
        history.replaceState(null, "", base + "#" + HASH_KEY + "=" + encoded);
        return true;
      } catch (e) {
        return false;
      }
    }

    function hashGet() {
      try {
        const h = window.location.hash || "";
        const m = h.match(new RegExp(HASH_KEY + "=([^&]+)"));
        return m ? decodeURIComponent(m[1]) : null;
      } catch (e) {
        return null;
      }
    }

    return {
      set(val) {
        if (hasLS) {
          try { localStorage.setItem(STORE_KEY, val); return; } catch (e) {}
        }
        if (hasSS) {
          try { sessionStorage.setItem(STORE_KEY, val); return; } catch (e) {}
        }
        if (cookieSet(val)) return;
        hashSet(val); // last resort
      },
      get() {
        const hv = hashGet();
        if (hv) return hv;

        if (hasLS) {
          try { return localStorage.getItem(STORE_KEY); } catch (e) {}
        }
        if (hasSS) {
          try { return sessionStorage.getItem(STORE_KEY); } catch (e) {}
        }
        const cv = cookieGet();
        if (cv) return cv;

        return null;
      }
    };
  })();

  function saveState() {
    try {
      const payload = {
        gender: currentGender,
        skin: currentSkin,
        cat: currentCat,
        equippedIds: Object.fromEntries(
          Object.entries(equipped).map(([slot, obj]) => [slot, obj ? obj.id : null])
        )
      };
      STORAGE.set(JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  // ✅ ONLY ONE loadState() — uses STORAGE.get()
  function loadState(items) {
    try {
      const raw = STORAGE.get();
      if (!raw) return;

      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;

      if (data.gender) currentGender = data.gender;
      if (data.skin) currentSkin = data.skin;
      if (data.cat) currentCat = data.cat;

      if (data.equippedIds && typeof data.equippedIds === "object") {
        Object.keys(equipped).forEach((k) => (equipped[k] = null));
        Object.entries(data.equippedIds).forEach(([slot, id]) => {
          if (!id) return;
          const found = items.find((it) => it.id === id);
          if (found && slot in equipped) equipped[slot] = found;
        });
      }
    } catch (e) {
      // ignore
    }
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

  function setGender(newGender) {
    currentGender = newGender;
    document.body.dataset.gender = currentGender;

    // keep your original behavior: reset equipped on gender swap
    Object.keys(equipped).forEach((k) => (equipped[k] = null));

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
      return (it.category === currentCat || it.cat === currentCat);
    });
  }

  function renderItems() {
    const items = safeItems();
    if (!items) return;

    const list = filterItems(items);

    grid.innerHTML = "";
    if (list.length === 0) {
      emptyMsg && emptyMsg.classList.remove("hidden");
      return;
    } else {
      emptyMsg && emptyMsg.classList.add("hidden");
    }

    list.forEach((it) => grid.appendChild(cardForItem(it)));
  }

  function clearOverlays() {
    overlayHost.innerHTML = "";
  }

  function addOverlayImg(itemObj) {
    const src = pickImgForSkin(itemObj);
    if (!src) return;

    const slot = itemObj.slot;

    if (slot === "ears") {
      const left = document.createElement("img");
      left.src = src;
      left.alt = itemObj.name || itemObj.id;
      left.className = `layer-overlay item-${itemObj.id} layer-ears-left`;
      left.style.zIndex = String(zBySlot.ears || 50);
      overlayHost.appendChild(left);

      const right = document.createElement("img");
      right.src = src;
      right.alt = itemObj.name || itemObj.id;
      right.className = `layer-overlay item-${itemObj.id} layer-ears-right`;
      right.style.zIndex = String(zBySlot.ears || 50);
      overlayHost.appendChild(right);
      return;
    }

    if (slot === "shoes") {
      const left = document.createElement("img");
      left.src = src;
      left.alt = itemObj.name || itemObj.id;
      left.className = `layer-overlay item-${itemObj.id} layer-shoes-left`;
      left.style.zIndex = String(zBySlot.shoes || 10);
      overlayHost.appendChild(left);

      const right = document.createElement("img");
      right.src = src;
      right.alt = itemObj.name || itemObj.id;
      right.className = `layer-overlay item-${itemObj.id} layer-shoes-right`;
      right.style.zIndex = String(zBySlot.shoes || 10);
      overlayHost.appendChild(right);
      return;
    }

    const img = document.createElement("img");
    img.src = src;
    img.alt = itemObj.name || itemObj.id;
    img.className = `layer-overlay item-${itemObj.id}`;
    img.style.zIndex = String(zBySlot[slot] || 20);
    overlayHost.appendChild(img);
  }

  function renderOverlays() {
    clearOverlays();
    Object.keys(equipped).forEach((slot) => {
      if (equipped[slot]) addOverlayImg(equipped[slot]);
    });
  }

  function initTabs() {
    $$(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCat = btn.dataset.cat || "hair";
        renderItems();
        saveState();
      });
    });
  }

  function initGenderButtons() {
    $$(".seg-btn[data-gender]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".seg-btn[data-gender]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        setGender(btn.dataset.gender === "male" ? "male" : "female");
      });
    });
  }

  function syncUIButtons() {
    $$(".seg-btn[data-gender]").forEach((b) => {
      b.classList.toggle("active", (b.dataset.gender === currentGender));
    });

    $$(".tab-btn").forEach((b) => {
      b.classList.toggle("active", (b.dataset.cat === currentCat));
    });
  }

  function boot() {
    const items = safeItems();
    if (!items) {
      errBox && errBox.classList.remove("hidden");
      return;
    } else {
      errBox && errBox.classList.add("hidden");
    }

    loadState(items);

    document.body.dataset.gender = currentGender;
    document.body.dataset.skin = currentSkin;

    initTabs();
    initGenderButtons();
    buildSkinButtons();

    syncUIButtons();

    setBaseImage();
    updateLabels();
    renderItems();
    renderOverlays();

    saveState();
  }

  // ✅ Mobile/BFCache-safe persistence
  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveState();
  });

  // ✅ When coming back from BFCache, re-load + re-render
  window.addEventListener("pageshow", () => {
    const items = safeItems();
    if (!items) return;

    loadState(items);

    document.body.dataset.gender = currentGender;
    document.body.dataset.skin = currentSkin;

    syncUIButtons();
    setBaseImage();
    updateLabels();
    renderItems();
    renderOverlays();
  });

  document.addEventListener("DOMContentLoaded", boot);
})();

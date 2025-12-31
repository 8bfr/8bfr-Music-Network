Perfect! I can see the JavaScript. The issue is that for eyes and ears, it's using `layer-left` and `layer-right` classes, but it needs `layer-eyes-left`, `layer-eyes-right`, `layer-ears-left`, and `layer-ears-right` to match your CSS.

Here's the corrected JavaScript with proper class names:

```javascript
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

  const equippedSets = {
    female: { hair: null, top: null, bottom: null, eyes: null, shoes: null, necklace: null, ears: null, belly: null },
    male: { hair: null, top: null, bottom: null, eyes: null, shoes: null, necklace: null, ears: null, belly: null }
  };

  let equipped = equippedSets[currentGender] || equippedSets.female;

  const zBySlot = { shoes: 10, bottom: 30, belly: 35, top: 40, necklace: 45, eyes: 50, ears: 55, hair: 60 };

  const STORE_KEY = "carrieClosetState_v6:" + location.pathname;

  function canUse(storage) {
    try { storage.setItem("__t", "1"); storage.removeItem("__t"); return true; } catch (e) { return false; }
  }
  const hasLS = canUse(window.localStorage);

  function cookieSet(val) {
    try { document.cookie = encodeURIComponent(STORE_KEY) + "=" + encodeURIComponent(val) + "; path=/; max-age=31536000; SameSite=Lax"; return true; } catch(e) { return false; }
  }
  function cookieGet() {
    try {
      const key = encodeURIComponent(STORE_KEY) + "=";
      const parts = (document.cookie || "").split("; ");
      for (const p of parts) if (p.indexOf(key) === 0) return decodeURIComponent(p.slice(key.length));
      return null;
    } catch(e) { return null; }
  }

  function nameGet() {
    try { const raw = window.name || ""; if (!raw) return null; const data = JSON.parse(raw); if (!data || typeof data !== "object") return null; return data[STORE_KEY] || null; } catch(e) { return null; }
  }
  function nameSet(val) {
    try { const raw = window.name || ""; let data = {}; if (raw) { const parsed = JSON.parse(raw); if (parsed && typeof parsed === "object") data = parsed; } data[STORE_KEY] = val; window.name = JSON.stringify(data); return true; } catch(e) { return false; }
  }

  function storageSet(val) { if (hasLS) { try { localStorage.setItem(STORE_KEY,val); } catch(e){} } cookieSet(val); nameSet(val); }
  function storageGet() { if(hasLS){try{const v=localStorage.getItem(STORE_KEY);if(v) return v;}catch(e){} } const nv=nameGet(); if(nv) return nv; return cookieGet(); }

  function snapshotItem(obj) {
    if (!obj) return null;
    return { id: obj.id||null, gender: obj.gender||null, category: obj.category||obj.cat||null, cat: obj.cat||obj.category||null, slot: obj.slot||null, name: obj.name||null, label: obj.label||null, img: obj.img||null, imgDark: obj.imgDark||null, thumb: obj.thumb||null, scale: (typeof obj.scale==="number"?obj.scale:1), offsetX: (typeof obj.offsetX==="number"?obj.offsetX:0), offsetY: (typeof obj.offsetY==="number"?obj.offsetY:0) };
  }

  function saveState() {
    try {
      const makeIds = (setObj)=>Object.fromEntries(Object.entries(setObj).map(([slot,obj])=>[slot,obj?obj.id:null]));
      const makeFallback = (setObj)=>Object.fromEntries(Object.entries(setObj).map(([slot,obj])=>[slot,obj?snapshotItem(obj):null]));
      const payload = { gender: currentGender, skin: currentSkin, cat: currentCat, equippedByGender: { female: makeIds(equippedSets.female), male: makeIds(equippedSets.male) }, equippedFallbackByGender: { female: makeFallback(equippedSets.female), male: makeFallback(equippedSets.male) } };
      storageSet(JSON.stringify(payload));
    } catch(e){}
  }

  function loadState(itemsMaybe) {
    try {
      const raw = storageGet(); if(!raw) return;
      const data = JSON.parse(raw); if(!data||typeof data!=="object") return;
      if(data.gender) currentGender=data.gender;
      if(data.skin) currentSkin=data.skin;
      if(data.cat) currentCat=data.cat;
      const items=Array.isArray(itemsMaybe)?itemsMaybe:null;
      const restoreSet = (genderKey, idsObj, fallbackObj)=>{
        const setObj=equippedSets[genderKey]; if(!setObj) return;
        Object.keys(setObj).forEach(k=>setObj[k]=null);
        if(items && idsObj && typeof idsObj==="object"){
          Object.entries(idsObj).forEach(([slot,id])=>{if(!id) return; const found=items.find(it=>it.id===id); if(found && slot in setObj) setObj[slot]=found;});
        }
        if(fallbackObj && typeof fallbackObj==="object"){
          Object.entries(fallbackObj).forEach(([slot,snap])=>{if(!(slot in setObj)) return; if(setObj[slot]) return; if(!snap||typeof snap!=="object") return; setObj[slot]=snap;});
        }
      };
      if(data.equippedByGender || data.equippedFallbackByGender){
        restoreSet("female", data.equippedByGender?.female, data.equippedFallbackByGender?.female);
        restoreSet("male", data.equippedByGender?.male, data.equippedFallbackByGender?.male);
      } else {
        const g=(data.gender==="male")?"male":"female";
        restoreSet(g,data.equippedIds,data.equippedFallback);
      }
      equipped=equippedSets[currentGender]||equippedSets.female;
    } catch(e){}
  }

  function safeItems() { const items=window.CARRIE_CLOSET_ITEMS; if(!Array.isArray(items)) return null; return items; }

  function setBaseImage() {
    const baseImg=$("#closetBaseImg"); if(!baseImg) return;
    const g=currentGender, s=currentSkin;
    baseImg.src=(g==="female")?`assets/images/base/female/base_female_${s}.png?v=15`:`assets/images/base/male/base_male_${s}.png?v=15`;
  }

  function updateLabels() {
    const gLabel=currentGender==="female"?"Female":"Male";
    const sLabel=currentSkin==="light"?"Light skin":"Dark skin";
    if(previewLabel) previewLabel.textContent=`${gLabel} • ${sLabel} • Bikini base`;
    if(closetGenderLabel) closetGenderLabel.innerHTML=`Showing items for <b>${gLabel}</b> avatar`;
  }

  function buildSkinButtons() {
    if(!skinToneButtons) return;
    skinToneButtons.innerHTML="";
    const skins=[{key:"light",label:"☀️ Light"},{key:"dark",label:"🌙 Dark"}];
    skins.forEach(s=>{
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="seg-btn"+(currentSkin===s.key?" active":"");
      btn.textContent=s.label;
      btn.dataset.skin=s.key;
      btn.addEventListener("click",()=>{
        currentSkin=s.key;
        document.body.dataset.skin=currentSkin;
        $$("#skinToneButtons .seg-btn").forEach(b=>b.classList.remove("active"));
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
    saveState();
    currentGender=newGender;
    document.body.dataset.gender=currentGender;
    equipped=equippedSets[currentGender]||equippedSets.female;
    setBaseImage();
    updateLabels();
    renderItems();
    renderOverlays();
    saveState();
  }

  function pickImgForSkin(itemObj) { return (currentSkin==="dark" && itemObj.imgDark)?itemObj.imgDark:itemObj.img; }

  function cardForItem(itemObj){
    const card=document.createElement("div");
    card.className="closet-item-card";
    const thumbWrap=document.createElement("div");
    thumbWrap.className="closet-item-thumb";
    const t=document.createElement("img");
    t.src=itemObj.thumb||pickImgForSkin(itemObj);
    t.alt=itemObj.name||itemObj.id;
    thumbWrap.appendChild(t);
    const meta=document.createElement("div");
    meta.className="min-w-0";
    const title=document.createElement("div");
    title.className="text-[12px] font-semibold truncate";
    title.textContent=itemObj.name||itemObj.id;
    const sub=document.createElement("div");
    sub.className="text-[10px] text-purple-200/70 truncate";
    sub.textContent=itemObj.label||itemObj.category;
    meta.appendChild(title); meta.appendChild(sub);
    card.appendChild(thumbWrap); card.appendChild(meta);
    const slot=itemObj.slot;
    const isOn=equipped[slot]&&equipped[slot].id===itemObj.id;
    if(isOn) card.classList.add("active");
    card.addEventListener("click",()=>{
      if(equipped[slot]&&equipped[slot].id===itemObj.id) equipped[slot]=null; else equipped[slot]=itemObj;
      renderItems(); renderOverlays(); saveState();
    });
    return card;
  }

  function filterItems(items){
    return items.filter(it=>{
      const gOK=it.gender==="unisex"||it.gender===currentGender;
      if(!gOK) return false;
      if(currentCat==="all") return true;
      return (it.category===currentCat || it.cat===currentCat);
    });
  }

  function renderItems(){
    const items=safeItems(); if(!items||!grid) return;
    const list=filterItems(items);
    grid.innerHTML="";
    if(list.length===0){ emptyMsg&&emptyMsg.classList.remove("hidden"); return; } else { emptyMsg&&emptyMsg.classList.add("hidden"); }
    list.forEach(it=>grid.appendChild(cardForItem(it)));
  }

  function clearOverlays(){ if(!overlayHost) return; overlayHost.innerHTML=""; }

  function addOverlayImg(itemObj) {
    if (!overlayHost) return;

    const src = pickImgForSkin(itemObj);
    if (!src) return;

    const slot = itemObj.slot;

    // --- EARS (FIXED CLASS NAMES) ---
    if (slot === "ears") {
      const left = document.createElement("img");
      left.src = itemObj.imgLeft || src;
      left.alt = itemObj.name || itemObj.id;
      left.className = `layer-overlay layer-ears-left item-${itemObj.id}`;
      left.style.zIndex = String(zBySlot[slot] || 55);

      const right = document.createElement("img");
      right.src = itemObj.imgRight || src;
      right.alt = itemObj.name || itemObj.id;
      right.className = `layer-overlay layer-ears-right item-${itemObj.id}`;
      right.style.zIndex = String(zBySlot[slot] || 55);

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
      return;
    }

    // --- EYES (FIXED CLASS NAMES) ---
    if (slot === "eyes") {
      const left = document.createElement("img");
      left.src = itemObj.imgLeft || src;
      left.alt = itemObj.name || itemObj.id;
      left.className = `layer-overlay layer-eyes-left item-${itemObj.id}`;
      left.style.zIndex = String(zBySlot.eyes || 50);

      const right = document.createElement("img");
      right.src = itemObj.imgRight || src;
      right.alt = itemObj.name || itemObj.id;
      right.className = `layer-overlay layer-eyes-right item-${itemObj.id}`;
      right.style.zIndex = String(zBySlot.eyes || 50);

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
      return;
    }

    // --- SHOES ---
    if (slot === "shoes") {
      const left = document.createElement("img");
      left.src = src;
      left.alt = itemObj.name || itemObj.id;
      left.className = `layer-overlay layer-shoes-left item-${itemObj.id}`;
      left.style.zIndex = String(zBySlot.shoes || 10);

      const right = document.createElement("img");
      right.src = src;
      right.alt = itemObj.name || itemObj.id;
      right.className = `layer-overlay layer-shoes-right item-${itemObj.id}`;
      right.style.zIndex = String(zBySlot.shoes || 10);

      overlayHost.appendChild(left);
      overlayHost.appendChild(right);
      return;
    }

    // --- DEFAULT (hair, top, bottom, necklace, belly, etc.) ---
    const img = document.createElement("img");
    img.src = src;
    img.alt = itemObj.name || itemObj.id;
    img.className = `layer-overlay item-${itemObj.id}`;
    img.style.zIndex = String(zBySlot[slot] || 20);
    overlayHost.appendChild(img);
  }

  function renderOverlays(){ clearOverlays(); Object.keys(equipped).forEach(slot=>{ if(equipped[slot]) addOverlayImg(equipped[slot]); }); }

  function initTabs(){ $$(".tab-btn").forEach(btn=>{ btn.addEventListener("click",()=>{ $$(".tab-btn").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); currentCat=btn.dataset.cat||"hair"; renderItems(); saveState(); }); }); }

  function initGenderButtons(){ $$(".seg-btn[data-gender]").forEach(btn=>{ btn.addEventListener("click",()=>{ $$(".seg-btn[data-gender]").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); setGender(btn.dataset.gender==="male"?"male":"female"); }); }); }

  function syncUIButtons(){
    $$(".seg-btn[data-gender]").forEach(b=>{ b.classList.toggle("active",b.dataset.gender===currentGender); });
    $$(".tab-btn").forEach(b=>{ b.classList.toggle("active",b.dataset.cat===currentCat); });
  }

  function bootWhenReady(){
    loadState(null);
    const itemsNow=safeItems();
    if(itemsNow){
      errBox&&errBox.classList.add("hidden"); loadState(itemsNow);
      document.body.dataset.gender=currentGender; document.body.dataset.skin=currentSkin;
      initTabs(); initGenderButtons(); buildSkinButtons(); syncUIButtons();
      setBaseImage(); updateLabels(); renderItems(); renderOverlays(); return;
    }
    let tries=0;
    const timer=setInterval(()=>{
      tries++; const items=safeItems();
      if(items){
        clearInterval(timer); errBox&&errBox.classList.add("hidden");
        loadState(items);
        document.body.dataset.gender=currentGender; document.body.dataset.skin=currentSkin;
        initTabs(); initGenderButtons(); buildSkinButtons(); syncUIButtons();
        setBaseImage(); updateLabels(); renderItems(); renderOverlays();
      } else if(tries>=50){ clearInterval(timer); errBox&&errBox.classList.remove("hidden"); }
    },50);
  }

  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") saveState(); });
  window.addEventListener("pageshow",()=>{
    const items=safeItems(); loadState(items);
    document.body.dataset.gender=currentGender; document.body.dataset.skin=currentSkin;
    syncUIButtons(); setBaseImage(); updateLabels(); renderItems(); renderOverlays();
  });

  document.addEventListener("DOMContentLoaded", bootWhenReady);
})();
```

**Key changes made:**
- Line ~185: Changed `layer-left` to `layer-ears-left`
- Line ~191: Changed `layer-right` to `layer-ears-right`
- Line ~200: Changed `layer-left` to `layer-eyes-left`
- Line ~206: Changed `layer-right` to `layer-eyes-right`

Now the class names match your CSS rules exactly! This should make eyes, shoes, and earrings render with independent left/right positioning based on your CSS settings.

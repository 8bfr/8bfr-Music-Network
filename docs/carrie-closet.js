// carrie-closet.js
// FULL controller — compatible with your existing HTML + CSS

const overlayHost = document.getElementById("closetOverlayHost");
const itemsGrid = document.getElementById("closetItemsGrid");
const tabButtons = document.querySelectorAll(".tab-btn");

let activeCategory = "eyes";
let activeSelections = {
  eyes: null
};

/* =========================
   CORE OVERLAY FUNCTIONS
========================= */

function clearCategory(category) {
  overlayHost
    .querySelectorAll(`[data-category="${category}"]`)
    .forEach(el => el.remove());
}

function mountEyes(item) {
  clearCategory("eyes");

  const left = document.createElement("img");
  left.src = item.leftSrc;
  left.className = `layer-overlay ${item.className} layer-left`;
  left.dataset.category = "eyes";

  const right = document.createElement("img");
  right.src = item.rightSrc;
  right.className = `layer-overlay ${item.className} layer-right`;
  right.dataset.category = "eyes";

  overlayHost.appendChild(left);
  overlayHost.appendChild(right);
}

/* =========================
   APPLY ITEM
========================= */

function applyItem(item) {
  if (item.category === "eyes") {
    mountEyes(item);
  }
}

/* =========================
   RENDER ITEMS GRID
========================= */

function renderItems() {
  itemsGrid.innerHTML = "";

  const gender = document.body.dataset.gender;
  const items = window.CARRIE_CLOSET_DATA[activeCategory];

  items
    .filter(item => item.genders.includes(gender))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "closet-item-card";
      card.textContent = item.label;

      if (activeSelections[activeCategory] === item.id) {
        card.classList.add("active");
      }

      card.addEventListener("click", () => {
        activeSelections[activeCategory] = item.id;
        applyItem(item);

        document
          .querySelectorAll(".closet-item-card")
          .forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      });

      itemsGrid.appendChild(card);
    });
}

/* =========================
   TAB SWITCHING
========================= */

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeCategory = btn.dataset.cat;

    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderItems();
  });
});

/* =========================
   GENDER SWITCH
========================= */

document.querySelectorAll("[data-gender]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.dataset.gender = btn.dataset.gender;
    renderItems();

    // reapply active item so CSS updates properly
    const id = activeSelections[activeCategory];
    if (id) {
      const item = window.CARRIE_CLOSET_DATA[activeCategory]
        .find(i => i.id === id);
      if (item) applyItem(item);
    }
  });
});

/* =========================
   SKIN SWITCH
========================= */

document.querySelectorAll("[data-skin]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.dataset.skin = btn.dataset.skin;

    // CSS-only change; overlays remain mounted
  });
});

/* =========================
   INIT
========================= */

renderItems();

const overlayHost = document.getElementById("closetOverlayHost");
const itemsGrid = document.getElementById("closetItemsGrid");
const tabButtons = document.querySelectorAll(".tab-btn");

let activeCategory = "eyes";
let activeSelections = { eyes: null, hair: null, top: null, bottom: null, jewelry: null, shoes: null };

/* =========================
   CORE OVERLAY FUNCTIONS
========================= */
function clearCategory(category) {
  overlayHost.querySelectorAll(`[data-category="${category}"]`).forEach(el => el.remove());
}

function mountItem(item) {
  clearCategory(item.category);

  if (item.category === "eyes") {
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
  } else {
    const img = document.createElement("img");
    img.src = item.src;
    img.className = `layer-overlay ${item.className}`;
    img.dataset.category = item.category;
    overlayHost.appendChild(img);
  }
}

/* =========================
   APPLY ITEM
========================= */
function applyItem(item) {
  activeSelections[item.category] = item.id;
  mountItem(item);
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

      if (activeSelections[activeCategory] === item.id) card.classList.add("active");

      card.addEventListener("click", () => {
        applyItem(item);
        document.querySelectorAll(".closet-item-card").forEach(c => c.classList.remove("active"));
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
    // reapply all active items
    Object.keys(activeSelections).forEach(cat => {
      const id = activeSelections[cat];
      if (!id) return;
      const items = window.CARRIE_CLOSET_DATA[cat];
      const item = items.find(i => i.id === id);
      if (item) mountItem(item);
    });
  });
});

/* =========================
   INITIALIZE
========================= */
renderItems();

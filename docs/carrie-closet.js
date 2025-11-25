// carrie-closet.js
// Front-end logic for Carrie Closet (preview + simple selection / coins stub)

(function () {
  const data = window.CARRIE_CLOSET;

  function fail(msg) {
    const root = document.getElementById("closetRoot");
    if (root) {
      root.innerHTML =
        '<div class="text-sm text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg p-3">' +
        (msg ||
          "Closet data failed to load. Please check the JS files or try again later.") +
        "</div>";
    }
  }

  if (!data || !data.bases || !data.items) {
    fail();
    return;
  }

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const root = document.getElementById("closetRoot");
    if (!root) {
      console.warn("Carrie Closet: #closetRoot not found");
      return;
    }

    root.innerHTML = buildShellHtml();

    // DOM refs
    const genderBtns = {
      female: document.getElementById("genderBtnFemale"),
      male: document.getElementById("genderBtnMale"),
    };
    const baseStrip = document.getElementById("baseStrip");
    const coinLabel = document.getElementById("coinBalance");

    const layerBase = document.getElementById("layerBase");
    const layerHair = document.getElementById("layerHair");
    const layerOutfit = document.getElementById("layerOutfit");
    const layerEyes = document.getElementById("layerEyes");
    const layerJewelry = document.getElementById("layerJewelry");
    const layerShoes = document.getElementById("layerShoes");

    const slots = {
      hair: {
        container: document.getElementById("slotGridHair"),
        clearBtn: document.getElementById("clearHair"),
      },
      outfit: {
        container: document.getElementById("slotGridOutfit"),
        clearBtn: document.getElementById("clearOutfit"),
      },
      eyes: {
        container: document.getElementById("slotGridEyes"),
        clearBtn: document.getElementById("clearEyes"),
      },
      jewelry: {
        container: document.getElementById("slotGridJewelry"),
        clearBtn: document.getElementById("clearJewelry"),
      },
      shoes: {
        container: document.getElementById("slotGridShoes"),
        clearBtn: document.getElementById("clearShoes"),
      },
    };

    const summaryList = document.getElementById("selectionSummary");
    const totalCostLabel = document.getElementById("totalCostLabel");

    // state
    let currentGender = "female";
    let baseIndex = 0;
    let coins = 0; // stub — real coin system can hook into this later
    const chosen = {
      hair: null,
      outfit: null,
      eyes: null,
      jewelry: null,
      shoes: null,
    };

    // ---- helpers ----

    function setGender(g) {
      currentGender = g;
      updateGenderButtons();
      baseIndex = 0;
      renderBaseStrip();
      renderBase();
      renderSlotGrids();
      renderSummary();
    }

    function updateGenderButtons() {
      ["female", "male"].forEach((g) => {
        const btn = genderBtns[g];
        if (!btn) return;
        if (g === currentGender) {
          btn.classList.add("bg-purple-600", "text-white", "border-purple-400");
          btn.classList.remove("bg-slate-900/70", "text-purple-200");
        } else {
          btn.classList.add("bg-slate-900/70", "text-purple-200");
          btn.classList.remove("bg-purple-600", "text-white", "border-purple-400");
        }
      });
    }

    function renderBaseStrip() {
      if (!baseStrip) return;
      const arr = data.bases[currentGender] || [];
      baseStrip.innerHTML = "";
      arr.forEach((b, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "relative overflow-hidden rounded-lg border text-[11px] px-2 py-1 flex flex-col items-center gap-1 " +
          (idx === baseIndex
            ? "border-purple-400 bg-purple-800/50"
            : "border-slate-600/70 bg-slate-900/80 hover:border-purple-400/70");
        btn.innerHTML = `
          <div class="w-10 h-14 bg-slate-900/80 rounded-md overflow-hidden">
            <img src="${b.src}" class="w-full h-full object-contain" alt="">
          </div>
          <span class="truncate max-w-[70px]">${b.label}</span>
        `;
        btn.addEventListener("click", () => {
          baseIndex = idx;
          renderBaseStrip();
          renderBase();
        });
        baseStrip.appendChild(btn);
      });
    }

    function renderBase() {
      const arr = data.bases[currentGender] || [];
      const b = arr[baseIndex];
      if (!b || !layerBase) return;
      layerBase.src = b.src || "";
    }

    function filteredItemsForSlot(slot) {
      return data.items.filter((item) => {
        if (item.slot !== slot) return false;
        if (item.gender === "unisex") return true;
        return item.gender === currentGender;
      });
    }

    function renderSlotGrid(slotKey) {
      const info = slots[slotKey];
      if (!info || !info.container) return;
      const list = filteredItemsForSlot(slotKey);
      info.container.innerHTML = "";
      if (!list.length) {
        info.container.innerHTML =
          '<div class="text-xs text-purple-200/70">No items yet for this slot.</div>';
        return;
      }
      list.forEach((item) => {
        const card = document.createElement("button");
        card.type = "button";
        const isActive = chosen[slotKey] && chosen[slotKey].id === item.id;
        card.className =
          "w-full text-left rounded-lg border px-2 py-1.5 text-xs flex items-center gap-2 mb-1 " +
          (isActive
            ? "border-emerald-400 bg-emerald-900/40"
            : "border-slate-600/70 bg-slate-900/80 hover:border-purple-400/70");
        card.innerHTML = `
          <div class="w-9 h-11 bg-slate-950/70 rounded-md overflow-hidden shrink-0">
            <img src="${item.src}" class="w-full h-full object-contain" alt="">
          </div>
          <div class="flex-1 min-w-0">
            <div class="truncate">${item.label}</div>
            <div class="text-[10px] text-purple-200/80 flex items-center gap-1">
              <span>🪙 ${item.coins}</span>
              <span class="opacity-70">• ${
                item.gender === "unisex"
                  ? "Unisex"
                  : item.gender === "female"
                  ? "Female"
                  : "Male"
              }</span>
            </div>
          </div>
        `;
        card.addEventListener("click", () => {
          if (isActive) {
            chosen[slotKey] = null;
          } else {
            chosen[slotKey] = item;
          }
          renderLayers();
          renderSlotGrid(slotKey);
          renderSummary();
        });
        info.container.appendChild(card);
      });
    }

    function renderSlotGrids() {
      renderSlotGrid("hair");
      renderSlotGrid("outfit");
      renderSlotGrid("eyes");
      renderSlotGrid("jewelry");
      renderSlotGrid("shoes");
    }

    function renderLayers() {
      if (layerHair) {
        layerHair.src = chosen.hair ? chosen.hair.src : "";
        layerHair.style.opacity = chosen.hair ? "1" : "0";
      }
      if (layerOutfit) {
        layerOutfit.src = chosen.outfit ? chosen.outfit.src : "";
        layerOutfit.style.opacity = chosen.outfit ? "1" : "0";
      }
      if (layerEyes) {
        layerEyes.src = chosen.eyes ? chosen.eyes.src : "";
        layerEyes.style.opacity = chosen.eyes ? "1" : "0";
      }
      if (layerJewelry) {
        layerJewelry.src = chosen.jewelry ? chosen.jewelry.src : "";
        layerJewelry.style.opacity = chosen.jewelry ? "1" : "0";
      }
      if (layerShoes) {
        layerShoes.src = chosen.shoes ? chosen.shoes.src : "";
        layerShoes.style.opacity = chosen.shoes ? "1" : "0";
      }
    }

    function renderSummary() {
      if (!summaryList || !totalCostLabel || !coinLabel) return;
      summaryList.innerHTML = "";
      let total = 0;
      Object.keys(chosen).forEach((slot) => {
        const item = chosen[slot];
        if (!item) return;
        total += item.coins || 0;
        const li = document.createElement("li");
        li.className =
          "flex items-center justify-between text-xs text-purple-50/90";
        li.innerHTML = `
          <span class="capitalize">${slot}</span>
          <span class="truncate flex-1 mx-2 text-right">${item.label}</span>
          <span class="ml-2 text-emerald-300">+${item.coins} 🪙</span>
        `;
        summaryList.appendChild(li);
      });
      if (!summaryList.children.length) {
        summaryList.innerHTML =
          '<li class="text-xs text-purple-200/70">No upgrades selected yet.</li>';
      }
      totalCostLabel.textContent = total;
      coinLabel.textContent = coins;
    }

    function wireClearButtons() {
      Object.keys(slots).forEach((slotKey) => {
        const info = slots[slotKey];
        if (!info || !info.clearBtn) return;
        info.clearBtn.addEventListener("click", () => {
          chosen[slotKey] = null;
          renderLayers();
          renderSlotGrid(slotKey);
          renderSummary();
        });
      });
    }

    function wireGenderButtons() {
      if (genderBtns.female) {
        genderBtns.female.addEventListener("click", () => setGender("female"));
      }
      if (genderBtns.male) {
        genderBtns.male.addEventListener("click", () => setGender("male"));
      }
    }

    // Initial render
    wireGenderButtons();
    wireClearButtons();
    updateGenderButtons();
    renderBaseStrip();
    renderBase();
    renderSlotGrids();
    renderLayers();
    renderSummary();
  }

  function buildShellHtml() {
    return `
      <div class="rounded-2xl border border-purple-500/50 bg-slate-950/80 shadow-2xl p-4 sm:p-5">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Left: preview -->
          <div class="md:w-1/2 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-2">
              <div class="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border border-purple-400/60 bg-purple-900/40 text-purple-50">
                <span>🧵 Carrie Closet</span>
                <span class="text-purple-200/80">beta</span>
              </div>
              <div class="text-[11px] text-purple-200/80">
                Coins: <span id="coinBalance" class="font-semibold text-emerald-300">0</span> 🪙
              </div>
            </div>

            <div class="flex items-center gap-2 text-[11px] mt-1">
              <button id="genderBtnFemale" type="button"
                class="flex-1 px-2 py-1 rounded-full border">
                ♀ Female
              </button>
              <button id="genderBtnMale" type="button"
                class="flex-1 px-2 py-1 rounded-full border">
                ♂ Male
              </button>
            </div>

            <div class="mt-2">
              <p class="text-[11px] text-purple-200/80 mb-1">Base skin tone</p>
              <div id="baseStrip" class="flex flex-row gap-2 overflow-x-auto pb-1"></div>
            </div>

            <div class="mt-3">
              <p class="text-[11px] text-purple-200/80 mb-1">Preview</p>
              <div class="relative w-full max-w-xs mx-auto aspect-[3/4] bg-slate-950/90 rounded-2xl border border-purple-500/60 shadow-[0_0_40px_rgba(124,58,237,0.55)] overflow-hidden">
                <img id="layerBase"
                     class="absolute inset-0 w-full h-full object-contain"
                     src=""
                     alt="Base avatar">
                <img id="layerOutfit"
                     class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
                     style="opacity:0"
                     src=""
                     alt="Outfit layer">
                <img id="layerHair"
                     class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
                     style="opacity:0"
                     src=""
                     alt="Hair layer">
                <img id="layerEyes"
                     class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
                     style="opacity:0"
                     src=""
                     alt="Eyes layer">
                <img id="layerJewelry"
                     class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
                     style="opacity:0"
                     src=""
                     alt="Jewelry layer">
                <img id="layerShoes"
                     class="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
                     style="opacity:0"
                     src=""
                     alt="Shoes layer">
              </div>
            </div>
          </div>

          <!-- Right: slots + items -->
          <div class="md:w-1/2 flex flex-col gap-3">
            <div>
              <p class="text-[11px] text-purple-200/80 mb-1">
                Choose what to customize
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                <button type="button" class="px-2 py-1 rounded-full bg-purple-700/60 text-purple-50">
                  Hair
                </button>
                <button type="button" class="px-2 py-1 rounded-full bg-slate-900/80 text-purple-100 border border-purple-500/40">
                  Outfit
                </button>
                <button type="button" class="px-2 py-1 rounded-full bg-slate-900/80 text-purple-100 border border-purple-500/40">
                  Eyes
                </button>
                <button type="button" class="px-2 py-1 rounded-full bg-slate-900/80 text-purple-100 border border-purple-500/40">
                  Jewelry
                </button>
                <button type="button" class="px-2 py-1 rounded-full bg-slate-900/80 text-purple-100 border border-purple-500/40">
                  Shoes
                </button>
              </div>
            </div>

            <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              <!-- Hair -->
              <section>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xs font-semibold text-purple-100">Hair</h3>
                  <button id="clearHair"
                    class="text-[10px] text-purple-200/80 hover:text-purple-50 underline-offset-2 hover:underline">
                    Clear hair
                  </button>
                </div>
                <div id="slotGridHair"></div>
              </section>

              <!-- Outfit -->
              <section>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xs font-semibold text-purple-100">Outfit</h3>
                  <button id="clearOutfit"
                    class="text-[10px] text-purple-200/80 hover:text-purple-50 underline-offset-2 hover:underline">
                    Clear outfit
                  </button>
                </div>
                <div id="slotGridOutfit"></div>
              </section>

              <!-- Eyes -->
              <section>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xs font-semibold text-purple-100">Eyes</h3>
                  <button id="clearEyes"
                    class="text-[10px] text-purple-200/80 hover:text-purple-50 underline-offset-2 hover:underline">
                    Clear eyes
                  </button>
                </div>
                <div id="slotGridEyes"></div>
              </section>

              <!-- Jewelry -->
              <section>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xs font-semibold text-purple-100">Jewelry</h3>
                  <button id="clearJewelry"
                    class="text-[10px] text-purple-200/80 hover:text-purple-50 underline-offset-2 hover:underline">
                    Clear jewelry
                  </button>
                </div>
                <div id="slotGridJewelry"></div>
              </section>

              <!-- Shoes -->
              <section>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xs font-semibold text-purple-100">Shoes</h3>
                  <button id="clearShoes"
                    class="text-[10px] text-purple-200/80 hover:text-purple-50 underline-offset-2 hover:underline">
                    Clear shoes
                  </button>
                </div>
                <div id="slotGridShoes"></div>
              </section>
            </div>

            <div class="mt-2 border-t border-purple-500/40 pt-2">
              <h3 class="text-xs font-semibold text-purple-100 mb-1">Selection summary</h3>
              <ul id="selectionSummary" class="space-y-0.5 mb-1"></ul>
              <div class="flex items-center justify-between text-xs text-purple-100 mt-1">
                <span>Total cost</span>
                <span class="text-emerald-300 font-semibold">
                  🪙 <span id="totalCostLabel">0</span>
                </span>
              </div>
              <p class="text-[10px] text-purple-300/75 mt-1">
                Coin purchases and saving outfits will be wired into the 8BFR coin system in a later step.
                For now, use this to preview styles for BF / GF chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
})();

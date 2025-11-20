// carrie-closet.js
// Front-end only • no Supabase required here

// --------- Data: closet items ---------

/**
 * Each item:
 * {
 *   id: string,
 *   category: "outfit" | "accessory" | "hair" | "eyes" | "skin",
 *   name: string,
 *   desc: string,
 *   style: "conservative" | "casual" | "sexy" | "swim" | "sporty" | "party",
 *   tone: string,             // vibe or color family
 *   rarity: "basic" | "rare" | "legendary",
 *   cost: number,             // coins
 *   tags: string[],
 *   emoji: string
 * }
 */

const CLOSET_ITEMS = [
  // --- Outfits: conservative / business ---
  {
    id: "outfit_conservative_1",
    category: "outfit",
    name: "Business Lavender Blazer Set",
    desc: "Tailored lavender blazer, white blouse, and slim black pants. Professional but still playful.",
    style: "conservative",
    tone: "business",
    rarity: "rare",
    cost: 850,
    tags: ["blazer", "pants", "office"],
    emoji: "🧥",
  },
  {
    id: "outfit_conservative_2",
    category: "outfit",
    name: "Studio Manager Fit",
    desc: "Dark skinny jeans, black v-neck, and 8BFR logo bomber jacket.",
    style: "conservative",
    tone: "dark",
    rarity: "basic",
    cost: 520,
    tags: ["jacket", "studio", "manager"],
    emoji: "🎧",
  },
  {
    id: "outfit_conservative_3",
    category: "outfit",
    name: "Soft Purple Turtleneck + Pencil Skirt",
    desc: "Cozy fitted turtleneck with a high-waist pencil skirt. Low-key but classy.",
    style: "conservative",
    tone: "soft purple",
    rarity: "rare",
    cost: 780,
    tags: ["skirt", "office", "classy"],
    emoji: "👗",
  },

  // --- Outfits: casual / street ---
  {
    id: "outfit_casual_1",
    category: "outfit",
    name: "Oversized Hoodie + Biker Shorts",
    desc: "Baggy 8BFR purple hoodie with black biker shorts. Chill gaming or late-night studio look.",
    style: "casual",
    tone: "street",
    rarity: "basic",
    cost: 400,
    tags: ["hoodie", "shorts", "street"],
    emoji: "🕶️",
  },
  {
    id: "outfit_casual_2",
    category: "outfit",
    name: "Neon Crop Jacket + Cargo Pants",
    desc: "Cropped neon blue jacket over a black tank and purple cargo pants.",
    style: "casual",
    tone: "neon",
    rarity: "rare",
    cost: 920,
    tags: ["cargo", "neon", "street"],
    emoji: "💡",
  },
  {
    id: "outfit_casual_3",
    category: "outfit",
    name: "Galaxy Tee + Ripped Jeans",
    desc: "Loose galaxy print t-shirt tucked into high-waist distressed jeans.",
    style: "casual",
    tone: "galaxy",
    rarity: "basic",
    cost: 350,
    tags: ["jeans", "t-shirt", "relaxed"],
    emoji: "🌌",
  },

  // --- Outfits: sexy / club ---
  {
    id: "outfit_sexy_1",
    category: "outfit",
    name: "Black Bodycon Dress with Neon Trim",
    desc: "Tight mini bodycon with subtle neon purple trim that glows under club lights.",
    style: "sexy",
    tone: "night",
    rarity: "rare",
    cost: 1350,
    tags: ["dress", "club", "night"],
    emoji: "💜",
  },
  {
    id: "outfit_sexy_2",
    category: "outfit",
    name: "Cross-Strap Crop + Leather Skirt",
    desc: "Cross-strap top paired with a high-rise leather mini skirt and fishnets.",
    style: "sexy",
    tone: "bold",
    rarity: "legendary",
    cost: 1900,
    tags: ["leather", "skirt", "club"],
    emoji: "🔥",
  },
  {
    id: "outfit_sexy_3",
    category: "outfit",
    name: "Lace-Up Corset + Skinny Jeans",
    desc: "Lace-up corset top with black skinny jeans and ankle boots. Flirty but still mobile.",
    style: "sexy",
    tone: "dark",
    rarity: "rare",
    cost: 1450,
    tags: ["corset", "jeans", "boots"],
    emoji: "🖤",
  },

  // --- Outfits: skirts / shorts ---
  {
    id: "outfit_skirt_1",
    category: "outfit",
    name: "Plaid Skirt + Oversized Sweater",
    desc: "High-waist pastel plaid skirt with a huge soft sweater tucked in the front.",
    style: "casual",
    tone: "soft",
    rarity: "basic",
    cost: 480,
    tags: ["skirt", "cozy", "cute"],
    emoji: "🧶",
  },
  {
    id: "outfit_shorts_1",
    category: "outfit",
    name: "Denim Shorts + Studio Crop",
    desc: "Fitted denim shorts with a black ‘Studio Mode’ crop top.",
    style: "casual",
    tone: "summer",
    rarity: "basic",
    cost: 430,
    tags: ["shorts", "crop", "summer"],
    emoji: "☀️",
  },

  // --- Outfits: swim / bikini ---
  {
    id: "outfit_swim_1",
    category: "outfit",
    name: "Purple One-Piece Swimsuit",
    desc: "Conservative one-piece with side cutouts but full coverage in the right places.",
    style: "swim",
    tone: "purple",
    rarity: "rare",
    cost: 1100,
    tags: ["swim", "one-piece"],
    emoji: "🏊‍♀️",
  },
  {
    id: "outfit_swim_2",
    category: "outfit",
    name: "Neon Triangle Bikini Set",
    desc: "Neon blue and pink triangle bikini set with string sides. Extra coin because extra spicy.",
    style: "sexy",
    tone: "swim",
    rarity: "legendary",
    cost: 2100,
    tags: ["bikini", "swim", "sexy"],
    emoji: "👙",
  },

  // --- Accessories ---
  {
    id: "acc_headphones_1",
    category: "accessory",
    name: "8BFR Studio Headphones",
    desc: "Over-ear purple studio headphones with subtle logo.",
    style: "casual",
    tone: "studio",
    rarity: "rare",
    cost: 600,
    tags: ["headphones", "studio"],
    emoji: "🎧",
  },
  {
    id: "acc_chain_1",
    category: "accessory",
    name: "Silver Name Necklace",
    desc: "Delicate chain with Carrie’s name in cursive.",
    style: "casual",
    tone: "silver",
    rarity: "basic",
    cost: 260,
    tags: ["necklace", "silver"],
    emoji: "📿",
  },
  {
    id: "acc_chain_2",
    category: "accessory",
    name: "Thick 8BFR Logo Chain",
    desc: "Heavy chain with a glowing 8BFR pendant.",
    style: "sexy",
    tone: "gold",
    rarity: "rare",
    cost: 720,
    tags: ["chain", "gold", "logo"],
    emoji: "💎",
  },
  {
    id: "acc_bracelet_1",
    category: "accessory",
    name: "Charm Bracelet Set",
    desc: "Stack of bracelets with tiny mic, music note, and game controller charms.",
    style: "casual",
    tone: "mixed",
    rarity: "basic",
    cost: 310,
    tags: ["bracelet", "charms"],
    emoji: "🎀",
  },
  {
    id: "acc_glasses_1",
    category: "accessory",
    name: "Blue Light Glasses",
    desc: "Transparent frames with a soft purple reflection.",
    style: "conservative",
    tone: "clear",
    rarity: "basic",
    cost: 290,
    tags: ["glasses", "nerdy"],
    emoji: "👓",
  },

  // --- Hair styles / colors ---
  {
    id: "hair_dark_1",
    category: "hair",
    name: "Long Dark Waves",
    desc: "Loose, dark waves just past the shoulders.",
    style: "casual",
    tone: "dark brown",
    rarity: "basic",
    cost: 380,
    tags: ["long", "wavy"],
    emoji: "💇‍♀️",
    colorHex: "#1f2933",
  },
  {
    id: "hair_purple_1",
    category: "hair",
    name: "Violet Ombre",
    desc: "Dark roots fading into neon violet tips.",
    style: "party",
    tone: "purple",
    rarity: "rare",
    cost: 980,
    tags: ["ombre", "party"],
    emoji: "💜",
    colorHex: "#7c3aed",
  },
  {
    id: "hair_blonde_1",
    category: "hair",
    name: "Soft Honey Blonde",
    desc: "Smooth honey blonde with a middle part.",
    style: "conservative",
    tone: "blonde",
    rarity: "rare",
    cost: 890,
    tags: ["blonde", "smooth"],
    emoji: "✨",
    colorHex: "#fbbf77",
  },
  {
    id: "hair_pink_1",
    category: "hair",
    name: "Cotton Candy Ponytail",
    desc: "High ponytail with pink and blue streaks.",
    style: "sexy",
    tone: "pastel",
    rarity: "legendary",
    cost: 1300,
    tags: ["pony", "pastel"],
    emoji: "🌈",
    colorHex: "#ec4899",
  },

  // --- Eye colors ---
  {
    id: "eyes_blue_1",
    category: "eyes",
    name: "Deep Ocean Blue",
    desc: "Bright but soft blue with a darker ring.",
    style: "casual",
    tone: "blue",
    rarity: "basic",
    cost: 260,
    tags: ["blue"],
    emoji: "👁️",
    colorHex: "#2563eb",
  },
  {
    id: "eyes_brown_1",
    category: "eyes",
    name: "Warm Brown",
    desc: "Dark chocolate brown with subtle gold flecks.",
    style: "conservative",
    tone: "brown",
    rarity: "basic",
    cost: 240,
    tags: ["brown"],
    emoji: "👁️",
    colorHex: "#4b2e16",
  },
  {
    id: "eyes_green_1",
    category: "eyes",
    name: "Emerald Green",
    desc: "Bright green with a hint of teal.",
    style: "rare",
    tone: "green",
    rarity: "rare",
    cost: 520,
    tags: ["green"],
    emoji: "👁️",
    colorHex: "#16a34a",
  },
  {
    id: "eyes_purple_1",
    category: "eyes",
    name: "Neon Violet Contacts",
    desc: "Glowing violet contacts for club or cosplay.",
    style: "party",
    tone: "purple",
    rarity: "legendary",
    cost: 880,
    tags: ["contacts", "party"],
    emoji: "👁️‍🗨️",
    colorHex: "#a855f7",
  },

  // --- Skin tones ---
  {
    id: "skin_fair_1",
    category: "skin",
    name: "Fair Neutral",
    desc: "Light neutral tone with soft pink undertones.",
    style: "base",
    tone: "fair",
    rarity: "basic",
    cost: 0,
    tags: ["fair", "neutral"],
    emoji: "🧴",
    colorHex: "#fde2d5",
  },
  {
    id: "skin_medium_1",
    category: "skin",
    name: "Medium Warm",
    desc: "Golden beige with warm highlights.",
    style: "base",
    tone: "medium",
    rarity: "basic",
    cost: 0,
    tags: ["medium", "warm"],
    emoji: "🧴",
    colorHex: "#f5b598",
  },
  {
    id: "skin_tan_1",
    category: "skin",
    name: "Tan Bronze",
    desc: "Rich tan with bronze undertones.",
    style: "base",
    tone: "tan",
    rarity: "basic",
    cost: 0,
    tags: ["tan", "bronze"],
    emoji: "🧴",
    colorHex: "#d08a5c",
  },
  {
    id: "skin_deep_1",
    category: "skin",
    name: "Deep Espresso",
    desc: "Deep cool-toned brown, rich and smooth.",
    style: "base",
    tone: "deep",
    rarity: "basic",
    cost: 0,
    tags: ["deep", "cool"],
    emoji: "🧴",
    colorHex: "#4b2a1a",
  },
];

// --------- State ---------

const loadout = {
  outfit: null,
  accessory: null,
  hair: null,
  eyes: null,
  skin: null,
};

let currentFilter = "all";
let currentSort = "default";

// --------- Helpers ---------

function formatCost(cost) {
  return cost.toLocaleString() + " coins";
}

function rarityLabel(rarity) {
  if (rarity === "legendary") return "Legendary";
  if (rarity === "rare") return "Rare";
  return "Basic";
}

function rarityColorClasses(rarity) {
  switch (rarity) {
    case "legendary":
      return "border-amber-400 text-amber-200 bg-amber-900/40";
    case "rare":
      return "border-purple-400 text-purple-100 bg-purple-900/40";
    default:
      return "border-slate-400 text-slate-100 bg-slate-900/60";
  }
}

function itemMatchesFilter(item, filter) {
  if (filter === "all") return true;
  if (["outfit","accessory","hair","eyes","skin"].includes(filter)) {
    return item.category === filter;
  }
  // style filters
  if (filter === "conservative") return item.style === "conservative";
  if (filter === "sexy") return item.style === "sexy";
  if (filter === "swim") return item.style === "swim";
  return true;
}

function sortItems(items, sort) {
  const arr = [...items];
  if (sort === "cost-low") {
    arr.sort((a,b) => a.cost - b.cost);
  } else if (sort === "cost-high") {
    arr.sort((a,b) => b.cost - a.cost);
  } else if (sort === "style") {
    arr.sort((a,b) => (a.style || "").localeCompare(b.style || ""));
  } else {
    // "default": some manual prioritization: outfits > others, then cost high
    arr.sort((a,b) => {
      const orderCat = (it) =>
        it.category === "outfit" ? 0 :
        it.category === "accessory" ? 1 :
        it.category === "hair" ? 2 :
        it.category === "eyes" ? 3 : 4;
      const ca = orderCat(a);
      const cb = orderCat(b);
      if (ca !== cb) return ca - cb;
      return b.cost - a.cost;
    });
  }
  return arr;
}

function totalLoadoutCost() {
  return ["outfit","accessory","hair","eyes","skin"].reduce((sum, cat) => {
    const item = loadout[cat];
    return sum + (item ? item.cost : 0);
  }, 0);
}

// --------- DOM wiring ---------

document.addEventListener("DOMContentLoaded", () => {
  const gridEl = document.getElementById("closetGrid");
  const countEl = document.getElementById("closetItemCount");
  const filters = document.querySelectorAll(".closet-filter");
  const sortSelect = document.getElementById("closetSort");
  const clearBtn = document.getElementById("closetClearLoadout");
  const equipList = document.getElementById("closetEquippedList");

  // Preview elements
  const loadoutCostEl = document.getElementById("closetLoadoutCost");
  const outfitLabelEl = document.getElementById("previewOutfitLabel");
  const outfitCostEl = document.getElementById("previewOutfitCost");
  const accLabelEl = document.getElementById("previewAccessoryLabel");
  const accCostEl = document.getElementById("previewAccessoryCost");
  const hairLabelEl = document.getElementById("previewHairLabel");
  const hairDotEl = document.getElementById("previewHairColorDot");
  const eyesLabelEl = document.getElementById("previewEyesLabel");
  const eyesDotEl = document.getElementById("previewEyesColorDot");
  const skinLabelEl = document.getElementById("previewSkinLabel");
  const skinDotEl = document.getElementById("previewSkinColorDot");

  if (!gridEl || !countEl) return;

  // Render all items first time
  function renderGrid() {
    const filtered = CLOSET_ITEMS.filter((item) =>
      itemMatchesFilter(item, currentFilter)
    );
    const sorted = sortItems(filtered, currentSort);

    gridEl.innerHTML = "";

    sorted.forEach((item) => {
      const card = document.createElement("article");
      card.className = "closet-card";

      const tagHtml = item.tags
        .map(
          (tag) =>
            `<span class="inline-flex items-center rounded-full border border-purple-500/60 bg-slate-900/80 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]">${tag}</span>`
        )
        .join(" ");

      const rarityClass = rarityColorClasses(item.rarity);

      card.innerHTML = `
        <!-- top row: emoji + name + rarity / cost -->
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="flex items-start gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-950/80 border border-purple-500/60 flex items-center justify-center text-lg">
              ${item.emoji || "👗"}
            </div>
            <div>
              <div class="text-[11px] font-semibold text-purple-50 line-clamp-2">
                ${item.name}
              </div>
              <div class="mt-0.5 flex flex-wrap gap-1">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded-full border bg-slate-900/80 border-slate-500/70 text-[9px] uppercase tracking-[0.14em]">
                  ${item.category.toUpperCase()}
                </span>
                <span class="inline-flex items-center px-1.5 py-0.5 rounded-full border bg-slate-900/80 border-slate-500/70 text-[9px] uppercase tracking-[0.14em]">
                  ${item.style}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right space-y-0.5">
            <div class="inline-flex items-center px-1.5 py-0.5 rounded-full border ${rarityClass} text-[9px] uppercase tracking-[0.14em]">
              ${rarityLabel(item.rarity)}
            </div>
            <div class="text-[10px] text-amber-300 font-semibold">
              ${formatCost(item.cost)}
            </div>
          </div>
        </div>

        <!-- description -->
        <p class="text-[10px] text-purple-200/80 mb-1.5">
          ${item.desc}
        </p>

        <!-- tags + equip -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-wrap gap-1">
            ${tagHtml}
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-full border border-emerald-400/80 bg-emerald-800/40 hover:bg-emerald-600/60 text-[10px] px-2 py-0.5"
            data-equip-id="${item.id}"
          >
            <span>Equip</span>
            <span>🪙</span>
          </button>
        </div>
      `;

      gridEl.appendChild(card);
    });

    countEl.textContent = `${sorted.length} items available`;
    attachEquipHandlers();
  }

  function attachEquipHandlers() {
    const buttons = gridEl.querySelectorAll("[data-equip-id]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-equip-id");
        const item = CLOSET_ITEMS.find((i) => i.id === id);
        if (!item) return;
        equipItem(item);
      });
    });
  }

  function equipItem(item) {
    // set in loadout by category
    loadout[item.category] = item;
    updatePreview();
  }

  function clearLoadout() {
    loadout.outfit = null;
    loadout.accessory = null;
    loadout.hair = null;
    loadout.eyes = null;
    loadout.skin = null;
    updatePreview();
  }

  function updatePreview() {
    const outfit = loadout.outfit;
    const acc = loadout.accessory;
    const hair = loadout.hair;
    const eyes = loadout.eyes;
    const skin = loadout.skin;

    // Outfit
    if (outfit) {
      outfitLabelEl.textContent = outfit.name;
      outfitCostEl.textContent = formatCost(outfit.cost);
    } else {
      outfitLabelEl.textContent = "Default system outfit";
      outfitCostEl.textContent = "0 coins";
    }

    // Accessory
    if (acc) {
      accLabelEl.textContent = acc.name;
      accCostEl.textContent = formatCost(acc.cost);
    } else {
      accLabelEl.textContent = "None equipped";
      accCostEl.textContent = "0 coins";
    }

    // Hair
    if (hair) {
      hairLabelEl.textContent = hair.name;
      if (hair.colorHex && hairDotEl) {
        hairDotEl.style.background = hair.colorHex;
      }
    } else {
      hairLabelEl.textContent = "Default dark";
      hairDotEl.style.background = "#4b5563";
    }

    // Eyes
    if (eyes) {
      eyesLabelEl.textContent = eyes.name;
      if (eyes.colorHex && eyesDotEl) {
        eyesDotEl.style.background = eyes.colorHex;
      }
    } else {
      eyesLabelEl.textContent = "Deep blue";
      eyesDotEl.style.background = "#1d4ed8";
    }

    // Skin
    if (skin) {
      skinLabelEl.textContent = skin.name;
      if (skin.colorHex && skinDotEl) {
        skinDotEl.style.background = skin.colorHex;
      }
    } else {
      skinLabelEl.textContent = "Default medium warm";
      skinDotEl.style.background = "#f5d0c5";
    }

    // Total cost
    const total = totalLoadoutCost();
    loadoutCostEl.textContent = `Total: ${formatCost(total)}`;

    // Equipped list
    equipList.innerHTML = "";
    const entries = [];
    ["outfit","accessory","hair","eyes","skin"].forEach((cat) => {
      const item = loadout[cat];
      if (item) {
        entries.push(
          `<li><span class="font-semibold capitalize">${cat}:</span> ${item.name} <span class="text-amber-300">(${formatCost(item.cost)})</span></li>`
        );
      }
    });
    if (!entries.length) {
      equipList.innerHTML = "<li>No items equipped yet.</li>";
    } else {
      equipList.innerHTML = entries.join("");
    }
  }

  // Filter buttons
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";
      currentFilter = filter;
      filters.forEach((b) => b.classList.remove("bg-purple-700/60","border-purple-400","text-purple-50","active"));
      btn.classList.add("bg-purple-700/60","border-purple-400","text-purple-50","active");
      renderGrid();
    });
  });

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value || "default";
      renderGrid();
    });
  }

  // Clear loadout button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearLoadout();
    });
  }

  // Initial render
  renderGrid();
  updatePreview();

  // Try autoplay video safely
  const avatarVideo = document.getElementById("closetAvatarVideo");
  if (avatarVideo) {
    try {
      avatarVideo.muted = true;
      avatarVideo.autoplay = true;
      avatarVideo.playsInline = true;
      avatarVideo.play().catch(() => {});
    } catch (e) {}
  }
});

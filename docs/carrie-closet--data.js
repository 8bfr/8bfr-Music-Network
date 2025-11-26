// carrie-closet-data.js
// Static data for Carrie Closet – uses your real PNG paths

window.CARRIE_BASE_CONFIG = {
  female: {
    label: "Female",
    defaultSkinId: "light",
    baseDesc: "Bikini base",
    skins: [
      {
        id: "light",
        label: "Light",
        src: "assets/images/base/female/base_female_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        src: "assets/images/base/female/base_female_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        src: "assets/images/base/female/base_female_dark.png",
      },
    ],
  },
  male: {
    label: "Male",
    defaultSkinId: "light",
    baseDesc: "Shorts base",
    skins: [
      {
        id: "light",
        label: "Light",
        src: "assets/images/base/male/base_male_light.png",
      },
      {
        id: "medium",
        label: "Medium",
        src: "assets/images/base/male/base_male_medium.png",
      },
      {
        id: "dark",
        label: "Dark",
        src: "assets/images/base/male/base_male_dark.png",
      },
    ],
  },
};

// Items:
// - gender: "female" | "male" | "unisex"
// - category: "hair" | "top" | "bottom" | "jewelry" | "eyes" | "shoes"
// - layer: which overlay slot to use
//   hair, top, bottom, necklace, ears, belly, eyes, shoes
// All src paths are full-frame PNGs drawn over the 500x282 canvas.

window.CARRIE_CLOSET_ITEMS = [
  // ---- FEMALE HAIR – STRAIGHT ----
  {
    id: "hair_f_straight_blonde",
    label: "Straight Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_blonde.png",
    price: 60,
  },
  {
    id: "hair_f_straight_brown",
    label: "Straight Brown",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_brown.png",
    price: 60,
  },
  {
    id: "hair_f_straight_copper",
    label: "Straight Copper",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_copper.png",
    price: 60,
  },
  {
    id: "hair_f_straight_ginger",
    label: "Straight Ginger",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_ginger.png",
    price: 60,
  },
  {
    id: "hair_f_straight_pastel_blue",
    label: "Straight Pastel Blue",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_blue.png",
    price: 70,
  },
  {
    id: "hair_f_straight_pastel_pink",
    label: "Straight Pastel Pink",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_pink.png",
    price: 70,
  },
  {
    id: "hair_f_straight_pastel_purple",
    label: "Straight Pastel Purple",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_pastel_purple.png",
    price: 70,
  },
  {
    id: "hair_f_straight_platinum",
    label: "Straight Platinum Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/straight/female_straight_platinum_blonde.png",
    price: 70,
  },

  // ---- FEMALE HAIR – WAVY ----
  {
    id: "hair_f_wavy_blonde",
    label: "Wavy Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_blonde.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_brown",
    label: "Wavy Brown",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_brown.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_copper",
    label: "Wavy Copper",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_copper.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_ginger",
    label: "Wavy Ginger",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_ginger.png",
    price: 65,
  },
  {
    id: "hair_f_wavy_pastel_blue",
    label: "Wavy Pastel Blue",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_pastel_blue.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_pastel_pink",
    label: "Wavy Pastel Pink",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_pastel_pink.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_pastel_purple",
    label: "Wavy Pastel Purple",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_pastel_purple.png",
    price: 75,
  },
  {
    id: "hair_f_wavy_platinum",
    label: "Wavy Platinum Blonde",
    gender: "female",
    category: "hair",
    layer: "hair",
    src: "assets/images/hair/wavy/female_wavy_platinum_blonde.png",
    price: 75,
  },

  // ---- FEMALE CLOTHING (BOTTOMS) ----
  {
    id: "bottom_f_shorts",
    label: "Shorts",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_shorts.png",
    price: 40,
  },
  {
    id: "bottom_f_skirt",
    label: "Skirt",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_skirt.png",
    price: 45,
  },

  // Bikini is your baked-in base, but we keep an option anyway:
  {
    id: "bottom_f_bikini",
    label: "Bikini (default)",
    gender: "female",
    category: "bottom",
    layer: "bottom",
    src: "assets/images/female_cloths/female_bikini.png",
    price: 0,
  },

  // ---- FEMALE JEWELRY ----
  {
    id: "jewelry_f_necklace",
    label: "Gold Necklace",
    gender: "female",
    category: "jewelry",
    layer: "necklace",
    src: "assets/images/female_jewlery/female_gold_necklace.png",
    price: 80,
  },
  {
    id: "jewelry_f_earrings",
    label: "Gold Earrings",
    gender: "female",
    category: "jewelry",
    layer: "ears",
    src: "assets/images/female_jewlery/female_gold_ear-ring.png",
    price: 70,
  },
  {
    id: "jewelry_f_belly_ring",
    label: "Gold Belly Ring",
    gender: "female",
    category: "jewelry",
    layer: "belly",
    src: "assets/images/female_jewlery/female_gold_belly-ring.png",
    price: 70,
  },

  // ---- MALE JEWELRY ----
  {
    id: "jewelry_m_necklace",
    label: "Gold Necklace",
    gender: "male",
    category: "jewelry",
    layer: "necklace",
    src: "assets/images/male_jewlery/male_gold_necklace.png",
    price: 80,
  },

  // ---- UNISEX TOPS ----
  {
    id: "top_unisex_tank",
    label: "Tank Top",
    gender: "unisex",
    category: "top",
    layer: "top",
    src: "assets/images/unisex/cloths/unisex_tank-top.png",
    price: 40,
  },
  {
    id: "top_unisex_tee",
    label: "Tee Shirt",
    gender: "unisex",
    category: "top",
    layer: "top",
    src: "assets/images/unisex/cloths/unisex_tee-shirt.png",
    price: 40,
  },

  // ---- UNISEX EYES ----
  {
    id: "eyes_unisex_blue",
    label: "Blue Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_blue.png",
    price: 30,
  },
  {
    id: "eyes_unisex_brown",
    label: "Brown Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_brown.png",
    price: 30,
  },
  {
    id: "eyes_unisex_green",
    label: "Green Eyes",
    gender: "unisex",
    category: "eyes",
    layer: "eyes",
    src: "assets/images/unisex/eyes/unisex_eyes_green.png",
    price: 30,
  },

  // ---- UNISEX SHOES ----
  {
    id: "shoes_unisex_sneakers",
      label: "Sneakers",
    gender: "unisex",
    category: "shoes",
    layer: "shoes",
    src: "assets/images/unisex/shoes/unisex_shoes.png",
    price: 50,
  },
  {
    id: "shoes_unisex_sandals",
    label: "Sandals",
    gender: "unisex",
    category: "shoes",
    layer: "shoes",
    src: "assets/images/unisex/shoes/unisex_sandles.png",
    price: 40,
  },
];

// Tiny debug (safe to leave in)
console.log(
  "Carrie Closet items loaded:",
  Array.isArray(window.CARRIE_CLOSET_ITEMS)
    ? window.CARRIE_CLOSET_ITEMS.length
    : "NO ARRAY"
);

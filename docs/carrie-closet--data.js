// carrie-closet-data.js
// Minimal, clean dataset so we always have a base avatar

window.CARRIE_CLOSET_DATA = {
  version: 4,

  categories: [
    { id: "skin",    label: "Skin",    emoji: "🎨" },
    { id: "hair",    label: "Hair",    emoji: "💇‍♀️" },
    { id: "eyes",    label: "Eyes",    emoji: "👀" },
    { id: "top",     label: "Tops",    emoji: "👕" },
    { id: "bottom",  label: "Bottoms", emoji: "🩳" },
    { id: "jewelry", label: "Jewelry", emoji: "💎" },
    { id: "shoes",   label: "Shoes",   emoji: "👟" }
  ],

  items: [
    // ---- SKIN (bases) ----
    {
      id: "f_skin_light",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Female • light",
      coins: 0,
      img: "assets/images/base/female/base_female_light.png",
      default: true
    },
    {
      id: "f_skin_medium",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Female • medium",
      coins: 0,
      img: "assets/images/base/female/base_female_medium.png"
    },
    {
      id: "f_skin_dark",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Female • dark",
      coins: 0,
      img: "assets/images/base/female/base_female_dark.png"
    },

    {
      id: "m_skin_light",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Male • light",
      coins: 0,
      img: "assets/images/base/male/base_male_light.png",
      default: true
    },
    {
      id: "m_skin_medium",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Male • medium",
      coins: 0,
      img: "assets/images/base/male/base_male_medium.png"
    },
    {
      id: "m_skin_dark",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Male • dark",
      coins: 0,
      img: "assets/images/base/male/base_male_dark.png"
    },

    // ---- HAIR (just a couple to test alignment) ----
    {
      id: "f_hair_straight_blonde",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight blonde",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_blonde.png"
    },
    {
      id: "f_hair_wavy_brown",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy brown",
      coins: 30,
      img: "assets/images/hair/wavy/female_wavy_brown.png"
    },

    // ---- EYES (unisex pair) ----
    {
      id: "eyes_blue",
      gender: "unisex",
      category: "eyes",
      slot: "eyes",
      label: "Blue eyes",
      coins: 10,
      img: "assets/images/unisex/eyes/unisex_eyes_blue.png",
      default: true
    },
    {
      id: "eyes_brown",
      gender: "unisex",
      category: "eyes",
      slot: "eyes",
      label: "Brown eyes",
      coins: 10,
      img: "assets/images/unisex/eyes/unisex_eyes_brown.png"
    },

    // ---- TOPS ----
    {
      id: "top_tee",
      gender: "unisex",
      category: "top",
      slot: "top",
      label: "Unisex tee",
      coins: 25,
      img: "assets/images/unisex/cloths/unisex_tee-shirt.png"
    },
    {
      id: "top_tank",
      gender: "unisex",
      category: "top",
      slot: "top",
      label: "Unisex tank",
      coins: 25,
      img: "assets/images/unisex/cloths/unisex_tank-top.png"
    },

    // ---- BOTTOMS (female only for now) ----
    {
      id: "f_bottom_shorts",
      gender: "female",
      category: "bottom",
      slot: "bottom",
      label: "Shorts",
      coins: 20,
      img: "assets/images/female_cloths/female_shorts.png"
    },
    {
      id: "f_bottom_skirt",
      gender: "female",
      category: "bottom",
      slot: "bottom",
      label: "Skirt",
      coins: 25,
      img: "assets/images/female_cloths/female_skirt.png"
    },

    // ---- JEWELRY ----
    {
      id: "f_jewel_necklace",
      gender: "female",
      category: "jewelry",
      slot: "necklace",
      label: "Gold necklace",
      coins: 35,
      img: "assets/images/female_jewlery/female_gold_necklace.png"
    },
    {
      id: "f_jewel_belly",
      gender: "female",
      category: "jewelry",
      slot: "belly",
      label: "Gold belly ring",
      coins: 35,
      img: "assets/images/female_jewlery/female_gold_belly-ring.png"
    },

    {
      id: "m_jewel_necklace",
      gender: "male",
      category: "jewelry",
      slot: "necklace",
      label: "Gold chain",
      coins: 35,
      img: "assets/images/male_jewlery/male_gold_necklace.png"
    },

    // ---- SHOES (unisex) ----
    {
      id: "shoes_unisex",
      gender: "unisex",
      category: "shoes",
      slot: "shoes",
      label: "Sneakers",
      coins: 25,
      img: "assets/images/unisex/shoes/unisex_shoes.png"
    },
    {
      id: "shoes_sandals",
      gender: "unisex",
      category: "shoes",
      slot: "shoes",
      label: "Sandals",
      coins: 20,
      img: "assets/images/unisex/shoes/unisex_sandles.png"
    }
  ]
};

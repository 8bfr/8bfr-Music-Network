// carrie-closet-data.js
// Static catalog of avatar parts for Carrie Closet (uses your PNG art)

window.CARRIE_CLOSET_DATA = {
  version: 3,

  // main categories, order in the UI
  categories: [
    { id: "skin",     label: "Skin",     emoji: "🎨" },
    { id: "hair",     label: "Hair",     emoji: "💇‍♀️" },
    { id: "eyes",     label: "Eyes",     emoji: "👀" },
    { id: "top",      label: "Tops",     emoji: "👕" },
    { id: "bottom",   label: "Bottoms",  emoji: "🩳" },
    { id: "jewelry",  label: "Jewelry",  emoji: "💎" },
    { id: "shoes",    label: "Shoes",    emoji: "👟" }
  ],

  // single source of truth for items
  // gender: "female" | "male" | "unisex"
  items: [
    // ---------- SKIN (base avatars) ----------
    {
      id: "f_skin_light",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Light skin",
      coins: 0,
      img: "assets/images/base/female/base_female_light.png",
      default: true
    },
    {
      id: "f_skin_medium",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Medium skin",
      coins: 0,
      img: "assets/images/base/female/base_female_medium.png"
    },
    {
      id: "f_skin_dark",
      gender: "female",
      category: "skin",
      slot: "base",
      label: "Dark skin",
      coins: 0,
      img: "assets/images/base/female/base_female_dark.png"
    },

    {
      id: "m_skin_light",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Light skin",
      coins: 0,
      img: "assets/images/base/male/base_male_light.png",
      default: true
    },
    {
      id: "m_skin_medium",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Medium skin",
      coins: 0,
      img: "assets/images/base/male/base_male_medium.png"
    },
    {
      id: "m_skin_dark",
      gender: "male",
      category: "skin",
      slot: "base",
      label: "Dark skin",
      coins: 0,
      img: "assets/images/base/male/base_male_dark.png"
    },

    // ---------- HAIR (female only for now) ----------
    // straight
    {
      id: "f_hair_straight_blonde",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Blonde",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_blonde.png"
    },
    {
      id: "f_hair_straight_brown",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Brown",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_brown.png"
    },
    {
      id: "f_hair_straight_copper",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Copper",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_copper.png"
    },
    {
      id: "f_hair_straight_ginger",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Ginger",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_ginger.png"
    },
    {
      id: "f_hair_straight_platinum",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Platinum",
      coins: 30,
      img: "assets/images/hair/straight/female_straight_platinum_blonde.png"
    },
    {
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Pastel blue",
      coins: 40,
      img: "assets/images/hair/straight/female_straight_pastel_blue.png"
    },
    {
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Pastel pink",
      coins: 40,
      img: "assets/images/hair/straight/female_straight_pastel_pink.png"
    },
    {
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Straight • Pastel purple",
      coins: 40,
      img: "assets/images/hair/straight/female_straight_pastel_purple.png"
    },

    // wavy
    {
      id: "f_hair_wavy_blonde",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Blonde",
      coins: 35,
      img: "assets/images/hair/wavy/female_wavy_blonde.png"
    },
    {
      id: "f_hair_wavy_brown",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Brown",
      coins: 35,
      img: "assets/images/hair/wavy/female_wavy_brown.png"
    },
    {
      id: "f_hair_wavy_copper",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Copper",
      coins: 35,
      img: "assets/images/hair/wavy/female_wavy_copper.png"
    },
    {
      id: "f_hair_wavy_ginger",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Ginger",
      coins: 35,
      img: "assets/images/hair/wavy/female_wavy_ginger.png"
    },
    {
      id: "f_hair_wavy_platinum",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Platinum",
      coins: 35,
      img: "assets/images/hair/wavy/female_wavy_platinum_blonde.png"
    },
    {
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Pastel blue",
      coins: 45,
      img: "assets/images/hair/wavy/female_pastel_blue.png"
    },
    {
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Pastel pink",
      coins: 45,
      img: "assets/images/hair/wavy/female_wavy_pastel_pink.png"
    },
    {
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      category: "hair",
      slot: "hair",
      label: "Wavy • Pastel purple",
      coins: 45,
      img: "assets/images/hair/wavy/female_wavy_pastel_purple.png"
    },

    // ---------- EYES (unisex, pair) ----------
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
      id: "eyes_green",
      gender: "unisex",
      category: "eyes",
      slot: "eyes",
      label: "Green eyes",
      coins: 10,
      img: "assets/images/unisex/eyes/unisex_eyes_green.png"
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

    // ---------- TOPS ----------
    {
      id: "top_unisex_tee",
      gender: "unisex",
      category: "top",
      slot: "top",
      label: "Unisex tee shirt",
      coins: 25,
      img: "assets/images/unisex/cloths/unisex_tee-shirt.png"
    },
    {
      id: "top_unisex_tank",
      gender: "unisex",
      category: "top",
      slot: "top",
      label: "Unisex tank top",
      coins: 25,
      img: "assets/images/unisex/cloths/unisex_tank-top.png"
    },

    // ---------- BOTTOMS (female) ----------
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

    // ---------- JEWELRY ----------
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
      id: "f_jewel_earrings",
      gender: "female",
      category: "jewelry",
      slot: "earrings",
      label: "Gold earrings",
      coins: 30,
      img: "assets/images/female_jewlery/female_gold_ear-ring.png"
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

    // ---------- SHOES (unisex) ----------
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

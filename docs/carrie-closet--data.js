// carrie-closet--data.js
// Data only — no DOM logic. Used by carrie-closet.js

window.CARRIE_CLOSET_DATA = {
  // Simple preview balance for now – later you can hook to real coins.
  previewCoins: 999,

  // Default selections for female preview
defaults: {
    gender: "female",
    baseId: "skin_female_light",
    outfitId: "outfit_bikini",
    hairId: "hair_long_straight_blonde",
    jewelryId: null,
    unisexTopId: null,
    shoesId: null,
    eyesId: null, // ❌ no overlay eyes for now
  },

  // All items that can be layered on the base sprite
  items: [
    // ---------- FEMALE SKIN (BASE) ----------
    {
      id: "skin_female_light",
      slot: "base",
      gender: "female",
      label: "Light skin (default)",
      price: 0,
      img: "assets/images/base/female/female_light_skin.png",
    },
    {
      id: "skin_female_tan",
      slot: "base",
      gender: "female",
      label: "Tan skin",
      price: 40,
      img: "assets/images/base/female/female_tan_skin.png",
    },
    {
      id: "skin_female_brown",
      slot: "base",
      gender: "female",
      label: "Brown skin",
      price: 40,
      img: "assets/images/base/female/female_brown_skin.png",
    },
    {
      id: "skin_female_dark_brown",
      slot: "base",
      gender: "female",
      label: "Dark brown skin",
      price: 40,
      img: "assets/images/base/female/female_dark_brown_skin.png",
    },
    {
      id: "skin_female_deep_brown",
      slot: "base",
      gender: "female",
      label: "Deep brown skin",
      price: 40,
      img: "assets/images/base/female/deep_brown_skin.png",
    },

    // ---------- MALE SKIN (BASE – PREVIEW ONLY, CLOTHES LATER) ----------
    {
      id: "skin_male_light",
      slot: "base",
      gender: "male",
      label: "Light skin (default)",
      price: 0,
      img: "assets/images/base/male/male_light_skin.png",
    },
    {
      id: "skin_male_medium",
      slot: "base",
      gender: "male",
      label: "Medium skin",
      price: 40,
      img: "assets/images/base/male/male_medium_skin.png",
    },
    {
      id: "skin_male_dark",
      slot: "base",
      gender: "male",
      label: "Dark skin",
      price: 40,
      img: "assets/images/base/male/male_dark_skin.png",
    },

    // ---------- FEMALE CLOTHES (OUTFITS OVER BIKINI BASE) ----------
    {
      id: "outfit_bikini",
      slot: "outfit",
      gender: "female",
      label: "Bikini (default)",
      price: 0,
      img: "assets/images/female_cloths/female_bikini.png",
    },
    {
      id: "outfit_shorts",
      slot: "outfit",
      gender: "female",
      label: "Shorts",
      price: 80,
      img: "assets/images/female_cloths/female_shorts.png",
    },
    {
      id: "outfit_skirt",
      slot: "outfit",
      gender: "female",
      label: "Skirt",
      price: 80,
      img: "assets/images/female_cloths/female_skirt.png",
    },

    // ---------- UNISEX TOPS ----------
    {
      id: "top_tank_unisex",
      slot: "unisexTop",
      gender: "unisex",
      label: "Tank top",
      price: 60,
      img: "assets/images/unisex/cloths/tank-top_unisex.png",
    },
    {
      id: "top_tee_unisex",
      slot: "unisexTop",
      gender: "unisex",
      label: "T-shirt",
      price: 60,
      img: "assets/images/unisex/cloths/tee-shirt_unisex.png",
    },

    // ---------- HAIR – LONG STRAIGHT ----------
    {
      id: "hair_long_straight_blonde",
      slot: "hair",
      gender: "female",
      label: "Long straight – blonde",
      price: 70,
      img: "assets/images/hair/long/long_straight_blonde.png",
    },
    {
      id: "hair_long_straight_dark_brown",
      slot: "hair",
      gender: "female",
      label: "Long straight – dark brown",
      price: 70,
      img: "assets/images/hair/long/long_straighr_dark_brown.png",
    },
    {
      id: "hair_long_straight_copper",
      slot: "hair",
      gender: "female",
      label: "Long straight – copper",
      price: 70,
      img: "assets/images/hair/long/long_straight_copper.png",
    },
    {
      id: "hair_long_straight_ginger",
      slot: "hair",
      gender: "female",
      label: "Long straight – ginger",
      price: 70,
      img: "assets/images/hair/long/long_straight_ginger.png",
    },
    {
      id: "hair_long_straight_pastel_blue",
      slot: "hair",
      gender: "female",
      label: "Long straight – pastel blue",
      price: 70,
      img: "assets/images/hair/long/long_straight_pastel_blue.png",
    },
    {
      id: "hair_long_straight_pastel_pink",
      slot: "hair",
      gender: "female",
      label: "Long straight – pastel pink",
      price: 70,
      img: "assets/images/hair/long/long_straight_pastel_pink.png",
    },
    {
      id: "hair_long_straight_platinum",
      slot: "hair",
      gender: "female",
      label: "Long straight – platinum",
      price: 70,
      img: "assets/images/hair/long/long_straight_platinum_blonde.png",
    },
    {
      id: "hair_long_straight_purple",
      slot: "hair",
      gender: "female",
      label: "Long straight – purple",
      price: 70,
      img: "assets/images/hair/long/long_straight_purple.png",
    },

    // ---------- HAIR – LONG WAVY ----------
    {
      id: "hair_long_wavy_blonde",
      slot: "hair",
      gender: "female",
      label: "Long wavy – blonde",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_blonde1.png",
    },
    {
      id: "hair_long_wavy_copper",
      slot: "hair",
      gender: "female",
      label: "Long wavy – copper",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_copper.png",
    },
    {
      id: "hair_long_wavy_dark_brown",
      slot: "hair",
      gender: "female",
      label: "Long wavy – dark brown",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_dark_brown.png",
    },
    {
      id: "hair_long_wavy_ginger",
      slot: "hair",
      gender: "female",
      label: "Long wavy – ginger",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_ginger.png",
    },
    {
      id: "hair_long_wavy_pastel_blue",
      slot: "hair",
      gender: "female",
      label: "Long wavy – pastel blue",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_pastel_blue.png",
    },
    {
      id: "hair_long_wavy_pink",
      slot: "hair",
      gender: "female",
      label: "Long wavy – pink",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_pink.png",
    },
    {
      id: "hair_long_wavy_platinum",
      slot: "hair",
      gender: "female",
      label: "Long wavy – platinum",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_platinum.png",
    },
    {
      id: "hair_long_wavy_purple",
      slot: "hair",
      gender: "female",
      label: "Long wavy – purple",
      price: 70,
      img: "assets/images/hair/wavy/long_wavy_purple.png",
    },

    // ---------- FEMALE JEWELRY ----------
    {
      id: "jewel_belly_ring",
      slot: "jewelry",
      gender: "female",
      label: "Belly ring",
      price: 40,
      img: "assets/images/female_jewlery/female_belly-ring.png",
    },
    {
      id: "jewel_ear_ring",
      slot: "jewelry",
      gender: "female",
      label: "Earrings",
      price: 40,
      img: "assets/images/female_jewlery/female_ear-ring.png",
    },
    {
      id: "jewel_gold_necklace",
      slot: "jewelry",
      gender: "female",
      label: "Gold necklace",
      price: 50,
      img: "assets/images/female_jewlery/female_gold_necklace.png",
    },

    // ---------- SHOES (UNISEX) ----------
    {
      id: "shoes_unisex",
      slot: "shoes",
      gender: "unisex",
      label: "Shoes",
      price: 50,
      img: "assets/images/unisex/shoes/shoes_unisex.png",
    },
    {
      id: "sandles_unisex",
      slot: "shoes",
      gender: "unisex",
      label: "Sandals",
      price: 40,
      img: "assets/images/unisex/shoes/sandles_unisex.png",
    },

    
      id: "eyes_green",
      slot: "eyes",
      gender: "unisex",
      label: "Green eyes",
      price: 35,
      img: "assets/images/unisex/eyes/green_eyes.png",
    },
  ],
};

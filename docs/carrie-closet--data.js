// carrie-closet--data.js
// Data only: no DOM stuff. Used by carrie-closet.js to render items + preview.
//
// All paths are relative to docs/ (same as carrie-closet.html)

window.CARRIE_CLOSET_DATA = {
  version: 1,

  // Which base to show first
  defaultGender: "female",
  defaultSkinId: "skin_female_light",
  defaultEyesId: "eyes_blue",
  defaultOutfitId: "outfit_female_bikini",

  // Layer order for the preview (from back to front)
  // carrie-closet.js should map these to <img> tags like:
  //   data-layer="skin" | "eyes" | "hair" | "top" | "bottom" | "shoes" | "jewelry"
  layers: ["skin", "eyes", "hair", "top", "bottom", "shoes", "jewelry"],

  // All items in the closet
  items: [
    // -----------------------
    // FEMALE SKIN (BASE)
    // -----------------------
    {
      id: "skin_female_light",
      label: "Light skin (female)",
      type: "skin",
      gender: "female",
      coins: 0,
      src: "assets/images/base/female/female_light_skin.png",
    },
    {
      id: "skin_female_tan",
      label: "Tan skin (female)",
      type: "skin",
      gender: "female",
      coins: 50,
      src: "assets/images/base/female/female_tan_skin.png",
    },
    {
      id: "skin_female_brown",
      label: "Brown skin (female)",
      type: "skin",
      gender: "female",
      coins: 50,
      src: "assets/images/base/female/female_brown_skin.png",
    },
    {
      id: "skin_female_dark_brown",
      label: "Dark brown skin (female)",
      type: "skin",
      gender: "female",
      coins: 50,
      src: "assets/images/base/female/female_dark_brown_skin.png",
    },
    {
      id: "skin_female_deep_brown",
      label: "Deep brown skin (female)",
      type: "skin",
      gender: "female",
      coins: 75,
      src: "assets/images/base/female/deep_brown_skin.png",
    },

    // -----------------------
    // MALE SKIN (BASE)
    // -----------------------
    {
      id: "skin_male_light",
      label: "Light skin (male)",
      type: "skin",
      gender: "male",
      coins: 0,
      src: "assets/images/base/male/male_light_skin.png",
    },
    {
      id: "skin_male_medium",
      label: "Medium skin (male)",
      type: "skin",
      gender: "male",
      coins: 50,
      src: "assets/images/base/male/male_medium_skin.png",
    },
    {
      id: "skin_male_dark",
      label: "Dark skin (male)",
      type: "skin",
      gender: "male",
      coins: 50,
      src: "assets/images/base/male/male_dark_skin.png",
    },

    // -----------------------
    // FEMALE CLOTHES
    // (these are tops+bottoms that sit on top of skin)
    // -----------------------
    {
      id: "outfit_female_bikini",
      label: "Bikini (female)",
      type: "top", // treat as full outfit for now
      gender: "female",
      coins: 0,
      src: "assets/images/female_cloths/female_bikini.png",
    },
    {
      id: "outfit_female_shorts",
      label: "Shorts (female)",
      type: "bottom",
      gender: "female",
      coins: 60,
      src: "assets/images/female_cloths/female_shorts.png",
    },
    {
      id: "outfit_female_skirt",
      label: "Skirt (female)",
      type: "bottom",
      gender: "female",
      coins: 60,
      src: "assets/images/female_cloths/female_skirt.png",
    },

    // -----------------------
    // UNISEX TOPS (CLOTHES)
    // -----------------------
    {
      id: "top_tank_unisex",
      label: "Tank top (unisex)",
      type: "top",
      gender: "unisex",
      coins: 80,
      src: "assets/images/unisex/cloths/tank-top_unisex.png",
    },
    {
      id: "top_tee_unisex",
      label: "Tee shirt (unisex)",
      type: "top",
      gender: "unisex",
      coins: 80,
      src: "assets/images/unisex/cloths/tee-shirt_unisex.png",
    },

    // -----------------------
    // FEMALE JEWELRY
    // -----------------------
    {
      id: "jewel_female_belly_ring",
      label: "Belly ring",
      type: "jewelry",
      gender: "female",
      coins: 90,
      src: "assets/images/female_jewlery/female_belly-ring.png",
    },
    {
      id: "jewel_female_ear_rings",
      label: "Ear rings",
      type: "jewelry",
      gender: "female",
      coins: 70,
      src: "assets/images/female_jewlery/female_ear-ring.png",
    },
    {
      id: "jewel_female_gold_necklace",
      label: "Gold necklace (female)",
      type: "jewelry",
      gender: "female",
      coins: 110,
      src: "assets/images/female_jewlery/female_gold_necklace.png",
    },

    // -----------------------
    // MALE JEWELRY
    // -----------------------
    {
      id: "jewel_male_gold_necklace",
      label: "Gold necklace (male)",
      type: "jewelry",
      gender: "male",
      coins: 110,
      src: "assets/images/male_jewlery/male_gold_necklace.png",
    },

    // -----------------------
    // HAIR — LONG STRAIGHT
    // -----------------------
    {
      id: "hair_long_straight_blonde",
      label: "Long straight blonde",
      type: "hair",
      gender: "female",
      coins: 120,
      src: "assets/images/hair/long/long_straight_blonde.png",
    },
    {
      id: "hair_long_straight_dark_brown",
      label: "Long straight dark brown",
      type: "hair",
      gender: "female",
      coins: 120,
      src: "assets/images/hair/long/long_straighr_dark_brown.png",
    },
    {
      id: "hair_long_straight_copper",
      label: "Long straight copper",
      type: "hair",
      gender: "female",
      coins: 120,
      src: "assets/images/hair/long/long_straight_copper.png",
    },
    {
      id: "hair_long_straight_ginger",
      label: "Long straight ginger",
      type: "hair",
      gender: "female",
      coins: 120,
      src: "assets/images/hair/long/long_straight_ginger.png",
    },
    {
      id: "hair_long_straight_pastel_blue",
      label: "Long straight pastel blue",
      type: "hair",
      gender: "female",
      coins: 140,
      src: "assets/images/hair/long/long_straight_pastel_blue.png",
    },
    {
      id: "hair_long_straight_pastel_pink",
      label: "Long straight pastel pink",
      type: "hair",
      gender: "female",
      coins: 140,
      src: "assets/images/hair/long/long_straight_pastel_pink.png",
    },
    {
      id: "hair_long_straight_platinum",
      label: "Long straight platinum blonde",
      type: "hair",
      gender: "female",
      coins: 150,
      src: "assets/images/hair/long/long_straight_platinum_blonde.png",
    },
    {
      id: "hair_long_straight_purple",
      label: "Long straight purple",
      type: "hair",
      gender: "female",
      coins: 140,
      src: "assets/images/hair/long/long_straight_purple.png",
    },

    // -----------------------
    // HAIR — LONG WAVY
    // -----------------------
    {
      id: "hair_long_wavy_blonde",
      label: "Long wavy blonde",
      type: "hair",
      gender: "female",
      coins: 130,
      src: "assets/images/hair/wavy/long_wavy_blonde1.png",
    },
    {
      id: "hair_long_wavy_dark_brown",
      label: "Long wavy dark brown",
      type: "hair",
      gender: "female",
      coins: 130,
      src: "assets/images/hair/wavy/long_wavy_dark_brown.png",
    },
    {
      id: "hair_long_wavy_copper",
      label: "Long wavy copper",
      type: "hair",
      gender: "female",
      coins: 130,
      src: "assets/images/hair/wavy/long_wavy_copper.png",
    },
    {
      id: "hair_long_wavy_ginger",
      label: "Long wavy ginger",
      type: "hair",
      gender: "female",
      coins: 130,
      src: "assets/images/hair/wavy/long_wavy_ginger.png",
    },
    {
      id: "hair_long_wavy_pastel_blue",
      label: "Long wavy pastel blue",
      type: "hair",
      gender: "female",
      coins: 150,
      src: "assets/images/hair/wavy/long_wavy_pastel_blue.png",
    },
    {
      id: "hair_long_wavy_pink",
      label: "Long wavy pink",
      type: "hair",
      gender: "female",
      coins: 150,
      src: "assets/images/hair/wavy/long_wavy_pink.png",
    },
    {
      id: "hair_long_wavy_platinum",
      label: "Long wavy platinum",
      type: "hair",
      gender: "female",
      coins: 150,
      src: "assets/images/hair/wavy/long_wavy_platinum.png",
    },
    {
      id: "hair_long_wavy_purple",
      label: "Long wavy purple",
      type: "hair",
      gender: "female",
      coins: 150,
      src: "assets/images/hair/wavy/long_wavy_purple.png",
    },

    // -----------------------
    // EYES (UNISEX)
    // -----------------------
    {
      id: "eyes_blue",
      label: "Blue eyes",
      type: "eyes",
      gender: "unisex",
      coins: 50,
      src: "assets/images/unisex/eyes/blue_eyes.png",
    },
    {
      id: "eyes_brown",
      label: "Brown eyes",
      type: "eyes",
      gender: "unisex",
      coins: 40,
      src: "assets/images/unisex/eyes/brown_eyes.png",
    },
    {
      id: "eyes_green",
      label: "Green eyes",
      type: "eyes",
      gender: "unisex",
      coins: 60,
      src: "assets/images/unisex/eyes/green_eyes.png",
    },

    // -----------------------
    // SHOES (UNISEX)
    // -----------------------
    {
      id: "shoes_sandals_unisex",
      label: "Sandals (unisex)",
      type: "shoes",
      gender: "unisex",
      coins: 70,
      src: "assets/images/unisex/shoes/sandles_unisex.png",
    },
    {
      id: "shoes_unisex",
      label: "Shoes (unisex)",
      type: "shoes",
      gender: "unisex",
      coins: 90,
      src: "assets/images/unisex/shoes/shoes_unisex.png",
    },
  ],
};

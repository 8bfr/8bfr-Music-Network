// carrie-closet--data.js
// Static data for Carrie Closet (images + prices + slots)

window.CARRIE_CLOSET_DATA = {
  coinsStart: 500,

  slots: [
    { id: "base",   label: "Skin / Base", icon: "🧍" },
    { id: "hair",   label: "Hair",        icon: "💇" },
    { id: "outfit", label: "Clothes",     icon: "👗" },
    { id: "eyes",   label: "Eyes",        icon: "👁️" },
    { id: "jewelry",label: "Jewelry",     icon: "💎" },
    { id: "shoes",  label: "Shoes",       icon: "👟" }
  ],

  items: [
    // -------- BASE / SKIN (female)
    {
      id: "base_female_light",
      slot: "base",
      gender: "female",
      label: "Female • Light skin",
      price: 0,
      rarity: "default",
      src: "assets/images/base/female/base_female_light.png"
    },
    {
      id: "base_female_medium",
      slot: "base",
      gender: "female",
      label: "Female • Medium skin",
      price: 0,
      rarity: "common",
      src: "assets/images/base/female/base_female_medium.png"
    },
    {
      id: "base_female_dark",
      slot: "base",
      gender: "female",
      label: "Female • Dark skin",
      price: 0,
      rarity: "common",
      src: "assets/images/base/female/base_female_dark.png"
    },

    // -------- BASE / SKIN (male)
    {
      id: "base_male_light",
      slot: "base",
      gender: "male",
      label: "Male • Light skin",
      price: 0,
      rarity: "default",
      src: "assets/images/base/male/base_male_light.png"
    },
    {
      id: "base_male_medium",
      slot: "base",
      gender: "male",
      label: "Male • Medium skin",
      price: 0,
      rarity: "common",
      src: "assets/images/base/male/base_male_medium.png"
    },
    {
      id: "base_male_dark",
      slot: "base",
      gender: "male",
      label: "Male • Dark skin",
      price: 0,
      rarity: "common",
      src: "assets/images/base/male/base_male_dark.png"
    },

    // -------- HAIR (female, straight)
    {
      id: "hair_straight_brown",
      slot: "hair",
      gender: "female",
      label: "Straight • Brown",
      price: 15,
      rarity: "common",
      src: "assets/images/hair/straight/female_straight_brown.png"
    },
    {
      id: "hair_straight_blonde",
      slot: "hair",
      gender: "female",
      label: "Straight • Blonde",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/straight/female_straight_blonde.png"
    },
    {
      id: "hair_straight_copper",
      slot: "hair",
      gender: "female",
      label: "Straight • Copper",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/straight/female_straight_copper.png"
    },
    {
      id: "hair_straight_ginger",
      slot: "hair",
      gender: "female",
      label: "Straight • Ginger",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/straight/female_straight_ginger.png"
    },
    {
      id: "hair_straight_pastel_blue",
      slot: "hair",
      gender: "female",
      label: "Straight • Pastel blue",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/straight/female_straight_pastel_blue.png"
    },
    {
      id: "hair_straight_pastel_pink",
      slot: "hair",
      gender: "female",
      label: "Straight • Pastel pink",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/straight/female_straight_pastel_pink.png"
    },
    {
      id: "hair_straight_pastel_purple",
      slot: "hair",
      gender: "female",
      label: "Straight • Pastel purple",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/straight/female_straight_pastel_purple.png"
    },
    {
      id: "hair_straight_platinum",
      slot: "hair",
      gender: "female",
      label: "Straight • Platinum blonde",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/straight/female_straight_platinum_blonde.png"
    },

    // -------- HAIR (female, wavy)
    {
      id: "hair_wavy_brown",
      slot: "hair",
      gender: "female",
      label: "Wavy • Brown",
      price: 15,
      rarity: "common",
      src: "assets/images/hair/wavy/female_wavy_brown.png"
    },
    {
      id: "hair_wavy_blonde",
      slot: "hair",
      gender: "female",
      label: "Wavy • Blonde",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/wavy/female_wavy_blonde.png"
    },
    {
      id: "hair_wavy_copper",
      slot: "hair",
      gender: "female",
      label: "Wavy • Copper",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/wavy/female_wavy_copper.png"
    },
    {
      id: "hair_wavy_ginger",
      slot: "hair",
      gender: "female",
      label: "Wavy • Ginger",
      price: 20,
      rarity: "rare",
      src: "assets/images/hair/wavy/female_wavy_ginger.png"
    },
    {
      id: "hair_wavy_pastel_blue",
      slot: "hair",
      gender: "female",
      label: "Wavy • Pastel blue",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/wavy/female_pastel_blue.png"
    },
    {
      id: "hair_wavy_pastel_pink",
      slot: "hair",
      gender: "female",
      label: "Wavy • Pastel pink",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/wavy/female_wavy_pastel_pink.png"
    },
    {
      id: "hair_wavy_pastel_purple",
      slot: "hair",
      gender: "female",
      label: "Wavy • Pastel purple",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/wavy/female_wavy_pastel_purple.png"
    },
    {
      id: "hair_wavy_platinum",
      slot: "hair",
      gender: "female",
      label: "Wavy • Platinum blonde",
      price: 30,
      rarity: "epic",
      src: "assets/images/hair/wavy/female_wavy_platinum_blonde.png"
    },

    // -------- CLOTHES (female)
    {
      id: "outfit_female_bikini",
      slot: "outfit",
      gender: "female",
      label: "Bikini (default)",
      price: 0,
      rarity: "default",
      src: "assets/images/female_cloths/female_bikini.png"
    },
    {
      id: "outfit_female_shorts",
      slot: "outfit",
      gender: "female",
      label: "Shorts",
      price: 20,
      rarity: "common",
      src: "assets/images/female_cloths/female_shorts.png"
    },
    {
      id: "outfit_female_skirt",
      slot: "outfit",
      gender: "female",
      label: "Skirt",
      price: 25,
      rarity: "rare",
      src: "assets/images/female_cloths/female_skirt.png"
    },

    // -------- CLOTHES (unisex tops)
    {
      id: "outfit_unisex_tank",
      slot: "outfit",
      gender: "unisex",
      label: "Tank top (unisex)",
      price: 20,
      rarity: "common",
      src: "assets/images/unisex/cloths/unisex_tank-top.png"
    },
    {
      id: "outfit_unisex_tee",
      slot: "outfit",
      gender: "unisex",
      label: "T-shirt (unisex)",
      price: 25,
      rarity: "common",
      src: "assets/images/unisex/cloths/unisex_tee-shirt.png"
    },

    // -------- EYES (unisex)
    {
      id: "eyes_blue",
      slot: "eyes",
      gender: "unisex",
      label: "Blue eyes",
      price: 15,
      rarity: "common",
      src: "assets/images/unisex/eyes/unisex_eyes_blue.png"
    },
    {
      id: "eyes_green",
      slot: "eyes",
      gender: "unisex",
      label: "Green eyes",
      price: 15,
      rarity: "common",
      src: "assets/images/unisex/eyes/unisex_eyes_green.png"
    },
    {
      id: "eyes_brown",
      slot: "eyes",
      gender: "unisex",
      label: "Brown eyes",
      price: 0,
      rarity: "default",
      src: "assets/images/unisex/eyes/unisex_eyes_brown.png"
    },

    // -------- SHOES (unisex)
    {
      id: "shoes_sneakers",
      slot: "shoes",
      gender: "unisex",
      label: "Sneakers",
      price: 15,
      rarity: "common",
      src: "assets/images/unisex/shoes/unisex_shoes.png"
    },
    {
      id: "shoes_sandals",
      slot: "shoes",
      gender: "unisex",
      label: "Sandals",
      price: 15,
      rarity: "common",
      src: "assets/images/unisex/shoes/unisex_sandles.png"
    },

    // -------- JEWELRY (female)
    {
      id: "jewel_female_necklace",
      slot: "jewelry",
      gender: "female",
      label: "Gold necklace",
      price: 30,
      rarity: "rare",
      src: "assets/images/female_jewlery/female_gold_necklace.png"
    },
    {
      id: "jewel_female_earrings",
      slot: "jewelry",
      gender: "female",
      label: "Gold earrings",
      price: 25,
      rarity: "rare",
      src: "assets/images/female_jewlery/female_gold_ear-ring.png"
    },
    {
      id: "jewel_female_bellyring",
      slot: "jewelry",
      gender: "female",
      label: "Gold belly ring",
      price: 35,
      rarity: "epic",
      src: "assets/images/female_jewlery/female_gold_belly-ring.png"
    },

    // -------- JEWELRY (male)
    {
      id: "jewel_male_necklace",
      slot: "jewelry",
      gender: "male",
      label: "Gold chain",
      price: 30,
      rarity: "rare",
      src: "assets/images/male_jewlery/male_gold_necklace.png"
    }
  ]
};

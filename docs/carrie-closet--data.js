// carrie-closet--data.js
// Data for Carrie Closet (uses your real folder structure + filenames)

window.CARRIE_CLOSET_DATA = {
  version: 1,

  // --------- BASES (under assets/images/base/...) ---------
  bases: {
    female: [
      {
        id: "female_light",
        label: "Female • Light skin (default)",
        image: "assets/images/base/female/female_light_skin.png",
        default: true,
      },
      {
        id: "female_tan",
        label: "Female • Tan skin",
        image: "assets/images/base/female/female_tan_skin.png",
      },
      {
        id: "female_brown",
        label: "Female • Brown skin",
        image: "assets/images/base/female/female_brown_skin.png",
      },
      {
        id: "female_dark_brown",
        label: "Female • Dark brown skin",
        image: "assets/images/base/female/female_dark_brown_skin.png",
      },
      {
        id: "female_deep_brown",
        label: "Female • Deep brown skin",
        image: "assets/images/base/female/deep_brown_skin.png",
      },
    ],
    male: [
      {
        id: "male_light",
        label: "Male • Light skin (default)",
        image: "assets/images/base/male/male_light_skin.png",
        default: true,
      },
      {
        id: "male_medium",
        label: "Male • Medium skin",
        image: "assets/images/base/male/male_medium_skin.png",
      },
      {
        id: "male_dark",
        label: "Male • Dark skin",
        image: "assets/images/base/male/male_dark_skin.png",
      },
    ],
  },

  // --------- OUTFITS (clothes layers) ---------
  outfits: [
    // FEMALE CLOTHES (assets/images/female_cloths)
    {
      id: "female_bikini",
      label: "Bikini (default)",
      gender: "female",
      slot: "outfit",
      cost: 0,
      rarity: "common",
      image: "assets/images/female_cloths/female_bikini.png",
    },
    {
      id: "female_shorts",
      label: "Shorts",
      gender: "female",
      slot: "outfit",
      cost: 20,
      rarity: "common",
      image: "assets/images/female_cloths/female_shorts.png",
    },
    {
      id: "female_skirt",
      label: "Skirt",
      gender: "female",
      slot: "outfit",
      cost: 25,
      rarity: "rare",
      image: "assets/images/female_cloths/female_skirt.png",
    },

    // UNISEX TOPS (assets/images/unisex/cloths)
    {
      id: "unisex_tank",
      label: "Tank Top",
      gender: "unisex",
      slot: "outfit",
      cost: 25,
      rarity: "common",
      image: "assets/images/unisex/cloths/tank-top_unisex.png",
    },
    {
      id: "unisex_tee",
      label: "Tee Shirt",
      gender: "unisex",
      slot: "outfit",
      cost: 30,
      rarity: "rare",
      image: "assets/images/unisex/cloths/tee-shirt_unisex.png",
    },
  ],

  // --------- HAIR (assets/images/hair/...) ---------
  hair: [
    // LONG STRAIGHT
    {
      id: "hair_long_straight_blonde",
      label: "Long Straight • Blonde",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/long/long_straight_blonde.png",
    },
    {
      id: "hair_long_straight_platinum",
      label: "Long Straight • Platinum",
      gender: "female",
      slot: "hair",
      cost: 40,
      rarity: "epic",
      image: "assets/images/hair/long/long_straight_platinum_blonde.png",
    },
    {
      id: "hair_long_straight_dark_brown",
      label: "Long Straight • Dark Brown",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/long/long_straighr_dark_brown.png",
    },
    {
      id: "hair_long_straight_copper",
      label: "Long Straight • Copper",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/long/long_straight_copper.png",
    },
    {
      id: "hair_long_straight_ginger",
      label: "Long Straight • Ginger",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/long/long_straight_ginger.png",
    },
    {
      id: "hair_long_straight_purple",
      label: "Long Straight • Purple",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/long/long_straight_purple.png",
    },
    {
      id: "hair_long_straight_pastel_pink",
      label: "Long Straight • Pastel Pink",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/long/long_straight_pastel_pink.png",
    },
    {
      id: "hair_long_straight_pastel_blue",
      label: "Long Straight • Pastel Blue",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/long/long_straight_pastel_blue.png",
    },

    // WAVY
    {
      id: "hair_long_wavy_blonde",
      label: "Long Wavy • Blonde",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/wavy/long_wavy_blonde1.png",
    },
    {
      id: "hair_long_wavy_platinum",
      label: "Long Wavy • Platinum",
      gender: "female",
      slot: "hair",
      cost: 40,
      rarity: "epic",
      image: "assets/images/hair/wavy/long_wavy_platinum.png",
    },
    {
      id: "hair_long_wavy_dark_brown",
      label: "Long Wavy • Dark Brown",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/wavy/long_wavy_dark_brown.png",
    },
    {
      id: "hair_long_wavy_copper",
      label: "Long Wavy • Copper",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/wavy/long_wavy_copper.png",
    },
    {
      id: "hair_long_wavy_ginger",
      label: "Long Wavy • Ginger",
      gender: "female",
      slot: "hair",
      cost: 30,
      rarity: "common",
      image: "assets/images/hair/wavy/long_wavy_ginger.png",
    },
    {
      id: "hair_long_wavy_purple",
      label: "Long Wavy • Purple",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/wavy/long_wavy_purple.png",
    },
    {
      id: "hair_long_wavy_pastel_pink",
      label: "Long Wavy • Pastel Pink",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/wavy/long_wavy_pink.png",
    },
    {
      id: "hair_long_wavy_pastel_blue",
      label: "Long Wavy • Pastel Blue",
      gender: "female",
      slot: "hair",
      cost: 35,
      rarity: "rare",
      image: "assets/images/hair/wavy/long_wavy_pastel_blue.png",
    },
  ],

  // --------- EYES (assets/images/unisex/eyes) ---------
  eyes: [
    {
      id: "eyes_brown",
      label: "Brown Eyes",
      gender: "unisex",
      slot: "eyes",
      cost: 10,
      rarity: "common",
      image: "assets/images/unisex/eyes/brown_eyes.png",
    },
    {
      id: "eyes_blue",
      label: "Blue Eyes",
      gender: "unisex",
      slot: "eyes",
      cost: 12,
      rarity: "rare",
      image: "assets/images/unisex/eyes/blue_eyes.png",
    },
    {
      id: "eyes_green",
      label: "Green Eyes",
      gender: "unisex",
      slot: "eyes",
      cost: 12,
      rarity: "rare",
      image: "assets/images/unisex/eyes/green_eyes.png",
    },
  ],

  // --------- JEWELRY (assets/images/female_jewlery & male_jewlery) ---------
  jewelry: [
    // FEMALE
    {
      id: "female_ear_ring",
      label: "Earrings",
      gender: "female",
      slot: "jewelry",
      cost: 15,
      rarity: "common",
      image: "assets/images/female_jewlery/female_ear-ring.png",
    },
    {
      id: "female_belly_ring",
      label: "Belly Ring",
      gender: "female",
      slot: "jewelry",
      cost: 20,
      rarity: "rare",
      image: "assets/images/female_jewlery/female_belly-ring.png",
    },
    {
      id: "female_gold_necklace",
      label: "Gold Necklace",
      gender: "female",
      slot: "jewelry",
      cost: 25,
      rarity: "epic",
      image: "assets/images/female_jewlery/female_gold_necklace.png",
    },

    // MALE
    {
      id: "male_gold_necklace",
      label: "Gold Necklace (Male)",
      gender: "male",
      slot: "jewelry",
      cost: 25,
      rarity: "epic",
      image: "assets/images/male_jewlery/male_gold_necklace.png",
    },
  ],

  // --------- SHOES (assets/images/unisex/shoes) ---------
  shoes: [
    {
      id: "unisex_shoes",
      label: "Sneakers",
      gender: "unisex",
      slot: "shoes",
      cost: 18,
      rarity: "common",
      image: "assets/images/unisex/shoes/shoes_unisex.png",
    },
    {
      id: "unisex_sandles",
      label: "Sandals",
      gender: "unisex",
      slot: "shoes",
      cost: 15,
      rarity: "common",
      image: "assets/images/unisex/shoes/sandles_unisex.png",
    },
  ],
};

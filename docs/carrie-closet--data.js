// carrie-closet--data.js
// Data for Carrie Closet — real assets, no eye overlays for now.

window.CARRIE_CLOSET_DATA = {
  version: 1,

  // What loads the first time you open the closet
  defaults: {
    baseId: "skin_female_light",
    outfitId: "outfit_bikini",
    hairId: "hair_long_straight_blonde",
    jewelryId: null,
    unisexTopId: null,
    shoesId: null,
  },

  // Each group = one "slot" in the avatar preview stack
  groups: [
    {
      key: "baseId",
      label: "Skin tone",
      items: [
        {
          id: "skin_female_light",
          label: "Light skin",
          priceCoins: 0,
          src: "assets/images/base/female/female_light_skin.png",
        },
        {
          id: "skin_female_tan",
          label: "Tan skin",
          priceCoins: 50,
          src: "assets/images/base/female/female_tan_skin.png",
        },
        {
          id: "skin_female_brown",
          label: "Brown skin",
          priceCoins: 50,
          src: "assets/images/base/female/female_brown_skin.png",
        },
        {
          id: "skin_female_dark_brown",
          label: "Dark brown skin",
          priceCoins: 75,
          src: "assets/images/base/female/female_dark_brown_skin.png",
        },
        {
          id: "skin_female_deep_brown",
          label: "Deep brown skin",
          priceCoins: 100,
          src: "assets/images/base/female/deep_brown_skin.png",
        },
      ],
    },

    {
      key: "outfitId",
      label: "Outfits (bottoms)",
      items: [
        {
          id: "outfit_bikini",
          label: "Bikini",
          priceCoins: 0,
          src: "assets/images/female_cloths/female_bikini.png",
        },
        {
          id: "outfit_shorts",
          label: "Short shorts",
          priceCoins: 75,
          src: "assets/images/female_cloths/female_shorts.png",
        },
        {
          id: "outfit_skirt",
          label: "Skirt",
          priceCoins: 75,
          src: "assets/images/female_cloths/female_skirt.png",
        },
      ],
    },

    {
      key: "unisexTopId",
      label: "Tops (unisex)",
      items: [
        {
          id: "top_tank_unisex",
          label: "Tank top",
          priceCoins: 60,
          src: "assets/images/unisex/cloths/tank-top_unisex.png",
        },
        {
          id: "top_tee_unisex",
          label: "T-shirt",
          priceCoins: 60,
          src: "assets/images/unisex/cloths/tee-shirt_unisex.png",
        },
      ],
    },

    {
      key: "hairId",
      label: "Hair (long straight)",
      items: [
        {
          id: "hair_long_straight_blonde",
          label: "Long straight — blonde",
          priceCoins: 80,
          src: "assets/images/hair/long/long_straight_blonde.png",
        },
        {
          id: "hair_long_straight_platinum",
          label: "Long straight — platinum",
          priceCoins: 90,
          src: "assets/images/hair/long/long_straight_platinum_blonde.png",
        },
        {
          id: "hair_long_straight_dark_brown",
          label: "Long straight — dark brown",
          priceCoins: 80,
          src: "assets/images/hair/long/long_straighr_dark_brown.png",
        },
        {
          id: "hair_long_straight_copper",
          label: "Long straight — copper",
          priceCoins: 80,
          src: "assets/images/hair/long/long_straight_copper.png",
        },
        {
          id: "hair_long_straight_ginger",
          label: "Long straight — ginger",
          priceCoins: 80,
          src: "assets/images/hair/long/long_straight_ginger.png",
        },
        {
          id: "hair_long_straight_pastel_pink",
          label: "Long straight — pastel pink",
          priceCoins: 90,
          src: "assets/images/hair/long/long_straight_pastel_pink.png",
        },
        {
          id: "hair_long_straight_pastel_blue",
          label: "Long straight — pastel blue",
          priceCoins: 90,
          src: "assets/images/hair/long/long_straight_pastel_blue.png",
        },
        {
          id: "hair_long_straight_purple",
          label: "Long straight — purple",
          priceCoins: 90,
          src: "assets/images/hair/long/long_straight_purple.png",
        },
      ],
    },

    {
      key: "hairId",
      label: "Hair (long wavy)",
      items: [
        {
          id: "hair_long_wavy_blonde",
          label: "Long wavy — blonde",
          priceCoins: 90,
          src: "assets/images/hair/wavy/long_wavy_blonde1.png",
        },
        {
          id: "hair_long_wavy_platinum",
          label: "Long wavy — platinum",
          priceCoins: 100,
          src: "assets/images/hair/wavy/long_wavy_platinum.png",
        },
        {
          id: "hair_long_wavy_dark_brown",
          label: "Long wavy — dark brown",
          priceCoins: 90,
          src: "assets/images/hair/wavy/long_wavy_dark_brown.png",
        },
        {
          id: "hair_long_wavy_copper",
          label: "Long wavy — copper",
          priceCoins: 90,
          src: "assets/images/hair/wavy/long_wavy_copper.png",
        },
        {
          id: "hair_long_wavy_ginger",
          label: "Long wavy — ginger",
          priceCoins: 90,
          src: "assets/images/hair/wavy/long_wavy_ginger.png",
        },
        {
          id: "hair_long_wavy_pastel_pink",
          label: "Long wavy — pastel pink",
          priceCoins: 100,
          src: "assets/images/hair/wavy/long_wavy_pink.png",
        },
        {
          id: "hair_long_wavy_pastel_blue",
          label: "Long wavy — pastel blue",
          priceCoins: 100,
          src: "assets/images/hair/wavy/long_wavy_pastel_blue.png",
        },
        {
          id: "hair_long_wavy_purple",
          label: "Long wavy — purple",
          priceCoins: 100,
          src: "assets/images/hair/wavy/long_wavy_purple.png",
        },
      ],
    },

    {
      key: "jewelryId",
      label: "Jewelry",
      items: [
        {
          id: "jewel_earrings",
          label: "Earrings",
          priceCoins: 70,
          src: "assets/images/female_jewlery/female_ear-ring.png",
        },
        {
          id: "jewel_belly_ring",
          label: "Belly ring",
          priceCoins: 90,
          src: "assets/images/female_jewlery/female_belly-ring.png",
        },
        {
          id: "jewel_gold_necklace",
          label: "Gold necklace",
          priceCoins: 120,
          src: "assets/images/female_jewlery/female_gold_necklace.png",
        },
      ],
    },

    {
      key: "shoesId",
      label: "Shoes (unisex)",
      items: [
        {
          id: "shoes_sandals_unisex",
          label: "Sandals",
          priceCoins: 60,
          src: "assets/images/unisex/shoes/sandles_unisex.png",
        },
        {
          id: "shoes_sneakers_unisex",
          label: "Sneakers",
          priceCoins: 80,
          src: "assets/images/unisex/shoes/shoes_unisex.png",
        },
      ],
    },
  ],
};

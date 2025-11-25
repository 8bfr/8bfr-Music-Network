// carrie-closet--data.js
// Data only — paths and item definitions for Carrie Closet

window.CARRIE_CLOSET_DATA = {
  // --- Base avatars (body + skin tone) ---

  baseAvatars: {
    female: [
      {
        id: "female_light",
        label: "Female • Light skin",
        src: "assets/images/base/female/base_female_light.png",
        default: true,
      },
      {
        id: "female_medium",
        label: "Female • Medium skin",
        src: "assets/images/base/female/base_female_medium.png",
      },
      {
        id: "female_dark",
        label: "Female • Dark skin",
        src: "assets/images/base/female/base_female_dark.png",
      },
    ],
    male: [
      {
        id: "male_light",
        label: "Male • Light skin",
        src: "assets/images/base/male/base_male_light.png",
        default: true,
      },
      {
        id: "male_medium",
        label: "Male • Medium skin",
        src: "assets/images/base/male/base_male_medium.png",
      },
      {
        id: "male_dark",
        label: "Male • Dark skin",
        src: "assets/images/base/male/base_male_dark.png",
      },
    ],
  },

  // --- Items ---
  // gender: "female" | "male" | "any"
  // slot: one of: "hair", "eyes", "top", "bottom", "necklace", "ears", "belly", "shoes"
  // category: used for the shop tabs
  // price: coins (cosmetic only right now)

  items: [
    // ----- HAIR (straight) -----
    {
      id: "hair_straight_blonde",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Blonde",
      src: "assets/images/hair/straight/female_straight_blonde.png",
      price: 25,
    },
    {
      id: "hair_straight_brown",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Brown",
      src: "assets/images/hair/straight/female_straight_brown.png",
      price: 25,
    },
    {
      id: "hair_straight_copper",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Copper",
      src: "assets/images/hair/straight/female_straight_copper.png",
      price: 25,
    },
    {
      id: "hair_straight_ginger",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Ginger",
      src: "assets/images/hair/straight/female_straight_ginger.png",
      price: 25,
    },
    {
      id: "hair_straight_pastel_blue",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Pastel blue",
      src: "assets/images/hair/straight/female_straight_pastel_blue.png",
      price: 30,
    },
    {
      id: "hair_straight_pastel_pink",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Pastel pink",
      src: "assets/images/hair/straight/female_straight_pastel_pink.png",
      price: 30,
    },
    {
      id: "hair_straight_pastel_purple",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Pastel purple",
      src: "assets/images/hair/straight/female_straight_pastel_purple.png",
      price: 30,
    },
    {
      id: "hair_straight_platinum",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Straight • Platinum blonde",
      src: "assets/images/hair/straight/female_straight_platinum_blonde.png",
      price: 30,
    },

    // ----- HAIR (wavy) -----
    {
      id: "hair_wavy_blonde",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Blonde",
      src: "assets/images/hair/wavy/female_wavy_blonde.png",
      price: 28,
    },
    {
      id: "hair_wavy_brown",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Brown",
      src: "assets/images/hair/wavy/female_wavy_brown.png",
      price: 28,
    },
    {
      id: "hair_wavy_copper",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Copper",
      src: "assets/images/hair/wavy/female_wavy_copper.png",
      price: 28,
    },
    {
      id: "hair_wavy_ginger",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Ginger",
      src: "assets/images/hair/wavy/female_wavy_ginger.png",
      price: 28,
    },
    {
      id: "hair_wavy_pastel_blue",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Pastel blue",
      src: "assets/images/hair/wavy/female_pastel_blue.png",
      price: 32,
    },
    {
      id: "hair_wavy_pastel_pink",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Pastel pink",
      src: "assets/images/hair/wavy/female_wavy_pastel_pink.png",
      price: 32,
    },
    {
      id: "hair_wavy_pastel_purple",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Pastel purple",
      src: "assets/images/hair/wavy/female_wavy_pastel_purple.png",
      price: 32,
    },
    {
      id: "hair_wavy_platinum",
      gender: "female",
      slot: "hair",
      category: "hair",
      label: "Wavy • Platinum blonde",
      src: "assets/images/hair/wavy/female_wavy_platinum_blonde.png",
      price: 32,
    },

    // ----- FEMALE CLOTHES (over bikini base) -----
    {
      id: "female_shorts",
      gender: "female",
      slot: "bottom",
      category: "bottoms",
      label: "Denim shorts",
      src: "assets/images/female_cloths/female_shorts.png",
      price: 20,
    },
    {
      id: "female_skirt",
      gender: "female",
      slot: "bottom",
      category: "bottoms",
      label: "Mini skirt",
      src: "assets/images/female_cloths/female_skirt.png",
      price: 22,
    },
    {
      id: "female_bikini_cover",
      gender: "female",
      slot: "top",
      category: "tops",
      label: "Bikini top overlay",
      src: "assets/images/female_cloths/female_bikini.png",
      price: 18,
    },

    // ----- UNISEX TOPS -----
    {
      id: "unisex_tank_top",
      gender: "any",
      slot: "top",
      category: "tops",
      label: "Unisex tank top",
      src: "assets/images/unisex/cloths/unisex_tank-top.png",
      price: 18,
    },
    {
      id: "unisex_tee_shirt",
      gender: "any",
      slot: "top",
      category: "tops",
      label: "Unisex tee shirt",
      src: "assets/images/unisex/cloths/unisex_tee-shirt.png",
      price: 18,
    },

    // ----- FEMALE JEWELRY -----
    {
      id: "female_necklace_gold",
      gender: "female",
      slot: "necklace",
      category: "jewelry",
      label: "Gold necklace",
      src: "assets/images/female_jewlery/female_gold_necklace.png",
      price: 30,
    },
    {
      id: "female_earrings_gold",
      gender: "female",
      slot: "ears",
      category: "jewelry",
      label: "Gold earrings",
      src: "assets/images/female_jewlery/female_gold_ear-ring.png",
      price: 26,
    },
    {
      id: "female_belly_ring_gold",
      gender: "female",
      slot: "belly",
      category: "jewelry",
      label: "Gold belly ring",
      src: "assets/images/female_jewlery/female_gold_belly-ring.png",
      price: 28,
    },

    // ----- MALE JEWELRY -----
    {
      id: "male_necklace_gold",
      gender: "male",
      slot: "necklace",
      category: "jewelry",
      label: "Gold necklace",
      src: "assets/images/male_jewlery/male_gold_necklace.png",
      price: 30,
    },

    // ----- UNISEX EYES -----
    {
      id: "eyes_blue",
      gender: "any",
      slot: "eyes",
      category: "eyes",
      label: "Blue eyes",
      src: "assets/images/unisex/eyes/unisex_eyes_blue.png",
      price: 15,
    },
    {
      id: "eyes_green",
      gender: "any",
      slot: "eyes",
      category: "eyes",
      label: "Green eyes",
      src: "assets/images/unisex/eyes/unisex_eyes_green.png",
      price: 15,
    },
    {
      id: "eyes_brown",
      gender: "any",
      slot: "eyes",
      category: "eyes",
      label: "Brown eyes",
      src: "assets/images/unisex/eyes/unisex_eyes_brown.png",
      price: 15,
    },

    // ----- UNISEX SHOES -----
    {
      id: "shoes_sneakers",
      gender: "any",
      slot: "shoes",
      category: "shoes",
      label: "Sneakers",
      src: "assets/images/unisex/shoes/unisex_shoes.png",
      price: 18,
    },
    {
      id: "shoes_sandles",
      gender: "any",
      slot: "shoes",
      category: "shoes",
      label: "Sandals",
      src: "assets/images/unisex/shoes/unisex_sandles.png",
      price: 16,
    },
  ],
};

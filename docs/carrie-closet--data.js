// carrie-closet--data.js
// Static data for Carrie Closet (uses your new folder structure)

window.CARRIE_CLOSET = {
  // ----- Base avatars (baked-in underwear / shorts) -----
  bases: {
    female: [
      {
        id: "female_light",
        label: "Light skin",
        src: "assets/images/base/female/base_female_light.png",
      },
      {
        id: "female_medium",
        label: "Medium skin",
        src: "assets/images/base/female/base_female_medium.png",
      },
      {
        id: "female_dark",
        label: "Dark skin",
        src: "assets/images/base/female/base_female_dark.png",
      },
    ],
    male: [
      {
        id: "male_light",
        label: "Light skin",
        src: "assets/images/base/male/base_male_light.png",
      },
      {
        id: "male_medium",
        label: "Medium skin",
        src: "assets/images/base/male/base_male_medium.png",
      },
      {
        id: "male_dark",
        label: "Dark skin",
        src: "assets/images/base/male/base_male_dark.png",
      },
    ],
  },

  // ----- Wearable items -----
  // slot = which layer it draws on top of the base
  // gender = "female" / "male" / "unisex"
  items: [
    // ===== FEMALE CLOTHES =====
    {
      id: "female_bikini",
      slot: "outfit",
      gender: "female",
      label: "Bikini (default)",
      coins: 0,
      src: "assets/images/female_cloths/female_bikini.png",
    },
    {
      id: "female_shorts",
      slot: "outfit",
      gender: "female",
      label: "Shorts",
      coins: 25,
      src: "assets/images/female_cloths/female_shorts.png",
    },
    {
      id: "female_skirt",
      slot: "outfit",
      gender: "female",
      label: "Skirt",
      coins: 30,
      src: "assets/images/female_cloths/female_skirt.png",
    },

    // ===== FEMALE JEWELRY =====
    {
      id: "female_necklace_gold",
      slot: "jewelry",
      gender: "female",
      label: "Gold Necklace",
      coins: 35,
      src: "assets/images/female_jewlery/female_gold_necklace.png",
    },
    {
      id: "female_earrings_gold",
      slot: "jewelry",
      gender: "female",
      label: "Gold Earrings",
      coins: 30,
      src: "assets/images/female_jewlery/female_gold_ear-ring.png",
    },
    {
      id: "female_belly_ring_gold",
      slot: "jewelry",
      gender: "female",
      label: "Gold Belly Ring",
      coins: 40,
      src: "assets/images/female_jewlery/female_gold_belly-ring.png",
    },

    // ===== MALE JEWELRY =====
    {
      id: "male_necklace_gold",
      slot: "jewelry",
      gender: "male",
      label: "Gold Necklace (Male)",
      coins: 35,
      src: "assets/images/male_jewlery/male_gold_necklace.png",
    },

    // ===== HAIR – STRAIGHT (FEMALE) =====
    {
      id: "hair_straight_blonde",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Blonde",
      coins: 30,
      src: "assets/images/hair/straight/female_straight_blonde.png",
    },
    {
      id: "hair_straight_brown",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Brown",
      coins: 30,
      src: "assets/images/hair/straight/female_straight_brown.png",
    },
    {
      id: "hair_straight_copper",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Copper",
      coins: 30,
      src: "assets/images/hair/straight/female_straight_copper.png",
    },
    {
      id: "hair_straight_ginger",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Ginger",
      coins: 30,
      src: "assets/images/hair/straight/female_straight_ginger.png",
    },
    {
      id: "hair_straight_pastel_blue",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Pastel Blue",
      coins: 35,
      src: "assets/images/hair/straight/female_straight_pastel_blue.png",
    },
    {
      id: "hair_straight_pastel_pink",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Pastel Pink",
      coins: 35,
      src: "assets/images/hair/straight/female_straight_pastel_pink.png",
    },
    {
      id: "hair_straight_pastel_purple",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Pastel Purple",
      coins: 35,
      src: "assets/images/hair/straight/female_straight_pastel_purple.png",
    },
    {
      id: "hair_straight_platinum",
      slot: "hair",
      gender: "female",
      group: "straight",
      label: "Long Straight • Platinum Blonde",
      coins: 35,
      src: "assets/images/hair/straight/female_straight_platinum_blonde.png",
    },

    // ===== HAIR – WAVY (FEMALE) =====
    {
      id: "hair_wavy_blonde",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Blonde",
      coins: 32,
      src: "assets/images/hair/wavy/female_wavy_blonde.png",
    },
    {
      id: "hair_wavy_brown",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Brown",
      coins: 32,
      src: "assets/images/hair/wavy/female_wavy_brown.png",
    },
    {
      id: "hair_wavy_copper",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Copper",
      coins: 32,
      src: "assets/images/hair/wavy/female_wavy_copper.png",
    },
    {
      id: "hair_wavy_ginger",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Ginger",
      coins: 32,
      src: "assets/images/hair/wavy/female_wavy_ginger.png",
    },
    {
      id: "hair_wavy_pastel_blue",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Pastel Blue",
      coins: 36,
      src: "assets/images/hair/wavy/female_pastel_blue.png",
    },
    {
      id: "hair_wavy_pastel_pink",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Pastel Pink",
      coins: 36,
      src: "assets/images/hair/wavy/female_wavy_pastel_pink.png",
    },
    {
      id: "hair_wavy_pastel_purple",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Pastel Purple",
      coins: 36,
      src: "assets/images/hair/wavy/female_wavy_pastel_purple.png",
    },
    {
      id: "hair_wavy_platinum_blonde",
      slot: "hair",
      gender: "female",
      group: "wavy",
      label: "Long Wavy • Platinum Blonde",
      coins: 36,
      src: "assets/images/hair/wavy/female_wavy_platinum_blonde.png",
    },

    // ===== UNISEX SHIRTS =====
    {
      id: "unisex_tank_top",
      slot: "outfit",
      gender: "unisex",
      label: "Unisex Tank Top",
      coins: 20,
      src: "assets/images/unisex/cloths/unisex_tank-top.png",
    },
    {
      id: "unisex_tee_shirt",
      slot: "outfit",
      gender: "unisex",
      label: "Unisex Tee Shirt",
      coins: 18,
      src: "assets/images/unisex/cloths/unisex_tee-shirt.png",
    },

    // ===== UNISEX EYES =====
    {
      id: "eyes_blue",
      slot: "eyes",
      gender: "unisex",
      label: "Blue Eyes",
      coins: 12,
      src: "assets/images/unisex/eyes/unisex_eyes_blue.png",
    },
    {
      id: "eyes_brown",
      slot: "eyes",
      gender: "unisex",
      label: "Brown Eyes",
      coins: 8,
      src: "assets/images/unisex/eyes/unisex_eyes_brown.png",
    },
    {
      id: "eyes_green",
      slot: "eyes",
      gender: "unisex",
      label: "Green Eyes",
      coins: 15,
      src: "assets/images/unisex/eyes/unisex_eyes_green.png",
    },

    // ===== UNISEX SHOES =====
    {
      id: "shoes_sandles_unisex",
      slot: "shoes",
      gender: "unisex",
      label: "Sandals (Unisex)",
      coins: 10,
      src: "assets/images/unisex/shoes/unisex_sandles.png",
    },
    {
      id: "shoes_unisex",
      slot: "shoes",
      gender: "unisex",
      label: "Shoes (Unisex)",
      coins: 18,
      src: "assets/images/unisex/shoes/unisex_shoes.png",
    },
  ],
};

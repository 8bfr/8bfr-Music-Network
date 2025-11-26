// docs/carrie-closet--data.js
// Static data describing all closet items.
// Uses full-canvas PNG overlays that match the 500x282 base avatars.

(function () {
  const IMG_BASE = "assets/images";

  window.CARRIE_CLOSET_ITEMS = [
    // -----------------------------
    // FEMALE HAIR — STRAIGHT
    // -----------------------------
    {
      id: "f_hair_straight_blonde",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — blonde",
      coins: 25,
      rarity: "common",
      src: `${IMG_BASE}/hair/straight/female_straight_blonde.png`,
    },
    {
      id: "f_hair_straight_brown",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — brown",
      coins: 25,
      rarity: "common",
      src: `${IMG_BASE}/hair/straight/female_straight_brown.png`,
    },
    {
      id: "f_hair_straight_copper",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — copper",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/hair/straight/female_straight_copper.png`,
    },
    {
      id: "f_hair_straight_ginger",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — ginger",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/hair/straight/female_straight_ginger.png`,
    },
    {
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — pastel blue",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/straight/female_straight_pastel_blue.png`,
    },
    {
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — pastel pink",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/straight/female_straight_pastel_pink.png`,
    },
    {
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — pastel purple",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/straight/female_straight_pastel_purple.png`,
    },
    {
      id: "f_hair_straight_platinum",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "straight",
      label: "Straight hair — platinum blonde",
      coins: 35,
      rarity: "epic",
      src: `${IMG_BASE}/hair/straight/female_straight_platinum_blonde.png`,
    },

    // -----------------------------
    // FEMALE HAIR — WAVY
    // -----------------------------
    {
      id: "f_hair_wavy_blonde",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — blonde",
      coins: 25,
      rarity: "common",
      src: `${IMG_BASE}/hair/wavy/female_wavy_blonde.png`,
    },
    {
      id: "f_hair_wavy_brown",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — brown",
      coins: 25,
      rarity: "common",
      src: `${IMG_BASE}/hair/wavy/female_wavy_brown.png`,
    },
    {
      id: "f_hair_wavy_copper",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — copper",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/hair/wavy/female_wavy_copper.png`,
    },
    {
      id: "f_hair_wavy_ginger",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — ginger",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/hair/wavy/female_wavy_ginger.png`,
    },
    {
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — pastel blue",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/wavy/female_pastel_blue.png`,
    },
    {
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — pastel pink",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/wavy/female_wavy_pastel_pink.png`,
    },
    {
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — pastel purple",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/hair/wavy/female_wavy_pastel_purple.png`,
    },
    {
      id: "f_hair_wavy_platinum",
      gender: "female",
      slot: "hair",
      category: "hair",
      style: "wavy",
      label: "Wavy hair — platinum blonde",
      coins: 35,
      rarity: "epic",
      src: `${IMG_BASE}/hair/wavy/female_wavy_platinum_blonde.png`,
    },

    // -----------------------------
    // FEMALE CLOTHES
    // -----------------------------
    {
      id: "f_bottom_bikini",
      gender: "female",
      slot: "bottom",
      category: "bottom",
      label: "Bikini bottoms",
      coins: 10,
      rarity: "common",
      note: "Base also has a bikini — this just reinforces it.",
      src: `${IMG_BASE}/female_cloths/female_bikini.png`,
    },
    {
      id: "f_bottom_shorts",
      gender: "female",
      slot: "bottom",
      category: "bottom",
      label: "Shorts",
      coins: 20,
      rarity: "common",
      src: `${IMG_BASE}/female_cloths/female_shorts.png`,
    },
    {
      id: "f_bottom_skirt",
      gender: "female",
      slot: "bottom",
      category: "bottom",
      label: "Skirt",
      coins: 20,
      rarity: "uncommon",
      src: `${IMG_BASE}/female_cloths/female_skirt.png`,
    },

    // -----------------------------
    // FEMALE JEWELRY
    // -----------------------------
    {
      id: "f_jewel_necklace_gold",
      gender: "female",
      slot: "necklace",
      category: "jewelry",
      label: "Gold necklace",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/female_jewlery/female_gold_necklace.png`,
    },
    {
      id: "f_jewel_earrings_gold",
      gender: "female",
      slot: "ears",
      category: "jewelry",
      label: "Gold earrings",
      coins: 20,
      rarity: "uncommon",
      src: `${IMG_BASE}/female_jewlery/female_gold_ear-ring.png`,
    },
    {
      id: "f_jewel_bellyring_gold",
      gender: "female",
      slot: "belly",
      category: "jewelry",
      label: "Gold belly ring",
      coins: 30,
      rarity: "rare",
      src: `${IMG_BASE}/female_jewlery/female_gold_belly-ring.png`,
    },

    // -----------------------------
    // MALE JEWELRY
    // -----------------------------
    {
      id: "m_jewel_necklace_gold",
      gender: "male",
      slot: "necklace",
      category: "jewelry",
      label: "Gold necklace",
      coins: 25,
      rarity: "uncommon",
      src: `${IMG_BASE}/male_jewlery/male_gold_necklace.png`,
    },

    // -----------------------------
    // UNISEX TOPS
    // -----------------------------
    {
      id: "u_top_tank",
      gender: "unisex",
      slot: "top",
      category: "top",
      label: "Tank top (unisex)",
      coins: 20,
      rarity: "common",
      src: `${IMG_BASE}/unisex/cloths/unisex_tank-top.png`,
    },
    {
      id: "u_top_tee",
      gender: "unisex",
      slot: "top",
      category: "top",
      label: "T-shirt (unisex)",
      coins: 20,
      rarity: "common",
      src: `${IMG_BASE}/unisex/cloths/unisex_tee-shirt.png`,
    },

    // -----------------------------
    // UNISEX EYES
    // -----------------------------
    {
      id: "u_eyes_blue",
      gender: "unisex",
      slot: "eyes",
      category: "eyes",
      label: "Blue eyes",
      coins: 15,
      rarity: "common",
      src: `${IMG_BASE}/unisex/eyes/unisex_eyes_blue.png`,
    },
    {
      id: "u_eyes_brown",
      gender: "unisex",
      slot: "eyes",
      category: "eyes",
      label: "Brown eyes",
      coins: 15,
      rarity: "common",
      src: `${IMG_BASE}/unisex/eyes/unisex_eyes_brown.png`,
    },
    {
      id: "u_eyes_green",
      gender: "unisex",
      slot: "eyes",
      category: "eyes",
      label: "Green eyes",
      coins: 15,
      rarity: "uncommon",
      src: `${IMG_BASE}/unisex/eyes/unisex_eyes_green.png`,
    },

    // -----------------------------
    // UNISEX SHOES
    // -----------------------------
    {
      id: "u_shoes_sneakers",
      gender: "unisex",
      slot: "shoes",
      category: "shoes",
      label: "Sneakers",
      coins: 20,
      rarity: "common",
      src: `${IMG_BASE}/unisex/shoes/unisex_shoes.png`,
    },
    {
      id: "u_shoes_sandals",
      gender: "unisex",
      slot: "shoes",
      category: "shoes",
      label: "Sandals",
      coins: 20,
      rarity: "common",
      src: `${IMG_BASE}/unisex/shoes/unisex_sandles.png`,
    },
  ];

  // Tiny debug (safe to leave in)
  console.log("Carrie Closet items loaded:", window.CARRIE_CLOSET_ITEMS.length);
})();

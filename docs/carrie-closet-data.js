// carrie-closet-data.js
// Static closet catalog using your actual image paths / names.

(function () {
  const base = "assets/images";

  // Helper to build item objects
  function item(opts) {
    return Object.assign(
      {
        id: "",
        gender: "female", // "female" | "male" | "unisex"
        cat: "hair",      // UI category: hair/top/bottom/jewelry/eyes/shoes/all
        slot: "hair",     // overlay slot: hair/top/bottom/eyes/shoes/necklace/ears/belly
        name: "",
        label: "",
        coins: 0,
        rarity: "common",
        img: "",
        thumb: ""
      },
      opts
    );
  }

  const items = [
    // ---- FEMALE HAIR – STRAIGHT ----
    item({
      id: "f_hair_straight_blonde",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Blonde",
      label: "straight • blonde",
      coins: 20,
      rarity: "rare",
      img: `${base}/hair/straight/female_straight_blonde.png`
    }),
    item({
      id: "f_hair_straight_brown",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Brown",
      label: "straight • brown",
      coins: 15,
      img: `${base}/hair/straight/female_straight_brown.png`
    }),
    item({
      id: "f_hair_straight_copper",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Copper",
      label: "straight • copper",
      coins: 18,
      img: `${base}/hair/straight/female_straight_copper.png`
    }),
    item({
      id: "f_hair_straight_ginger",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Ginger",
      label: "straight • ginger",
      coins: 18,
      img: `${base}/hair/straight/female_straight_ginger.png`
    }),
    item({
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Blue",
      label: "straight • pastel blue",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/straight/female_straight_pastel_blue.png`
    }),
    item({
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Pink",
      label: "straight • pastel pink",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/straight/female_straight_pastel_pink.png`
    }),
    item({
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Purple",
      label: "straight • pastel purple",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/straight/female_straight_pastel_purple.png`
    }),
    item({
      id: "f_hair_straight_platinum",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Straight Platinum",
      label: "straight • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: `${base}/hair/straight/female_straight_platinum_blonde.png`
    }),

    // ---- FEMALE HAIR – WAVY ----
    item({
      id: "f_hair_wavy_blonde",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Blonde",
      label: "wavy • blonde",
      coins: 20,
      img: `${base}/hair/wavy/female_wavy_blonde.png`
    }),
    item({
      id: "f_hair_wavy_brown",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Brown",
      label: "wavy • brown",
      coins: 18,
      img: `${base}/hair/wavy/female_wavy_brown.png`
    }),
    item({
      id: "f_hair_wavy_copper",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Copper",
      label: "wavy • copper",
      coins: 18,
      img: `${base}/hair/wavy/female_wavy_copper.png`
    }),
    item({
      id: "f_hair_wavy_ginger",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Ginger",
      label: "wavy • ginger",
      coins: 18,
      img: `${base}/hair/wavy/female_wavy_ginger.png`
    }),
    item({
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Blue",
      label: "wavy • pastel blue",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/wavy/female_pastel_blue.png`
    }),
    item({
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Pink",
      label: "wavy • pastel pink",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/wavy/female_wavy_pastel_pink.png`
    }),
    item({
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Purple",
      label: "wavy • pastel purple",
      coins: 22,
      rarity: "epic",
      img: `${base}/hair/wavy/female_wavy_pastel_purple.png`
    }),
    item({
      id: "f_hair_wavy_platinum",
      gender: "female",
      cat: "hair",
      slot: "hair",
      name: "Wavy Platinum",
      label: "wavy • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: `${base}/hair/wavy/female_wavy_platinum_blonde.png`
    }),

    // ---- TOPS (unisex tank + tee) ----
    item({
      id: "u_top_tank",
      gender: "unisex",
      cat: "top",
      slot: "top",
      name: "8BFR Tank Top",
      label: "unisex tank",
      coins: 15,
      img: `${base}/unisex/cloths/unisex_tank-top.png`
    }),
    item({
      id: "u_top_tee",
      gender: "unisex",
      cat: "top",
      slot: "top",
      name: "8BFR Tee",
      label: "unisex tee",
      coins: 15,
      img: `${base}/unisex/cloths/unisex_tee-shirt.png`
    }),

    // ---- BOTTOMS (female shorts / skirt) ----
    item({
      id: "f_bottom_shorts",
      gender: "female",
      cat: "bottom",
      slot: "bottom",
      name: "Denim Shorts",
      label: "female shorts",
      coins: 15,
      img: `${base}/female_cloths/female_shorts.png`
    }),
    item({
      id: "f_bottom_skirt",
      gender: "female",
      cat: "bottom",
      slot: "bottom",
      name: "Mini Skirt",
      label: "female skirt",
      coins: 18,
      img: `${base}/female_cloths/female_skirt.png`
    }),

    // ---- JEWELRY – FEMALE ----
    item({
      id: "f_jewel_necklace",
      gender: "female",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Necklace",
      label: "necklace",
      coins: 20,
      img: `${base}/female_jewlery/female_gold_necklace.png`
    }),
    item({
      id: "f_jewel_belly",
      gender: "female",
      cat: "jewelry",
      slot: "belly",
      name: "Belly Ring",
      label: "belly ring",
      coins: 15,
      img: `${base}/female_jewlery/female_gold_belly-ring.png`
    }),
    item({
      id: "f_jewel_ears",
      gender: "female",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earrings",
      label: "ear rings",
      coins: 18,
      img: `${base}/female_jewlery/female_gold_ear-ring.png`
    }),

    // ---- JEWELRY – MALE ----
    item({
      id: "m_jewel_necklace",
      gender: "male",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Chain",
      label: "male necklace",
      coins: 20,
      img: `${base}/male_jewlery/male_gold_necklace.png`
    }),

    // ---- EYES (unisex, iris overlays) ----
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      label: "blue",
      coins: 10,
      img: `${base}/unisex/eyes/unisex_eyes_blue.png`
    }),
    item({
      id: "u_eyes_green",
      gender: "unisex",
      cat: "eyes",
      slot: "eyes",
      name: "Green Eyes",
      label: "green",
      coins: 10,
      img: `${base}/unisex/eyes/unisex_eyes_green.png`
    }),
    item({
      id: "u_eyes_brown",
      gender: "unisex",
      cat: "eyes",
      slot: "eyes",
      name: "Brown Eyes",
      label: "brown",
      coins: 10,
      img: `${base}/unisex/eyes/unisex_eyes_brown.png`
    }),

    // ---- SHOES (unisex sneakers only) ----
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      label: "unisex shoes",
      coins: 14,
      img: `${base}/unisex/shoes/unisex_shoes.png`
    })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

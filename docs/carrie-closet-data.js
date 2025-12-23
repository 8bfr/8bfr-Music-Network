// carrie-closet-data.js
// Static closet catalog using your actual image paths / names.

(function () {
  const base = "assets/images";

  // Helper to build item objects with defaults
  function item(opts) {
    return Object.assign(
      {
        id: "",
        gender: "female",      // "female" | "male" | "unisex"
        category: "hair",      // UI category: hair/top/bottom/jewelry/eyes/shoes
        cat: "hair",           // alias for older/newer JS
        slot: "hair",          // overlay slot: hair/top/bottom/eyes/shoes/necklace/ears/belly
        name: "",
        label: "",
        coins: 0,
        rarity: "common",
        img: "",
        thumb: "",
        // per-item transform defaults (optional, for future logic)
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      opts
    );
  }

  const items = [
    // ---- FEMALE HAIR – STRAIGHT ----
    item({
      id: "f_hair_straight_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Blonde",
      label: "straight • blonde",
      coins: 20,
      rarity: "rare",
      img: base + "/hair/straight/female_straight_blonde.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -10
    }),
    item({
      id: "f_hair_straight_brown",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Brown",
      label: "straight • brown",
      coins: 15,
      img: base + "/hair/straight/female_straight_brown.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -10
    }),
    item({
      id: "f_hair_straight_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Copper",
      label: "straight • copper",
      coins: 18,
      img: base + "/hair/straight/female_straight_copper.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Ginger",
      label: "straight • ginger",
      coins: 18,
      img: base + "/hair/straight/female_straight_ginger.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Blue",
      label: "straight • pastel blue",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_blue.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Pink",
      label: "straight • pastel pink",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_pink.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Purple",
      label: "straight • pastel purple",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/straight/female_straight_pastel_purple.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_platinum",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Platinum",
      label: "straight • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: base + "/hair/straight/female_straight_platinum_blonde.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    item({
      id: "f_hair_straight_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Black",
      label: "straight • black",
      coins: 18,
      img: base + "/hair/straight/female_straight_black.png",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),

    // ---- FEMALE HAIR – WAVY ----
    item({
      id: "f_hair_wavy_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Blonde",
      label: "wavy • blonde",
      coins: 20,
      img: base + "/hair/wavy/female_wavy_blonde.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_brown",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Brown",
      label: "wavy • brown",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_brown.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Copper",
      label: "wavy • copper",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_copper.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Ginger",
      label: "wavy • ginger",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_ginger.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Blue",
      label: "wavy • pastel blue",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_blue.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Pink",
      label: "wavy • pastel pink",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_pink.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Purple",
      label: "wavy • pastel purple",
      coins: 22,
      rarity: "epic",
      img: base + "/hair/wavy/female_wavy_pastel_purple.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_platinum",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Platinum",
      label: "wavy • platinum blonde",
      coins: 25,
      rarity: "legendary",
      img: base + "/hair/wavy/female_wavy_platinum_blonde.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Black",
      label: "wavy • black",
      coins: 18,
      img: base + "/hair/wavy/female_wavy_black.png",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),

    // ---- TOPS (unisex tank + tee + red bikini top) ----
    item({
      id: "u_top_tank",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tank Top",
      label: "unisex tank",
      coins: 15,
      img: base + "/unisex/cloths/unisex_tank-top_v1.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: 6
    }),
    item({
      id: "u_top_tee",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tee",
      label: "unisex tee",
      coins: 15,
      img: base + "/unisex/cloths/unisex_tee-shirt.png",
      scale: 0.9,
      offsetX: 0,
      offsetY: 5
    }),
    item({
      id: "f_top_bikini_red",
      gender: "female",
      category: "top",
      cat: "top",
      slot: "top",
      name: "Red Bikini Top",
      label: "bikini top • red",
      coins: 12,
      img: base + "/female_cloths/female_bikini-top_red.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: 6
    }),

    // ---- BOTTOMS (female shorts / skirt + red bikini bottom) ----
    item({
      id: "f_bottom_shorts",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Denim Shorts",
      label: "female shorts",
      coins: 15,
      img: base + "/female_cloths/female_shorts.png",
      scale: 0.92,
      offsetX: 0,
      offsetY: -2
    }),
    item({
      id: "f_bottom_skirt",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Mini Skirt",
      label: "female skirt",
      coins: 18,
      img: base + "/female_cloths/female_skirt.png",
      scale: 1.06,
      offsetX: 0,
      offsetY: -4
    }),

    /* ✅ FIXED: bikini bottom was breaking the file */
    item({
      id: "f_bottom_bikini_red",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Red Bikini Bottom",
      label: "bikini bottom • red",
      coins: 12,

      // LIGHT image
      img: base + "/female_cloths/female_bikini-bottom_redv2.png",

      // DARK image (used by carrie-closet.js only when skin=dark)
      imgDark: base + "/female_cloths/female_bikini-bottom_red_dark.png",

      // keep your defaults (unchanged)
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),


    // ---- JEWELRY – FEMALE  Dark----
    item({
      id: "f_jewel_necklace",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Necklace",
      label: "necklace",
      coins: 20,
      img: base + "/female_jewlery/female_gold_necklace_dark.png",
      scale: 0.82,
      offsetX: 0,
      offsetY: 8
    }),
    item({
      id: "f_jewel_belly",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "belly",
      name: "Belly Ring",
      label: "belly ring",
      coins: 15,
      img: base + "/female_jewlery/female_belly-ring.png",
      scale: 0.7,
      offsetX: 0,
      offsetY: -6
    }),
    
// ---- JEWELRY – FEMALE EARRINGS ----
item({
  id: "f_jewel_ear_left",
  gender: "female",
  category: "jewelry",
  cat: "jewelry",
  slot: "ears",
  side: "left",                // specify side
  name: "Gold Earring Left",
  label: "ear ring • left",
  coins: 18,
  img: base + "/female_jewlery/female_gold_ear-ring_left.png",
  scale: 0.85,
  offsetX: 0,
  offsetY: -8
}),
item({
  id: "f_jewel_ear_right",
  gender: "female",
  category: "jewelry",
  cat: "jewelry",
  slot: "ears",
  side: "right",               // specify side
  name: "Gold Earring Right",
  label: "ear ring • right",
  coins: 18,
  img: base + "/female_jewlery/female_gold_ear-ring_right.png",
  scale: 0.85,
  offsetX: 0,
  offsetY: -8
}),

// ---- SHOES (unisex) ----
item({
  id: "u_shoes_sneakers_left",
  gender: "unisex",
  category: "shoes",
  cat: "shoes",
  slot: "shoes",
  side: "left",
  name: "Sneakers Left",
  label: "unisex shoes left",
  coins: 14,
  img: base + "/unisex/shoes/unisex_shoes_left.png",
  scale: 1,
  offsetX: 0,
  offsetY: 0
}),
item({
  id: "u_shoes_sneakers_right",
  gender: "unisex",
  category: "shoes",
  cat: "shoes",
  slot: "shoes",
  side: "right",
  name: "Sneakers Right",
  label: "unisex shoes right",
  coins: 14,
  img: base + "/unisex/shoes/unisex_shoes_right.png",
  scale: 1,
  offsetX: 0,
  offsetY: 0
}),

// ---- EYES (if left/right needed, optional) ----
item({
  id: "u_eyes_left",
  gender: "unisex",
  category: "eyes",
  cat: "eyes",
  slot: "eyes",
  side: "left",
  name: "Blue Eyes Left",
  label: "blue left",
  coins: 10,
  img: base + "/unisex/eyes/unisex_eyes_blue_left.png",
  scale: 0.28,
  offsetX: 0,
  offsetY: -18
}),
// ---item({
  id: "u_eyes_right",
  gender: "unisex",
  category: "eyes",
  cat: "eyes",
  slot: "eyes",
  side: "right",
  name: "Blue Eyes Right",
  label: "blue right",
  coins: 10,
  img: base + "/unisex/eyes/unisex_eyes_blue_right.png",
  scale: 0.28,
  offsetX: 0,
  offsetY: -18
}),
   

    // ---- JEWELRY – MALE ----
    item({
      id: "m_jewel_necklace",
      gender: "male",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Chain",
      label: "male necklace",
      coins: 20,
      img: base + "/male_jewlery/male_gold_necklace.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: 10
    }),

    // ---- EYES (unisex) ----
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      label: "blue",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_blue_left",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),
    item({
      id: "u_eyes_green",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Green Eyes",
      label: "green",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_green_left",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),
    item({
      id: "u_eyes_brown",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Brown Eyes",
      label: "brown",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_brown_left",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    // ---- SHOES (unisex) ----
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      label: "unisex shoes",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoes_left",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

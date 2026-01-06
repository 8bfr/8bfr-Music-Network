// carrie-chat-data.js
// Item data for chat page - mirrors carrie-closet-data.js but for chat use only
// DO NOT modify carrie-closet-data.js - that file is done and should not be touched

(function() {
  const base = "assets/images";

  // Helper to create item object
  function item(opts) {
    return Object.assign({
      id: "",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "",
      label: "",
      coins: 0,
      img: "",
      imgLeft: "",
      imgRight: "",
      imgDark: ""
    }, opts);
  }

  // All closet items (copied from carrie-closet-data.js)
  const items = [
    // ========== HAIR - STRAIGHT ==========
    item({
      id: "f_hair_straight_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Blonde",
      label: "straight • blonde",
      coins: 20,
      img: base + "/hair/straight/female_straight_blonde.png"
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
      img: base + "/hair/straight/female_straight_brown.png"
    }),
    item({
      id: "f_hair_straight_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Copper",
      label: "straight • copper",
      coins: 22,
      img: base + "/hair/straight/female_straight_copper.png"
    }),
    item({
      id: "f_hair_straight_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Ginger",
      label: "straight • ginger",
      coins: 22,
      img: base + "/hair/straight/female_straight_ginger.png"
    }),
    item({
      id: "f_hair_straight_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Blue",
      label: "straight • pastel blue",
      coins: 25,
      img: base + "/hair/straight/female_straight_pastel_blue.png"
    }),
    item({
      id: "f_hair_straight_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Pink",
      label: "straight • pastel pink",
      coins: 25,
      img: base + "/hair/straight/female_straight_pastel_pink.png"
    }),
    item({
      id: "f_hair_straight_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Pastel Purple",
      label: "straight • pastel purple",
      coins: 25,
      img: base + "/hair/straight/female_straight_pastel_purple.png"
    }),
    item({
      id: "f_hair_straight_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Black",
      label: "straight • black",
      coins: 15,
      img: base + "/hair/straight/female_straight_black.png"
    }),

    // ========== HAIR - WAVY ==========
    item({
      id: "f_hair_wavy_blonde",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Blonde",
      label: "wavy • blonde",
      coins: 20,
      img: base + "/hair/wavy/female_wavy_blonde.png"
    }),
    item({
      id: "f_hair_wavy_brown",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Brown",
      label: "wavy • brown",
      coins: 15,
      img: base + "/hair/wavy/female_wavy_brown.png"
    }),
    item({
      id: "f_hair_wavy_copper",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Copper",
      label: "wavy • copper",
      coins: 22,
      img: base + "/hair/wavy/female_wavy_copper.png"
    }),
    item({
      id: "f_hair_wavy_ginger",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Ginger",
      label: "wavy • ginger",
      coins: 22,
      img: base + "/hair/wavy/female_wavy_ginger.png"
    }),
    item({
      id: "f_hair_wavy_pastel_blue",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Blue",
      label: "wavy • pastel blue",
      coins: 25,
      img: base + "/hair/wavy/female_wavy_pastel_blue.png"
    }),
    item({
      id: "f_hair_wavy_pastel_pink",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Pink",
      label: "wavy • pastel pink",
      coins: 25,
      img: base + "/hair/wavy/female_wavy_pastel_pink.png"
    }),
    item({
      id: "f_hair_wavy_pastel_purple",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Wavy Pastel Purple",
      label: "wavy • pastel purple",
      coins: 25,
      img: base + "/hair/wavy/female_wavy_pastel_purple.png"
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
      img: base + "/hair/wavy/female_wavy_black.png"
    }),

    // ========== TOPS ==========
    item({
      id: "u_top_tank",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tank Top",
      label: "unisex tank",
      coins: 15,
      img: base + "/unisex/cloths/unisex_tank-top_v1.png"
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
      img: base + "/unisex/cloths/unisex_tee-shirt.png"
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
      img: base + "/female_cloths/female_bikini-top_red.png"
    }),

    // ========== BOTTOMS ==========
    item({
      id: "f_bottom_shorts",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Denim Shorts",
      label: "female shorts",
      coins: 15,
      img: base + "/female_cloths/female_shorts.png"
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
      img: base + "/female_cloths/female_skirt.png"
    }),
    item({
      id: "f_bottom_bikini_red",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Red Bikini Bottom",
      label: "bikini bottom • red",
      coins: 12,
      img: base + "/female_cloths/female_bikini-bottom_redv2.png",
      imgDark: base + "/female_cloths/female_bikini-bottom_red_dark.png"
    }),

    // ========== JEWELRY ==========
    item({
      id: "f_jewel_necklace",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Necklace",
      label: "necklace",
      coins: 20,
      img: base + "/female_jewlery/female_gold_necklace.png",
      imgDark: base + "/female_jewlery/female_gold_necklace.png"
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
      img: base + "/female_jewlery/female_belly-ring.png"
    }),
    item({
      id: "f_jewel_ears",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earrings",
      label: "ear rings",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_left.png",
      imgLeft: base + "/female_jewlery/female_gold_ear-ring_left.png",
      imgRight: base + "/female_jewlery/female_gold_ear-ring_right.png"
    }),

    // ========== EYES ==========
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      label: "blue",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_blue_left.png",
      imgLeft: base + "/unisex/eyes/unisex_eyes_blue_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_blue_right.png"
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
      img: base + "/unisex/eyes/unisex_eyes_green_left.png",
      imgLeft: base + "/unisex/eyes/unisex_eyes_green_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_green_right.png"
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
      img: base + "/unisex/eyes/unisex_eyes_brown_left.png",
      imgLeft: base + "/unisex/eyes/unisex_eyes_brown_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_brown_right.png"
    }),

    // ========== SHOES ==========
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      label: "unisex shoes",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoes_left.png",
      imgLeft: base + "/unisex/shoes/unisex_shoes_left.png",
      imgRight: base + "/unisex/shoes/unisex_shoes_right.png"
    })
  ];

  // Export to global scope for chat page
  window.CARRIE_CHAT_ITEMS = items;
})();

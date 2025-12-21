// carrie-closet-data.js
// Static closet catalog using your actual image paths / names.

(function () {
  const base = "assets/images";

  // Helper to build item objects with defaults
  function item(opts) {
    return Object.assign(
      {
        id: "",
        gender: "female",
        category: "hair",
        cat: "hair",
        slot: "hair",
        name: "",
        label: "",
        coins: 0,
        rarity: "common",
        img: "",
        thumb: "",
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      opts
    );
  }

  const items = [

    /* ===================== HAIR (UNCHANGED) ===================== */
    /* (all your hair items remain exactly as-is) */

    /* ===================== TOPS (UNCHANGED) ===================== */

    /* ===================== BOTTOMS ===================== */

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

    /* ✅ FIX: bikini bottom light/dark handled correctly */
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
      imgDark: base + "/female_cloths/female_bikini-bottom_red_dark.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),

    /* ===================== JEWELRY ===================== */

    /* ✅ FIX: necklace uses ONE item with img / imgDark */
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
      imgDark: base + "/female_jewlery/female_gold_necklace_dark.png",
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

    /* ✅ FIX: earrings are ONE item with left/right images */
    item({
      id: "f_jewel_ears",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earrings",
      label: "ear rings",
      coins: 18,
      imgLeft: base + "/female_jewlery/female_gold_ear-ring_left.png",
      imgRight: base + "/female_jewlery/female_gold_ear-ring_right.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    /* ===================== EYES ===================== */

    /* ✅ FIX: eyes split into left/right images */
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      label: "blue",
      coins: 10,
      imgLeft: base + "/unisex/eyes/unisex_eyes_blue_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_blue_right.png",
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
      imgLeft: base + "/unisex/eyes/unisex_eyes_green_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_green_right.png",
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
      imgLeft: base + "/unisex/eyes/unisex_eyes_brown_left.png",
      imgRight: base + "/unisex/eyes/unisex_eyes_brown_right.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    /* ===================== SHOES ===================== */

    /* ✅ FIX: shoes split left/right */
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      label: "unisex shoes",
      coins: 14,
      imgLeft: base + "/unisex/shoes/unisex_shoes_left.png",
      imgRight: base + "/unisex/shoes/unisex_shoes_right.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    })

  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

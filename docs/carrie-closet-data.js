// carrie-closet-data.js
// Static closet catalog using your actual image paths / names.

(function () {
  const base = "assets/images";

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

    /* ================= EXISTING ITEMS — UNCHANGED ================= */
    /* (Your full existing list remains exactly the same) */

    /* ================= NEW: FEMALE EARRINGS (SPLIT) ================= */

    item({
      id: "f_ears_light_left",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earring (Light • Left)",
      label: "ear ring left",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_left.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    item({
      id: "f_ears_light_right",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earring (Light • Right)",
      label: "ear ring right",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_right.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    item({
      id: "f_ears_dark_left",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earring (Dark • Left)",
      label: "ear ring left",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_left_dark.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    item({
      id: "f_ears_dark_right",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earring (Dark • Right)",
      label: "ear ring right",
      coins: 18,
      img: base + "/female_jewlery/female_gold_ear-ring_right_dark.png",
      scale: 0.85,
      offsetX: 0,
      offsetY: -8
    }),

    /* ================= NEW: EYES (SPLIT) ================= */

    item({
      id: "u_eyes_light_left",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Eyes (Light • Left)",
      label: "eyes left",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_left_light.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    item({
      id: "u_eyes_light_right",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Eyes (Light • Right)",
      label: "eyes right",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_right_light.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    item({
      id: "u_eyes_dark_left",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Eyes (Dark • Left)",
      label: "eyes left",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_left_dark.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    item({
      id: "u_eyes_dark_right",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Eyes (Dark • Right)",
      label: "eyes right",
      coins: 10,
      img: base + "/unisex/eyes/unisex_eyes_right_dark.png",
      scale: 0.28,
      offsetX: 0,
      offsetY: -18
    }),

    /* ================= NEW: SHOES (SPLIT) ================= */

    item({
      id: "u_shoes_light_left",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneaker (Light • Left)",
      label: "shoe left",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoe_left_light.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),

    item({
      id: "u_shoes_light_right",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneaker (Light • Right)",
      label: "shoe right",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoe_right_light.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),

    item({
      id: "u_shoes_dark_left",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneaker (Dark • Left)",
      label: "shoe left",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoe_left_dark.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }),

    item({
      id: "u_shoes_dark_right",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneaker (Dark • Right)",
      label: "shoe right",
      coins: 14,
      img: base + "/unisex/shoes/unisex_shoe_right_dark.png",
      scale: 1,
      offsetX: 0,
      offsetY: 0
    })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

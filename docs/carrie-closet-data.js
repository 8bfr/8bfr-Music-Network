// carrie-closet-data.js
// Static closet catalog with global cache-busting (never fight cache again)

(function () {
  const base = "assets/images";

  // 🔑 CHANGE THIS NUMBER ONLY when assets don't update
  const ASSET_VER = "?v=5";

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
        imgDark: "",
        thumb: "",
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      opts
    );
  }

  const items = [

    // ── FEMALE HAIR (STRAIGHT) ──
    item({ id:"f_hair_straight_blonde", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Blonde", label:"straight • blonde",
      img: base+"/hair/straight/female_straight_blonde.png"+ASSET_VER }),

    item({ id:"f_hair_straight_brown", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Brown", label:"straight • brown",
      img: base+"/hair/straight/female_straight_brown.png"+ASSET_VER }),

    item({ id:"f_hair_straight_black", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Black", label:"straight • black",
      img: base+"/hair/straight/female_straight_black.png"+ASSET_VER }),

    // ── FEMALE HAIR (WAVY) ──
    item({ id:"f_hair_wavy_blonde", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Blonde", label:"wavy • blonde",
      img: base+"/hair/wavy/female_wavy_blonde.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_black", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Black", label:"wavy • black",
      img: base+"/hair/wavy/female_wavy_black.png"+ASSET_VER }),

    // ── TOPS ──
    item({
      id: "u_top_tank",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tank Top",
      label: "unisex tank",
      img: base + "/unisex/cloths/unisex_tank-top_v5.png" + ASSET_VER
    }),

    item({
      id: "u_top_tee",
      gender: "unisex",
      category: "top",
      cat: "top",
      slot: "top",
      name: "8BFR Tee",
      label: "unisex tee",
      img: base + "/unisex/cloths/unisex_tee-shirt.png" + ASSET_VER
    }),

    item({
      id: "f_top_bikini_red",
      gender: "female",
      category: "top",
      cat: "top",
      slot: "top",
      name: "Red Bikini Top",
      label: "bikini top • red",
      img: base + "/female_cloths/female_bikini-top_red.png" + ASSET_VER
    }),

    // ── BOTTOMS ──
    item({
      id: "f_bottom_bikini_red",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Red Bikini Bottom",
      label: "bikini bottom • red",
      img: base + "/female_cloths/female_bikini-bottom_redv2.png" + ASSET_VER,
      imgDark: base + "/female_cloths/female_bikini-bottom_red_dark.png" + ASSET_VER
    }),

    // ── EYES ──
    item({
      id: "u_eyes_blue",
      gender: "unisex",
      category: "eyes",
      cat: "eyes",
      slot: "eyes",
      name: "Blue Eyes",
      img: base + "/unisex/eyes/unisex_eyes_blue.png" + ASSET_VER
    }),

    // ── SHOES ──
    item({
      id: "u_shoes_sneakers",
      gender: "unisex",
      category: "shoes",
      cat: "shoes",
      slot: "shoes",
      name: "Sneakers",
      img: base + "/unisex/shoes/unisex_shoes.png" + ASSET_VER
    })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

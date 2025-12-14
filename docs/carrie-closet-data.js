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

    item({ id:"f_hair_straight_copper", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Copper", label:"straight • copper",
      img: base+"/hair/straight/female_straight_copper.png"+ASSET_VER }),

    item({ id:"f_hair_straight_ginger", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Ginger", label:"straight • ginger",
      img: base+"/hair/straight/female_straight_ginger.png"+ASSET_VER }),

    item({ id:"f_hair_straight_pastel_blue", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Pastel Blue", label:"straight • pastel blue", rarity:"epic",
      img: base+"/hair/straight/female_straight_pastel_blue.png"+ASSET_VER }),

    item({ id:"f_hair_straight_pastel_pink", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Pastel Pink", label:"straight • pastel pink", rarity:"epic",
      img: base+"/hair/straight/female_straight_pastel_pink.png"+ASSET_VER }),

    item({ id:"f_hair_straight_pastel_purple", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Pastel Purple", label:"straight • pastel purple", rarity:"epic",
      img: base+"/hair/straight/female_straight_pastel_purple.png"+ASSET_VER }),

    item({ id:"f_hair_straight_platinum", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Platinum", label:"straight • platinum blonde", rarity:"legendary",
      img: base+"/hair/straight/female_straight_platinum_blonde.png"+ASSET_VER }),

    item({ id:"f_hair_straight_black", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Straight Black", label:"straight • black",
      img: base+"/hair/straight/female_straight_black.png"+ASSET_VER }),

    // ── FEMALE HAIR (WAVY) ──
    item({ id:"f_hair_wavy_blonde", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Blonde", label:"wavy • blonde",
      img: base+"/hair/wavy/female_wavy_blonde.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_brown", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Brown", label:"wavy • brown",
      img: base+"/hair/wavy/female_wavy_brown.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_copper", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Copper", label:"wavy • copper",
      img: base+"/hair/wavy/female_wavy_copper.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_ginger", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Ginger", label:"wavy • ginger",
      img: base+"/hair/wavy/female_wavy_ginger.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_pastel_blue", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Pastel Blue", label:"wavy • pastel blue", rarity:"epic",
      img: base+"/hair/wavy/female_wavy_pastel_blue.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_pastel_pink", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Pastel Pink", label:"wavy • pastel pink", rarity:"epic",
      img: base+"/hair/wavy/female_wavy_pastel_pink.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_pastel_purple", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Pastel Purple", label:"wavy • pastel purple", rarity:"epic",
      img: base+"/hair/wavy/female_wavy_pastel_purple.png"+ASSET_VER }),

    item({ id:"f_hair_wavy_platinum", gender:"female", category:"hair", cat:"hair", slot:"hair",
      name:"Wavy Platinum", label:"wavy • platinum blonde", rarity:"legendary",
      img: base+"/hair/wavy/female_wavy_platinum_blonde.png"+ASSET_VER }),

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
      id: "f_bottom_shorts",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Denim Shorts",
      label: "female shorts",
      img: base + "/female_cloths/female_shorts.png" + ASSET_VER
    }),

    item({
      id: "f_bottom_skirt",
      gender: "female",
      category: "bottom",
      cat: "bottom",
      slot: "bottom",
      name: "Mini Skirt",
      label: "female skirt",
      img: base + "/female_cloths/female_skirt.png" + ASSET_VER
    }),

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

    // ── JEWELRY (FEMALE) ──
    item({
      id: "f_jewel_necklace",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Necklace",
      label: "necklace",
      img: base + "/female_jewlery/female_gold_necklace.png" + ASSET_VER
    }),

    item({
      id: "f_jewel_belly",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "belly",
      name: "Belly Ring",
      label: "belly ring",
      img: base + "/female_jewlery/female_gold_belly-ring.png" + ASSET_VER
    }),

    item({
      id: "f_jewel_ears",
      gender: "female",
      category: "jewelry",
      cat: "jewelry",
      slot: "ears",
      name: "Gold Earrings",
      label: "ear rings",
      img: base + "/female_jewlery/female_gold_ear-ring.png" + ASSET_VER
    }),

    // ── JEWELRY (MALE) ──
    item({
      id: "m_jewel_necklace",
      gender: "male",
      category: "jewelry",
      cat: "jewelry",
      slot: "necklace",
      name: "Gold Chain",
      label: "male necklace",
      img: base + "/male_jewlery/male_gold_necklace.png" + ASSET_VER
    }),

    // ── EYES ──
    item({ id:"u_eyes_blue", gender:"unisex", category:"eyes", cat:"eyes", slot:"eyes",
      name:"Blue Eyes", label:"blue",
      img: base+"/unisex/eyes/unisex_eyes_blue.png"+ASSET_VER }),

    item({ id:"u_eyes_green", gender:"unisex", category:"eyes", cat:"eyes", slot:"eyes",
      name:"Green Eyes", label:"green",
      img: base+"/unisex/eyes/unisex_eyes_green.png"+ASSET_VER }),

    item({ id:"u_eyes_brown", gender:"unisex", category:"eyes", cat:"eyes", slot:"eyes",
      name:"Brown Eyes", label:"brown",
      img: base+"/unisex/eyes/unisex_eyes_brown.png"+ASSET_VER }),

    // ── SHOES ──
    item({ id:"u_shoes_sneakers", gender:"unisex", category:"shoes", cat:"shoes", slot:"shoes",
      name:"Sneakers", label:"unisex shoes",
      img: base+"/unisex/shoes/unisex_shoes.png"+ASSET_VER }),

    item({ id:"u_shoes_sandles", gender:"unisex", category:"shoes", cat:"shoes", slot:"shoes",
      name:"Sandals", label:"unisex sandals",
      img: base+"/unisex/shoes/unisex_sandles.png"+ASSET_VER })
  ];

  window.CARRIE_CLOSET_ITEMS = items;
})();

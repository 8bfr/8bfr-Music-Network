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
      img: base + "/hair/straight/female_straight_blonde.png?v=2",
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
      img: base + "/hair/straight/female_straight_brown.png?v=2",
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
      img: base + "/hair/straight/female_straight_copper.png?v=2",
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
      img: base + "/hair/straight/female_straight_ginger.png?v=2",
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
      img: base + "/hair/straight/female_straight_pastel_blue.png?v=2",
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
      img: base + "/hair/straight/female_straight_pastel_pink.png?v=2",
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
      img: base + "/hair/straight/female_straight_pastel_purple.png?v=2",
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
      img: base + "/hair/straight/female_straight_platinum_blonde.png?v=2",
      scale: 0.95,
      offsetX: 0,
      offsetY: -4
    }),
    // NEW: Straight Black hair
    item({
      id: "f_hair_straight_black",
      gender: "female",
      category: "hair",
      cat: "hair",
      slot: "hair",
      name: "Straight Black",
      label: "straight • black",
      coins: 18,
      img: base + "/hair/straight/female_straight_black.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_blonde.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_brown.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_copper.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_ginger.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_pastel_blue.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_pastel_pink.png?v=2",
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
      img: base + "/hair/wavy/female_wavy_pastel_purple.png?v=2",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3
    }),
    item({
      id: "f_hair_wavy_platinum",
      gender: "female",
      category

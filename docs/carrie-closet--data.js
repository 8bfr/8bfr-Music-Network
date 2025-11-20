// Global closet catalog used by carrie-closet.js
// Each item uses:
// id, name, category, categoryLabel, categoryEmoji, cost, tone, style, desc, tags[], order

window.CARRIE_CLOSET_ALL = [
  // ---------- FULL OUTFITS (conservative) ----------
  {
    id: "outfit-studio-blazer",
    name: "Studio Meeting Blazer Set",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "🧥",
    cost: 180,
    tone: "conservative",
    style: "business",
    desc: "Fitted blazer, soft blouse, and slim trousers — perfect for business Carrie / James.",
    tags: ["conservative","professional","studio","safe"],
    order: 1000
  },
  {
    id: "outfit-cozy-sweats",
    name: "Cozy Hoodie & Sweats",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "🩳",
    cost: 120,
    tone: "casual",
    style: "relaxed",
    desc: "Oversized hoodie with joggers and socks for late-night studio chat vibes.",
    tags: ["casual","chill","hoodie","unisex"],
    order: 990
  },
  {
    id: "outfit-denim-day",
    name: "Denim Day Fit",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "👖",
    cost: 150,
    tone: "casual",
    style: "street",
    desc: "Light denim jacket, graphic tee, and black jeans — safe but stylish.",
    tags: ["casual","street","safe"],
    order: 980
  },

  // ---------- FULL OUTFITS (spicier / sexy but still PG) ----------
  {
    id: "outfit-neon-club",
    name: "Neon Club Fit",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "✨",
    cost: 280,
    tone: "sexy",
    style: "party",
    desc: "Neon crop top with high-waist pants and glow strips, tuned for nightclub energy.",
    tags: ["sexy","party","night","neon"],
    order: 970
  },
  {
    id: "outfit-mini-dress",
    name: "Midnight Mini Dress",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "👗",
    cost: 320,
    tone: "sexy",
    style: "dressy",
    desc: "Little black dress with shimmer accents. Higher coin cost because it’s a ‘date night’ skin.",
    tags: ["sexy","dress","date-night"],
    order: 960
  },
  {
    id: "outfit-city-skirt-set",
    name: "City Skirt Set",
    category: "outfit",
    categoryLabel: "Full Outfit",
    categoryEmoji: "👜",
    cost: 260,
    tone: "sexy",
    style: "street",
    desc: "Cropped jacket, fitted top, and mini skirt with stockings — stylish but still PG.",
    tags: ["sexy","skirt","street"],
    order: 950
  },

  // ---------- TOPS ----------
  {
    id: "top-8bfr-tee-purple",
    name: "8BFR Logo Tee (Purple)",
    category: "top",
    categoryLabel: "Top",
    categoryEmoji: "👕",
    cost: 50,
    tone: "casual",
    style: "street",
    desc: "Classic fitted 8BFR tee in signature purple with chest logo.",
    tags: ["casual","logo","safe","starter"],
    order: 900
  },
  {
    id: "top-8bfr-hoodie-black",
    name: "8BFR Neon Hoodie (Black)",
    category: "top",
    categoryLabel: "Top",
    categoryEmoji: "🧥",
    cost: 90,
    tone: "casual",
    style: "street",
    desc: "Black hoodie with neon blue and purple 8BFR print. Streamer / gamer friendly.",
    tags: ["casual","hoodie","unisex","gamer"],
    order: 890
  },
  {
    id: "top-conservative-blouse",
    name: "Buttoned Silk Blouse",
    category: "top",
    categoryLabel: "Top",
    categoryEmoji: "👔",
    cost: 110,
    tone: "conservative",
    style: "business",
    desc: "Soft long-sleeve blouse with higher neckline for conservative looks.",
    tags: ["conservative","office","safe"],
    order: 880
  },
  {
    id: "top-crop-glow",
    name: "Neon Glow Crop Tee",
    category: "top",
    categoryLabel: "Top",
    categoryEmoji: "✨",
    cost: 170,
    tone: "sexy",
    style: "party",
    desc: "Short crop tee with neon trim — costs more coins because it’s a hotter look.",
    tags: ["sexy","crop-top","party"],
    order: 870
  },

  // ---------- BOTTOMS ----------
  {
    id: "bottom-skinny-jeans",
    name: "Dark Skinny Jeans",
    category: "bottom",
    categoryLabel: "Bottom",
    categoryEmoji: "👖",
    cost: 80,
    tone: "casual",
    style: "street",
    desc: "Simple dark wash jeans that match almost any top.",
    tags: ["casual","safe","unisex"],
    order: 860
  },
  {
    id: "bottom-highwaist-pants",
    name: "High-Waist Studio Trousers",
    category: "bottom",
    categoryLabel: "Bottom",
    categoryEmoji: "🩳",
    cost: 110,
    tone: "conservative",
    style: "business",
    desc: "Tailored trousers that work with blazers and conservative tops.",
    tags: ["conservative","studio","office"],
    order: 850
  },
  {
    id: "bottom-mini-skirt",
    name: "Side-Slit Mini Skirt",
    category: "bottom",
    categoryLabel: "Bottom",
    categoryEmoji: "🧷",
    cost: 190,
    tone: "sexy",
    style: "street",
    desc: "Short skirt with side slit. Still PG, but definitely a higher-coin flirt look.",
    tags: ["sexy","skirt","date-night"],
    order: 840
  },
  {
    id: "bottom-denim-shorts",
    name: "Distressed Denim Shorts",
    category: "bottom",
    categoryLabel: "Bottom",
    categoryEmoji: "🩳",
    cost: 140,
    tone: "sexy",
    style: "casual",
    desc: "Cut-off denim shorts for summer and beach-adjacent fits.",
    tags: ["sexy","shorts","summer"],
    order: 830
  },

  // ---------- SWIM / BEACH ----------
  {
    id: "swim-onepiece",
    name: "Classic One-Piece Swimsuit",
    category: "swim",
    categoryLabel: "Swim",
    categoryEmoji: "🏊",
    cost: 220,
    tone: "sexy",
    style: "swim",
    desc: "One-piece swimsuit with subtle 8BFR logo. Safer but still beach-ready.",
    tags: ["swim","beach","sexy-lite"],
    order: 820
  },
  {
    id: "swim-bikini-neon",
    name: "Neon Trim Bikini",
    category: "swim",
    categoryLabel: "Swim",
    categoryEmoji: "🌴",
    cost: 360,
    tone: "sexy",
    style: "swim",
    desc: "Two-piece bikini with neon straps. One of the most expensive skins in the closet.",
    tags: ["sexy","bikini","premium"],
    order: 810
  },
  {
    id: "swim-coverup",
    name: "Sheer Beach Cover-Up",
    category: "swim",
    categoryLabel: "Swim",
    categoryEmoji: "🩱",
    cost: 190,
    tone: "sexy",
    style: "swim",
    desc: "Light cover-up that can be worn over swimsuits or with shorts.",
    tags: ["sexy","beach","layer"],
    order: 800
  },

  // ---------- ACCESSORIES ----------
  {
    id: "acc-neon-headphones",
    name: "8BFR Neon Headphones",
    category: "accessory",
    categoryLabel: "Accessory",
    categoryEmoji: "🎧",
    cost: 130,
    tone: "casual",
    style: "studio",
    desc: "Glowing purple-blue headphones — perfect for producer / gamer looks.",
    tags: ["studio","gamer","music"],
    order: 790
  },
  {
    id: "acc-sunglasses-black",
    name: "Blackout Shades",
    category: "accessory",
    categoryLabel: "Accessory",
    categoryEmoji: "🕶️",
    cost: 150,
    tone: "sexy",
    style: "street",
    desc: "Dark sunglasses for mysterious club and streetwear fits.",
    tags: ["sexy","street","club"],
    order: 780
  },
  {
    id: "acc-stud-earrings",
    name: "Simple Stud Earrings",
    category: "accessory",
    categoryLabel: "Accessory",
    categoryEmoji: "💎",
    cost: 70,
    tone: "conservative",
    style: "minimal",
    desc: "Tiny stud earrings that add shine without changing the whole vibe.",
    tags: ["conservative","minimal","safe"],
    order: 770
  },
  {
    id: "acc-chain",
    name: "8BFR Chain",
    category: "accessory",
    categoryLabel: "Accessory",
    categoryEmoji: "⛓️",
    cost: 160,
    tone: "casual",
    style: "street",
    desc: "Gold or silver 8BFR chain pendant — rapper / street creator energy.",
    tags: ["street","rapper","unisex"],
    order: 760
  },

  // ---------- COSMETICS: HAIR ----------
  {
    id: "hair-long-brown",
    name: "Long Brown Waves",
    category: "cosmetic",
    categoryLabel: "Hair",
    categoryEmoji: "💇‍♀️",
    cost: 140,
    tone: "casual",
    style: "hair",
    desc: "Soft long brown hair with loose waves. Good for friendly girlfriend Carrie.",
    tags: ["hair","casual","safe"],
    order: 750
  },
  {
    id: "hair-bob-black",
    name: "Sharp Black Bob",
    category: "cosmetic",
    categoryLabel: "Hair",
    categoryEmoji: "💇‍♀️",
    cost: 160,
    tone: "conservative",
    style: "hair",
    desc: "Short straight bob that fits business and studio modes.",
    tags: ["hair","conservative","office"],
    order: 740
  },
  {
    id: "hair-braids",
    name: "Long Braids",
    category: "cosmetic",
    categoryLabel: "Hair",
    categoryEmoji: "💇‍♀️",
    cost: 190,
    tone: "casual",
    style: "hair",
    desc: "Stylish long braids that work with casual and party outfits.",
    tags: ["hair","braids","street"],
    order: 730
  },

  // ---------- COSMETICS: EYES ----------
  {
    id: "eyes-brown-soft",
    name: "Soft Brown Eyes",
    category: "cosmetic",
    categoryLabel: "Eyes",
    categoryEmoji: "👁️",
    cost: 60,
    tone: "casual",
    style: "eyes",
    desc: "Warm, friendly brown eye color — default girlfriend / boyfriend mood.",
    tags: ["eyes","safe"],
    order: 720
  },
  {
    id: "eyes-blue-icy",
    name: "Icy Blue Eyes",
    category: "cosmetic",
    categoryLabel: "Eyes",
    categoryEmoji: "👁️",
    cost: 90,
    tone: "sexy",
    style: "eyes",
    desc: "Sharp blue eye color that stands out in darker outfits.",
    tags: ["eyes","sexy"],
    order: 710
  },
  {
    id: "eyes-emerald",
    name: "Emerald Green Eyes",
    category: "cosmetic",
    categoryLabel: "Eyes",
    categoryEmoji: "👁️",
    cost: 110,
    tone: "sexy",
    style: "eyes",
    desc: "Bright green eyes that pop with neon and party fits.",
    tags: ["eyes","sexy","rare"],
    order: 700
  },

  // ---------- COSMETICS: SKIN TONE ----------
  {
    id: "skin-light-neutral",
    name: "Skin Tone — Light Neutral",
    category: "cosmetic",
    categoryLabel: "Skin",
    categoryEmoji: "🧴",
    cost: 0,
    tone: "base",
    style: "skin",
    desc: "One of the default skin palettes. Always available at zero cost.",
    tags: ["skin","base","free"],
    order: 690
  },
  {
    id: "skin-medium-warm",
    name: "Skin Tone — Medium Warm",
    category: "cosmetic",
    categoryLabel: "Skin",
    categoryEmoji: "🧴",
    cost: 0,
    tone: "base",
    style: "skin",
    desc: "Medium warm tone — another default palette for all avatars.",
    tags: ["skin","base","free"],
    order: 680
  },
  {
    id: "skin-deep-rich",
    name: "Skin Tone — Deep Rich",
    category: "cosmetic",
    categoryLabel: "Skin",
    categoryEmoji: "🧴",
    cost: 0,
    tone: "base",
    style: "skin",
    desc: "Deep rich tone — free base option so everyone is represented.",
    tags: ["skin","base","free"],
    order: 670
  }
];

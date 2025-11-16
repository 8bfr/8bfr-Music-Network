// carrie-closet.js
// Handles outfit selection + preview for Carrie Closet

(function () {
  const previewVideo = document.getElementById("carriePreview");
  const labelEl      = document.getElementById("currentOutfitLabel");
  const detailEl     = document.getElementById("currentOutfitDetail");
  const gridEl       = document.getElementById("outfitGrid");

  if (!previewVideo || !labelEl || !detailEl || !gridEl) return;

  // We only have 2 actual video assets, so:
  // - outfits mapped to "casual" use carrie_casual_animate_3_1.webm
  // - outfits mapped to "business" use carrie_business_animate.webm
  const VIDEO_BY_KEY = {
    casual: "assets/videos/carrie_casual_animate_3_1.webm",
    business: "assets/videos/carrie_business_animate.webm",
  };

  const OUTFITS = [
    {
      id: "neon_casual",
      key: "casual",
      name: "Neon Casual 8BFR FAN",
      price: "Free",
      free: true,
      makeup: "soft glam lilac highlight, glossy lips",
      hair: "violet ponytail with neon blue streaks",
      eyes: "teal eyes with subtle shimmer",
      accessories: "8BFR FAN holo earrings, neon wristband",
      clothes:
        "black crop hoodie with bold “8BFR FAN” print across the chest, matching joggers",
    },
    {
      id: "business_boss",
      key: "business",
      name: "Business Boss 8BFR FAN",
      price: "Free",
      free: true,
      makeup: "clean boss-liner, matte mauve lips",
      hair: "sleek dark-brown straight hair, side part",
      eyes: "hazel eyes with light gold shimmer",
      accessories:
        "8BFR FAN lanyard pass, subtle gold 8 logo necklace, slim headset mic",
      clothes:
        "tailored purple blazer over black top with small chest patch that reads “8BFR FAN”, dark slacks",
    },
    {
      id: "concert_neon",
      key: "casual",
      name: "Concert Neon 8BFR FAN (Coming Soon)",
      price: "Locked • 250 Coins",
      free: false,
      makeup: "stage-ready glitter under-eye, bold liner",
      hair: "electric pink space-buns with glowing tips",
      eyes: "bright amber eyes",
      accessories:
        "8BFR FAN glowstick, wrist holo-pass, LED ankle strap synced to the beat",
      clothes:
        "iridescent bomber jacket with a huge back print “8BFR FAN TOUR”, mini skirt with side taping logo",
    },
    {
      id: "cozy_hoodie",
      key: "casual",
      name: "Cozy Hoodie 8BFR FAN (Coming Soon)",
      price: "Locked • 150 Coins",
      free: false,
      makeup: "barely-there cozy look, soft blush",
      hair: "messy bun with loose curls",
      eyes: "warm brown eyes",
      accessories:
        "oversized 8BFR FAN mug, fuzzy socks with tiny 8 icons on the sides",
      clothes:
        "oversized charcoal hoodie with pastel “8BFR FAN” embroidered across the front, soft lounge pants",
    },
    {
      id: "retro_arcade",
      key: "casual",
      name: "Retro Arcade 8BFR FAN (Coming Soon)",
      price: "Locked • 200 Coins",
      free: false,
      makeup: "retro eyeliner with soft peach lip",
      hair: "short bob with teal tips",
      eyes: "grey eyes with pixel reflection highlight",
      accessories:
        "8-bit 8BFR FAN pin set, retro game controller keychain, neon visor",
      clothes:
        "color-block bomber jacket with pixel “8BFR FAN” logo, high-waisted jeans with side-stripe",
    },
    {
      id: "lofi_study",
      key: "business",
      name: "Lo-Fi Study 8BFR FAN (Coming Soon)",
      price: "Locked • 200 Coins",
      free: false,
      makeup: "soft smudged liner, muted rose lip",
      hair: "loose wavy hair with clip-on 8BFR barrette",
      eyes: "deep green eyes",
      accessories:
        "8BFR FAN notebook, pen behind the ear, small headphones resting around neck",
      clothes:
        "knit cardigan over t-shirt that says “8BFR FAN MODE: STUDY”, comfy jeans",
    },
  ];

  function outfitToDetailText(o) {
    return (
      o.makeup +
      " • " +
      o.hair +
      " • " +
      o.eyes +
      " • " +
      o.clothes +
      " • Accessories: " +
      o.accessories
    );
  }

  function applyOutfit(outfit) {
    const videoSrc = VIDEO_BY_KEY[outfit.key] || VIDEO_BY_KEY.casual;

    previewVideo.src = videoSrc;
    try {
      previewVideo.play().catch(() => {});
    } catch {}

    labelEl.textContent = outfit.name;
    detailEl.textContent = outfitToDetailText(outfit);

    // Save basic key so other pages / future Carrie avatar can read it
    try {
      localStorage.setItem("carrie_outfit", outfit.key);
      localStorage.setItem("carrie_outfit_id", outfit.id);
    } catch {}

    // If global Carrie exposes an API, sync the outfit key
    if (window._8bfrCarrie && typeof window._8bfrCarrie.setOutfit === "function") {
      window._8bfrCarrie.setOutfit(outfit.key);
    }
  }

  function renderOutfits() {
    gridEl.innerHTML = "";

    OUTFITS.forEach((o) => {
      const card = document.createElement("div");
      card.className =
        "rounded-xl border bg-black/40 p-3 flex flex-col gap-2 " +
        (o.free
          ? "border-purple-500/60"
          : "border-purple-500/30 opacity-75");

      const headerRow = document.createElement("div");
      headerRow.className = "flex items-center justify-between gap-2";

      const left = document.createElement("div");
      const title = document.createElement("div");
      title.className = "text-sm font-semibold";
      title.textContent = o.name;

      const subtitle = document.createElement("div");
      subtitle.className = "text-[11px] text-purple-200/80";
      subtitle.textContent =
        "Makeup, hair, eyes & “8BFR FAN” outfit style.";

      left.appendChild(title);
      left.appendChild(subtitle);

      const badge = document.createElement("span");
      badge.className =
        "badge " +
        (o.free
          ? "bg-emerald-800/40 border-emerald-400/80 text-emerald-100"
          : "bg-gray-800/60 border-gray-400/60 text-gray-200");
      badge.textContent = o.price;

      headerRow.appendChild(left);
      headerRow.appendChild(badge);

      const detail = document.createElement("div");
      detail.className = "text-[11px] text-purple-300/80";
      detail.textContent = outfitToDetailText(o);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn mt-1 " + (o.free ? "btn-primary" : "");
      button.textContent = o.free ? "Wear this" : "Unlock in Shop (soon)";
      if (!o.free) {
        button.disabled = true;
        button.style.opacity = "0.8";
        button.style.cursor = "not-allowed";
      } else {
        button.addEventListener("click", () => applyOutfit(o));
      }

      card.appendChild(headerRow);
      card.appendChild(detail);
      card.appendChild(button);

      gridEl.appendChild(card);
    });
  }

  function initFromSaved() {
    let savedId = null;
    try {
      savedId = localStorage.getItem("carrie_outfit_id");
    } catch {}
    const match = OUTFITS.find((o) => o.id === savedId && o.free);
    if (match) {
      applyOutfit(match);
    } else {
      // default to first free outfit (neon casual)
      const firstFree = OUTFITS.find((o) => o.free) || OUTFITS[0];
      applyOutfit(firstFree);
    }
  }

  renderOutfits();
  initFromSaved();
})();

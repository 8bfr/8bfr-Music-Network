// docs/scripts.js
// Handles:
// - Hero rotating text (index only)
// - Featured ads carousel + swipe + modals (index only)
// - Global floating menu (all pages)
// - Carrie avatar (all pages) – draggable + tap opens carrie-chat
// - Floating Contact + Donate bubbles (all pages)

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    setupHero();
    setupAdsCarousel();
    setupAdFormModal();
    setupHowAdsModal();
    injectGlobalUI(); // menu + Carrie + bubbles
  });

  // ---------------- HERO TEXT ----------------
  function setupHero() {
    const el = document.getElementById("line");
    if (!el) return;
    const lines = [
      "Game Tournaments (Win Free Coins)",
      "Music Studio — AI Lyrics & AI Beat Creator (Artists & Beatmakers)",
      "AI Post Creator with Voiceover (Influencers)",
      "AI Helper for Authors",
      "Mirror Your Streams from Other Sites",
      "Seller Options • Group 7 (G7) Perks",
      "Carrie — AI Chat & Helper",
      "Explore the site to find all features",
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      el.textContent = lines[i];
    }, 4800);
  }

  // ---------------- ADS CAROUSEL ----------------
  function setupAdsCarousel() {
    const track = document.getElementById("adTrack");
    const prev = document.getElementById("adPrev");
    const next = document.getElementById("adNext");
    const pause = document.getElementById("adPause");
    if (!track || !prev || !next || !pause) return;

    const ads = [
      { img: "assets/images/ad_banner_1.jpg", url: "#" },
      { img: "assets/images/ad_banner_2.jpg", url: "#" },
      { img: "assets/images/ad_banner_3.jpg", url: "#" },
      { img: "assets/images/ad_banner_4.jpg", url: "#" },
      { img: "assets/images/ad_banner_5.jpg", url: "#" },
    ];

    let i = 0;
    let paused = false;
    let t = null;

    function slide(idx) {
      i = (idx + ads.length) % ads.length;
      const old = track.querySelector(".ad-slide.show");

      const a = document.createElement("a");
      a.className = "ad-slide";
      a.href = ads[i].url || "#";
      a.target = "_blank";
      a.rel = "noopener";

      const img = new Image();
      img.src = ads[i].img;
      img.alt = "Ad banner";
      a.appendChild(img);

      track.appendChild(a);
      requestAnimationFrame(() => a.classList

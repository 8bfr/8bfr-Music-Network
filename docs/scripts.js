// 8BFR Music Network – site behaviors
document.addEventListener("DOMContentLoaded", function () {
  // Floating menu
  const hamburger = document.getElementById("hamburger-btn");
  const avatar = document.getElementById("carrie-avatar");
  const panel = document.getElementById("floating-menu-panel");

  function togglePanel() {
    if (!panel) return;
    panel.classList.toggle("hidden");
    panel.classList.toggle("visible");
  }

  [hamburger, avatar].forEach(btn => {
    if (btn) btn.addEventListener("click", e => {
      e.stopPropagation();
      togglePanel();
    });
  });

  document.addEventListener("click", e => {
    if (!panel) return;
    if (
      !panel.contains(e.target) &&
      !avatar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      panel.classList.add("hidden");
      panel.classList.remove("visible");
    }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Ads modal logic
  const infoBtn = document.getElementById("ads-info-btn");
  const buyBtn = document.getElementById("ads-buy-btn");
  const modal = document.getElementById("ads-modal");
  const backdrop = document.getElementById("ads-modal-backdrop");
  const closeBtns = document.querySelectorAll("[data-close-ads-modal]");

  const openModal = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };
  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  if (infoBtn) infoBtn.addEventListener("click", openModal);
  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
  if (backdrop) backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const subject = encodeURIComponent("Buy an Ad on 8BFR Music Network");
      const body = encodeURIComponent(
        [
          "Hey 8BFR,",
          "",
          "I want to buy an ad on 8BFR Music Network.",
          "",
          "Artist/Brand Name:",
          "What I'm promoting:",
          "Links (music / socials / site):",
          "Preferred start date:",
          "Budget range:",
          "",
          "Thanks!"
        ].join("\n")
      );
      window.location.href = `mailto:8bfr.music@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  console.log("8BFR scripts loaded — menu, ads, and Carrie active.");
});

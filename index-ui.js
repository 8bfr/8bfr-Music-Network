// ===============================
// index-ui.js — 8BFR Avatar Switcher for index.html only
// ===============================

(function () {
  const switcher = document.getElementById("avatarSwitcher");
  if (!switcher) return;

  // Make switcher visible (overrides any global hide)
  switcher.style.display = "flex";

  // Avatar IDs
  const AVATAR_KEYS = ["carrie", "james", "azreen"];
  const AVATAR_IDS = {
    carrie: "avatar-carrie",
    james: "avatar-james",
    azreen: "avatar-azreen",
  };

  function getStoredAvatar() {
    try {
      const raw = localStorage.getItem("carrie_avatar");
      if (!raw) return "carrie";
      const a = raw.toLowerCase();
      if (AVATAR_KEYS.includes(a)) return a;
    } catch (e) {}
    return "carrie";
  }

  function setStoredAvatar(name) {
    try {
      localStorage.setItem("carrie_avatar", name);
    } catch (e) {}
  }

  let currentAvatar = getStoredAvatar();

  function setActiveAvatar(name) {
    currentAvatar = AVATAR_KEYS.includes(name) ? name : "carrie";

    AVATAR_KEYS.forEach((k) => {
      const vid = document.getElementById(AVATAR_IDS[k]);
      if (!vid) return;
      if (k === currentAvatar) {
        vid.classList.add("active");
        try {
          vid.muted = true;
          vid.autoplay = true;
          vid.playsInline = true;
          vid.play().catch(() => {});
        } catch {}
      } else {
        vid.classList.remove("active");
        try {
          vid.pause();
        } catch {}
      }
    });

    // Highlight active button
    switcher.querySelectorAll("button[data-avatar]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.avatar === currentAvatar);
    });

    setStoredAvatar(currentAvatar);
  }

  // Init
  setActiveAvatar(currentAvatar);

  // Button clicks
  switcher.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-avatar]");
    if (!btn) return;
    const name = btn.dataset.avatar;
    if (!AVATAR_KEYS.includes(name)) return;
    setActiveAvatar(name);
  });

  // Keep in sync with other tabs
  window.addEventListener("storage", (ev) => {
    if (ev.key === "carrie_avatar") {
      currentAvatar = getStoredAvatar();
      setActiveAvatar(currentAvatar);
    }
  });
})();

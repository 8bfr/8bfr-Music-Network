// index-ui.js — only loaded on index.html
document.addEventListener("DOMContentLoaded", function() {
  const switcher = document.getElementById("homeAvatarSwitcher");
  if (!switcher) return;

  // Make sure it's visible (overrides any global hide)
  switcher.style.display = "flex";

  // Optional: highlight selected avatar
  const buttons = switcher.querySelectorAll("button[data-avatar-choice]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("bg-purple-500/80"));
      btn.classList.add("bg-purple-500/80");
      localStorage.setItem("homeAvatar", btn.dataset.avatarChoice);
    });

    // Load previous selection
    if (btn.dataset.avatarChoice === localStorage.getItem("homeAvatar")) {
      btn.classList.add("bg-purple-500/80");
    }
  });
});

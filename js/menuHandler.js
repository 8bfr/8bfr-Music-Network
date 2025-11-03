/* === Menu Access Control === */
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userBadges = user.badges || [];

  document.querySelectorAll("#main-menu a[data-badge]").forEach(link => {
    const allowed = link.getAttribute("data-badge").split(",");
    const hasAccess = allowed.some(b => userBadges.includes(b)) || user.role === "owner";
    if (!hasAccess) {
      link.classList.add("locked");
      link.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "/docs/shop-upgrades.html";
      });
    }
  });
});

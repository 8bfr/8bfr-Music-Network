// ✅ loadPartials.js — fixed version
document.addEventListener("DOMContentLoaded", async () => {
  // Prevent duplicate loading
  if (window.__partialsLoaded) return;
  window.__partialsLoaded = true;

  try {
    // Load NAV
    const nav = await fetch("partials/nav.html");
    const navHtml = await nav.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load FOOTER
    const footer = await fetch("partials/footer.html");
    const footerHtml = await footer.text();
    document.body.insertAdjacentHTML("beforeend", footerHtml);

    console.log("✅ Partials loaded once successfully");
  } catch (err) {
    console.error("⚠️ Error loading partials:", err);
  }
});

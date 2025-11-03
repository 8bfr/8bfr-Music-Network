document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect if hosted on GitHub Pages
    const base = window.location.pathname.includes("/8bfr-Music-Network/")
      ? "/8bfr-Music-Network/docs/"
      : "/docs/";

    const navUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    // Load NAV
    const nav = await fetch(navUrl);
    if (!nav.ok) throw new Error(`Nav fetch failed (${nav.status})`);
    const navHtml = await nav.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load FOOTER
    const footer = await fetch(footerUrl);
    if (footer.ok) {
      const footerHtml = await footer.text();
      document.body.insertAdjacentHTML("beforeend", footerHtml);
    }

    console.log("✅ Loaded nav & footer from", base);
  } catch (err) {
    console.error("⚠️ Failed to load partials:", err);
  }
});

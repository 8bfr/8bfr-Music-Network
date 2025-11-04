document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect GitHub Pages base path dynamically
    const base = window.location.pathname.includes("/8bfr-Music-Network/")
      ? "/8bfr-Music-Network/"
      : "/";

    // Make sure we always look in the docs folder for the menu and footer
    const menuUrl = base + "docs/menu.html";
    const footerUrl = base + "partials/footer.html";

    // Load menu
    const menuResp = await fetch(menuUrl);
    if (!menuResp.ok) throw new Error(`Menu fetch failed (${menuResp.status})`);
    const menuHtml = await menuResp.text();
    document.body.insertAdjacentHTML("afterbegin", menuHtml);

    // Load footer (if exists)
    const footerResp = await fetch(footerUrl);
    if (footerResp.ok) {
      const footerHtml = await footerResp.text();
      document.body.insertAdjacentHTML("beforeend", footerHtml);
    }

    console.log("✅ Loaded menu & footer successfully from:", base);
  } catch (err) {
    console.error("⚠️ Failed to load partials:", err);
  }
});

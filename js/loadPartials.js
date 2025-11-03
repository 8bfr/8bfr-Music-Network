document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect base path for GitHub Pages
    const base = window.location.pathname.includes("/8bfr-Music-Network/") ? "/8bfr-Music-Network/docs/" : "/docs/";

    // Load the menu (instead of nav.html)
    const menuUrl = base + "menu.html";
    const footerUrl = base + "../partials/footer.html";

    // Fetch and insert menu
    const menuResp = await fetch(menuUrl);
    if (!menuResp.ok) throw new Error(`Menu fetch failed (${menuResp.status})`);
    const menuHtml = await menuResp.text();
    document.body.insertAdjacentHTML("afterbegin", menuHtml);

    // Fetch and insert footer
    const footerResp = await fetch(footerUrl);
    if (footerResp.ok) {
      const footerHtml = await footerResp.text();
      document.body.insertAdjacentHTML("beforeend", footerHtml);
    }

    console.log("✅ Menu and footer loaded successfully");
  } catch (err) {
    console.error("⚠️ Error loading menu/footer:", err);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect GitHub Pages base path
    const base = window.location.pathname.includes("/8bfr-Music-Network/") ? "/8bfr-Music-Network/docs/" : "/docs/";
    const navUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    // Load NAV
    const navResp = await fetch(navUrl);
    if (!navResp.ok) throw new Error(`Menu fetch failed (${navResp.status})`);
    const navHtml = await navResp.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load FOOTER
    const footerResp = await fetch(footerUrl);
    if (!footerResp.ok) throw new Error(`Footer fetch failed (${footerResp.status})`);
    const footerHtml = await footerResp.text();
    document.body.insertAdjacentHTML("beforeend", footerHtml);

    console.log("✅ Loaded nav & footer from", base);
  } catch (err) {
    console.error("⚠️ Failed to load partials:", err);
  }
});

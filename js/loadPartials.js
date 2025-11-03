document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect correct base path (GitHub Pages or local)
    let base = "/";
    if (window.location.hostname.includes("github.io")) {
      base = "/8bfr-Music-Network/";
    }

    const navUrl = `${base}partials/nav.html`;
    const footerUrl = `${base}partials/footer.html`;

    console.log("🔍 Trying to load:", navUrl, footerUrl);

    // Load NAV
    const navResp = await fetch(navUrl);
    if (!navResp.ok) throw new Error(`Nav fetch failed (${navResp.status})`);
    const navHtml = await navResp.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load FOOTER
    const footResp = await fetch(footerUrl);
    if (!footResp.ok) throw new Error(`Footer fetch failed (${footResp.status})`);
    const footerHtml = await footResp.text();
    document.body.insertAdjacentHTML("beforeend", footerHtml);

    console.log("✅ Loaded nav & footer successfully from:", base);
  } catch (err) {
    console.error("⚠️ Failed to load partials:", err);
  }
});

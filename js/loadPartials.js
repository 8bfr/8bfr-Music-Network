document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect if we're on GitHub Pages or local
    const base = window.location.pathname.includes("/8bfr-Music-Network/")
      ? "/8bfr-Music-Network/docs/"
      : "/docs/";

    const menuUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    // Load the menu
    const navResp = await fetch(menuUrl);
    if (!navResp.ok) throw new Error(`Failed to load menu (${navResp.status})`);
    const navHtml = await navResp.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load footer if exists
    const footResp = await fetch(footerUrl);
    if (footResp.ok) {
      const footHtml = await footResp.text();
      document.body.insertAdjacentHTML("beforeend", footHtml);
    }

    console.log("✅ Loaded menu & footer from", base);
  } catch (err) {
    console.error("⚠️ Failed to load menu/footer:", err);
  }
});

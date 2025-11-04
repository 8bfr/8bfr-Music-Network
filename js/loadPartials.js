document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Always use /docs/ for GitHub Pages
    const base = "/8bfr-Music-Network/docs/";
    const menuUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    // Debug helper box
    const debugBox = document.createElement("div");
    debugBox.style.cssText = `
      position:fixed;bottom:10px;left:10px;z-index:9999;
      background:rgba(0,0,0,0.7);color:#00ffcc;
      padding:6px 10px;border-radius:8px;font-size:12px;
      font-family:monospace;`;
    debugBox.textContent = "🧠 Fetching: " + menuUrl;
    document.body.appendChild(debugBox);

    // Fetch and insert menu
    const navResp = await fetch(menuUrl);
    if (!navResp.ok) throw new Error(`Menu failed (${navResp.status})`);
    const navHtml = await navResp.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);
    debugBox.textContent = "✅ Menu loaded from " + menuUrl;

    // Fetch and insert footer
    const footResp = await fetch(footerUrl);
    if (footResp.ok) {
      const footHtml = await footResp.text();
      document.body.insertAdjacentHTML("beforeend", footHtml);
    }
  } catch (err) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div style='color:red;position:fixed;bottom:10px;left:10px;'>❌ ${err}</div>`
    );
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const base = window.location.pathname.includes("/8bfr-Music-Network/")
      ? "/8bfr-Music-Network/docs/"
      : "/docs/";

    const menuUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    // Show debug info on screen
    const debugBox = document.createElement("div");
    debugBox.style.cssText = `
      position:fixed;bottom:10px;left:10px;z-index:9999;
      background:rgba(0,0,0,0.7);color:#00ffcc;
      padding:6px 10px;border-radius:8px;font-size:12px;
      font-family:monospace;`;
    debugBox.textContent = "🧠 Trying: " + menuUrl;
    document.body.appendChild(debugBox);

    const navResp = await fetch(menuUrl);
    if (!navResp.ok) {
      debugBox.textContent = `⚠️ Menu failed (${navResp.status}) from ${menuUrl}`;
      throw new Error(`Failed to load menu (${navResp.status})`);
    }
    const navHtml = await navResp.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);
    debugBox.textContent = "✅ Menu loaded from " + menuUrl;

    const footResp = await fetch(footerUrl);
    if (footResp.ok) {
      const footHtml = await footResp.text();
      document.body.insertAdjacentHTML("beforeend", footHtml);
    }
  } catch (err) {
    document.body.insertAdjacentHTML("afterbegin", `<div style="color:red;">❌ ${err}</div>`);
  }
});

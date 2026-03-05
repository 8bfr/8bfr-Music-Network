document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menuUrl  = "/menu.html?v=2";
    const footerUrl = "/footer.html?v=2";

    // Insert menu at top
    const navResp = await fetch(menuUrl);
    if (navResp.ok) {
      const navHtml = await navResp.text();
      document.body.insertAdjacentHTML("afterbegin", navHtml);
    }

    // Insert footer at bottom
    const footResp = await fetch(footerUrl);
    if (footResp.ok) {
      const footHtml = await footResp.text();
      document.body.insertAdjacentHTML("beforeend", footHtml);
    }
  } catch (err) {
    console.warn("load-partials:", err);
  }
});

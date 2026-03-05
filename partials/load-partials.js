document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Only load footer - menu/nav is handled by scripts.js
    const footResp = await fetch("/footer.html?v=2");
    if (footResp.ok) {
      const footHtml = await footResp.text();
      document.body.insertAdjacentHTML("beforeend", footHtml);
    }
  } catch (err) {
    console.warn("load-partials:", err);
  }
});

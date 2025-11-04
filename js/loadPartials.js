document.addEventListener("DOMContentLoaded", async () => {
  try {
    const base = window.location.pathname.includes("/8bfr-Music-Network/") 
      ? "/8bfr-Music-Network/docs/" 
      : "/docs/";

    const navUrl = base + "menu.html";
    const footerUrl = base + "footer.html";

    const nav = await fetch(navUrl);
    if (!nav.ok) throw new Error(`Nav load failed: ${nav.status}`);
    document.body.insertAdjacentHTML("afterbegin", await nav.text());

    const footer = await fetch(footerUrl);
    if (!footer.ok) throw new Error(`Footer load failed: ${footer.status}`);
    document.body.insertAdjacentHTML("beforeend", await footer.text());

    console.log("✅ Loaded menu & footer from", base);
  } catch (err) {
    console.error("⚠️ Failed to load menu/footer:", err);
  }
});

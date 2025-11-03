document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Auto-detect GitHub Pages base path
    const base = window.location.pathname.includes("/8bfr-Music-Network/") ? "/8bfr-Music-Network/" : "/";
    const navCandidates = [base + "partials/menu.html", base + "partials/nav.html"];
    const footerUrl = base + "partials/footer.html";

    let navHtml = "";
    for (const url of navCandidates) {
      const resp = await fetch(url);
      if (resp.ok) {
        navHtml = await resp.text();
        console.log(`✅ Loaded navigation from ${url}`);
        break;
      }
    }

    if (!navHtml) throw new Error("❌ Neither menu.html nor nav.html found!");

    document.body.insertAdjacentHTML("afterbegin", navHtml);

    // Load FOOTER
    const footer = await fetch(footerUrl);
    if (footer.ok) {
      const footerHtml = await footer.text();
      document.body.insertAdjacentHTML("beforeend", footerHtml);
      console.log(`✅ Loaded footer from ${footerUrl}`);
    } else {
      console.warn(`⚠️ Footer not found at ${footerUrl}`);
    }

  } catch (err) {
    console.error("⚠️ Failed to load partials:", err);
  }
});

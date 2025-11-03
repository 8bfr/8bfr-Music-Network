document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Detect correct base path (works for GitHub Pages)
    const base = window.location.pathname.includes("/8bfr-Music-Network/") ? "/8bfr-Music-Network/" : "/";
    const navUrl = base + "partials/nav.html";
    const nav = await fetch(navUrl);
    const navHtml = await nav.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);
    console.log("✅ Loaded nav from", navUrl);
  } catch (err) {
    console.error("⚠️ Failed to load nav:", err);
  }
});

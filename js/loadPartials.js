document.addEventListener("DOMContentLoaded", async () => {
  try {
    const nav = await fetch("/partials/nav.html");
    const navHtml = await nav.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);
  } catch (err) {
    console.error("⚠️ Failed to load nav:", err);
  }
});

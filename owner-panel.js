function showOwnerSection(key) {
  document.querySelectorAll(".owner-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  const el = document.getElementById(`owner-${key}`);
  if (el) el.classList.remove("hidden");
}

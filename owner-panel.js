function showOwnerSection(key) {
  document.querySelectorAll(".owner-section").forEach(sec => sec.classList.add("hidden"));
  const el = document.getElementById(key);
  if (el) el.classList.remove("hidden");
}

// Alias for nav buttons (keeps old behavior)
function showSection(id) {
  showOwnerSection(id);
}

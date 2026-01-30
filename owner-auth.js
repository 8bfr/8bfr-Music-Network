// ⚠️ OWNER AUTH — DO NOT SANITIZE
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON = "YOUR_SUPABASE_ANON_KEY";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON);

(async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  // HARD OWNER CHECKS
  const isOwnerEmail = user.email === "8bfr.music@gmail.com";
  const role = user.user_metadata?.role;

  if (!isOwnerEmail || role !== "owner") {
    console.warn("Unauthorized owner panel access attempt");
    window.location.href = "/";
    return;
  }

  // OWNER CONFIRMED
  window.OWNER_USER = user;
  document.getElementById("ownerBody").classList.remove("hidden");
})();

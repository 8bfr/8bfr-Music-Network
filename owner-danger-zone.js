const ADMIN_DANGER_API = "https://PROJECT_ID.functions.supabase.co/admin-danger";

async function logoutAll(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  await fetch(ADMIN_DANGER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "logout-all", payload: {} })
  });

  alert("All users logged out!");
}

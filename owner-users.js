const ADMIN_USERS_API = "https://PROJECT_ID.functions.supabase.co/admin-users";

async function fetchUsers(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_USERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "list-users", payload: {} })
  });
  const data = await res.json();
  const container = document.getElementById('users');
  container.innerHTML = '<h2>Users</h2>' + data.map(u => `<div>${u.email} - ${u.role}</div>`).join('');
}

fetchUsers();

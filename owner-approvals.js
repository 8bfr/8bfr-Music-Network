const ADMIN_APPROVALS_API = "https://PROJECT_ID.functions.supabase.co/admin-approvals";

async function fetchApprovals(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_APPROVALS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "list-pending", payload: {} })
  });

  const data = await res.json();
  document.getElementById('approvals').innerHTML = '<h2>Pending Approvals</h2>' + data.map(u=>`<div>${u.email} - ${u.requestedRole}</div>`).join('');
}

fetchApprovals();

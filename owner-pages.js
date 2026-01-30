const ADMIN_PAGES_API = "https://PROJECT_ID.functions.supabase.co/admin-pages";

async function fetchPages(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_PAGES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "list-pages", payload: {} })
  });

  const data = await res.json();
  document.getElementById('pages').innerHTML = '<h2>Pages</h2>' + data.map(p=>`<div>${p.title} - ${p.slug}</div>`).join('');
}

fetchPages();

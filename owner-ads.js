const ADMIN_ADS_API = "https://PROJECT_ID.functions.supabase.co/admin-ads";

async function fetchAds(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_ADS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "list-ads", payload: {} })
  });

  const data = await res.json();
  document.getElementById('ads').innerHTML = '<h2>Ads</h2>' + data.map(a=>`<div>${a.title} - ${a.status}</div>`).join('');
}

fetchAds();

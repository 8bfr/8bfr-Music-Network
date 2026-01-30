const ADMIN_DISCOUNTS_API = "https://PROJECT_ID.functions.supabase.co/admin-discounts";

async function fetchDiscounts(){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_DISCOUNTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "list-codes", payload: {} })
  });

  const data = await res.json();
  document.getElementById('discounts').innerHTML = '<h2>Discount Codes</h2>' + data.map(c=>`<div>${c.code} - ${c.percent || c.amount}%</div>`).join('');
}

fetchDiscounts();

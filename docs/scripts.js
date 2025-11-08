// Minimal helpers + Supabase placeholders (replace keys as needed)
const SUPABASE_URL="https://qjzcoybmcrmonzjctama.supabase.co";
const SUPABASE_ANON_KEY="84af9f28b30df5230d52cd0d4de26c8394de3ef318761ed1fe99ab6ef5f6cf3b";
const sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
async function api(path,method="GET",query="",body=null){const url=new URL(`${SUPABASE_URL}/rest/v1/${path}${query}`);const r=await fetch(url,{method,headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Prefer":"return=representation"},body:body?JSON.stringify(body):null});if(!r.ok)throw new Error(await r.text());return r.json()}
async function getPosts(){try{const p=await api("posts","GET","?select=*&order=created_at.desc&limit=20");const el=document.getElementById("feed");if(!el)return;el.innerHTML=p.map(x=>`<div class="card"><b>@${x.username}</b><p>${x.text||""}</p></div>`).join("")}catch(e){console.error(e)}}
window._8bfr={api,getPosts};console.log("8BFR scripts.js loaded");
// Load global floating menu + Carrie everywhere
(function(){
  var s = document.createElement('script');
  s.src = 'global-ui.js'; s.defer = true;
  document.head.appendChild(s);
})();
(function(){
  var s = document.createElement('script');
  s.src = 'global-ui.js'; s.defer = true;
  document.head.appendChild(s);
})();

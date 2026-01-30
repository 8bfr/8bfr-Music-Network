const ADMIN_EDITOR_API = "https://PROJECT_ID.functions.supabase.co/admin-editor";

async function loadPage(slug){
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  const res = await fetch(ADMIN_EDITOR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "get-page", payload: { slug } })
  });
  const data = await res.json();
  document.getElementById('editor').innerHTML = `<h2>Editing ${slug}</h2><textarea id="editor-content" class="w-full h-96 bg-black text-white">${data.content}</textarea><button onclick="savePage('${slug}')">Save</button>`;
}

async function savePage(slug){
  const content = document.getElementById('editor-content').value;
  const session = await supabase.auth.getSession();
  const token = session.data.session.access_token;

  await fetch(ADMIN_EDITOR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ action: "save-page", payload: { slug, content } })
  });
  alert("Saved!");
}

// ⚠️ OWNER USER CONTROL — ROOT ONLY
// Requires owner-auth.js to have set window.OWNER_USER

const USERS_SECTION = document.getElementById("owner-users");

USERS_SECTION.innerHTML = `
  <h2 class="text-2xl font-bold mb-4">User Management</h2>

  <div class="mb-6 space-y-2">
    <input id="newEmail" placeholder="Email" class="bg-zinc-800 p-2 rounded w-full">
    <input id="newPassword" placeholder="Temp Password" class="bg-zinc-800 p-2 rounded w-full">
    <select id="newRole" class="bg-zinc-800 p-2 rounded w-full">
      <option value="user">User</option>
      <option value="artist">Artist</option>
      <option value="beatmaker">Beatmaker</option>
      <option value="admin">Admin</option>
      <option value="owner">Owner</option>
    </select>
    <button onclick="createUser()" class="bg-purple-600 px-4 py-2 rounded">
      Create User
    </button>
  </div>

  <hr class="border-zinc-700 mb-4" />

  <div id="userList" class="space-y-3"></div>
`;

// Supabase admin edge (requires service role via function)
const ADMIN_API = "/supabase-admin"; // your existing edge/function proxy

async function loadUsers() {
  const res = await fetch(`${ADMIN_API}/list-users`);
  const users = await res.json();

  const list = document.getElementById("userList");
  list.innerHTML = "";

  users.forEach(u => {
    list.innerHTML += `
      <div class="border border-zinc-800 p-3 rounded">
        <div class="text-sm">
          <strong>${u.email}</strong><br>
          Role: ${u.role}
        </div>

        <div class="mt-2 space-x-2 text-xs">
          <button onclick="promoteUser('${u.id}', 'admin')" class="bg-zinc-700 px-2 py-1 rounded">Promote</button>
          <button onclick="demoteUser('${u.id}')" class="bg-zinc-700 px-2 py-1 rounded">Demote</button>
          <button onclick="resetPassword('${u.id}')" class="bg-zinc-700 px-2 py-1 rounded">Reset PW</button>
          <button onclick="banUser('${u.id}')" class="bg-red-600 px-2 py-1 rounded">Ban</button>
          <button onclick="deleteUser('${u.id}')" class="bg-red-800 px-2 py-1 rounded">Delete</button>
        </div>
      </div>
    `;
  });
}

// ---- ACTIONS ----

async function createUser() {
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("newRole").value;

  await fetch(`${ADMIN_API}/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role })
  });

  loadUsers();
}

async function promoteUser(id, role) {
  await fetch(`${ADMIN_API}/set-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, role })
  });
  loadUsers();
}

async function demoteUser(id) {
  await promoteUser(id, "user");
}

async function resetPassword(id) {
  await fetch(`${ADMIN_API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  alert("Password reset email sent");
}

async function banUser(id) {
  await fetch(`${ADMIN_API}/ban-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm("Delete this user permanently?")) return;

  await fetch(`${ADMIN_API}/delete-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadUsers();
}

// INIT
loadUsers();

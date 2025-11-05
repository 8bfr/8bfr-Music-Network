async function loadShop() {
  const { data } = await supabase.from("carrie_shop_items").select("*");
  const container = document.querySelector("#shopItems");
  container.innerHTML = data.map(item => `
    <div class="shop-item">
      <img src="${item.image_url}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price_coins} 🪙</p>
      <button onclick="buyItem(${item.id}, '${item.name}', ${item.price_coins})">Buy</button>
    </div>
  `).join("");
}

async function buyItem(id, name, cost) {
  const user = supabase.auth.user();
  const { data: wallet } = await supabase.from("user_wallets").select("coins").eq("user_id", user.id).single();
  if (wallet.coins < cost) return alert("Not enough coins!");
  await supabase.rpc("deduct_coins", { uid: user.id, amount: cost });
  await supabase.from("user_inventory").insert({ user_id: user.id, item_id: id });
  alert(`Purchased ${name}!`);
}
window.addEventListener("load", loadShop);

export async function showWallet(user) {
  const { data } = await supabase.from("user_wallets").select("*").eq("user_id", user.id).single();
  const balance = data?.coins ?? 0;
  const publicFlag = data?.is_balance_public ?? true;
  const display = publicFlag ? `🪙 ${balance.toLocaleString()} coins` : "🔒 Hidden";
  document.querySelector("#walletDisplay").innerHTML = display;
}

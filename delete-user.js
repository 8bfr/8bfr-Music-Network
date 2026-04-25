const { createClient } = require("@supabase/supabase-js");

// Service role key MUST come from environment variable - never hardcode
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
}

const supabaseAdmin = createClient(
  "https://novbuvwpjnxwwvdekjhr.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OWNER_ID = "cb556180-f032-4b21-9470-1d786f2664ab";

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { user_id, requester_id } = req.body;

    if (!user_id || !requester_id) {
      return res.status(400).json({ error: "Missing user_id or requester_id" });
    }

    // Only owner can delete users
    if (requester_id !== OWNER_ID) {
      return res.status(403).json({ error: "Owner access only" });
    }

    // Cannot delete the owner
    if (user_id === OWNER_ID) {
      return res.status(403).json({ error: "Cannot delete the owner account" });
    }

    // Step 1: Delete from all database tables
    const tables = [
      { table: "posts", column: "user_id" },
      { table: "comments", column: "user_id" },
      { table: "songs", column: "user_id" },
      { table: "stories", column: "user_id" },
      { table: "follows", column: "follower_id" },
      { table: "follows", column: "following_id" },
      { table: "friend_requests", column: "sender_id" },
      { table: "friend_requests", column: "receiver_id" },
      { table: "friends", column: "user_id" },
      { table: "friends", column: "friend_id" },
      { table: "notifications", column: "recipient_id" },
      { table: "notifications", column: "sender_id" },
      { table: "messages", column: "sender_id" },
      { table: "messages", column: "receiver_id" },
      { table: "likes", column: "user_id" },
      { table: "coin_transactions", column: "user_id" },
      { table: "group_members", column: "user_id" },
      { table: "page_likes", column: "user_id" },
      { table: "email_verifications", column: "user_id" },
      { table: "subscriptions", column: "user_id" },
      { table: "purchases", column: "user_id" },
      { table: "reports", column: "reporter_id" },
      { table: "reports", column: "reported_user_id" },
      { table: "playlist_tracks", column: "added_by" },
      { table: "playlists", column: "user_id" },
    ];

    const errors = [];
    for (const t of tables) {
      const { error } = await supabaseAdmin
        .from(t.table)
        .delete()
        .eq(t.column, user_id);
      // Table might not exist yet - that is fine, skip it
      if (error && !error.message.includes("does not exist") && !error.message.includes("relation")) {
        errors.push(t.table + "." + t.column + ": " + error.message);
      }
    }

    // Step 2: Delete profile (last, after all references)
    const { error: profError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("user_id", user_id);
    if (profError) errors.push("profiles: " + profError.message);

    // Step 3: Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (authError) {
      errors.push("auth: " + authError.message);
    }

    if (errors.length > 0) {
      return res.status(207).json({
        status: "partial",
        message: "User deleted with some warnings",
        warnings: errors,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User fully deleted from database and auth",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// api/delete-user.js
// Vercel serverless endpoint — deletes a user account (auth row + cascades public tables).
//
// SECURITY: Service role key MUST come from environment variable. Never hardcode.
// Set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars (use the sb_secret_... value).

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co';
const OWNER_ID = 'cb556180-f032-4b21-9470-1d786f2664ab';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SERVICE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY env var missing' });
  }

  const body = req.body || {};
  const user_id = body.user_id;
  const requester_id = body.requester_id;
  const access_token = body.access_token;

  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  if (user_id === OWNER_ID) return res.status(403).json({ error: 'Cannot delete the owner account' });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // Authorize
  if (access_token) {
    // SELF-DELETE PATH
    try {
      const { data, error } = await admin.auth.getUser(access_token);
      if (error || !data || !data.user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }
      if (data.user.id !== user_id) {
        return res.status(403).json({ error: 'Token does not match user_id' });
      }
    } catch (e) {
      return res.status(401).json({ error: 'Token verification failed: ' + e.message });
    }
  } else if (requester_id) {
    // OWNER ADMIN PATH
    if (requester_id !== OWNER_ID) {
      return res.status(403).json({ error: 'Owner access only' });
    }
  } else {
    return res.status(400).json({ error: 'Either access_token (self) or requester_id (owner) required' });
  }

  // Tables that exist in the 8BFR schema. Order matters: child tables before parents.
  // Tables that may not exist are pre-checked silently (no warnings).
  const tables = [
    { table: 'post_comments', col: 'user_id' },
    { table: 'post_likes', col: 'user_id' },
    { table: 'favorites', col: 'user_id' },
    { table: 'comments', col: 'user_id' },
    { table: 'likes', col: 'user_id' },
    { table: 'follows', col: 'follower_id' },
    { table: 'follows', col: 'following_id' },
    { table: 'friends', col: 'user_id' },
    { table: 'friends', col: 'friend_id' },
    { table: 'user_blocks', col: 'blocker_id' },
    { table: 'user_blocks', col: 'blocked_id' },
    { table: 'notifications', col: 'recipient_id' },
    { table: 'notifications', col: 'sender_id' },
    { table: 'messages', col: 'sender_id' },
    { table: 'messages', col: 'receiver_id' },
    { table: 'stories', col: 'user_id' },
    { table: 'posts', col: 'user_id' },
    { table: 'songs', col: 'uploaded_by' },
    { table: 'song_purchases', col: 'buyer_id' },
    { table: 'coin_transactions', col: 'user_id' },
    { table: 'transactions', col: 'user_id' },
    { table: 'group_members', col: 'user_id' },
    { table: 'user_owned_items', col: 'user_id' },
    { table: 'email_verifications', col: 'user_id' },
    { table: 'reports', col: 'reporter_id' },
    { table: 'reports', col: 'reported_user_id' },
    { table: 'playlist_tracks', col: 'added_by' },
    { table: 'playlists', col: 'user_id' },
    { table: 'referrals', col: 'referrer_id' },
    { table: 'referrals', col: 'referred_id' },
    { table: 'profiles', col: 'user_id' }
  ];

  const warnings = [];
  for (const t of tables) {
    try {
      const { error } = await admin.from(t.table).delete().eq(t.col, user_id);
      if (error) {
        // Silently ignore "table doesn't exist" type errors — only show real problems
        const msg = error.message || '';
        if (!/does not exist|relation|schema cache|not find the table/i.test(msg)) {
          warnings.push(t.table + '.' + t.col + ': ' + msg);
        }
      }
    } catch (e) {
      // Silently ignore connection-type errors per table — keep going
    }
  }

  // Delete the auth.users row (frees email for re-signup)
  let authStatus = 'success';
  try {
    const { error: authErr } = await admin.auth.admin.deleteUser(user_id);
    if (authErr) {
      // "User not found" means already gone — count as success
      if (/not found/i.test(authErr.message)) {
        authStatus = 'already_deleted';
      } else {
        return res.status(207).json({
          status: 'partial',
          message: 'Public data deleted but auth deletion failed',
          warnings: warnings,
          auth_error: authErr.message
        });
      }
    }
  } catch (e) {
    return res.status(500).json({ error: 'Auth delete failed: ' + e.message, warnings });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Account fully deleted',
    auth_status: authStatus,
    warnings: warnings.length > 0 ? warnings : null
  });
}

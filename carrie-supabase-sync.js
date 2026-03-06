// carrie-supabase-sync.js
// Loads BEFORE carrie-chat.js
// Pulls coins + owned items from Supabase into the localStorage keys
// that carrie-chat.js already reads, so nothing in carrie-chat.js breaks.
// Also patches saveCoins / saveOwnedItems so writes go to both places.

(function () {
  var SUPABASE_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0';
  var OWNER_ID     = 'cb556180-f032-4b21-9470-1d786f2664ab';

  // localStorage keys — must match carrie-chat.js exactly
  var COINS_KEY     = 'carrieCoins_v1';
  var OWNERSHIP_KEY = 'carrieOwnedItems_v1';

  var db   = null;
  var user = null;

  // ── Wait for Supabase library ──────────────────────────────────
  function waitForSupabase(cb) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (window.supabase && window.supabase.createClient) {
        clearInterval(timer);
        cb();
      } else if (attempts > 50) {
        clearInterval(timer);
        console.warn('[carrie-sync] Supabase not available — using localStorage only');
      }
    }, 100);
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    try {
      db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      var sessionRes = await db.auth.getSession();
      user = sessionRes.data.session ? sessionRes.data.session.user : null;
    } catch (e) {
      console.warn('[carrie-sync] Auth error:', e);
      return;
    }

    if (!user) {
      console.log('[carrie-sync] No session — localStorage only');
      return;
    }

    var isOwner = user.id === OWNER_ID;

    // ── Pull coins from Supabase ──
    try {
      var coinRes = await db
        .from('profiles')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      if (!coinRes.error && coinRes.data) {
        var supaCoins = isOwner ? 999999999 : (coinRes.data.coins || 0);
        localStorage.setItem(COINS_KEY, supaCoins.toString());
        console.log('[carrie-sync] Coins synced from Supabase:', supaCoins);
      }
    } catch (e) {
      console.warn('[carrie-sync] Coin sync error:', e);
    }

    // ── Pull owned items from Supabase ──
    try {
      if (isOwner) {
        // Owner owns everything — handled inside carrie-chat.js autoUnlock
        console.log('[carrie-sync] Owner — skipping owned items sync');
      } else {
        var itemsRes = await db
          .from('user_owned_items')
          .select('item_id')
          .eq('user_id', user.id);

        if (!itemsRes.error && itemsRes.data) {
          var ids = itemsRes.data.map(function (r) { return r.item_id; });
          localStorage.setItem(OWNERSHIP_KEY, JSON.stringify(ids));
          console.log('[carrie-sync] Owned items synced from Supabase:', ids.length);
        }
      }
    } catch (e) {
      console.warn('[carrie-sync] Owned items sync error:', e);
    }

    // ── Expose helpers for carrie-chat.js and shop.html ──────────
    window.CARRIE_SYNC = {
      db: db,
      user: user,
      isOwner: isOwner,

      // Call this after a coin spend to update Supabase
      pushCoins: async function (newBalance) {
        if (!db || !user) return;
        try {
          await db
            .from('profiles')
            .update({ coins: newBalance })
            .eq('user_id', user.id);
        } catch (e) {
          console.warn('[carrie-sync] pushCoins error:', e);
        }
      },

      // Call this after an item purchase to record in Supabase
      pushOwnedItem: async function (itemId, itemName, coinsPaid) {
        if (!db || !user) return;
        if (isOwner) return; // owner never needs records
        try {
          await db.rpc('purchase_item_with_coins', {
            p_item_id:   itemId,
            p_item_type: 'closet',
            p_item_name: itemName,
            p_coins_cost: coinsPaid
          });
        } catch (e) {
          console.warn('[carrie-sync] pushOwnedItem error:', e);
        }
      },

      // Check if user is logged in via Supabase
      isLoggedIn: function () { return !!user; }
    };

    console.log('[carrie-sync] Ready. Owner:', isOwner);
  }

  // Kick off after Supabase library is available
  waitForSupabase(function () { init(); });
})();

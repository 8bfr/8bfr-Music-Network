// api/automod.js
// POST /api/automod
// Body: { text, content_type, user_id, content_id }
// Returns: { flagged, severity, reason, action }
// Actions: 'none', 'warn', 'report' (never auto-bans)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var body = req.body || {};
  var text = (body.text || '').trim();
  var contentType = body.content_type || 'message';
  var userId = body.user_id || '';
  var contentId = body.content_id || '';

  if (!text) return res.status(200).json({ flagged: false, action: 'none' });

  var OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(200).json({ flagged: false, action: 'none', note: 'No AI key' });

  try {
    // Use OpenAI moderation endpoint first (free, fast)
    var modRes = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OPENAI_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: text })
    });

    var modData = await modRes.json();
    var result = modData.results && modData.results[0];

    if (!result) {
      return res.status(200).json({ flagged: false, action: 'none' });
    }

    // Check if flagged by OpenAI moderation
    if (result.flagged) {
      var categories = result.categories || {};
      var scores = result.category_scores || {};
      var flaggedCats = [];

      for (var cat in categories) {
        if (categories[cat]) flaggedCats.push(cat);
      }

      // Determine severity
      var severity = 'low';
      var action = 'warn';

      // High severity - always report to owner
      var highSeverity = [
        'sexual/minors',
        'hate/threatening',
        'violence/graphic',
        'self-harm/intent',
        'self-harm/instructions'
      ];

      // Medium severity - warn user + report
      var medSeverity = [
        'hate',
        'harassment/threatening',
        'violence',
        'self-harm'
      ];

      for (var i = 0; i < flaggedCats.length; i++) {
        if (highSeverity.indexOf(flaggedCats[i]) !== -1) {
          severity = 'high';
          action = 'report';
          break;
        }
        if (medSeverity.indexOf(flaggedCats[i]) !== -1) {
          severity = 'medium';
          action = 'report';
        }
      }

      // Low severity (harassment, sexual) - just warn
      if (severity === 'low') {
        action = 'warn';
      }

      var reason = 'Content flagged for: ' + flaggedCats.join(', ');

      // Log to database
      try {
        var { createClient } = require('@supabase/supabase-js');
        var supabase = createClient(
          process.env.SUPABASE_URL || 'https://novbuvwpjnxwwvdekjhr.supabase.co',
          process.env.SUPABASE_SERVICE_KEY || ''
        );

        // Log infraction
        await supabase.from('automod_log').insert({
          user_id: userId || null,
          content_type: contentType,
          content_id: contentId || null,
          text_snippet: text.substring(0, 300),
          categories: flaggedCats,
          severity: severity,
          action_taken: action,
          scores: scores
        });

        // Notify owner for medium/high severity
        if (action === 'report') {
          var OWNER_ID = 'cb556180-f032-4b21-9470-1d786f2664ab';

          // Get username
          var userName = 'Unknown user';
          if (userId) {
            try {
              var { data: prof } = await supabase.from('profiles')
                .select('display_name,username')
                .eq('user_id', userId).single();
              if (prof) userName = prof.display_name || prof.username;
            } catch(e) {}
          }

          await supabase.from('notifications').insert({
            recipient_id: OWNER_ID,
            notif_type: 'chat_moderation',
            metadata: {
              title: 'AutoMod: ' + severity.toUpperCase() + ' severity',
              body: userName + ' - ' + reason + ': "' + text.substring(0, 80) + '..."',
              from_name: 'AutoMod',
              from_id: userId,
              link: 'owner-monitor.html',
              message: reason
            }
          });
        }
      } catch(dbErr) {
        console.error('AutoMod DB error:', dbErr);
      }

      return res.status(200).json({
        flagged: true,
        severity: severity,
        categories: flaggedCats,
        reason: reason,
        action: action,
        warning_message: action === 'warn'
          ? 'Your message may violate community guidelines. Please keep content respectful.'
          : 'This content has been flagged and reported for review. Repeated violations may result in account action.'
      });
    }

    // Not flagged
    return res.status(200).json({ flagged: false, action: 'none' });

  } catch (e) {
    console.error('AutoMod error:', e);
    // On error, allow the content through (don't block)
    return res.status(200).json({ flagged: false, action: 'none', note: 'Check failed' });
  }
};

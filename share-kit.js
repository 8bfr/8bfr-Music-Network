// api/share.js
// ═══════════════════════════════════════════════════════════
// 8BFR SHARE PREVIEW SERVICE
// ═══════════════════════════════════════════════════════════
// Server-renders Open Graph meta tags for social media previews.
// Deploy to Vercel at /api/share.js - accessible at:
//   https://8bfr-api.vercel.app/api/share?type=post&id=<uuid>
//   https://8bfr-api.vercel.app/api/share?type=song&id=<uuid>
//   https://8bfr-api.vercel.app/api/share?type=profile&id=<uuid>
//   https://8bfr-api.vercel.app/api/share?type=playlist&id=<uuid>
//
// - Scrapers (FB, Twitter, WhatsApp, Discord, iMessage, Slack, etc.)
//   get HTML with real OG tags pre-filled from Supabase data.
// - Real browsers get instantly redirected to the actual page on 8bfr.com.
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0';

// Scraper User-Agent patterns — if any match, we serve HTML with OG tags
// If none match, we assume it's a human and redirect to the real page
const SCRAPER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|bingbot|Googlebot|Applebot|SkypeUriPreview|pinterest|vkshare|redditbot|Snapchat|tumblr|embed|preview|curl|wget|Mastodon|fedi|Bluesky|Threads|SocialFlow/i;

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function supabaseQuery(table, params) {
  const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `${SUPABASE_URL}/rest/v1/${table}?${qs}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length ? data[0] : null;
}

async function getPost(id) {
  const post = await supabaseQuery('posts', {
    select: 'id,user_id,text,media,media_type,likes,comment_count,reshares,is_private,hidden,created_at',
    id: `eq.${id}`,
    limit: 1
  });
  if (!post || post.is_private || post.hidden) return null;
  const author = post.user_id ? await supabaseQuery('profiles', {
    select: 'user_id,username,display_name,avatar_url,verified_artist',
    user_id: `eq.${post.user_id}`,
    limit: 1
  }) : null;

  // Build OG image - prefer post media, fallback to YouTube thumbnail, fallback to 8bfr logo
  let ogImage = '';
  if (post.media) {
    if (post.media_type === 'image' || post.media_type === 'photo' || /\.(jpg|jpeg|png|gif|webp)/i.test(post.media)) {
      ogImage = post.media;
    } else {
      const yt = post.media.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
      if (yt) ogImage = `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;
    }
  }
  // Also check text field for YouTube URL
  if (!ogImage && post.text) {
    const yt = post.text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (yt) ogImage = `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;
  }

  const authorName = author ? (author.display_name || author.username || 'User') : 'Someone';
  const title = `${authorName} on 8BFR Music Network`;
  const description = (post.text || 'Check out this post on 8BFR Music Network').substring(0, 280);

  return {
    title,
    description,
    image: ogImage || 'https://8bfr.com/assets/final-image.jpg',
    canonical: `https://8bfr.com/post.html?id=${id}`,
    type: 'article',
    author: authorName
  };
}

async function getSong(id) {
  const song = await supabaseQuery('songs', {
    select: 'id,title,artist,cover_art,song_url,explicit,uploaded_by,dummy_id',
    id: `eq.${id}`,
    limit: 1
  });
  if (!song) return null;

  let artist = song.artist || 'Unknown';
  if (!song.artist && song.uploaded_by) {
    const p = await supabaseQuery('profiles', {
      select: 'username,display_name',
      user_id: `eq.${song.uploaded_by}`,
      limit: 1
    });
    if (p) artist = p.display_name || p.username || 'Unknown';
  }

  const title = `${song.title || 'Song'} — ${artist}`;
  const description = `Listen to "${song.title}" by ${artist} on 8BFR Music Network. Stream free with unlimited play.`;

  return {
    title,
    description,
    image: song.cover_art || 'https://8bfr.com/assets/final-image.jpg',
    canonical: `https://8bfr.com/song.html?id=${id}`,
    type: 'music.song',
    audioUrl: song.song_url
  };
}

async function getProfile(id) {
  const profile = await supabaseQuery('profiles', {
    select: 'user_id,username,display_name,avatar_url,bio,role,verified_artist',
    user_id: `eq.${id}`,
    limit: 1
  });
  if (!profile) return null;

  const name = profile.display_name || profile.username || 'User';
  const title = `${name} on 8BFR Music Network`;
  const description = profile.bio ? profile.bio.substring(0, 280) : `Follow ${name} on 8BFR - music, artists, community.`;

  return {
    title,
    description,
    image: profile.avatar_url || 'https://8bfr.com/assets/final-image.jpg',
    canonical: `https://8bfr.com/profile.html?id=${id}`,
    type: 'profile'
  };
}

async function getPlaylist(id) {
  const playlist = await supabaseQuery('playlists', {
    select: 'id,name,description,cover_url,user_id,visibility',
    id: `eq.${id}`,
    limit: 1
  });
  if (!playlist) return null;

  return {
    title: `${playlist.name || 'Playlist'} on 8BFR`,
    description: playlist.description || 'A music playlist on 8BFR Music Network',
    image: playlist.cover_url || 'https://8bfr.com/assets/final-image.jpg',
    canonical: `https://8bfr.com/playlist-details.html?id=${id}`,
    type: 'music.playlist'
  };
}

function renderHTML(meta, opts = {}) {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const img = escapeHtml(meta.image);
  const url = escapeHtml(meta.canonical);
  const type = escapeHtml(meta.type || 'website');

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t}</title>
<link rel="icon" href="https://8bfr.com/assets/images/favicon.png">

<!-- Open Graph (Facebook, LinkedIn, WhatsApp, iMessage, Discord, Slack) -->
<meta property="og:type" content="${type}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="8BFR Music Network">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<meta name="twitter:site" content="@8bfr">

<!-- Canonical -->
<link rel="canonical" href="${url}">

<!-- Fallback redirect for browsers that somehow don't run JS -->
<meta http-equiv="refresh" content="2; url=${url}">

<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(#0b0014,#000);color:#eae6ff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center;}
.box{max-width:520px;}
.cover{width:100%;max-width:380px;aspect-ratio:1;border-radius:16px;background:linear-gradient(135deg,#7c3aed,#a855f7);overflow:hidden;margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:4rem;}
.cover img{width:100%;height:100%;object-fit:cover;}
h1{font-size:1.4rem;font-weight:800;margin-bottom:.5rem;color:#eae6ff;}
.desc{color:rgba(234,230,255,.75);font-size:.95rem;margin-bottom:1.5rem;line-height:1.55;}
.btn{display:inline-block;background:#7c3aed;color:#fff;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 20px rgba(124,58,237,.4);}
.btn:hover{background:#6d28d9;}
.note{margin-top:1rem;font-size:.78rem;color:rgba(168,85,247,.6);}
.spinner{width:32px;height:32px;border:3px solid rgba(124,58,237,.25);border-top-color:#a855f7;border-radius:50%;animation:spin .7s linear infinite;margin:.75rem auto 0;}
@keyframes spin{to{transform:rotate(360deg);}}
</style>
</head>
<body>
<div class="box">
<div class="cover"><img src="${img}" alt="${t}" onerror="this.parentNode.innerHTML='🎵';"></div>
<h1>${t}</h1>
<div class="desc">${d}</div>
<a href="${url}" class="btn" id="openBtn">Open on 8BFR →</a>
<div class="note">Redirecting…</div>
<div class="spinner"></div>
</div>

<script>
// Instant redirect for real browsers (scrapers don't run JS, so they just see the OG tags above)
(function(){
  var url=${JSON.stringify(meta.canonical)};
  // Tiny delay so the OG meta parser (in case the scraper does run JS like some chat apps) gets a chance
  setTimeout(function(){ window.location.replace(url); }, 50);
})();
</script>
</body>
</html>`;
}

export default async function handler(req, res) {
  const { type, id } = req.query;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!type || !id) {
    return res.status(400).send('Missing type or id parameter. Usage: /api/share?type=post&id=<uuid>');
  }

  try {
    let meta = null;
    switch (type) {
      case 'post':     meta = await getPost(id); break;
      case 'song':     meta = await getSong(id); break;
      case 'profile':  meta = await getProfile(id); break;
      case 'playlist': meta = await getPlaylist(id); break;
      default: return res.status(400).send('Unknown type. Valid: post, song, profile, playlist');
    }

    if (!meta) {
      // Not found - still return 200 with generic OG so the shared link at least shows SOMETHING
      meta = {
        title: '8BFR Music Network',
        description: 'Discover music, artists, and community on 8BFR.',
        image: 'https://8bfr.com/assets/final-image.jpg',
        canonical: 'https://8bfr.com',
        type: 'website'
      };
    }

    // Cache at the CDN edge for 5 min - enough for scrapers to re-fetch updated posts
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(renderHTML(meta));
  } catch (e) {
    console.error('Share handler error:', e);
    return res.status(500).send('Share service error: ' + (e.message || 'unknown'));
  }
}

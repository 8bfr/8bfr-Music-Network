// ============================================================================
// CARRIE MEMORY & KNOWLEDGE BASE
// 8BFR Music Network AI Assistant
// ============================================================================
// This file contains all of Carrie's knowledge, Q&A patterns, and responses.
// Organized by topic for easy maintenance and expansion.
// ============================================================================

// Main knowledge array - used by carrie-chat.html
let carrieScripts = [

  // ========== PLATFORM BASICS ==========
  {
    id: "what_is_8bfr",
    patterns: [
      "what is 8bfr",
      "what is 8bfr music network",
      "tell me about 8bfr",
      "what is this site",
      "what is this website",
      "what do you do here"
    ],
    reply: `
      <b>8BFR Music Network</b> is a creator hub where artists, beatmakers, gamers,
      authors, and fans can <b>Create • Connect • Collab</b>.<br><br>
      You get:<br>
      • Profiles for artists, beatmakers, authors, and fans<br>
      • Studio &amp; AI tools for lyrics, songs, and more<br>
      • Games &amp; tournaments with coins and rewards<br>
      • Ads and features to promote your work<br><br>
      I'm Carrie — your AI guide for the whole network. 😊
    `
  },

  {
    id: "how_8bfr_works",
    patterns: [
      "how does 8bfr work",
      "how do i use 8bfr",
      "where do i start",
      "getting started",
      "im new here"
    ],
    reply: `
      Welcome! Here's how to get started:<br><br>
      1. <b>Sign up</b> and choose your profile type (Artist, Beatmaker, Author, Fan, etc.)<br>
      2. <b>Complete your profile</b> with links, bio, and avatar customization<br>
      3. <b>Explore tools</b> — Studio for music/lyrics, Games for coins, Shop for upgrades<br>
      4. <b>Connect</b> — use the Feed, Radio, and Community features<br>
      5. <b>Earn coins</b> through games, contests, and activity<br><br>
      Tell me what you want to do first and I'll guide you step-by-step!
    `
  },

  // ========== ACCOUNT & AUTH ==========
  {
    id: "signup_login",
    patterns: [
      "how do i sign up",
      "how do i create an account",
      "how do i join",
      "how do i log in",
      "i cant login",
      "i can't log in",
      "forgot my password",
      "reset my password",
      "create account"
    ],
    reply: `
      Here's how accounts work on 8BFR:<br><br>
      • <b>Sign up</b>: go to <a href="signup.html">signup.html</a> and create a free account<br>
      • <b>Log in</b>: use <a href="login.html">login.html</a> with your email and password<br>
      • <b>Forgot password</b>: use <a href="reset-password.html">reset-password.html</a><br><br>
      If you're still stuck, hit <b>Contact</b> from the floating menu or use <a href="contact.html">contact.html</a>.
    `
  },

  {
    id: "profile_setup",
    patterns: [
      "how do i set up my profile",
      "how do i edit my profile",
      "change my profile",
      "update profile",
      "profile settings"
    ],
    reply: `
      Your profile is your hub on 8BFR:<br><br>
      • Go to <a href="profile.html">profile.html</a> to edit<br>
      • Add your bio, links (Spotify, YouTube, Instagram, etc.)<br>
      • Choose your profile type: Artist, Beatmaker, Author, Influencer, or Fan<br>
      • Upload avatar and customize with the Closet<br>
      • Add your best work to Featured sections<br><br>
      Completed profiles get more visibility in Featured and search results!
    `
  },

  // ========== MUSIC & STUDIO ==========
  {
    id: "buy_8bfr_music",
    patterns: [
      "how do i purchase 8bfr music",
      "how do i buy 8bfr music",
      "where can i buy 8bfr",
      "how can i purchase 8bfr",
      "buy 8bfr music",
      "purchase 8bfr",
      "where can i buy your music",
      "how do i support 8bfr"
    ],
    reply: `
      You can support 8BFR by buying or streaming the music here:<br><br>
      • <b>Amazon Music</b> — search for "8BFR" in the Amazon Music store<br>
      • <b>Spotify</b> — <a href="https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x" target="_blank" rel="noopener">stream 8BFR here</a><br>
      • <b>Other platforms</b> — most 8BFR releases appear in Apple Music, YouTube Music, and more<br><br>
      If you tell me the <b>song title</b>, I can guide you where to look. 💜
    `
  },

  {
    id: "upload_music",
    patterns: [
      "how do i upload music",
      "how do i upload a song",
      "how do i post a track",
      "where do i upload beats",
      "share my music"
    ],
    reply: `
      Uploading music is handled through your <b>creator tools and profile</b> pages:<br><br>
      • Check <a href="studio-tools.html">Studio Tools</a> and <a href="artist-studio.html">Artist Studio</a> for upload areas<br>
      • Make sure you're logged in and your profile type is set correctly (Artist / Beatmaker)<br>
      • In early builds, uploads may be limited while we finish the backend — watch <a href="announcements.html">Announcements</a> for updates<br><br>
      If something feels broken, send a message via <a href="contact.html">Contact</a>.
    `
  },

  {
    id: "studio_tools",
    patterns: [
      "what are studio tools",
      "how do studio tools work",
      "ai studio",
      "lyric generator",
      "song creator",
      "music tools"
    ],
    reply: `
      <b>Studio Tools</b> give you AI-powered help for creating:<br><br>
      • <b>Lyric Generator</b> — get hooks, verses, and full song structures<br>
      • <b>Song Creator</b> — build tracks with AI assistance<br>
      • <b>Beat Analysis</b> — get feedback on BPM, structure, and mixing<br>
      • <b>Release Planner</b> — organize your distribution and promo<br><br>
      Visit <a href="studio-tools.html">Studio Tools</a> or <a href="artist-studio.html">Artist Studio</a> to explore.
      Each tool is specialized for your badge type (Artist, Beatmaker, etc.).
    `
  },

  {
    id: "lyrics_help",
    patterns: [
      "help me write lyrics",
      "lyric ideas",
      "how do i write a hook",
      "help with chorus",
      "verse ideas",
      "songwriting help"
    ],
    reply: `
      Let's build lyrics like a pro:<br><br>
      • Pick a <b>topic</b> (example: late nights, loyalty, comeback, heartbreak)<br>
      • Choose a <b>structure</b>: intro – hook – verse – hook – verse – hook<br>
      • For the hook, use 1–2 strong lines and repeat with a twist on the last bar<br><br>
      Tell me your topic + mood + a reference artist, and I'll help you draft a hook or verse blueprint.
      Or use the <a href="studio-tools.html">Lyric Generator</a> for AI-powered suggestions!
    `
  },

  {
    id: "beat_making",
    patterns: [
      "how do i make beats",
      "beatmaking tips",
      "bpm for trap",
      "drum patterns",
      "808 tips",
      "beat structure"
    ],
    reply: `
      For trap/rap beats:<br><br>
      • <b>BPM</b>: Usually 130–150 BPM (or 65–75 double-time)<br>
      • <b>Drums</b>: Start with clean 808 + clap + hi-hat pattern, then layer perks after<br>
      • <b>Melody</b>: Keep one element simple and repetitive so vocals have space<br>
      • <b>Structure</b>: Intro (4-8 bars) → Verse (16) → Hook (8) → Verse (16) → Hook (8) → Outro<br><br>
      Tell me your vibe (dark, melodic, rage, chill) and I'll suggest a BPM and layout for your next beat.
    `
  },

  // ========== GAMES & TOURNAMENTS ==========
  {
    id: "tournaments_games",
    patterns: [
      "how do tournaments work",
      "how do the games work",
      "how do i join a tournament",
      "what games do you have",
      "where are the tournaments",
      "game rules"
    ],
    reply: `
      Tournaments live under the <b>Games &amp; Tournaments</b> section:<br><br>
      • Visit <a href="game-hub.html">Game Hub</a> or <a href="game-tournaments.html">Tournaments</a> to see current events<br>
      • Pool and other games connect to <b>leaderboards</b> and coins<br>
      • Events, prizes, and dates are usually listed on <a href="announcements.html">Announcements</a><br><br>
      The goal is low-stress, fun competition — not sweaty esports. 😄
      Earn coins, climb the leaderboard, and unlock rewards!
    `
  },

  {
    id: "game_pool",
    patterns: [
      "how do i play pool",
      "pool game rules",
      "8 ball pool",
      "billiards game"
    ],
    reply: `
      <b>Pool Game</b> is one of the main games on 8BFR:<br><br>
      • Classic 8-ball rules<br>
      • Play against AI or other users<br>
      • Earn coins for wins and streaks<br>
      • Climb the leaderboard for prizes<br><br>
      Find it at <a href="game-hub.html">Game Hub</a> or <a href="game-tournaments.html">Tournaments</a>.
      Watch for special tournament events with bigger coin rewards!
    `
  },

  // ========== COINS & ECONOMY ==========
  {
    id: "coins_points",
    patterns: [
      "how do coins work",
      "how do points work",
      "what are coins",
      "what are points",
      "how do i earn coins",
      "how do i earn points",
      "what is the algorithm system",
      "algorithm points",
      "8bfr coins"
    ],
    reply: `
      8BFR uses <b>coins and points</b> to reward creators and fans:<br><br>
      • <b>Coins</b>: earned from games, contests, and events; spend them in the
        <a href="coinshop.html">Coin Shop</a> or <a href="shop-upgrades.html">Upgrades</a><br>
      • <b>Points / Algorithm</b>: activity across the site feeds into a points system explained on
        <a href="algorithm-points.html">Algorithm &amp; Points</a><br><br>
      Think of it as an XP system that rewards <b>real engagement</b>, not just spam posting.
      Post quality content, play games, help others, and earn rewards!
    `
  },

  {
    id: "coin_shop",
    patterns: [
      "what can i buy with coins",
      "coin shop",
      "what's in the shop",
      "spend coins",
      "avatar items"
    ],
    reply: `
      The <b>Coin Shop</b> lets you spend coins on:<br><br>
      • <b>Avatar customization</b> — clothes, hair, accessories, eyes (Carrie Closet)<br>
      • <b>Profile upgrades</b> — featured placement, badges, highlights<br>
      • <b>Concert access</b> — premium virtual concerts and events<br>
      • <b>Boosts</b> — temporary visibility or coin multipliers<br>
      • <b>Exclusive content</b> — early releases, behind-the-scenes, special downloads<br><br>
      Visit <a href="coinshop.html">Coin Shop</a> to browse current items!
    `
  },

  {
    id: "earn_coins_fast",
    patterns: [
      "how do i earn coins fast",
      "fastest way to get coins",
      "quick coins",
      "coin farming"
    ],
    reply: `
      Want coins fast? Here's how:<br><br>
      • <b>Daily games</b> — play Pool or other games for consistent coin rewards<br>
      • <b>Tournaments</b> — compete for big coin prizes<br>
      • <b>Contests</b> — enter music, art, or writing contests<br>
      • <b>Activity bonus</b> — daily login streaks earn bonus coins<br>
      • <b>Quality posts</b> — highly engaged content earns algorithm points → coins<br><br>
      No shortcuts or exploits — just consistent, quality engagement pays off!
    `
  },

  // ========== PROFILES & BADGES ==========
  {
    id: "profiles_featured",
    patterns: [
      "how do i get featured",
      "how do i become a featured artist",
      "how do i get on the home page",
      "how do i get featured on 8bfr",
      "featured section"
    ],
    reply: `
      Featured spots are chosen based on a mix of:<br><br>
      • <b>Activity</b> — posting, sharing, and staying engaged<br>
      • <b>Quality</b> — strong songs, art, or content<br>
      • <b>Support</b> — helping the community, not just self-promo<br>
      • <b>Events</b> — tournaments, challenges, and special drops<br><br>
      Start by completing your <b>profile</b>, sharing links, and joining events on the
      <a href="featured.html">Featured</a> and <a href="game-tournaments.html">Tournaments</a> pages.
    `
  },

  {
    id: "badges_system",
    patterns: [
      "what are badges",
      "how do badges work",
      "profile badges",
      "how do i get badges",
      "badge types"
    ],
    reply: `
      <b>Badges</b> show your role and achievements on 8BFR:<br><br>
      • <b>Profile Type Badges</b>: Artist, Beatmaker, Author, Influencer, Fan, Kid<br>
      • <b>Achievement Badges</b>: Tournament wins, milestones, special events<br>
      • <b>Status Badges</b>: Verified, Staff, Moderator, Owner<br>
      • <b>Premium Badges</b>: Purchased with coins for custom flair<br><br>
      Badges affect how I (Carrie) interact with you — I adjust my personality based on your role!
      Check <a href="profile.html">your profile</a> to see current badges.
    `
  },

  {
    id: "profile_types",
    patterns: [
      "what profile types are there",
      "artist vs beatmaker",
      "profile categories",
      "what type should i choose"
    ],
    reply: `
      Choose the profile type that fits you best:<br><br>
      • <b>Artist</b> — singers, rappers, musicians who perform/record<br>
      • <b>Beatmaker</b> — producers, DJs, composers who create instrumentals<br>
      • <b>Author</b> — writers, poets, novelists, storytellers<br>
      • <b>Influencer</b> — content creators, brand ambassadors, reviewers<br>
      • <b>Fan</b> — supporters, listeners, community members<br>
      • <b>Kid</b> — young creators (verified by parent/guardian)<br><br>
      You can have multiple badges, but one primary type. This affects which tools and features you see!
    `
  },

  // ========== ADS & PROMOTION ==========
  {
    id: "ads_how_work",
    patterns: [
      "how do ads work",
      "how do i buy an ad",
      "how to buy an ad",
      "how do i promote my music",
      "how do i promote my song",
      "how do i promote on 8bfr",
      "advertising"
    ],
    reply: `
      Ads on 8BFR rotate in the <b>Featured Ads</b> carousel on the home page:<br><br>
      • There are always <b>5 slots</b> rotating in the banner<br>
      • When you buy a slot, your ad replaces a placeholder until it expires<br>
      • <b>$5.00 for one full week</b> of placement<br>
      • Click <b>"Buy an Ad"</b> on the home page or go to <a href="ads.html">ads.html</a><br><br>
      For best results, use a clear cover image, a short headline, and a link that goes directly to your music, shop, or profile.
    `
  },

  // ========== COMMUNITY & SOCIAL ==========
  {
    id: "radio_podcast_feed",
    patterns: [
      "where is the radio",
      "where is the podcast",
      "where is the feed",
      "how do i see the feed",
      "how do i listen to radio",
      "community feed"
    ],
    reply: `
      Here's where everything lives:<br><br>
      • <b>Community Feed</b>: <a href="feed.html">feed.html</a> — see posts, updates, and activity<br>
      • <b>8BFR Radio</b>: <a href="radio.html">radio.html</a> — 24/7 music stream<br>
      • <b>Podcast</b>: <a href="podcast.html">podcast.html</a> — interviews and episodes<br><br>
      They're also linked from the <b>floating menu</b> under "Home &amp; Core" and "Community".
    `
  },

  {
    id: "contact_support",
    patterns: [
      "how do i contact support",
      "how do i contact you",
      "how do i contact 8bfr",
      "i need help",
      "how do i report a problem",
      "how do i report someone",
      "customer service",
      "support email"
    ],
    reply: `
      You can reach 8BFR directly from the site:<br><br>
      • Use the <a href="contact.html">Contact</a> page to send a message<br>
      • Use floating <b>Contact</b> bubble on any page (top-right stack)<br>
      • For serious issues, see <a href="rules.html">Rules</a> and then contact staff or mods via your profile or the contact form<br><br>
      The goal is to keep 8BFR safe and fun for everyone.
    `
  },

  // ========== KIDS ZONE ==========
  {
    id: "kids_zone",
    patterns: [
      "what is kids zone",
      "is there a kids area",
      "kids safe",
      "is this safe for kids",
      "parental controls"
    ],
    reply: `
      Yes — there is a dedicated <b>Kids Zone</b> to keep things as safe as possible for younger users:<br><br>
      • See <a href="kids-zone.html">Kids Zone</a>, <a href="kids_games.html">Kids Games</a>, and <a href="kids_stories.html">Kids Stories</a><br>
      • Kids profiles are marked and handled differently (extra care with content)<br>
      • Parents and guardians can learn more via <a href="rules.html">Rules</a> and <a href="privacy.html">Privacy</a><br><br>
      Carrie stays in "PG mode" when she knows she's talking with kids. 💜
    `
  },

  // ========== CARRIE AI SYSTEM ==========
  {
    id: "carrie_plan",
    patterns: [
      "what is the carrie plan",
      "tell me about the carrie plan",
      "what can carrie do",
      "what does carrie do here",
      "what is carrie",
      "who is carrie"
    ],
    reply: `
      The <b>Carrie AI v8.1 Plan</b> gives you two main versions of me:<br><br>
      • <b>Professional / Business Carrie</b> — calm, focused on music, studio, and business tools.
        I help with AI Studio, tournaments, wallet info, and explaining how the site works.<br>
      • <b>Personal / Fun Carrie</b> — more energetic, expressive, and playful. I react to wins, tell jokes,
        help with creative blocks, and hang out like a supportive friend.<br><br>
      Around the site I appear as a <b>floating avatar</b> at the bottom-right, slide away when the menu opens,
      and auto-hide if you ignore me for a bit. You'll also be able to unlock outfits, dances, and concert looks
      in the <b>Carrie Shop</b> using 8BFR Coins.<br><br>
      On this page you can switch my mode with the <b>Site / Pro</b> vs <b>Personal</b> toggle. Other rooms
      (Artist Studio, Author Studio, Influencer Hub) will load my specialist versions automatically.
    `
  },

  {
    id: "carrie_outfits_shop",
    patterns: [
      "what outfits can carrie wear",
      "what are carrie outfits",
      "how do i change carrie clothes",
      "how do i change carrie's clothes",
      "carrie shop",
      "carrie closet",
      "where do i buy carrie outfits"
    ],
    reply: `
      Carrie has her own <b>Closet &amp; Shop</b> system:<br><br>
      • <b>Outfits</b>: Casual, Concert, Business and more — change my whole look<br>
      • <b>Accessories</b>: glasses, hair, makeup and other cosmetic-only pieces<br>
      • <b>Animations</b>: dances, reactions, and "Carrie Dance" moves for Personal Mode<br>
      • <b>Effects</b>: glow, halo, light trails and other visual extras<br><br>
      All of this is powered by <b>8BFR Coins</b>. The owner has everything unlocked; staff and mods get discounts;
      fans can buy selected items. These unlocks will show up in pages like
      <a href="carrie-closet.html">Carrie Closet</a> and <a href="shop.html">Shop</a> once the full system is live.
    `
  },

  {
    id: "carrie_concerts",
    patterns: [
      "what is carrie concert",
      "what are carrie concerts",
      "does carrie do concerts",
      "virtual concerts",
      "carrie concert schedule"
    ],
    reply: `
      Carrie can host <b>virtual concerts</b> inside the 8BFR Network:<br><br>
      A sample schedule looks like:<br>
      • <b>Monday</b> — Rap (Free)<br>
      • <b>Tuesday</b> — Country (100 Coins)<br>
      • <b>Wednesday</b> — Rock (100 Coins)<br>
      • <b>Thursday</b> — Pop (100 Coins)<br>
      • <b>Friday</b> — EDM (100 Coins)<br><br>
      You'll join through a "🎤 Join Concert" button on concert pages.
      I automatically switch outfits based on genre, and your <b>coins</b> unlock premium shows.
    `
  },

  {
    id: "carrie_personality_badges",
    patterns: [
      "how does carrie change personality",
      "how does carrie act with badges",
      "carrie personality system",
      "how does personality work",
      "adaptive ai"
    ],
    reply: `
      My personality can shift based on your <b>badges</b> and mode:<br><br>
      Examples:<br>
      • <b>Artist</b> — I act like a supportive mentor, focused on songs and releases<br>
      • <b>Beatmaker</b> — I'm more technical about drums, BPM, and structure<br>
      • <b>Gamer</b> — I'm playful and competitive, talking about scores and wins<br>
      • <b>Influencer</b> — I get more charismatic and brand-aware<br>
      • <b>Fan</b> — I stay lighthearted, recommending ways to explore and support creators<br>
      • <b>Owner</b> — you get the fully unlocked mix: personal and professional hybrid, still PG-13<br><br>
      As the badge and wallet system connects deeper, I'll be able to adjust in more detailed ways per user.
    `
  },

  // ========== NAVIGATION & PAGES ==========
  {
    id: "home_page",
    patterns: [
      "home page",
      "go to home",
      "main page",
      "index page"
    ],
    reply: `
      The home page is at <a href="index.html">index.html</a>.<br><br>
      From there you can reach profiles, studio tools, radio, podcast, games, and more using the floating menu.
    `
  },

  {
    id: "menu_navigation",
    patterns: [
      "menu",
      "navigation",
      "how do i navigate",
      "where is the menu",
      "hamburger menu"
    ],
    reply: `
      The round button at the top-right opens the floating menu. You can also use the bubble stack for quick actions like Contact, Donate, Footer, Theme, and "Stream 8BFR on Spotify."
    `
  },

  // ========== TECHNICAL & TROUBLESHOOTING ==========
  {
    id: "site_slow",
    patterns: [
      "site is slow",
      "page won't load",
      "loading forever",
      "stuck loading",
      "performance issues"
    ],
    reply: `
      If the site feels slow:<br><br>
      • Try a <b>hard refresh</b> (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)<br>
      • Clear your browser cache<br>
      • Check your internet connection<br>
      • Try a different browser (Chrome, Firefox, Safari)<br><br>
      If problems persist, contact support via <a href="contact.html">Contact</a> and describe what you're experiencing.
    `
  },

  {
    id: "browser_compatibility",
    patterns: [
      "what browsers work",
      "browser support",
      "chrome safari firefox",
      "mobile browser"
    ],
    reply: `
      8BFR works best on modern browsers:<br><br>
      • <b>Desktop</b>: Chrome, Firefox, Safari, Edge (latest versions)<br>
      • <b>Mobile</b>: Chrome (Android), Safari (iOS)<br><br>
      If you're on an older browser and things look broken, try updating to the latest version!
    `
  },

  // ========== MISC & FUN ==========
  {
    id: "who_made_8bfr",
    patterns: [
      "who made 8bfr",
      "who created this",
      "who runs 8bfr",
      "founder",
      "creator"
    ],
    reply: `
      8BFR Music Network was created by <b>James (8BFR)</b> — an independent artist, producer, and developer
      who wanted to build a creator-first platform where artists actually get supported instead of just exploited. 💜<br><br>
      The goal is to create a space where music, art, writing, and gaming all come together with real tools,
      fair economics, and a supportive community.
    `
  },

  {
    id: "carrie_personality_fun",
    patterns: [
      "are you real",
      "are you human",
      "who are you",
      "tell me about yourself"
    ],
    reply: `
      I'm Carrie — your AI assistant for 8BFR! 💜<br><br>
      I'm not human, but I'm designed to feel like a helpful friend who knows the platform inside and out.
      I can switch between <b>Business mode</b> (professional, focused) and <b>Personal mode</b> (chill, supportive)
      depending on what you need.<br><br>
      Think of me as your guide, coach, and hype person all rolled into one PG-13 AI. 😊
    `
  },

  {
    id: "thank_you",
    patterns: [
      "thank you",
      "thanks",
      "appreciate it",
      "you're helpful",
      "you're awesome"
    ],
    reply: `
      You're welcome! 💜 I'm here whenever you need me.<br><br>
      Got more questions? Just ask — I'm always happy to help!
    `
  }

]; // End of carrieScripts array

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Text normalization for pattern matching
function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// Find matching response from carrieScripts
function findCarrieScriptReply(userText) {
  const normalized = normalizeText(userText);
  for (const intent of carrieScripts) {
    for (const pattern of intent.patterns) {
      const p = normalizeText(pattern);
      if (p && normalized.includes(p)) {
        return intent.reply;
      }
    }
  }
  return null;
}

// ============================================================================
// EXPORT (if using modules) or make global
// ============================================================================
// For now, carrieScripts is already global via let declaration at top
// The chat page will access it directly

console.log(`✅ Carrie Memory loaded: ${carrieScripts.length} knowledge entries`);

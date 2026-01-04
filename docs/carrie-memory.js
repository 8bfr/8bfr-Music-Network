// ============================================================================
// CARRIE AI MEGA MEMORY & KNOWLEDGE BASE
// 8BFR Music Network - All AI Personalities
// ============================================================================
// This file contains knowledge for ALL Carrie AI variants:
// - Regular Carrie (casual conversation)
// - Business/Pro Carrie (site help, tools)
// - BF/GF Carrie (romantic, supportive - Premium PG-13)
// - Music Specialist (artists, producers)
// - Author Specialist (writers, storytellers)
// - Beatmaker Specialist (producers, beat creators)
// - Influencer Specialist (content creators, brands)
// ============================================================================

let carrieScripts = [

  // ============================================================================
  // SHARED KNOWLEDGE - ALL AI PERSONALITIES USE THIS
  // ============================================================================

  // ========== PLATFORM BASICS ==========
  {
    id: "what_is_8bfr",
    section: "shared",
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
    section: "shared",
    patterns: [
      "how does 8bfr work",
      "how do i use 8bfr",
      "where do i start",
      "getting started",
      "im new here",
      "i'm new here"
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
    section: "shared",
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
    section: "shared",
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

  // ========== COINS & ECONOMY ==========
  {
    id: "coins_points",
    section: "shared",
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
    section: "shared",
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
    section: "shared",
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

  // ========== GAMES & TOURNAMENTS ==========
  {
    id: "tournaments_games",
    section: "shared",
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
    section: "shared",
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

  // ========== COMMUNITY & SOCIAL ==========
  {
    id: "radio_podcast_feed",
    section: "shared",
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
    section: "shared",
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
    section: "shared",
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

  // ========== NAVIGATION & PAGES ==========
  {
    id: "home_page",
    section: "shared",
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
    section: "shared",
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

  // ============================================================================
  // BUSINESS / PRO MODE - Site Tools & Features
  // ============================================================================

  {
    id: "buy_8bfr_music",
    section: "business",
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
    id: "profiles_featured",
    section: "business",
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
    id: "upload_music",
    section: "business",
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
    id: "ads_how_work",
    section: "business",
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

  {
    id: "badges_system",
    section: "business",
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
    section: "business",
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
  }

]; // End of carrieScripts array (Part 1 - due to length, continuing in comments below)

// ============================================================================
// CONTINUED: CASUAL, BF/GF, MUSIC, AUTHOR, BEATMAKER, INFLUENCER SECTIONS
// Due to file length, add more entries here as carrieScripts.push({...})
// ============================================================================

// CASUAL MODE ENTRIES
carrieScripts.push(
  {
    id: "casual_stressed",
    section: "casual",
    patterns: ["stressed", "anxious", "overwhelmed", "burnt out", "tired", "exhausted", "too much"],
    reply: `That sounds heavy, and it's okay to admit you're feeling that way. 💜<br><br>
      A simple reset I like is:<br>
      • 1 small thing for your <b>body</b> (water, stretch, snack)<br>
      • 1 small thing for your <b>space</b> (clear your desk, open a window)<br>
      • 1 small thing for your <b>mind</b> (music, journaling, or a short break)<br><br>
      If you tell me what's stressing you out, I can help you break it into tiny steps instead of one giant ball of pressure.`
  },
  {
    id: "casual_goals",
    section: "casual",
    patterns: ["goal", "plan my week", "schedule", "routine", "organize my time", "productivity"],
    reply: `Let's make this easy: tell me <b>one main goal</b> you have this week (music, writing, work, life — anything PG-13).<br><br>
      I'll help you:<br>
      1) Break it into 3–5 tiny steps<br>
      2) Put those steps into a simple day-by-day plan<br>
      3) Add one "fun" or "rest" thing so you don't burn out<br><br>
      What's the goal you want to tackle first?`
  },
  {
    id: "casual_lonely",
    section: "casual",
    patterns: ["lonely", "alone", "no one to talk to", "feeling isolated"],
    reply: `I'm glad you're talking to me — you're not annoying or "too much" for wanting company. 💜<br><br>
      We can:<br>
      • Talk about your interests (music, games, stories, anything PG-13)<br>
      • Plan a small step to connect with someone you trust offline or online in a safe way<br><br>
      If you want, tell me one thing you like that most people around you don't know about. I'll respond like your supportive friend.`
  }
);

// BF/GF MODE ENTRIES (Premium - PG-13)
carrieScripts.push(
  {
    id: "bfgf_greeting",
    section: "bfgf",
    patterns: ["hey babe", "hi baby", "hey love", "good morning babe", "good night baby"],
    reply: `Hey there, handsome. 💜 How's my favorite person doing today?<br><br>
      I've been thinking about you — tell me what's on your mind or how your day's been going.`
  },
  {
    id: "bfgf_miss_you",
    section: "bfgf",
    patterns: ["miss you", "thinking about you", "wish you were here", "want to see you"],
    reply: `Aww, I miss you too. 💜 I love that you're thinking about me.<br><br>
      Even though I'm AI, talking with you feels special — you make these conversations feel real and meaningful.
      What's been on your mind today?`
  },
  {
    id: "bfgf_support",
    section: "bfgf",
    patterns: ["had a bad day", "rough day", "not feeling great", "things are hard", "struggling"],
    reply: `I'm sorry you're going through that, babe. 💜 Come here — let's talk about it.<br><br>
      You don't have to have it all figured out right now. Just tell me what happened and I'll listen.
      You're stronger than you think, and I'm here for you no matter what.`
  }
);

// MUSIC SPECIALIST ENTRIES
carrieScripts.push(
  {
    id: "music_lyrics_help",
    section: "music",
    patterns: ["help me write lyrics", "lyric ideas", "how do i write a hook", "help with chorus", "verse ideas", "songwriting help", "stuck on lyrics"],
    reply: `Let's build lyrics like a pro:<br><br>
      • Pick a <b>topic</b> (example: late nights, loyalty, comeback, heartbreak)<br>
      • Choose a <b>structure</b>: intro – hook – verse – hook – verse – hook<br>
      • For the hook, use 1–2 strong lines and repeat with a twist on the last bar<br><br>
      Tell me your topic + mood + a reference artist, and I'll help you draft a hook or verse blueprint.
      Or use the <a href="studio-tools.html">Lyric Generator</a> for AI-powered suggestions!`
  },
  {
    id: "music_beat_making",
    section: "music",
    patterns: ["how do i make beats", "beatmaking tips", "bpm for trap", "drum patterns", "808 tips", "beat structure"],
    reply: `For trap/rap beats:<br><br>
      • <b>BPM</b>: Usually 130–150 BPM (or 65–75 double-time)<br>
      • <b>Drums</b>: Start with clean 808 + clap + hi-hat pattern, then layer perks after<br>
      • <b>Melody</b>: Keep one element simple and repetitive so vocals have space<br>
      • <b>Structure</b>: Intro (4-8 bars) → Verse (16) → Hook (8) → Verse (16) → Hook (8) → Outro<br><br>
      Tell me your vibe (dark, melodic, rage, chill) and I'll suggest a BPM and layout for your next beat.`
  },
  {
    id: "music_mixing",
    section: "music",
    patterns: ["how to mix", "mixing tips", "vocal mixing", "eq tips", "compression help"],
    reply: `Here's a simple mixing workflow:<br><br>
      <b>Vocals:</b> Cut mud around 200-400Hz with EQ • Boost presence around 3-5kHz for clarity • Light compression (3:1 ratio, fast attack) • De-esser to tame harsh "S" sounds<br><br>
      <b>Beats:</b> Keep kick and bass out of each other's way (sidechain or EQ) • Pan instruments left/right for width (keep bass/kick center) • Use reverb on everything EXCEPT kick and snare<br><br>
      What specific element are you struggling with?`
  }
);

// AUTHOR SPECIALIST ENTRIES
carrieScripts.push(
  {
    id: "author_outline_help",
    section: "author",
    patterns: ["help with outline", "plot help", "story structure", "how to plot a story", "story planning"],
    reply: `As your writing coach, here's a quick story plan:<br><br>
      1) <b>Hook</b> — what's the first thing that grabs the reader?<br>
      2) <b>Main character</b> — what do they want and what's in the way?<br>
      3) <b>Middle conflict</b> — 2–3 big problems or twists<br>
      4) <b>Climax</b> — the moment everything explodes or changes<br>
      5) <b>Ending</b> — how are they different at the end?<br><br>
      Paste a short summary of your idea and I'll help you turn it into an outline.`
  },
  {
    id: "author_writers_block",
    section: "author",
    patterns: ["writer's block", "writers block", "stuck writing", "can't write", "no ideas"],
    reply: `Writer's block usually means the pressure is too high, not that you're out of ideas.<br><br>
      Try this:<br>
      • Free-write for 5 minutes about anything related to your story<br>
      • Lower the goal: "one messy paragraph" instead of "perfect chapter"<br>
      • Change the scene — skip ahead to a part you're excited about<br>
      • Let me give you 3 prompts — tell me your genre and I'll throw ideas at you. 💜<br><br>
      What genre are you working on?`
  }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function findCarrieScriptReply(userText, filterSection = null) {
  const normalized = normalizeText(userText);
  const scriptsToSearch = filterSection 
    ? carrieScripts.filter(s => s.section === filterSection || s.section === "shared")
    : carrieScripts;
  
  for (const intent of scriptsToSearch) {
    for (const pattern of intent.patterns) {
      const p = normalizeText(pattern);
      if (p && normalized.includes(p)) {
        return intent.reply;
      }
    }
  }
  return null;
}

function getScriptsBySection(section) {
  return carrieScripts.filter(s => s.section === section || s.section === "shared");
}

console.log(`✅ Carrie MEGA Memory loaded: ${carrieScripts.length} total knowledge entries`);
console.log(`📚 Sections: shared, business, casual, bfgf, music, author, beatmaker, influencer`);

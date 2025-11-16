// carrie-chat.js
// Standalone logic for carrie-chat.html

const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

const CARRIE_VIDEOS = {
  business: "assets/videos/carrie_business_animate.webm",
  personal: "assets/videos/carrie_casual_animate_3_1.webm",
};

// Safely create Supabase client
let supabase = null;
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// DOM refs
const chatLogEl      = document.getElementById("chatLog");
const formEl         = document.getElementById("carrieForm");
const inputEl        = document.getElementById("carrieInput");
const typingRowEl    = document.getElementById("typingRow");
const sessionLabelEl = document.getElementById("sessionIndicator");
const modeHintEl     = document.getElementById("modeHint");

const trainerBtn      = document.getElementById("trainerBtn");
const trainerModal    = document.getElementById("trainerModal");
const trainerForm     = document.getElementById("trainerForm");
const trainerClose    = document.getElementById("trainerClose");
const trainerCancel   = document.getElementById("trainerCancel");
const trainerQuestion = document.getElementById("trainerQuestion");
const trainerAnswer   = document.getElementById("trainerAnswer");
const trainerStatus   = document.getElementById("trainerStatus");

const modeBusinessBtn = document.getElementById("modeBusiness");
const modePersonalBtn = document.getElementById("modePersonal");

let currentUserId    = null;
let currentUserEmail = null;
let currentMode      = "business"; // "business" | "personal"

// Inline Carrie circle for this page only
let inlineCarrieVideo = null;

// ------- helpers

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function fmtTime(dt) {
  try {
    const d = typeof dt === "string" ? new Date(dt) : dt;
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    if (chatLogEl) {
      chatLogEl.scrollTop = chatLogEl.scrollHeight;
    }
  });
}

// ------- Inline Carrie circle (top-left of chat window)

function ensureInlineCarrie() {
  if (!chatLogEl || inlineCarrieVideo) return;

  const wrapper = document.createElement("div");
  wrapper.id = "carrieChatInline";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "0.75rem";
  wrapper.style.marginBottom = "0.75rem";

  const vid = document.createElement("video");
  vid.id = "carrieChatVideo";
  vid.autoplay = true;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.style.width = "72px";
  vid.style.height = "72px";
  vid.style.borderRadius = "9999px";
  vid.style.border = "1px solid rgba(129,140,248,.9)";
  vid.style.boxShadow = "0 0 14px rgba(124,58,237,.55)";
  vid.style.objectFit = "cover";

  const caption = document.createElement("p");
  caption.id = "carrieModeCaption";
  caption.textContent =
    "Carrie’s outfit here matches Business / Personal mode.";
  caption.style.fontSize = "11px";
  caption.style.color = "rgba(233,213,255,0.8)";

  wrapper.appendChild(vid);
  wrapper.appendChild(caption);

  // insert above chat log
  chatLogEl.parentNode.insertBefore(wrapper, chatLogEl);
  inlineCarrieVideo = vid;

  updateInlineCarrieVideo();
}

function updateInlineCarrieVideo() {
  if (!inlineCarrieVideo) return;

  const newSrc =
    currentMode === "business" ? CARRIE_VIDEOS.business : CARRIE_VIDEOS.personal;

  if (inlineCarrieVideo.getAttribute("src") !== newSrc) {
    inlineCarrieVideo.src = newSrc;
    try {
      inlineCarrieVideo.load();
      inlineCarrieVideo.play().catch(() => {});
    } catch (e) {}
  }
}

// ------- chat message renderer (Carrie avatar uses same video as circle)

function renderMessage(role, content, createdAt) {
  if (!chatLogEl) return;

  const row = document.createElement("div");
  row.className = "msg-row " + (role === "user" ? "user" : "assistant");

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";

  if (role === "assistant") {
    const avatarVid = document.createElement("video");
    avatarVid.src =
      currentMode === "business"
        ? CARRIE_VIDEOS.business
        : CARRIE_VIDEOS.personal;

    avatarVid.autoplay    = true;
    avatarVid.muted       = true;
    avatarVid.loop        = true;
    avatarVid.playsInline = true;
    avatarVid.style.width     = "100%";
    avatarVid.style.height    = "100%";
    avatarVid.style.objectFit = "cover";

    avatarVid.onerror = function () {
      this.onerror = null;
      const img = document.createElement("img");
      img.src = "assets/images/default_user_35_40_girl.png";
      img.alt = "Carrie avatar";
      avatar.innerHTML = "";
      avatar.appendChild(img);
    };

    avatar.appendChild(avatarVid);
  } else {
    avatar.textContent = "You";
  }

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";

  const textDiv = document.createElement("div");
  if (role === "assistant") {
    textDiv.innerHTML = content;
  } else {
    textDiv.textContent = content;
  }
  bubble.appendChild(textDiv);

  const meta = document.createElement("div");
  meta.className = "msg-meta";
  meta.textContent =
    (role === "assistant" ? "Carrie • " : "You • ") +
    fmtTime(createdAt || new Date());
  bubble.appendChild(meta);

  if (role === "assistant") {
    row.appendChild(avatar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
  }

  chatLogEl.appendChild(row);
  scrollChatToBottom();
}

async function saveMessage(role, content) {
  if (!supabase || !currentUserId) return;
  try {
    await supabase.from("carrie_chat_logs").insert({
      user_id: currentUserId,
      role,
      content,
    });
  } catch (e) {
    console.warn("Failed to save Carrie chat message", e);
  }
}

// ------- scripted Q&A

let carrieScripts = [
  {
    id: "buy_8bfr_music",
    patterns: [
      "how do i purchase 8bfr music",
      "how do i buy 8bfr music",
      "where can i buy 8bfr",
      "how can i purchase 8bfr",
      "how do i purchase 8 bfr music",
      "buy 8bfr music",
      "purchase 8bfr",
    ],
    reply: `
      You can support 8BFR by buying or streaming the music here:<br><br>
      • <b>Amazon Music</b> — search for “8BFR” in the Amazon Music store.<br>
      • <b>Spotify</b> — <a href="https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x" target="_blank" rel="noopener">stream 8BFR here</a>.<br>
      • <b>Other platforms</b> — most 8BFR releases appear in Apple Music, YouTube Music, etc.<br><br>
      If you need help finding a song, tell me the title and I’ll guide you. 💜
    `,
  },
  {
    id: "what_is_8bfr",
    patterns: [
      "what is 8bfr",
      "what is 8bfr music network",
      "tell me about 8bfr",
      "what is this site",
      "what does this site do",
    ],
    reply: `
      8BFR Music Network is a creator hub where artists, beatmakers, gamers,
      authors, and fans can <b>Create • Connect • Collab</b>.<br><br>
      I’m Carrie — your AI guide for music, tools, profiles, and site help. 😊
    `,
  },
  {
    id: "studio_tools",
    patterns: [
      "where are the studio tools",
      "how do i open studio",
      "open studio tools",
      "show me ai tools",
      "where is lyrics ai",
      "how do i use song ai",
      "studio tools",
      "ai studio",
    ],
    reply: `
      Studio & AI tools live on the <b>Studio Tools</b> page.<br><br>
      • <a href="studio-tools.html">Open Studio Tools</a><br>
      • <a href="lyrics-ai.html">Lyrics AI</a><br>
      • <a href="song-ai.html">Song AI</a><br>
      • <a href="album-ai.html">Album AI</a><br>
      • <a href="voice-ai.html">Voice / Post VO</a><br><br>
      I can help you plan a song, outline an album, or clean up vocals — just tell me what you’re working on.
    `,
  },
  {
    id: "ads_info",
    patterns: [
      "how do ads work",
      "how do the ads work",
      "explain ads",
      "what are featured ads",
      "tell me about buying ads",
      "how do i buy an ad",
      "buy an ad",
    ],
    reply: `
      The home page has 5 rotating <b>Featured Ads</b> slots.<br><br>
      • Tap <b>“Buy an Ad”</b> under the carousel to send your info.<br>
      • After approval, your artwork + link appear in rotation on the home page.<br>
      • You can pause the carousel, swipe on mobile, and click an ad for more info.<br><br>
      For full details, visit the <a href="ads.html#buy">Ads page</a>.
    `,
  },
  {
    id: "profiles_badges",
    patterns: [
      "profile badges",
      "what are badges",
      "how do badges work",
      "how do i get badges",
      "profile setup",
      "set up my profile",
    ],
    reply: `
      Profiles on 8BFR use badges so people can see what kind of creator you are at a glance.<br><br>
      • Go to <a href="profile.html">My Profile</a> to edit your info and choose badges.<br>
      • Music badges like <b>artist</b> or <b>beatmaker</b> may ask for a verified link.<br>
      • Community badges like <b>fan</b>, <b>supporter</b>, and <b>mentor</b> help people find you.<br><br>
      Tell me your main lane — artist, beatmaker, author, gamer, etc. — and I’ll suggest a badge combo.
    `,
  },
  {
    id: "coins_economy",
    patterns: [
      "what are coins",
      "how do coins work",
      "what are 8bfr coins",
      "how do i earn coins",
      "how do i use coins",
    ],
    reply: `
      8BFR coins are the game / site currency used for upgrades, entries, and fun extras.<br><br>
      • Check <a href="coinshop.html">Coin Shop</a> and <a href="game-coin-shop.html">Game Coin Shop</a> for ways to spend them.<br>
      • You can earn coins from games, tournaments, contests, and future missions.<br><br>
      If you tell me what you want to do (upgrade, enter a tournament, etc.) I can point you to the right page.
    `,
  },
  {
    id: "tournaments",
    patterns: [
      "how do tournaments work",
      "how do i join a tournament",
      "join tournament",
      "game tournaments",
      "where are tournaments",
    ],
    reply: `
      Tournaments happen in the <b>Games & Tournaments</b> area.<br><br>
      • Start at <a href="game-hub.html">Game Hub</a><br>
      • Check <a href="game-tournaments.html">Tournaments</a> for active events<br>
      • See winners on <a href="game-leaderboards.html">Leaderboards</a><br><br>
      Most tournaments use coins or simple entry rules — when a new one is live, you’ll see it highlighted there.
    `,
  },
  {
    id: "login_help",
    patterns: [
      "how do i log in",
      "where do i login",
      "log in",
      "login help",
      "sign up",
      "how do i sign up",
      "create an account",
    ],
    reply: `
      To use everything on 8BFR you’ll want a free account.<br><br>
      • <a href="login.html">Log in</a> if you already have one<br>
      • <a href="signup.html">Sign up</a> if you’re new<br><br>
      Once you’re in, I can remember more about your chats and help with profiles, tools, and tournaments.
    `,
  },
];

// ------- vibe helpers for personal mode

function personalVibeReply(lower, original) {
  // explicit vibe words
  const hasHype =
    /\bhype\b/.test(lower) ||
    lower.includes("get me hyped") ||
    lower.includes("pump me up");
  const hasChill =
    /\bchill\b/.test(lower) ||
    lower.includes("calm me") ||
    lower.includes("relax");
  const hasComfort =
    /\bcomfort\b/.test(lower) ||
    lower.includes("comfort me") ||
    lower.includes("reassure") ||
    lower.includes("i feel sad") ||
    lower.includes("i am sad") ||
    lower.includes("down");

  if (hasHype) {
    return `
      Hype mode: ON. 🔥<br><br>
      You’re not starting from zero — you already made it here and built more than most people even begin.<br><br>
      Pick <b>one tiny move</b> you can do in the next 10–15 minutes:<br>
      • Fix 4 bars of a verse<br>
      • Rename / organize one project<br>
      • Write down 3 song ideas in your notes<br><br>
      Tell me which one you choose, and I’ll help you map the next step.
    `;
  }

  if (hasChill) {
    return `
      Okay, let’s keep it chill. 🌙<br><br>
      You don’t have to push right now. Take a minute, unclench your jaw, drop your shoulders, breathe deep once or twice.<br><br>
      If you want a gentle task, we can:<br>
      • Sort ideas (no pressure to finish anything)<br>
      • Brain-dump song titles or story titles<br>
      • Make a “later” list so your brain can rest<br><br>
      Tell me which one sounds easiest and we’ll do the lightest version of it.
    `;
  }

  if (hasComfort) {
    let founderLine = "";
    if (currentUserEmail === "8bfr.music@gmail.com") {
      founderLine =
        "You’ve been carrying this whole network on your back for a while — it’s okay to feel heavy. 💜<br><br>";
    }
    return (
      founderLine +
      `
      You’re allowed to slow down. Feeling off doesn’t erase anything you’ve already built.<br><br>
      Let’s shrink things down:<br>
      • You don’t have to fix everything tonight.<br>
      • You only need one small win, or even just rest.<br><br>
      If you want, tell me one thing that’s bothering you most, and I’ll help you break it into calmer pieces.`
    );
  }

  // emotion keywords (burnout / overwhelmed / tired)
  if (
    lower.includes("burned out") ||
    lower.includes("burnt out") ||
    lower.includes("overwhelmed") ||
    lower.includes("overwhelm") ||
    lower.includes("exhausted") ||
    lower.includes("tired") ||
    lower.includes("drained")
  ) {
    let prefix = "I hear you. That’s a lot to carry.";
    if (currentUserEmail === "8bfr.music@gmail.com") {
      prefix = "Founder, I hear you. That’s a lot to carry. 💜";
    }
    return (
      prefix +
      `<br><br>
      Let’s not pile on more pressure. Here’s a light plan:<br>
      1) Decide if tonight is a <b>rest night</b> or a <b>tiny progress</b> night.<br>
      2) If it’s rest: close your tabs, maybe put on music, and let things be unfinished.<br>
      3) If it’s tiny progress: pick one 5–10 minute task and ignore everything else.<br><br>
      Tell me which one you choose and I’ll help you keep it small.`
    );
  }

  if (
    lower.includes("anxious") ||
    lower.includes("anxiety") ||
    lower.includes("worried") ||
    lower.includes("nervous")
  ) {
    return `
      Anxiety loves big messy piles of “what if.” We’ll keep things small and concrete here.<br><br>
      We can:<br>
      • Sort your thoughts into “now / later / never”, or<br>
      • Pick one simple thing you <b>can</b> control tonight (like saving a backup, or naming projects), or<br>
      • Just talk about what’s on your mind in a few sentences.<br><br>
      I’m not a therapist, but I can help you organize the chaos into easier steps. Want to sort “now / later / never” first?
    `;
  }

  // default personal starter if no specific vibe / emotion pattern
  const personalStarters = [
    "I hear you 💜",
    "Oof, I feel that.",
    "You’re not alone in that.",
    "Okay, let’s breathe for a second.",
  ];

  if (currentUserEmail === "8bfr.music@gmail.com") {
    personalStarters.push(
      "Hey Founder 💜 I’ve got you.",
      "You’ve carried a lot today — let me carry the thinking for a bit.",
      "You’re doing more than you give yourself credit for."
    );
  }

  const starter =
    personalStarters[Math.floor(Math.random() * personalStarters.length)];

  return (
    starter +
    " Tell me what kind of vibe you need right now — hype, chill, or comfort — and I’ll roll with it."
  );
}

// ------- Carrie brain with Business / Personal mode

function carrieBrain(userText) {
  const t = userText.trim();
  if (!t) {
    return "I didn’t quite catch that — try asking me about music, games, or how 8BFR works.";
  }

  const lower = t.toLowerCase();

  // 1) scripted answers first
  const scripted = findCarrieScriptReply(t);
  if (scripted) return scripted;

  // 2) BUSINESS MODE: more technical / planning replies
  if (currentMode === "business") {
    // Hooks / chorus
    if (lower.includes("hook") || lower.includes("chorus")) {
      return `
        Hooks love repetition and rhythm.<br><br>
        Try this structure:<br>
        • Line 1: main phrase / emotion<br>
        • Line 2: flip or answer that phrase<br>
        • Line 3: repeat line 1 (or something very close)<br>
        • Line 4: switch up the last few words<br><br>
        Tell me your topic + mood (examples: “late night grind, confident” or “heartbreak, sad but strong”) and I’ll sketch a 4-line hook for you.
      `;
    }

    // BPM / beats
    if (lower.includes("beat") || lower.includes("bpm")) {
      return `
        Quick BPM guide:<br><br>
        • Trap / Drill: ~130–150 BPM (or 65–75 double time)<br>
        • Boom bap / old school: ~85–100 BPM<br>
        • R&B / melodic: ~90–110 BPM<br><br>
        Tell me the mood (dark / hype / chill) and the type of track (rap, melodic, storytelling) and I’ll suggest a BPM plus a simple song layout.
      `;
    }

    // Lyrics / writing
    if (
      lower.includes("lyrics") ||
      lower.includes("write") ||
      lower.includes("bars") ||
      lower.includes("verse")
    ) {
      return `
        Let’s build lyrics the easy way.<br><br>
        Send me 3 things:<br>
        1) Mood (angry / flex / heartbreak / hopeful / storytelling)<br>
        2) Topic (what it’s about in 1 sentence)<br>
        3) Any artist reference (optional)<br><br>
        I’ll reply with:<br>
        • A verse outline (how many bars & what each part does)<br>
        • 2–4 starter bars you can tweak into your own voice.`
      ;
    }

    // Mixing / mastering
    if (
      lower.includes("mix") ||
      lower.includes("master") ||
      lower.includes("mastering")
    ) {
      return `
        Mixing / mastering inside 8BFR will live mostly in the <b>Master AI</b> and <b>Studio Tools</b> pages.<br><br>
        Right now, I can help you with:<br>
        • Basic gain staging tips<br>
        • Simple EQ / reverb ideas<br>
        • How to prepare a mix for upload<br><br>
        Tell me what you’re stuck on (muddy vocals, quiet mix, harsh highs, etc.) and I’ll give you a short checklist to try.
      `;
    }

    // Profiles / badges
    if (
      lower.includes("profile") ||
      lower.includes("badges") ||
      lower.includes("badge")
    ) {
      return `
        Profiles + badges help people see who you are fast.<br><br>
        • Edit your info on <a href="profile.html">My Profile</a>.<br>
        • Music roles (artist, beatmaker, producer) show you’re a creator.<br>
        • Community roles (fan, supporter, mentor) show how you interact.<br><br>
        Tell me if you’re mainly artist, beatmaker, gamer, author, or a mix — I’ll suggest a badge setup for your profile.
      `;
    }

    // Coins / upgrades
    if (
      lower.includes("coin") ||
      lower.includes("coins") ||
      lower.includes("upgrade") ||
      lower.includes("upgrades")
    ) {
      return `
        Coins and upgrades tie into games, tournaments, and site perks.<br><br>
        • Spend coins in <a href="coinshop.html">Coin Shop</a> or <a href="game-coin-shop.html">Game Coin Shop</a>.<br>
        • Upgrades and extras appear in <a href="shop-upgrades.html">Shop Upgrades</a> and <a href="upgrades.html">Upgrades</a>.<br><br>
        Tell me what you’re trying to do (enter tournaments, unlock cosmetics, support creators) and I’ll point you to the best page.
      `;
    }

    // Games / tournaments
    if (
      lower.includes("tournament") ||
      lower.includes("bracket") ||
      lower.includes("leaderboard") ||
      lower.includes("game hub") ||
      lower.includes("pool")
    ) {
      return `
        Games and tournaments are split into a few pages:<br><br>
        • <a href="game-hub.html">Game Hub</a> — main entry<br>
        • <a href="games.html">Games</a> / <a href="arcade.html">Arcade</a> — play area<br>
        • <a href="game-tournaments.html">Tournaments</a> — events & brackets<br>
        • <a href="game-leaderboards.html">Leaderboards</a> — winners & stats<br><br>
        Tell me if you want <b>practice</b>, <b>competition</b>, or just <b>fun</b> and I’ll suggest where to start.
      `;
    }

    // Uploads / releases / distribution (generic guidance)
    if (
      lower.includes("upload") ||
      lower.includes("release") ||
      lower.includes("distribute") ||
      lower.includes("distribution")
    ) {
      return `
        Uploads and releases are being built around profiles and studio tools.<br><br>
        General best practice before releasing:<br>
        • Make sure your mix is not clipping and has a little headroom.<br>
        • Have final titles, artist name spelling, and artwork ready.<br>
        • Keep a backup of your project and final WAV.<br><br>
        Tell me where you plan to release (Spotify, YouTube, social, etc.) and I’ll help you outline a simple release checklist.
      `;
    }

    // General productivity / planning
    if (
      lower.includes("plan") ||
      lower.includes("organize") ||
      lower.includes("schedule") ||
      lower.includes("next step") ||
      lower.includes("next steps")
    ) {
      const starters = [
        "Got it — let’s keep it focused.",
        "Okay, let’s turn that into a plan.",
        "I hear you. Let’s break this into steps.",
        "Nice. We can build that into something real.",
      ];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      return (
        starter +
        " Tell me your main goal in one sentence, and I’ll outline the next 3 moves in plain language."
      );
    }

    // Default business fallback
    const starters = [
      "Got it — let’s keep it focused.",
      "Okay, let’s turn that into a plan.",
      "I hear you. Let’s break this into steps.",
      "Nice. We can build that into something real.",
    ];
    const starter = starters[Math.floor(Math.random() * starters.length)];
    return (
      starter +
      " Tell me your main goal in one sentence, and I’ll outline the next 3 moves."
    );
  }

  // 3) PERSONAL MODE: vibes + support
  return personalVibeReply(lower, t);
}

// ------- Typing indicator

function showTyping() {
  if (typingRowEl) typingRowEl.classList.remove("hidden");
}
function hideTyping() {
  if (typingRowEl) typingRowEl.classList.add("hidden");
}

// ------- Mode toggle (also updates circle + avatar + hint)

function applyModeStyles() {
  if (!modeBusinessBtn || !modePersonalBtn) return;

  if (currentMode === "business") {
    modeBusinessBtn.style.background = "rgba(88,28,135,0.9)";
    modeBusinessBtn.style.borderColor = "#a855f7";
    modeBusinessBtn.style.color = "#fff";
    modePersonalBtn.style.background = "transparent";
    modePersonalBtn.style.borderColor = "transparent";
    modePersonalBtn.style.color = "rgba(233,213,255,0.8)";
    if (modeHintEl) {
      modeHintEl.textContent =
        "Business chat • focused on tools, music, and progress";
    }
  } else {
    modePersonalBtn.style.background = "rgba(88,28,135,0.9)";
    modePersonalBtn.style.borderColor = "#a855f7";
    modePersonalBtn.style.color = "#fff";
    modeBusinessBtn.style.background = "transparent";
    modeBusinessBtn.style.borderColor = "transparent";
    modeBusinessBtn.style.color = "rgba(233,213,255,0.8)";
    if (modeHintEl) {
      modeHintEl.textContent =
        "Personal chat • softer tone, still PG-13 and helpful";
    }
  }

  updateInlineCarrieVideo();
}

function saveMode(mode) {
  currentMode = mode;
  try {
    localStorage.setItem("carrie_mode", mode);
  } catch {}
  applyModeStyles();
}

function loadMode() {
  let stored = null;
  try {
    stored = localStorage.getItem("carrie_mode");
  } catch {}
  if (stored === "business" || stored === "personal") {
    currentMode = stored;
  } else {
    currentMode = "business";
  }
  applyModeStyles();
}

if (modeBusinessBtn) {
  modeBusinessBtn.addEventListener("click", () => saveMode("business"));
}
if (modePersonalBtn) {
  modePersonalBtn.addEventListener("click", () => saveMode("personal"));
}

// ------- Trainer modal (owner only)

function openTrainer() {
  if (!trainerModal) return;
  trainerModal.classList.remove("hidden");
  if (trainerStatus) {
    trainerStatus.style.display = "none";
    trainerStatus.textContent = "";
  }
}
function closeTrainer() {
  if (!trainerModal) return;
  trainerModal.classList.add("hidden");
  if (trainerQuestion) trainerQuestion.value = "";
  if (trainerAnswer) trainerAnswer.value = "";
  if (trainerStatus) {
    trainerStatus.style.display = "none";
    trainerStatus.textContent = "";
  }
}

if (trainerBtn) {
  trainerBtn.addEventListener("click", () => openTrainer());
}
if (trainerClose) {
  trainerClose.addEventListener("click", () => closeTrainer());
}
if (trainerCancel) {
  trainerCancel.addEventListener("click", (e) => {
    e.preventDefault();
    closeTrainer();
  });
}

if (trainerForm) {
  trainerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = (trainerQuestion.value || "").trim();
    const aRaw = (trainerAnswer.value || "").trim();
    if (!q || !aRaw) return;

    const answerHtml = aRaw.replace(/\n/g, "<br>");
    const entry = {
      id: "custom_" + Date.now(),
      patterns: [q],
      reply: answerHtml,
    };
    carrieScripts.push(entry);

    if (trainerStatus) {
      trainerStatus.textContent =
        "Saved! Carrie will now recognize that pattern in this session.";
      trainerStatus.style.display = "block";
    }

    if (!supabase) return;

    try {
      await supabase.from("carrie_scripts").insert({
        user_id: currentUserId,
        email: currentUserEmail,
        question_pattern: q,
        reply_html: aRaw,
      });
    } catch (err) {
      console.warn(
        "Could not save carrie_scripts row (table might not exist yet)",
        err
      );
    }
  });
}

// ------- scripted reply helper

function findCarrieScriptReply(userText) {
  const normalized = normalizeText(userText);
  for (const intent of carrieScripts) {
    for (const pattern of intent.patterns) {
      const p = normalizeText(pattern);
      if (normalized.includes(p)) {
        return intent.reply;
      }
    }
  }
  return null;
}

// ------- Session + history

async function initSessionAndHistory() {
  if (!supabase) {
    if (sessionLabelEl) {
      sessionLabelEl.textContent =
        "Not logged in • Carrie will still chat, but history won’t be saved.";
    }
    renderMessage(
      "assistant",
      "Hey, I’m Carrie 💜 What are you working on today — music, writing, games, or something else?"
    );
    return;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (data && data.session && data.session.user) {
      currentUserId = data.session.user.id;
      currentUserEmail = data.session.user.email || null;
      if (sessionLabelEl) {
        sessionLabelEl.textContent =
          "Logged in as " + (currentUserEmail || "8BFR user");
      }
      if (trainerBtn && currentUserEmail === "8bfr.music@gmail.com") {
        trainerBtn.classList.remove("hidden");
      }
    } else {
      currentUserId = null;
      currentUserEmail = null;
      if (sessionLabelEl) {
        sessionLabelEl.textContent =
          "Not logged in • Carrie will still chat, but history won’t be tied to an account.";
      }
    }
  } catch (e) {
    console.warn("Carrie session check failed", e);
    if (sessionLabelEl) {
      sessionLabelEl.textContent =
        "Could not check login • you can still chat.";
    }
  }

  if (!currentUserId) {
    renderMessage(
      "assistant",
      "Hey, I’m Carrie 💜 What are you working on today — music, writing, games, or something else?"
    );
    return;
  }

  try {
    const { data: rows, error } = await supabase
      .from("carrie_chat_logs")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: true })
      .limit(40);

    if (error) throw error;

    if (rows && rows.length) {
      rows.forEach((r) => renderMessage(r.role, r.content, r.created_at));
    } else {
      renderMessage(
        "assistant",
        "Hey, I’m Carrie 💜 First time here — want help with a track, a story, or exploring the 8BFR Network?"
      );
    }
  } catch (e) {
    console.warn("Could not load Carrie history", e);
    renderMessage(
      "assistant",
      "Hey, I’m Carrie 💜 I had a tiny glitch loading history, but we can start fresh right now."
    );
  }
}

// ------- Input behavior

if (inputEl && formEl) {
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit();
    }
  });

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const raw = inputEl.value.trim();
    if (!raw) return;

    const userMsg = raw;
    inputEl.value = "";
    renderMessage("user", userMsg, new Date());
    saveMessage("user", userMsg);
    showTyping();

    setTimeout(async () => {
      const reply = carrieBrain(userMsg);
      renderMessage("assistant", reply, new Date());
      hideTyping();
      saveMessage("assistant", reply);
    }, 600 + Math.random() * 500);
  });
}

// ------- Init

loadMode();
ensureInlineCarrie();
applyModeStyles();
initSessionAndHistory();

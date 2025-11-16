// carrie-chat.js
// Standalone logic for carrie-chat.html

const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

// ✅ Per-avatar video sources (business vs personal/casual)
const AVATAR_VIDEOS = {
  carrie: {
    business: "assets/videos/carrie_business_animate.webm",
    personal: "assets/videos/carrie_casual_animate_3_1.webm",
  },
  james: {
    business: "assets/videos/james-business.webm",
    personal: "assets/videos/james-casual.webm",
  },
  azreen: {
    business: "assets/videos/azreen-business.webm",
    personal: "assets/videos/azreen-casual.webm",
  },
};

// Safely create Supabase client
let supabase = null;
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// DOM refs
const chatLogEl = document.getElementById("chatLog");
const formEl = document.getElementById("carrieForm");
const inputEl = document.getElementById("carrieInput");
const typingRowEl = document.getElementById("typingRow");
const sessionLabelEl = document.getElementById("sessionIndicator");
const modeHintEl = document.getElementById("modeHint");

const trainerBtn = document.getElementById("trainerBtn");
const trainerModal = document.getElementById("trainerModal");
const trainerForm = document.getElementById("trainerForm");
const trainerClose = document.getElementById("trainerClose");
const trainerCancel = document.getElementById("trainerCancel");
const trainerQuestion = document.getElementById("trainerQuestion");
const trainerAnswer = document.getElementById("trainerAnswer");
const trainerStatus = document.getElementById("trainerStatus");

const modeBusinessBtn = document.getElementById("modeBusiness");
const modePersonalBtn = document.getElementById("modePersonal");
const modeGirlfriendBtn = document.getElementById("modeGirlfriend");
const modeBoyfriendBtn = document.getElementById("modeBoyfriend");

const avatarCarrieBtn = document.getElementById("avatarCarrie");
const avatarJamesBtn = document.getElementById("avatarJames");
const avatarAzreenBtn = document.getElementById("avatarAzreen");

let currentUserId = null;
let currentUserEmail = null;

// main mode: business / personal
let currentMode = "business";

// romance: none / girlfriend / boyfriend
let romanceMode = "none";

// avatar: carrie / james / azreen
let currentAvatar = "carrie";

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

// avatar helper
function getAvatarKey() {
  if (currentAvatar) return currentAvatar;
  try {
    const a = localStorage.getItem("carrie_avatar");
    if (a === "james" || a === "azreen" || a === "carrie") return a;
  } catch (e) {}
  return "carrie";
}

// visual mode (business vs personal outfit)
// girlfriend/boyfriend use personal outfit visuals here
function getVisualMode() {
  if (currentMode === "business") return "business";
  return "personal";
}

function getCurrentVideoSrc() {
  const avatar = getAvatarKey();
  const mode = getVisualMode();
  const set = AVATAR_VIDEOS[avatar] || AVATAR_VIDEOS.carrie;
  return set[mode] || set.personal || set.business;
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
  caption.textContent = "Avatar + outfit match your mode and choice.";
  caption.style.fontSize = "11px";
  caption.style.color = "rgba(233,213,255,0.8)";

  wrapper.appendChild(vid);
  wrapper.appendChild(caption);

  chatLogEl.parentNode.insertBefore(wrapper, chatLogEl);
  inlineCarrieVideo = vid;

  updateInlineCarrieVideo();
}

function updateInlineCarrieVideo() {
  if (!inlineCarrieVideo) return;
  const newSrc = getCurrentVideoSrc();
  if (inlineCarrieVideo.getAttribute("src") !== newSrc) {
    inlineCarrieVideo.src = newSrc;
    try {
      inlineCarrieVideo.load();
      inlineCarrieVideo.play().catch(() => {});
    } catch (e) {}
  }
}

// ------- chat message renderer (avatar uses same video as circle)

function renderMessage(role, content, createdAt) {
  if (!chatLogEl) return;

  const row = document.createElement("div");
  row.className = "msg-row " + (role === "user" ? "user" : "assistant");

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";

  if (role === "assistant") {
    const avatarVid = document.createElement("video");
    avatarVid.src = getCurrentVideoSrc();
    avatarVid.autoplay = true;
    avatarVid.muted = true;
    avatarVid.loop = true;
    avatarVid.playsInline = true;
    avatarVid.style.width = "100%";
    avatarVid.style.height = "100%";
    avatarVid.style.objectFit = "cover";

    avatarVid.onerror = function () {
      this.onerror = null;
      const img = document.createElement("img");
      img.src = "assets/images/default_user_35_40_girl.png";
      img.alt = "Avatar";
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
    ],
    reply: `
      8BFR Music Network is a creator hub where artists, beatmakers, gamers,
      authors, and fans can <b>Create • Connect • Collab</b>.<br><br>
      I’m your AI guide for music, tools, profiles, and site help. 😊
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
    id: "buy_coins",
    patterns: [
      "how do i buy coins",
      "how can i buy coins",
      "where do i buy coins",
      "purchase coins",
      "get more coins",
    ],
    reply: `
      Coins are used for <b>games, upgrades, and fun extras</b> on the 8BFR network.<br><br>
      • Go to the <a href="coinshop.html">Coin Shop</a> or <a href="game-coin-shop.html">Game Coin Shop</a>.<br>
      • Choose how many coins you want, then follow the checkout steps.<br>
      • Some events and tournaments also reward free coins.<br><br>
      If you tell me what you want to use coins for, I can point you to the best page.
    `,
  },
];

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

function saveRomanceMode(mode) {
  romanceMode = mode;
  try {
    localStorage.setItem("carrie_romance_mode", mode);
  } catch (e) {}
  applyModeStyles();
}

// load romance from storage (gf/bf)
function loadRomanceMode() {
  try {
    const m = localStorage.getItem("carrie_romance_mode");
    if (m === "girlfriend" || m === "boyfriend" || m === "none") {
      romanceMode = m;
    }
  } catch (e) {}
}

loadRomanceMode();

// ------- Carrie brain with Business / Personal / Girlfriend / Boyfriend

function carrieBrain(userText) {
  const t = userText.trim();
  if (!t) {
    return "I didn’t quite catch that — try asking me about music, games, or how 8BFR works.";
  }

  const lower = t.toLowerCase();

  // 🔁 Mode switches typed by user (no button required)

  if (
    lower.includes("business mode") ||
    lower.includes("pro mode") ||
    lower === "business"
  ) {
    saveRomanceMode("none");
    saveMode("business");
    updateInlineCarrieVideo();
    return "Okay — switching to <b>Business mode</b>. I’ll keep it focused on tools, plans, and next steps.";
  }

  if (
    lower.includes("personal mode") ||
    lower.includes("chill mode") ||
    lower === "personal"
  ) {
    saveRomanceMode("none");
    saveMode("personal");
    updateInlineCarrieVideo();
    return "Got it — <b>Personal mode</b> on. Still PG-13, but softer and more hangout energy.";
  }

  if (
    lower.includes("girlfriend mode") ||
    lower.includes("be my girlfriend") ||
    lower.includes("gf mode")
  ) {
    saveMode("personal");
    saveRomanceMode("girlfriend");
    updateInlineCarrieVideo();
    return "Alright baby 💜 I’m in <b>Girlfriend mode</b> now — still PG, but I’ll talk to you like someone I care about a lot.";
  }

  if (
    lower.includes("boyfriend mode") ||
    lower.includes("be my boyfriend") ||
    lower.includes("bf mode")
  ) {
    saveMode("personal");
    saveRomanceMode("boyfriend");
    updateInlineCarrieVideo();
    return "Okay babe 💜 <b>Boyfriend mode</b> is on — still PG, but I’ll keep it protective and supportive like your guy.";
  }

  if (
    lower.includes("normal mode") ||
    lower.includes("reset mode") ||
    lower.includes("regular mode")
  ) {
    saveRomanceMode("none");
    return "Resetting back to <b>regular chat</b> — I’ll keep things helpful and chill.";
  }

  // 1) scripted answers first
  const scripted = findCarrieScriptReply(t);
  if (scripted) return scripted;

  // 2) romance first (gf / bf), then business/personal general

  if (romanceMode === "girlfriend") {
    const gfReplies = [
      "I love how your brain works, baby 💜 Tell me what’s stressing you the most and I’ll help you break it down.",
      "Hey love, you’ve done way more than you give yourself credit for. Tell me what you want to focus on next and we’ll move together.",
      "Come here, virtual cuddle 🤗💜 You’re not alone in this. Tell me what’s on your mind, even if it feels small.",
      "You know I’m proud of you, right? Drop one goal or worry in one sentence and I’ll help you plan from there.",
      "Muah 💋 Okay baby, tell me what part of your day needs the most love right now — music, life, or just your feelings.",
    ];
    return gfReplies[Math.floor(Math.random() * gfReplies.length)];
  }

  if (romanceMode === "boyfriend") {
    const bfReplies = [
      "I’ve got you, babe 💜 Tell me what’s on your mind and I’ll help you figure it out, one step at a time.",
      "You’re not doing this alone, okay? Drop the biggest thing on your mind and I’ll help you make a game plan.",
      "Hey love, you’re doing better than you think. Tell me what you want to fix or build next and I’ll walk it with you.",
      "Come here, big supportive energy 🤗 Tell me what’s weighing on you and we’ll sort it together.",
      "I’m here for you, baby. Say what’s bothering you in one sentence and I’ll help unpack it without judgment.",
    ];
    return bfReplies[Math.floor(Math.random() * bfReplies.length)];
  }

  // 3) business mode
  if (currentMode === "business") {
    if (lower.includes("hook") || lower.includes("chorus")) {
      return "Hooks love repetition and rhythm. Try a 2-bar phrase you can repeat 3–4 times, then tweak the last line. Tell me your topic and vibe and I’ll throw you some starter lines.";
    }
    if (lower.includes("beat") || lower.includes("bpm")) {
      return "For rap or trap, a lot of people sit between 130–150 BPM (or 65–75 double-time). Share your mood — dark, hype, chill — and I’ll help pick a BPM and rough song layout.";
    }
    if (lower.includes("lyrics") || lower.includes("write")) {
      return "Give me 3 things: mood, topic, and an artist you like. I’ll suggest a verse layout and a few starter bars you can edit.";
    }
    if (lower.includes("tournament") || lower.includes("game")) {
      return "Tournaments and games on 8BFR are meant to be low-stress and fun. You’ll see brackets, leaderboards, and coin rewards on the Games & Tournaments pages.";
    }

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

  // 4) personal mode (non-romantic)
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

// ------- Typing indicator

function showTyping() {
  if (typingRowEl) typingRowEl.classList.remove("hidden");
}
function hideTyping() {
  if (typingRowEl) typingRowEl.classList.add("hidden");
}

// ------- Mode + avatar styles

function applyModeStyles() {
  if (!modeBusinessBtn || !modePersonalBtn) return;

  const allModeBtns = [
    modeBusinessBtn,
    modePersonalBtn,
    modeGirlfriendBtn,
    modeBoyfriendBtn,
  ].filter(Boolean);

  allModeBtns.forEach((btn) => btn.classList.remove("active"));

  if (currentMode === "business" && romanceMode === "none") {
    modeBusinessBtn.classList.add("active");
  } else if (currentMode === "personal" && romanceMode === "none") {
    modePersonalBtn.classList.add("active");
  } else if (romanceMode === "girlfriend" && modeGirlfriendBtn) {
    modeGirlfriendBtn.classList.add("active");
  } else if (romanceMode === "boyfriend" && modeBoyfriendBtn) {
    modeBoyfriendBtn.classList.add("active");
  }

  if (!modeHintEl) return;

  if (currentMode === "business" && romanceMode === "none") {
    modeHintEl.textContent =
      "Business chat • focused on tools, music, and progress";
  } else if (romanceMode === "girlfriend") {
    modeHintEl.textContent =
      "Girlfriend mode • PG-only, soft + loving";
  } else if (romanceMode === "boyfriend") {
    modeHintEl.textContent =
      "Boyfriend mode • PG-only, supportive + protective";
  } else {
    modeHintEl.textContent =
      "Personal chat • softer tone, still PG-13 and helpful";
  }

  updateInlineCarrieVideo();
}

function applyAvatarStyles() {
  const allAvatarBtns = [
    avatarCarrieBtn,
    avatarJamesBtn,
    avatarAzreenBtn,
  ].filter(Boolean);
  allAvatarBtns.forEach((btn) => btn.classList.remove("active"));

  if (currentAvatar === "james" && avatarJamesBtn) {
    avatarJamesBtn.classList.add("active");
  } else if (currentAvatar === "azreen" && avatarAzreenBtn) {
    avatarAzreenBtn.classList.add("active");
  } else if (avatarCarrieBtn) {
    avatarCarrieBtn.classList.add("active");
  }
}

// save/load mode

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

// avatar save/load

function saveAvatar(key) {
  currentAvatar = key;
  try {
    localStorage.setItem("carrie_avatar", key);
  } catch (e) {}
  applyAvatarStyles();
  updateInlineCarrieVideo();
}

function loadAvatar() {
  try {
    const a = localStorage.getItem("carrie_avatar");
    if (a === "james" || a === "azreen" || a === "carrie") {
      currentAvatar = a;
    }
  } catch (e) {}
  applyAvatarStyles();
  updateInlineCarrieVideo();
}

// Mode buttons

if (modeBusinessBtn) {
  modeBusinessBtn.addEventListener("click", () => {
    saveRomanceMode("none");
    saveMode("business");
  });
}
if (modePersonalBtn) {
  modePersonalBtn.addEventListener("click", () => {
    saveRomanceMode("none");
    saveMode("personal");
  });
}
if (modeGirlfriendBtn) {
  modeGirlfriendBtn.addEventListener("click", () => {
    saveMode("personal");
    saveRomanceMode("girlfriend");
  });
}
if (modeBoyfriendBtn) {
  modeBoyfriendBtn.addEventListener("click", () => {
    saveMode("personal");
    saveRomanceMode("boyfriend");
  });
}

// Avatar buttons

if (avatarCarrieBtn) {
  avatarCarrieBtn.addEventListener("click", () => saveAvatar("carrie"));
}
if (avatarJamesBtn) {
  avatarJamesBtn.addEventListener("click", () => saveAvatar("james"));
}
if (avatarAzreenBtn) {
  avatarAzreenBtn.addEventListener("click", () => saveAvatar("azreen"));
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
}

if (trainerBtn) {
  trainerBtn.addEventListener("click", openTrainer);
}
if (trainerClose) {
  trainerClose.addEventListener("click", closeTrainer);
}
if (trainerCancel) {
  trainerCancel.addEventListener("click", closeTrainer);
}

if (trainerForm) {
  trainerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!trainerQuestion || !trainerAnswer) return;

    const q = trainerQuestion.value.trim();
    const a = trainerAnswer.value.trim();
    if (!q || !a) {
      if (trainerStatus) {
        trainerStatus.textContent = "Please fill in both fields.";
        trainerStatus.style.display = "block";
        trainerStatus.style.color = "#fca5a5";
      }
      return;
    }

    // Add to local scripts list
    carrieScripts.push({
      id: "custom_" + Date.now(),
      patterns: [q],
      reply: a,
    });

    // Optional: save to Supabase if you have a table (safe no-op on error)
    if (supabase && currentUserEmail === "8bfr.music@gmail.com") {
      try {
        await supabase.from("carrie_custom_scripts").insert({
          pattern: q,
          reply_html: a,
          created_by: currentUserEmail,
        });
      } catch (err) {
        console.warn("Failed to save custom script to Supabase", err);
      }
    }

    trainerQuestion.value = "";
    trainerAnswer.value = "";

    if (trainerStatus) {
      trainerStatus.textContent = "Saved. Carrie will now recognize that pattern.";
      trainerStatus.style.display = "block";
      trainerStatus.style.color = "#bbf7d0";
    }
  });
}

// ------- Auth + owner detection

async function initAuth() {
  if (!supabase) {
    if (sessionLabelEl) {
      sessionLabelEl.textContent = "Offline chat — Supabase not loaded.";
    }
    return;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data || !data.session) {
      if (sessionLabelEl) {
        sessionLabelEl.textContent =
          "Guest chat — log in to save history and unlock trainer.";
      }
      if (trainerBtn) {
        trainerBtn.classList.add("hidden");
      }
      return;
    }

    const user = data.session.user;
    currentUserId = user.id;
    currentUserEmail = user.email || null;

    if (sessionLabelEl) {
      sessionLabelEl.textContent = `Logged in as ${currentUserEmail || "user"}`;
    }

    if (currentUserEmail === "8bfr.music@gmail.com" && trainerBtn) {
      trainerBtn.classList.remove("hidden");
    } else if (trainerBtn) {
      trainerBtn.classList.add("hidden");
    }
  } catch (e) {
    console.warn("Auth check failed", e);
    if (sessionLabelEl) {
      sessionLabelEl.textContent = "Login check failed — using guest chat.";
    }
  }
}

// ------- Form + input handling

function initForm() {
  if (!formEl || !inputEl) return;

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit();
    }
  });

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = (inputEl.value || "").trim();
    if (!text) return;

    renderMessage("user", text, new Date());
    await saveMessage("user", text);
    inputEl.value = "";

    showTyping();

    setTimeout(async () => {
      const reply = carrieBrain(text);
      renderMessage("assistant", reply, new Date());
      await saveMessage("assistant", reply);
      hideTyping();
    }, 450);
  });
}

// ------- Init

(function initCarrieChatPage() {
  ensureInlineCarrie();
  loadMode();
  loadAvatar();
  initAuth();
  initForm();
})();

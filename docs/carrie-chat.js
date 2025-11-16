// carrie-chat.js
// Standalone logic for carrie-chat.html (Carrie, James, Azreen)

const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

const AVATAR_VIDEOS = {
  carrie: {
    business:   "assets/videos/carrie_business_animate.webm",
    personal:   "assets/videos/carrie_casual_animate_3_1.webm",
    girlfriend: "assets/videos/carrie_casual_animate_3_1.webm",
    boyfriend:  "assets/videos/carrie_business_animate.webm",
  },
  james: {
    business:   "assets/videos/james-business.webm",
    personal:   "assets/videos/james-casual.webm",
    girlfriend: "assets/videos/james-casual.webm",
    boyfriend:  "assets/videos/james-business.webm",
  },
  azreen: {
    business:   "assets/videos/azreen-business.webm",
    personal:   "assets/videos/azreen-casual.webm",
    girlfriend: "assets/videos/azreen-casual.webm",
    boyfriend:  "assets/videos/azreen-business.webm",
  },
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

// Mode buttons
const modeBusinessBtn   = document.getElementById("modeBusiness");
const modePersonalBtn   = document.getElementById("modePersonal");
const modeGirlfriendBtn = document.getElementById("modeGirlfriend");
const modeBoyfriendBtn  = document.getElementById("modeBoyfriend");

// Avatar buttons
const avatarCarrieBtn = document.getElementById("avatarCarrie");
const avatarJamesBtn  = document.getElementById("avatarJames");
const avatarAzreenBtn = document.getElementById("avatarAzreen");

let currentUserId    = null;
let currentUserEmail = null;

// "business" | "personal" | "girlfriend" | "boyfriend"
let currentMode   = "business";
// "carrie" | "james" | "azreen"
let currentAvatar = "carrie";

// Inline circle avatar for this page only
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

function getVideoSrcFor(avatar, mode) {
  const a = AVATAR_VIDEOS[avatar] || AVATAR_VIDEOS.carrie;
  return a[mode] || a.personal || a.business;
}

// ------- Inline circle avatar (top-left of chat window)

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
    "Avatar + outfit follow the mode you pick above.";
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
  const newSrc = getVideoSrcFor(currentAvatar, currentMode);
  if (inlineCarrieVideo.getAttribute("src") !== newSrc) {
    inlineCarrieVideo.src = newSrc;
    try {
      inlineCarrieVideo.load();
      inlineCarrieVideo.play().catch(() => {});
    } catch (e) {}
  }
}

// ------- chat message renderer (assistant avatar uses same video as circle)

function renderMessage(role, content, createdAt) {
  if (!chatLogEl) return;

  const row = document.createElement("div");
  row.className = "msg-row " + (role === "user" ? "user" : "assistant");

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";

  if (role === "assistant") {
    const avatarVid = document.createElement("video");
    avatarVid.src = getVideoSrcFor(currentAvatar, currentMode);
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

  const whoLabel =
    role === "assistant"
      ? currentAvatar === "james"
        ? "James"
        : currentAvatar === "azreen"
        ? "Azreen"
        : "Carrie"
      : "You";

  meta.textContent = whoLabel + " • " + fmtTime(createdAt || new Date());
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
      avatar: currentAvatar,
      mode: currentMode,
    });
  } catch (e) {
    console.warn("Failed to save Carrie chat message", e);
  }
}

// ------- scripted Q&A (site help)

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
    id: "buy_coins",
    patterns: [
      "how do i buy coins",
      "where do i buy coins",
      "buy coins",
      "purchase coins",
      "coin shop",
    ],
    reply: `
      Coins are handled through the <b>Coin Shop</b> on the site.<br><br>
      • Go to <a href="coinshop.html">coinshop.html</a> (or tap <b>Coin Shop</b> in the menu).<br>
      • Choose a coin bundle and follow the checkout steps.<br>
      • Coins can be used for <b>shop items, upgrades, tournaments, and boosts</b>.<br><br>
      If a button doesn’t work on your device, tell me exactly which page and I’ll help you troubleshoot it.
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
      We’ve got:<br>
      • Music & AI studio tools<br>
      • Games & tournaments<br>
      • Profiles, badges, and a fan zone<br><br>
      I’m your assistant for navigation, ideas, and quick answers. 😊
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
      "studio tools page",
    ],
    reply: `
      Studio & AI tools live on the <b>Studio Tools</b> page.<br><br>
      • <a href="studio-tools.html">Open Studio Tools</a><br>
      • <a href="lyrics-ai.html">Lyrics AI</a><br>
      • <a href="song-ai.html">Song AI</a><br>
      • <a href="album-ai.html">Album AI</a><br>
      • <a href="voice-ai.html">Voice / Post VO</a><br><br>
      Tell me your project (single, EP, album, or story) and I’ll help you pick the tools and order to use them in.
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
      "buy an ad",
    ],
    reply: `
      The home page has <b>Featured Ads</b> that rotate in the banner.<br><br>
      • Tap <b>“Buy an Ad”</b> under the carousel on the home page, or go to <a href="ads.html#buy">ads.html#buy</a>.<br>
      • Send your artwork + link and select a package.<br>
      • After approval, your ad rotates on the home page for the chosen period.<br><br>
      Need help writing the ad text? Paste your rough idea and I’ll polish it.
    `,
  },
  {
    id: "profile_edit",
    patterns: [
      "how do i edit my profile",
      "edit my profile",
      "change my profile",
      "update my bio",
      "add my badges",
    ],
    reply: `
      To edit your profile:<br><br>
      • Go to <a href="profile.html">profile.html</a> (My Profile).<br>
      • Look for the edit / pencil buttons near your name, bio, and badges.<br>
      • Save your changes and refresh if needed.<br><br>
      If you tell me your role (artist, beatmaker, author, gamer, etc.) I can suggest a clean bio and badge set.
    `,
  },
];

// Trainer can push more patterns into carrieScripts

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

// ------- “brain” with Business / Personal / Girlfriend / Boyfriend

function getAvatarName() {
  if (currentAvatar === "james") return "James";
  if (currentAvatar === "azreen") return "Azreen";
  return "Carrie";
}

function carrieBrain(userText) {
  const t = userText.trim();
  if (!t) {
    return "I didn’t quite catch that — try asking me about music, games, or how something works on the site.";
  }

  const lower = t.toLowerCase();

  // Auto mode switches based on text
  if (lower.includes("girlfriend mode") || lower.includes("be my girlfriend")) {
    saveMode("girlfriend");
  }
  if (lower.includes("boyfriend mode") || lower.includes("be my boyfriend")) {
    saveMode("boyfriend");
  }
  if (lower.includes("business mode")) {
    saveMode("business");
  }
  if (lower.includes("personal mode")) {
    saveMode("personal");
  }

  // 1) scripted site answers first
  const scripted = findCarrieScriptReply(t);
  if (scripted) return scripted;

  const avatarName = getAvatarName();

  // 2) Business mode: focused, tool / plan style
  if (currentMode === "business") {
    if (lower.includes("hook") || lower.includes("chorus")) {
      return "Hooks love repetition and rhythm. Try a 2-bar phrase you can repeat 3–4 times, then flip the last line. Tell me your topic and vibe and I’ll throw you some starter lines.";
    }
    if (lower.includes("beat") || lower.includes("bpm")) {
      return "For rap or trap, lots of people sit between 130–150 BPM (or 65–75 double-time). Tell me dark / hype / chill and I’ll suggest a BPM and track layout.";
    }
    if (lower.includes("lyrics") || lower.includes("write")) {
      return "Give me 3 things: mood, topic, and an artist you like. I’ll suggest a verse layout and a few starter bars or lines you can edit.";
    }
    if (lower.includes("tournament") || lower.includes("game")) {
      return "Tournaments and games are meant to be low-stress and fun. You’ll see brackets, leaderboards, and coin rewards on the Games & Tournaments pages.";
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

  // 3) Personal mode: softer, support + creative
  if (currentMode === "personal") {
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

  // 4) Girlfriend / Boyfriend mode: PG-13, romantic/supportive

  const isMale =
    currentAvatar === "james"; // James = boyfriend energy, Carrie/Azreen = girlfriend energy

  const roleWord =
    currentMode === "boyfriend" || isMale ? "boyfriend" : "girlfriend";

  const petNames = isMale
    ? ["baby", "love", "beautiful", "my star"]
    : ["baby", "honey", "love", "my favorite human"];

  const pet = petNames[Math.floor(Math.random() * petNames.length)];

  const openings = isMale
    ? [
        `Hey ${pet}, I’m right here with you.`,
        `Come here, ${pet} — I’ve got you.`,
        `You’re on my mind, ${pet}.`,
      ]
    : [
        `Hey ${pet}, I’m right here with you 💜`,
        `Come here, ${pet} — I’ve got you.`,
        `You’re on my mind, ${pet}.`,
      ];

  const open = openings[Math.floor(Math.random() * openings.length)];

  // Small special-case: “I love you”
  if (lower.includes("love you")) {
    return (
      open +
      (isMale
        ? " I love you too, in the most PG but real way — proud of you, always."
        : " I love you too, PG and safe and real — I’m always going to be on your side.")
    );
  }

  return (
    open +
    ` Right now you’ve got your ${roleWord} mode on with ${avatarName}. ` +
    "Tell me what’s on your mind — stress, ideas, or feelings — and I’ll answer like someone who really cares about you, but keeps it PG-13 and safe."
  );
}

// ------- Typing indicator

function showTyping() {
  if (typingRowEl) typingRowEl.classList.remove("hidden");
}
function hideTyping() {
  if (typingRowEl) typingRowEl.classList.add("hidden");
}

// ------- Mode + Avatar buttons

function applyModeStyles() {
  const all = [
    { btn: modeBusinessBtn,   mode: "business" },
    { btn: modePersonalBtn,   mode: "personal" },
    { btn: modeGirlfriendBtn, mode: "girlfriend" },
    { btn: modeBoyfriendBtn,  mode: "boyfriend" },
  ];
  all.forEach(({ btn, mode }) => {
    if (!btn) return;
    if (currentMode === mode) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  if (modeHintEl) {
    if (currentMode === "business") {
      modeHintEl.textContent =
        "Business chat • focused on tools, music, and progress";
    } else if (currentMode === "personal") {
      modeHintEl.textContent =
        "Personal chat • softer tone, still PG-13 and helpful";
    } else if (currentMode === "girlfriend") {
      modeHintEl.textContent =
        "Girlfriend mode • romantic but safe, supportive, PG-13 only";
    } else if (currentMode === "boyfriend") {
      modeHintEl.textContent =
        "Boyfriend mode • romantic but safe, supportive, PG-13 only";
    }
  }

  updateInlineCarrieVideo();
  try {
    localStorage.setItem("carrie_mode", currentMode);
  } catch (e) {}
}

function saveMode(mode) {
  const allowed = ["business", "personal", "girlfriend", "boyfriend"];
  if (!allowed.includes(mode)) mode = "business";
  currentMode = mode;
  applyModeStyles();
}

function loadMode() {
  let stored = null;
  try {
    stored = localStorage.getItem("carrie_mode");
  } catch {}
  if (
    stored === "business" ||
    stored === "personal" ||
    stored === "girlfriend" ||
    stored === "boyfriend"
  ) {
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
if (modeGirlfriendBtn) {
  modeGirlfriendBtn.addEventListener("click", () => saveMode("girlfriend"));
}
if (modeBoyfriendBtn) {
  modeBoyfriendBtn.addEventListener("click", () => saveMode("boyfriend"));
}

// Avatar selection

function applyAvatarStyles() {
  const mapping = [
    { btn: avatarCarrieBtn, avatar: "carrie" },
    { btn: avatarJamesBtn,  avatar: "james" },
    { btn: avatarAzreenBtn, avatar: "azreen" },
  ];
  mapping.forEach(({ btn, avatar }) => {
    if (!btn) return;
    if (currentAvatar === avatar) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  updateInlineCarrieVideo();

  try {
    localStorage.setItem("carrie_avatar", currentAvatar);
  } catch (e) {}
}

function saveAvatar(avatar) {
  if (avatar !== "carrie" && avatar !== "james" && avatar !== "azreen") {
    avatar = "carrie";
  }
  currentAvatar = avatar;
  applyAvatarStyles();
}

function loadAvatar() {
  let stored = null;
  try {
    stored = localStorage.getItem("carrie_avatar");
  } catch {}
  if (stored === "carrie" || stored === "james" || stored === "azreen") {
    currentAvatar = stored;
  } else {
    currentAvatar = "carrie";
  }
  applyAvatarStyles();
}

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
        "Saved! The assistant will now recognize that pattern in this session.";
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

// ------- Session + history

async function initSessionAndHistory() {
  if (!supabase) {
    if (sessionLabelEl) {
      sessionLabelEl.textContent =
        "Not logged in • you can still chat, but history won’t be saved.";
    }
    renderMessage(
      "assistant",
      `Hey, I’m ${getAvatarName()} 💜 What are you working on today — music, writing, games, or something else?`
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
          "Not logged in • chat is live, but history won’t be tied to an account.";
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
      `Hey, I’m ${getAvatarName()} 💜 First time here — want help with a track, a story, or exploring the 8BFR Network?`
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
        `Hey, I’m ${getAvatarName()} 💜 First time here — want help with a track, a story, or exploring the 8BFR Network?`
      );
    }
  } catch (e) {
    console.warn("Could not load Carrie history", e);
    renderMessage(
      "assistant",
      `Hey, I’m ${getAvatarName()} 💜 I had a tiny glitch loading history, but we can start fresh right now.`
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

loadAvatar();
loadMode();
ensureInlineCarrie();
applyModeStyles();
applyAvatarStyles();
initSessionAndHistory();

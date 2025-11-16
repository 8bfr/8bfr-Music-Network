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

const modeBusinessBtn      = document.getElementById("modeBusiness");
const modePersonalBtn      = document.getElementById("modePersonal");
const personaNeutralBtn    = document.getElementById("personaNeutral");
const personaGirlfriendBtn = document.getElementById("personaGirlfriend");

let currentUserId    = null;
let currentUserEmail = null;
let currentMode      = "business";  // "business" | "personal"
let currentPersona   = "neutral";   // "neutral" | "girlfriend"

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

// ------- Mode + Persona persistence

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
}

function savePersona(persona) {
  currentPersona = persona;
  try {
    localStorage.setItem("carrie_persona", persona);
  } catch {}
  applyModeStyles();
}

function loadPersona() {
  let stored = null;
  try {
    stored = localStorage.getItem("carrie_persona");
  } catch {}
  if (stored === "girlfriend" || stored === "neutral") {
    currentPersona = stored;
  } else {
    currentPersona = "neutral";
  }
}

// ------- Carrie brain with Business / Personal / Girlfriend

function carrieBrain(userText) {
  const t = userText.trim();
  if (!t) {
    return "I didn’t quite catch that — try asking me about music, games, or how 8BFR works.";
  }

  const lower = t.toLowerCase();

  // 0) Persona commands (secret phrases)
  if (
    lower.includes("girlfriend mode") ||
    lower.includes("gf mode") ||
    lower.includes("act like my girlfriend") ||
    lower.includes("be my girlfriend")
  ) {
    saveMode("personal");
    savePersona("girlfriend");
    return "Okay baby 💜 Switching to girlfriend mode — still PG, but I’m here like your girl now. What’s going on with you?";
  }

  if (
    lower.includes("normal mode") ||
    lower.includes("back to normal") ||
    lower.includes("turn off girlfriend") ||
    lower.includes("stop girlfriend")
  ) {
    savePersona("neutral");
    return "Got it 💜 I’ll dial it back to normal personal mode, but I’m still right here for you.";
  }

  // 1) scripted answers first
  const scripted = findCarrieScriptReply(t);
  if (scripted) return scripted;

  // 2) business mode
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

  // 3) personal mode (normal or girlfriend)
  if (currentPersona === "girlfriend") {
    const gfStarters = [
      "Baby, I hear you 💜",
      "Hey love, I’ve got you.",
      "Come here, I’m right here with you.",
      "Okay honey, let’s talk about it.",
    ];
    const line = gfStarters[Math.floor(Math.random() * gfStarters.length)];
    return (
      line +
      " Tell me what’s on your mind — good or bad — and I’ll be your supportive girlfriend, no judgment, all PG cuddles and hype."
    );
  }

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

// ------- Mode + Persona toggle (also updates circle + avatar + hint)

function applyModeStyles() {
  // ---- Mode buttons ----
  if (modeBusinessBtn && modePersonalBtn) {
    if (currentMode === "business") {
      modeBusinessBtn.style.background   = "rgba(88,28,135,0.9)";
      modeBusinessBtn.style.borderColor  = "#a855f7";
      modeBusinessBtn.style.color        = "#fff";

      modePersonalBtn.style.background   = "transparent";
      modePersonalBtn.style.borderColor  = "transparent";
      modePersonalBtn.style.color        = "rgba(233,213,255,0.8)";
    } else {
      modePersonalBtn.style.background   = "rgba(88,28,135,0.9)";
      modePersonalBtn.style.borderColor  = "#a855f7";
      modePersonalBtn.style.color        = "#fff";

      modeBusinessBtn.style.background   = "transparent";
      modeBusinessBtn.style.borderColor  = "transparent";
      modeBusinessBtn.style.color        = "rgba(233,213,255,0.8)";
    }
  }

  // ---- Persona buttons ----
  if (personaNeutralBtn && personaGirlfriendBtn) {
    if (currentPersona === "girlfriend") {
      personaGirlfriendBtn.style.background  = "rgba(88,28,135,0.9)";
      personaGirlfriendBtn.style.borderColor = "#a855f7";
      personaGirlfriendBtn.style.color       = "#fff";

      personaNeutralBtn.style.background     = "transparent";
      personaNeutralBtn.style.borderColor    = "transparent";
      personaNeutralBtn.style.color          = "rgba(233,213,255,0.8)";
    } else {
      personaNeutralBtn.style.background     = "rgba(88,28,135,0.9)";
      personaNeutralBtn.style.borderColor    = "#a855f7";
      personaNeutralBtn.style.color          = "#fff";

      personaGirlfriendBtn.style.background  = "transparent";
      personaGirlfriendBtn.style.borderColor = "transparent";
      personaGirlfriendBtn.style.color       = "rgba(233,213,255,0.8)";
    }
  }

  // ---- Hint text ----
  if (modeHintEl) {
    let hintText;
    if (currentMode === "business") {
      hintText = "Business chat • focused on tools, music, and progress";
    } else {
      if (currentPersona === "girlfriend") {
        hintText = "Girlfriend mode • affectionate, PG-13, supportive";
      } else {
        hintText = "Personal chat • softer tone, still PG-13 and helpful";
      }
    }
    modeHintEl.textContent = hintText;
  }

  // ---- Update the inline Carrie circle video ----
  updateInlineCarrieVideo();
}

// Mode button listeners
if (modeBusinessBtn) {
  modeBusinessBtn.addEventListener("click", () => saveMode("business"));
}
if (modePersonalBtn) {
  modePersonalBtn.addEventListener("click", () => saveMode("personal"));
}

// Persona button listeners
if (personaNeutralBtn) {
  personaNeutralBtn.addEventListener("click", () => {
    savePersona("neutral");
  });
}
if (personaGirlfriendBtn) {
  personaGirlfriendBtn.addEventListener("click", () => {
    saveMode("personal");
    savePersona("girlfriend");
  });
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
loadPersona();
ensureInlineCarrie();
applyModeStyles();
initSessionAndHistory();

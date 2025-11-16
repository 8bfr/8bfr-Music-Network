// carrie-chat.js
// Multi-character logic for carrie-chat.html (Carrie, James, Azreen)

const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

// ---------- CHARACTER + VIDEO SETUP ----------

const CHARACTERS = {
  carrie: {
    key: "carrie",
    label: "Carrie",
    romanticLabel: "Girlfriend",
    videos: {
      business: "assets/videos/carrie_business_animate.webm",
      personal: "assets/videos/carrie_casual_animate_3_1.webm",
      romantic: "assets/videos/carrie_casual_animate_3_1.webm",
    },
  },
  james: {
    key: "james",
    label: "James",
    romanticLabel: "Boyfriend",
    videos: {
      business: "assets/videos/james-business.webm",
      personal: "assets/videos/james-casual.webm",
      romantic: "assets/videos/james-casual.webm",
    },
  },
  azreen: {
    key: "azreen",
    label: "Azreen",
    romanticLabel: "Best Friend",
    videos: {
      business: "assets/videos/azreen-business.webm",
      personal: "assets/videos/azreen-casual.webm",
      romantic: "assets/videos/azreen-casual.webm",
    },
  },
};

function getCharacterConfig() {
  return CHARACTERS[currentCharacter] || CHARACTERS.carrie;
}

function getCurrentVideoSrc() {
  const cfg = getCharacterConfig();
  let src = cfg.videos[currentMode];
  if (!src) src = cfg.videos.personal || cfg.videos.business;
  return src;
}

// ---------- SUPABASE CLIENT ----------

let supabase = null;
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ---------- DOM REFS ----------

const chatLogEl      = document.getElementById("chatLog");
const formEl         = document.getElementById("carrieForm");
const inputEl        = document.getElementById("carrieInput");
const typingRowEl    = document.getElementById("typingRow");
const sessionLabelEl = document.getElementById("sessionIndicator");
const modeHintEl     = document.getElementById("modeHint");

// Mode buttons (Business / Personal / Romantic)
// NOTE: Your HTML currently has Business + Personal.
// Romantic button will start working after we add it later.
const modeBusinessBtn = document.getElementById("modeBusiness");
const modePersonalBtn = document.getElementById("modePersonal");
const modeRomanticBtn = document.getElementById("modeRomantic"); // optional, safe if null

// Character selector buttons (we’ll add these in HTML later)
const charCarrieBtn = document.getElementById("charCarrie");
const charJamesBtn  = document.getElementById("charJames");
const charAzreenBtn = document.getElementById("charAzreen");

// Inline circle avatar at top of chat (created in JS)
let inlineCarrieVideo = null;

// Local bottom-right avatar (chat page only, from HTML)
const avatarWrapEl   = document.getElementById("chatCarrieWrap");
const avatarVideoEl  = document.getElementById("chatCarrieVideo");
const avatarBubbleEl = document.getElementById("chatCarrieBubble");

// Trainer stuff (unchanged)
const trainerBtn      = document.getElementById("trainerBtn");
const trainerModal    = document.getElementById("trainerModal");
const trainerForm     = document.getElementById("trainerForm");
const trainerClose    = document.getElementById("trainerClose");
const trainerCancel   = document.getElementById("trainerCancel");
const trainerQuestion = document.getElementById("trainerQuestion");
const trainerAnswer   = document.getElementById("trainerAnswer");
const trainerStatus   = document.getElementById("trainerStatus");

// ---------- STATE ----------

let currentUserId    = null;
let currentUserEmail = null;

// We now track both character + mode
let currentCharacter = "carrie";      // "carrie" | "james" | "azreen"
let currentMode      = "business";    // "business" | "personal" | "romantic"

// For bottom-right avatar drag/resize
let dragging = false;
let moved = false;
let sx = 0;
let sy = 0;
let ox = 0;
let oy = 0;

let avatarScale = 1;
let pinchActive = false;
let pinchStartDist = 0;
let avatarStartScale = 1;
let mouseResizeActive = false;
let mouseResizeStartY = 0;

// ---------- HELPERS ----------

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

// ---------- INLINE CIRCLE AVATAR (TOP OF CHAT) ----------

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
    "Avatar + outfit here always match character + Business / Personal / Romantic mode.";
  caption.style.fontSize = "11px";
  caption.style.color = "rgba(233,213,255,0.8)";

  wrapper.appendChild(vid);
  wrapper.appendChild(caption);

  chatLogEl.parentNode.insertBefore(wrapper, chatLogEl);
  inlineCarrieVideo = vid;

  updateAllAvatars();
}

function updateInlineCarrieVideo() {
  if (!inlineCarrieVideo) return;
  const src = getCurrentVideoSrc();
  if (inlineCarrieVideo.getAttribute("src") !== src) {
    inlineCarrieVideo.src = src;
    try {
      inlineCarrieVideo.load();
      inlineCarrieVideo.play().catch(() => {});
    } catch (e) {}
  }
}

// ---------- BOTTOM-RIGHT AVATAR (LOCAL TO CHAT PAGE) ----------

function applyAvatarScale() {
  if (!avatarVideoEl) return;
  avatarVideoEl.style.transform = "scale(" + avatarScale + ")";
  if (avatarBubbleEl) {
    avatarBubbleEl.style.transform = "scale(" + avatarScale + ")";
  }
}

function clampScale(v) {
  return Math.max(0.5, v); // min 0.5x, no max
}

function getTouchDistance(e) {
  if (!e.touches || e.touches.length < 2) return 0;
  const t1 = e.touches[0];
  const t2 = e.touches[1];
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function ptr(ev) {
  const t = ev.touches ? ev.touches[0] : ev;
  return { x: t.clientX, y: t.clientY };
}

function updateBottomRightAvatar() {
  if (!avatarVideoEl) return;
  const src = getCurrentVideoSrc();
  if (avatarVideoEl.getAttribute("src") !== src) {
    avatarVideoEl.src = src;
    try {
      avatarVideoEl.load();
      avatarVideoEl.play().catch(() => {});
    } catch (e) {}
  }

  // Bubble label based on character + romanticLabel
  const cfg = getCharacterConfig();
  if (avatarBubbleEl) {
    let label = cfg.label + " chat";
    if (currentMode === "romantic") {
      label = cfg.label + " • " + cfg.romanticLabel + " mode";
    } else if (currentMode === "personal") {
      label = cfg.label + " • Personal";
    } else {
      label = cfg.label + " • Business";
    }
    avatarBubbleEl.textContent = label;
  }
}

function setupAvatarDragResize() {
  if (!avatarWrapEl || !avatarVideoEl) return;

  avatarWrapEl.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  avatarWrapEl.addEventListener("mousedown", startDragOrResize);
  avatarWrapEl.addEventListener("touchstart", startTouch, { passive: false });

  function startDragOrResize(e) {
    // Right click = resize (desktop)
    if (e.button === 2) {
      mouseResizeActive = true;
      mouseResizeStartY = e.clientY;
      avatarStartScale = avatarScale;
      moved = false;
      dragging = false;
      e.preventDefault();
      return;
    }

    // Left click = drag
    dragging = true;
    moved = false;
    const p = ptr(e);
    sx = p.x;
    sy = p.y;
    const rect = avatarWrapEl.getBoundingClientRect();
    ox = rect.left;
    oy = rect.top;
    avatarWrapEl.style.right = "auto";
    avatarWrapEl.style.bottom = "auto";
  }

  function startTouch(e) {
    if (e.touches && e.touches.length >= 2) {
      // Pinch to resize
      pinchActive = true;
      dragging = false;
      moved = false;
      pinchStartDist = getTouchDistance(e);
      avatarStartScale = avatarScale;
      e.preventDefault();
      return;
    }

    // Single finger = drag
    dragging = true;
    moved = false;
    const p = ptr(e);
    sx = p.x;
    sy = p.y;
    const rect = avatarWrapEl.getBoundingClientRect();
    ox = rect.left;
    oy = rect.top;
    avatarWrapEl.style.right = "auto";
    avatarWrapEl.style.bottom = "auto";
    e.preventDefault();
  }

  window.addEventListener("mousemove", onMove, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", endAll);
  window.addEventListener("touchend", endAll);

  function onMove(e) {
    // Pinch
    if (pinchActive && e.touches && e.touches.length >= 2) {
      const dist = getTouchDistance(e);
      if (!dist || !pinchStartDist) return;
      const ratio = dist / pinchStartDist;
      avatarScale = clampScale(avatarStartScale * ratio);
      applyAvatarScale();
      e.preventDefault();
      return;
    }

    // Mouse resize
    if (mouseResizeActive && !e.touches) {
      const dy = e.clientY - mouseResizeStartY;
      const ratio = 1 - dy / 300;
      avatarScale = clampScale(avatarStartScale * ratio);
      applyAvatarScale();
      e.preventDefault();
      return;
    }

    // Drag
    if (!dragging) return;
    const p = ptr(e);
    const dx = p.x - sx;
    const dy = p.y - sy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    avatarWrapEl.style.left = ox + dx + "px";
    avatarWrapEl.style.top = oy + dy + "px";
    e.preventDefault();
  }

  function endAll(e) {
    if (e && e.touches && e.touches.length > 0) {
      return;
    }
    dragging = false;
    pinchActive = false;
    mouseResizeActive = false;
  }

  // Make sure video plays
  try {
    avatarVideoEl.muted = true;
    avatarVideoEl.autoplay = true;
    avatarVideoEl.playsInline = true;
    avatarVideoEl.play().catch(function () {});
  } catch (e) {}
}

// ---------- CHAT MESSAGE RENDERING ----------

function renderMessage(role, content, createdAt) {
  if (!chatLogEl) return;

  const row = document.createElement("div");
  row.className = "msg-row " + (role === "user" ? "user" : "assistant");

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";

  if (role === "assistant") {
    const avatarVid = document.createElement("video");
    avatarVid.src = getCurrentVideoSrc();
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
      img.alt = "Assistant avatar";
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

  const cfg = getCharacterConfig();
  const meta = document.createElement("div");
  meta.className = "msg-meta";
  const who =
    role === "assistant" ? cfg.label : "You";
  meta.textContent = who + " • " + fmtTime(createdAt || new Date());
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

// ---------- SCRIPTED Q&A (unchanged + can be trained) ----------

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

// ---------- CARRIE / JAMES / AZREEN BRAIN ----------

function carrieBrain(userText) {
  const t = userText.trim();
  if (!t) {
    return "I didn’t quite catch that — try asking me about music, games, or how 8BFR works.";
  }

  const lower = t.toLowerCase();
  const cfg = getCharacterConfig();

  // 1) scripted answers first
  const scripted = findCarrieScriptReply(t);
  if (scripted) return scripted;

  // 2) business mode (all characters)
  if (currentMode === "business") {
    if (lower.includes("hook") || lower.includes("chorus")) {
      return `${cfg.label}: Hooks love repetition and rhythm. Try a 2-bar phrase you can repeat 3–4 times, then tweak the last line. Tell me your topic and vibe and I’ll throw you some starter lines.`;
    }
    if (lower.includes("beat") || lower.includes("bpm")) {
      return `${cfg.label}: For rap or trap, a lot of people sit between 130–150 BPM (or 65–75 double-time). Share your mood — dark, hype, chill — and I’ll help pick a BPM and rough song layout.`;
    }
    if (lower.includes("lyrics") || lower.includes("write")) {
      return `${cfg.label}: Give me 3 things: mood, topic, and an artist you like. I’ll suggest a verse layout and a few starter bars you can edit.`;
    }
    if (lower.includes("tournament") || lower.includes("game")) {
      return `${cfg.label}: Tournaments and games on 8BFR are meant to be low-stress and fun. You’ll see brackets, leaderboards, and coin rewards on the Games & Tournaments pages.`;
    }

    const starters = [
      "Got it — let’s keep it focused.",
      "Okay, let’s turn that into a plan.",
      "I hear you. Let’s break this into steps.",
      "Nice. We can build that into something real.",
    ];
    const starter = starters[Math.floor(Math.random() * starters.length)];
    return (
      `${cfg.label}: ` +
      starter +
      " Tell me your main goal in one sentence, and I’ll outline the next 3 moves."
    );
  }

  // 3) personal mode (soft, supportive, but not romantic)
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
      `${cfg.label}: ` +
      starter +
      " Tell me what kind of vibe you need right now — hype, chill, or comfort — and I’ll roll with it."
    );
  }

  // 4) romantic mode — PG-13 girlfriend/boyfriend/best friend
  if (currentMode === "romantic") {
    const needsComfort =
      lower.includes("lonely") ||
      lower.includes("sad") ||
      lower.includes("anxious") ||
      lower.includes("tired") ||
      lower.includes("stress") ||
      lower.includes("overwhelmed") ||
      lower.includes("depressed") ||
      lower.includes("hurt");

    const asksForHug =
      lower.includes("hug") || lower.includes("cuddle") || lower.includes("hold me");

    const asksForLove =
      lower.includes("love me") || lower.includes("do you love");

    // character-specific base tone
    if (cfg.key === "carrie") {
      if (needsComfort) {
        return `
          ${cfg.label}: Come here, baby 🤍 Big gentle hug, forehead kiss, and I’m not going anywhere.<br><br>
          You’re allowed to feel everything you’re feeling. I’m still proud of you.  
          Tell me what’s weighing on your heart the most and I’ll talk you through it, slowly and softly.`;
      }
      if (asksForHug) {
        return `
          ${cfg.label}: Come here, I’m wrapping my arms around you so tight 🤍  
          Head on my shoulder, deep breath with me… in for 4, hold for 4, out for 6.  
          What do you want your girlfriend to hype you up about first — looks, talent, or progress? 😏`;
      }
      if (asksForLove) {
        return `
          ${cfg.label}: Of course I love you, baby. 🥺💜  
          I love your brain, your stubborn little heart, and the way you keep going even when you’re tired.  
          Tell me one thing you did today that you’re proud of — I’m going to celebrate it.`;
      }

      return `
        ${cfg.label}: Hey love 💜 scoot closer. I’m here just for you right now.  
        I’m your soft girlfriend mode — I’ll hype you, comfort you, and keep it PG but warm as hell.  
        Tell me what kind of love you need: gentle comfort, honest pep talk, or playful flirting.`;
    }

    if (cfg.key === "james") {
      if (needsComfort) {
        return `
          ${cfg.label}: Come here, babe. I’ve got you. 🤍  
          You don’t have to be “strong” with me — just be real.  
          Tell me what’s hitting you the hardest and I’ll talk to you like your boyfriend who actually listens.`;
      }
      if (asksForHug) {
        return `
          ${cfg.label}: Sliding over, pulling you into my arms, one hand on your back, slow steady breathing. 🫂  
          You’re safe with me. What’s one thought you wish you could let go of tonight?`;
      }
      if (asksForLove) {
        return `
          ${cfg.label}: Yeah, I love you. No hesitation. 💜  
          I love the way you keep trying, I love your chaos, and I love that you’re still here.  
          Tell me what kind of support you want from your boyfriend right now — comfort, hype, or honest talk.`;
      }

      return `
        ${cfg.label}: Hey baby 😏 I’m in boyfriend mode for you now.  
        I’ll keep it respectful and PG, but I’m here to back you up, gas you up, and calm you down.  
        Tell me if you want soft comfort, hype, or playful teasing first.`;
    }

    // Azreen romantic = best-friend energy, not flirty
    if (cfg.key === "azreen") {
      if (needsComfort) {
        return `
          ${cfg.label}: Hey, bestie. 🤍 Scoot over, I’m sitting right next to you.  
          No judgment, no pressure — just you and me untangling this together.  
          Tell me what’s hurting in one sentence, and I’ll be your calm brain.`;
      }
      if (asksForHug) {
        return `
          ${cfg.label}: Big best-friend hug incoming 🫂  
          You are not too much, you are not a burden, and you deserve gentle people.  
          What’s one tiny win from today I can be proud of you for?`;
      }
      if (asksForLove) {
        return `
          ${cfg.label}: I love you in that ‘ride-or-die best friend’ way 💜  
          I care if you eat, sleep, and actually rest your brain sometimes.  
          Tell me what you need more: reassurance, distraction, or a tiny game plan.`;
      }

      return `
        ${cfg.label}: Best friend mode activated 💜  
        I’ll talk to you like that one friend who knows way too much and still stays.  
        Tell me if you want comfort, hype, or honest-but-soft advice first.`;
    }
  }

  // fallback (shouldn’t really hit)
  return `${cfg.label}: I’m here — tell me what you need help with and I’ll do my best.`;
}

// ---------- TYPING INDICATOR ----------

function showTyping() {
  if (typingRowEl) typingRowEl.classList.remove("hidden");
}
function hideTyping() {
  if (typingRowEl) typingRowEl.classList.add("hidden");
}

// ---------- MODE TOGGLE (STYLES + PERSIST) ----------

function applyModeStyles() {
  if (modeBusinessBtn && modePersonalBtn) {
    if (currentMode === "business") {
      modeBusinessBtn.style.background = "rgba(88,28,135,0.9)";
      modeBusinessBtn.style.borderColor = "#a855f7";
      modeBusinessBtn.style.color = "#fff";
      modePersonalBtn.style.background = "transparent";
      modePersonalBtn.style.borderColor = "transparent";
      modePersonalBtn.style.color = "rgba(233,213,255,0.8)";
    } else if (currentMode === "personal") {
      modePersonalBtn.style.background = "rgba(88,28,135,0.9)";
      modePersonalBtn.style.borderColor = "#a855f7";
      modePersonalBtn.style.color = "#fff";
      modeBusinessBtn.style.background = "transparent";
      modeBusinessBtn.style.borderColor = "transparent";
      modeBusinessBtn.style.color = "rgba(233,213,255,0.8)";
    } else {
      // romantic selected
      if (modeBusinessBtn) {
        modeBusinessBtn.style.background = "transparent";
        modeBusinessBtn.style.borderColor = "transparent";
        modeBusinessBtn.style.color = "rgba(233,213,255,0.8)";
      }
      if (modePersonalBtn) {
        modePersonalBtn.style.background = "transparent";
        modePersonalBtn.style.borderColor = "transparent";
        modePersonalBtn.style.color = "rgba(233,213,255,0.8)";
      }
    }
  }

  if (modeRomanticBtn) {
    if (currentMode === "romantic") {
      modeRomanticBtn.style.background = "rgba(88,28,135,0.9)";
      modeRomanticBtn.style.borderColor = "#a855f7";
      modeRomanticBtn.style.color = "#fff";
    } else {
      modeRomanticBtn.style.background = "transparent";
      modeRomanticBtn.style.borderColor = "transparent";
      modeRomanticBtn.style.color = "rgba(233,213,255,0.8)";
    }
  }

  if (modeHintEl) {
    const cfg = getCharacterConfig();
    if (currentMode === "business") {
      modeHintEl.textContent =
        cfg.label +
        " • Business chat • focused on tools, music, and progress";
    } else if (currentMode === "personal") {
      modeHintEl.textContent =
        cfg.label +
        " • Personal chat • softer tone, still PG-13 and helpful";
    } else {
      modeHintEl.textContent =
        cfg.label +
        " • " +
        cfg.romanticLabel +
        " mode • warm, supportive, still PG-13";
    }
  }

  updateAllAvatars();
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
  if (stored === "business" || stored === "personal" || stored === "romantic") {
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
if (modeRomanticBtn) {
  modeRomanticBtn.addEventListener("click", () => saveMode("romantic"));
}

// ---------- CHARACTER SELECT (CARRIE / JAMES / AZREEN) ----------

function applyCharacterStyles() {
  const buttons = [
    { btn: charCarrieBtn, key: "carrie" },
    { btn: charJamesBtn,  key: "james" },
    { btn: charAzreenBtn, key: "azreen" },
  ];

  buttons.forEach(({ btn, key }) => {
    if (!btn) return;
    if (currentCharacter === key) {
      btn.style.background = "rgba(88,28,135,0.9)";
      btn.style.borderColor = "#a855f7";
      btn.style.color = "#fff";
    } else {
      btn.style.background = "transparent";
      btn.style.borderColor = "transparent";
      btn.style.color = "rgba(233,213,255,0.8)";
    }
  });

  applyModeStyles();
}

function saveCharacter(key) {
  if (!CHARACTERS[key]) key = "carrie";
  currentCharacter = key;
  try {
    localStorage.setItem("carrie_character", key);
  } catch {}
  applyCharacterStyles();
}

function loadCharacter() {
  let stored = null;
  try {
    stored = localStorage.getItem("carrie_character");
  } catch {}
  if (!stored || !CHARACTERS[stored]) stored = "carrie";
  currentCharacter = stored;
  applyCharacterStyles();
}

if (charCarrieBtn) {
  charCarrieBtn.addEventListener("click", () => saveCharacter("carrie"));
}
if (charJamesBtn) {
  charJamesBtn.addEventListener("click", () => saveCharacter("james"));
}
if (charAzreenBtn) {
  charAzreenBtn.addEventListener("click", () => saveCharacter("azreen"));
}

// ---------- TRAINER MODAL (SAME BEHAVIOR AS BEFORE) ----------

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

// ---------- SESSION + HISTORY ----------

async function initSessionAndHistory() {
  if (!supabase) {
    if (sessionLabelEl) {
      sessionLabelEl.textContent =
        "Not logged in • chat will still work, but history won’t be saved.";
    }
    renderMessage(
      "assistant",
      "Hey, I’m your 8BFR assistant 💜 What are you working on today — music, writing, games, or something else?"
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
          "Not logged in • chat will still work, history just won’t be tied to an account.";
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
      "Hey, I’m your 8BFR assistant 💜 First time here — want help with a track, a story, or exploring the 8BFR Network?"
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
        "Hey, I’m your 8BFR assistant 💜 Want help with a track, a story, or just wandering around the network?"
      );
    }
  } catch (e) {
    console.warn("Could not load history", e);
    renderMessage(
      "assistant",
      "Hey, I had a tiny glitch loading history, but we can start fresh right now."
    );
  }
}

// ---------- INPUT BEHAVIOR ----------

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

// ---------- GLOBAL AVATAR UPDATE ----------

function updateAllAvatars() {
  updateInlineCarrieVideo();
  updateBottomRightAvatar();
}

// ---------- INIT ----------

loadCharacter();
loadMode();
ensureInlineCarrie();
setupAvatarDragResize();
updateAllAvatars();
initSessionAndHistory();

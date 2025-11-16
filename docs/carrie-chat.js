// carrie-chat.js
// Logic ONLY for carrie-chat.html (does NOT touch global scripts.js)

(function () {
  const SUPABASE_URL = "https://novbuvwpjnxwwvdekjhr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

  const CARRIE_VIDEOS = {
    business: "assets/videos/carrie_business_animate.webm",
    personal: "assets/videos/carrie_casual_animate_3_1.webm",
  };

  // Local-only state
  let carrieChatMode = "business"; // "business" | "personal"
  let supabaseClient = null;

  let chatLogEl,
    formEl,
    inputEl,
    typingRowEl,
    sessionLabelEl,
    trainerBtn,
    trainerModal,
    trainerForm,
    trainerClose,
    trainerCancel,
    trainerQuestion,
    trainerAnswer,
    trainerStatus,
    modeBusinessBtn,
    modePersonalBtn;

  // Inline circle + bottom-right dock
  let inlineCarrieVideo = null;
  let dockCarrieVideo = null;

  let currentUserId = null;
  let currentUserEmail = null;

  // ----- helpers

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

  // ----- inline Carrie circle (above chat)

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
    caption.textContent =
      "Carrie’s outfit here follows the mode you pick: Business or Personal.";
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

    const newSrc =
      carrieChatMode === "business"
        ? CARRIE_VIDEOS.business
        : CARRIE_VIDEOS.personal;

    if (inlineCarrieVideo.getAttribute("src") !== newSrc) {
      inlineCarrieVideo.src = newSrc;
      try {
        inlineCarrieVideo.load();
        inlineCarrieVideo.play().catch(() => {});
      } catch (e) {}
    }
  }

  // ----- bottom-right Carrie dock (chat page only)

  function ensureDockCarrie() {
    if (dockCarrieVideo) return;

    const dock = document.createElement("div");
    dock.id = "carrieChatDock";
    dock.style.position = "fixed";
    dock.style.right = "16px";
    dock.style.bottom = "16px";
    dock.style.zIndex = "50";
    dock.style.width = "70px";
    dock.style.height = "70px";
    dock.style.borderRadius = "9999px";
    dock.style.border = "1px solid rgba(129,140,248,.9)";
    dock.style.boxShadow = "0 0 18px rgba(124,58,237,.75)";
    dock.style.overflow = "hidden";
    dock.style.background = "rgba(10,2,26,.95)";

    const vid = document.createElement("video");
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.style.width = "100%";
    vid.style.height = "100%";
    vid.style.objectFit = "cover";

    dock.appendChild(vid);
    document.body.appendChild(dock);

    dockCarrieVideo = vid;
    updateDockCarrieVideo();
  }

  function updateDockCarrieVideo() {
    if (!dockCarrieVideo) return;

    const newSrc =
      carrieChatMode === "business"
        ? CARRIE_VIDEOS.business
        : CARRIE_VIDEOS.personal;

    if (dockCarrieVideo.getAttribute("src") !== newSrc) {
      dockCarrieVideo.src = newSrc;
      try {
        dockCarrieVideo.load();
        dockCarrieVideo.play().catch(() => {});
      } catch (e) {}
    }
  }

  // ----- message renderer (tiny avatar per reply)

  function renderMessage(role, content, createdAt) {
    if (!chatLogEl) return;

    const row = document.createElement("div");
    row.className = "msg-row " + (role === "user" ? "user" : "assistant");

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";

    if (role === "assistant") {
      const avatarVid = document.createElement("video");
      avatarVid.src =
        carrieChatMode === "business"
          ? CARRIE_VIDEOS.business
          : CARRIE_VIDEOS.personal;

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
    if (!supabaseClient || !currentUserId) return;
    try {
      await supabaseClient.from("carrie_chat_logs").insert({
        user_id: currentUserId,
        role,
        content,
      });
    } catch (e) {
      console.warn("Failed to save Carrie chat message", e);
    }
  }

  // ----- scripted Q&A

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
    {
      id: "where_are_tools",
      patterns: [
        "where are the ai tools",
        "where are

// carrie-chat.js
// Front-end logic for the Carrie chat page only (carrie-chat.html).
// Does NOT touch Carrie Closet – that stays in carrie-closet*.js.

(function () {
  // --- Grab DOM nodes ---
  const chatLog        = document.getElementById("chatLog");
  const typingRow      = document.getElementById("typingRow");
  const form           = document.getElementById("carrieForm");
  const input          = document.getElementById("carrieInput");

  const chatModeToggle = document.getElementById("chatModeToggle");
  const chatModeMenu   = document.getElementById("chatModeMenu");
  const chatModeLabel  = document.getElementById("chatModeLabel");

  const avatarToggle   = document.getElementById("avatarToggle");
  const avatarMenu     = document.getElementById("avatarMenu");
  const avatarLabel    = document.getElementById("avatarLabel");

  const maintToggle    = document.getElementById("maintToggle");
  const maintMenu      = document.getElementById("maintMenu");
  const btnClearLocal  = document.getElementById("maintClearLocal");
  const btnSaveSelf    = document.getElementById("maintSaveSnapshot");
  const btnArchiveAll  = document.getElementById("maintArchiveAll");
  const btnToggleRole  = document.getElementById("maintToggleRole");
  const maintRoleLabel = document.getElementById("maintToggleRoleLabel");

  const shopToggle     = document.getElementById("shopToggle");
  const shopMenu       = document.getElementById("shopMenu");

  const trainerBtn     = document.getElementById("trainerBtn");
  const trainerModal   = document.getElementById("trainerModal");
  const trainerClose   = document.getElementById("trainerClose");
  const trainerCancel  = document.getElementById("trainerCancel");
  const trainerForm    = document.getElementById("trainerForm");
  const trainerStatus  = document.getElementById("trainerStatus");

  // Floating corner avatar (video)
  const chatVideo      = document.getElementById("chatCarrieVideo");
  const chatBubble     = document.getElementById("chatCarrieBubble");

  // If we’re somehow not on the chat page, bail quietly
  if (!chatLog || !form || !input) {
    console.warn("Carrie chat: required DOM nodes not found, exiting.");
    return;
  }

  // --- Owner toggle (local only) ---
  const OWNER_KEY = "8bfr_owner_mode";
  let isOwner = false;

  try {
    isOwner = localStorage.getItem(OWNER_KEY) === "1";
  } catch (e) {
    isOwner = false;
  }

  function updateOwnerUI() {
    if (maintRoleLabel) {
      maintRoleLabel.textContent = isOwner
        ? "View as regular user"
        : "View as owner";
    }
    if (trainerBtn) {
      if (isOwner) trainerBtn.classList.remove("hidden");
      else trainerBtn.classList.add("hidden");
    }
  }

  // --- Local state ---
  const LOG_KEY       = "carrie_chat_log_v1";
  const MODE_KEY      = "carrie_chat_mode_v1";
  const AVATAR_KEY    = "carrie_chat_avatar_v1";
  const ARCHIVE_KEY   = "carrie_chat_archive_v1"; // "Archive for me"

  let currentMode   = "business"; // business | personal | girlfriend | boyfriend
  let currentAvatar = "carrie";   // carrie | james | azreen

  function loadState() {
    try {
      const saved = localStorage.getItem(LOG_KEY);
      if (saved) {
        chatLog.innerHTML = saved;
        chatLog.scrollTop = chatLog.scrollHeight;
      }
      const mode = localStorage.getItem(MODE_KEY);
      if (mode) currentMode = mode;
      const avatar = localStorage.getItem(AVATAR_KEY);
      if (avatar) currentAvatar = avatar;
    } catch (e) {
      console.warn("Carrie chat: unable to load saved state", e);
    }
    updateModeLabel();
    updateAvatarLabel();
    updateFloatingAvatar();
  }

  function saveLog() {
    try {
      localStorage.setItem(LOG_KEY, chatLog.innerHTML);
    } catch (e) {
      console.warn("Carrie chat: unable to save log", e);
    }
  }

  function saveModeAvatar() {
    try {
      localStorage.setItem(MODE_KEY, currentMode);
      localStorage.setItem(AVATAR_KEY, currentAvatar);
    } catch (e) {
      console.warn("Carrie chat: unable to save mode/avatar", e);
    }
  }

  // --- Typing indicator ---
  function showTyping() {
    if (typingRow) typingRow.classList.remove("hidden");
  }
  function hideTyping() {
    if (typingRow) typingRow.classList.add("hidden");
  }

  // --- Avatar art mapping ---
  function getAvatarImageSrc() {
    // Chat bubble thumbnail (in the log)
    if (currentAvatar === "james") {
      return "assets/images/default_user_25_30.png";
    }
    if (currentAvatar === "azreen") {
      return "assets/images/default_user_35_40_girl.png";
    }
    // Carrie is default
    return "assets/images/carrie_business.png";
  }

  function getVideoSrcForAvatar() {
    // You can change these to more specific videos when you have them
    if (currentAvatar === "james") {
      return "assets/videos/carrie_business_animate.webm"; // placeholder
    }
    if (currentAvatar === "azreen") {
      return "assets/videos/carrie_business_animate.webm"; // placeholder
    }
    return "assets/videos/carrie_business_animate.webm";
  }

  function updateFloatingAvatar() {
    if (!chatVideo) return;
    const newSrc = getVideoSrcForAvatar();
    if (chatVideo.getAttribute("src") !== newSrc) {
      chatVideo.setAttribute("src", newSrc);
      try {
        chatVideo.play().catch(() => {});
      } catch (e) {}
    }
    if (chatBubble) {
      const label = {
        carrie: "Carrie (chat)",
        james: "James (chat)",
        azreen: "Azreen (chat)"
      }[currentAvatar] || "Carrie (chat)";
      chatBubble.textContent = label;
    }
  }

  // --- Message rendering ---
  function addMessage(role, htmlContent) {
    const row = document.createElement("div");
    row.className = "msg-row" + (role === "user" ? " user" : "");

    if (role === "user") {
      row.innerHTML = `
        <div class="msg-bubble">
          <div class="msg-body">${htmlContent}</div>
          <div class="msg-meta">You • now</div>
        </div>
      `;
    } else {
      const avatarSrc = getAvatarImageSrc();
      const whoLabel = {
        carrie: "Carrie",
        james: "James",
        azreen: "Azreen"
      }[currentAvatar] || "Carrie";

      row.innerHTML = `
        <div class="msg-avatar">
          <img src="${avatarSrc}" alt="${whoLabel} avatar" onerror="this.style.display='none'">
        </div>
        <div class="msg-bubble">
          <div class="msg-body">${htmlContent}</div>
          <div class="msg-meta">${whoLabel} • ${currentMode} mode</div>
        </div>
      `;
    }

    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
    saveLog();
  }

  // --- Scripted Q&A ---
  const scripted = [
    {
      id: "buy_8bfr_music",
      patterns: [
        "how do i purchase 8bfr music",
        "how do i buy 8bfr music",
        "where can i buy 8bfr",
        "where can i buy your music",
        "buy 8bfr music",
        "purchase 8bfr",
        "stream 8bfr",
        "listen to 8bfr"
      ],
      reply: `
        You can support 8BFR by <b>streaming or buying the music here:</b><br><br>
        • 🎧 <a href="https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x" target="_blank" rel="noopener">Spotify – 8BFR</a><br>
        • 🛒 Search <b>"8BFR"</b> on Apple Music, Amazon, or your favorite platform.<br><br>
        If you tell me your mood, I can suggest a type of track to start with. 💜
      `
    },
    {
      id: "carrie_closet",
      patterns: [
        "carrie closet",
        "closet",
        "change outfit",
        "change clothes",
        "dress carrie",
        "dress avatar",
        "change avatar clothes",
        "bf chat",
        "gf chat",
        "boyfriend chat",
        "girlfriend chat"
      ],
      reply: `
        Outfit changing is part of <b>BF / GF chat</b> and the <b>Carrie Closet</b> system. 👗<br><br>
        • Open <a href="carrie-closet.html">Carrie Closet</a> to try hair, eyes, clothes, and accessories.<br>
        • Coins and real purchases will connect from the <a href="coinshop.html">Coin Shop</a> later.<br><br>
        On normal business/personal chat we keep Carrie in a standard outfit so she stays consistent across pages.
      `
    },
    {
      id: "coins",
      patterns: [
        "coins",
        "buy coins",
        "coin shop",
        "how do coins work",
        "what are coins for"
      ],
      reply: `
        🪙 <b>8BFR Coins (beta design)</b><br><br>
        • Use coins later for outfits, BF / GF chat upgrades, game entries, and special perks.<br>
        • The design is being wired to the <a href="coinshop.html">Coin Shop</a> and game pages.<br><br>
        Right now, Closet is visual only so you can design looks without spending coins yet.
      `
    },
    {
      id: "games",
      patterns: [
        "games",
        "play a game",
        "arcade",
        "pool game",
        "8 ball",
        "9 ball",
        "tournaments"
      ],
      reply: `
        🎮 <b>Games & Arcade</b><br><br>
        • Visit the <a href="arcade.html">Game Arcade</a> for pool and other games.<br>
        • Leaderboards and tournaments will connect with coins and rewards.<br><br>
        I can help explain any game rules if you want.
      `
    }
  ];

  function findScriptedReply(text) {
    const t = text.toLowerCase().trim();
    for (const s of scripted) {
      if (s.patterns.some((p) => t.includes(p))) {
        return s.reply;
      }
    }
    return null;
  }

  function buildGenericReply(text) {
    const safe = text.replace(/[<>]/g, (ch) =>
      ch === "<" ? "&lt;" : "&gt;"
    );

    let vibe = "";
    if (currentMode === "personal") {
      vibe = "I’m in personal / chill mode, so you can talk to me like a friend. 💜";
    } else if (currentMode === "girlfriend") {
      vibe = "GF chat is in early beta – I’m still learning how to talk like a partner. 💕";
    } else if (currentMode === "boyfriend") {
      vibe = "BF chat is in early beta – I’m still learning how to talk like a partner. 💙";
    } else {
      vibe = "I’m in business mode to help with music, tools, and site questions.";
    }

    return `
      You said:<br>
      <blockquote style="margin:4px 0 6px;border-left:2px solid rgba(148,163,255,.6);padding-left:6px;font-size:0.8rem;">
        ${safe}
      </blockquote>
      I’m still in beta on this page, so I don’t always give perfect answers yet.<br>
      ${vibe}
    `;
  }

  // --- Dropdown helpers ---
  function closeAllDropdowns() {
    [chatModeMenu, avatarMenu, maintMenu, shopMenu].forEach((menu) => {
      if (menu) menu.classList.remove("open");
    });
  }

  function attachDropdown(toggleEl, menuEl) {
    if (!toggleEl || !menuEl) return;
    toggleEl.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const already = menuEl.classList.contains("open");
      closeAllDropdowns();
      if (!already) menuEl.classList.add("open");
    });
  }

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  attachDropdown(chatModeToggle, chatModeMenu);
  attachDropdown(avatarToggle, avatarMenu);
  attachDropdown(maintToggle, maintMenu);
  attachDropdown(shopToggle, shopMenu);

  // --- Mode selection ---
  function updateModeLabel() {
    if (!chatModeLabel) return;
    const label = {
      business: "Business",
      personal: "Personal",
      girlfriend: "Girlfriend",
      boyfriend: "Boyfriend"
    }[currentMode] || "Business";
    chatModeLabel.textContent = "Mode: " + label;
  }

  if (chatModeMenu) {
    chatModeMenu.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const mode = btn.getAttribute("data-mode") || "business";
        // You mentioned business/personal main + BF/GF for avatars later.
        // For now, we just switch the label + reply style.
        currentMode = mode;
        updateModeLabel();
        saveModeAvatar();
        closeAllDropdowns();
      });
    });
  }

  // --- Avatar selection ---
  function updateAvatarLabel() {
    if (!avatarLabel) return;
    const label = {
      carrie: "Carrie",
      james: "James",
      azreen: "Azreen"
    }[currentAvatar] || "Carrie";
    avatarLabel.textContent = "Avatar: " + label;
  }

  if (avatarMenu) {
    avatarMenu.querySelectorAll("[data-avatar]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const av = btn.getAttribute("data-avatar") || "carrie";
        currentAvatar = av;
        updateAvatarLabel();
        saveModeAvatar();
        updateFloatingAvatar();
        closeAllDropdowns();
      });
    });
  }

  // --- Maintenance actions ---
  if (btnClearLocal) {
    btnClearLocal.addEventListener("click", (e) => {
      e.preventDefault();
      chatLog.innerHTML = "";
      saveLog();
      closeAllDropdowns();
      addMessage(
        "assistant",
        "Chat cleared on this device only. (History on other devices is not affected.)"
      );
    });
  }

  if (btnSaveSelf) {
    btnSaveSelf.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        const payload = {
          savedAt: new Date().toISOString(),
          html: chatLog.innerHTML
        };
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(payload));
        addMessage(
          "assistant",
          "Archived this conversation <b>locally for you</b>. (Only on this device, not in the cloud yet.)"
        );
      } catch (err) {
        addMessage(
          "assistant",
          "I couldn’t archive this chat locally (storage error). Try clearing some space."
        );
      }
      closeAllDropdowns();
    });
  }

  if (btnArchiveAll) {
    btnArchiveAll.addEventListener("click", (e) => {
      e.preventDefault();
      // Full “everyone” archive needs Supabase / backend wiring later.
      addMessage(
        "assistant",
        "Owner archive for everyone will be connected to Supabase later. Right now this button is just a preview."
      );
      closeAllDropdowns();
    });
  }

  if (btnToggleRole) {
    btnToggleRole.addEventListener("click", (e) => {
      e.preventDefault();
      isOwner = !isOwner;
      try {
        localStorage.setItem(OWNER_KEY, isOwner ? "1" : "0");
      } catch (err) {}
      updateOwnerUI();
      closeAllDropdowns();
    });
  }

  // --- Trainer modal (owner-only UI, local only) ---
  function openTrainer() {
    if (!trainerModal) return;
    trainerModal.classList.remove("hidden");
  }
  function closeTrainer() {
    if (!trainerModal) return;
    trainerModal.classList.add("hidden");
  }

  if (trainerBtn) {
    trainerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openTrainer();
    });
  }
  if (trainerClose) {
    trainerClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeTrainer();
    });
  }
  if (trainerCancel) {
    trainerCancel.addEventListener("click", (e) => {
      e.preventDefault();
      closeTrainer();
    });
  }
  if (trainerForm && trainerStatus) {
    trainerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("trainerQuestion");
      const a = document.getElementById("trainerAnswer");
      const qv = (q && q.value || "").trim();
      const av = (a && a.value || "").trim();
      if (!qv || !av) {
        trainerStatus.style.display = "block";
        trainerStatus.textContent = "Please add both a pattern and a reply.";
        trainerStatus.style.color = "#fed7d7";
        return;
      }
      // For now, just show a success – actual storage to Supabase comes later.
      trainerStatus.style.display = "block";
      trainerStatus.style.color = "#bbf7d0";
      trainerStatus.textContent =
        "Saved for this session (beta). A future update will sync this trainer to Supabase.";
    });
  }

  // --- Chat submission ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;

    const safeTxt = txt.replace(/[<>]/g, (ch) =>
      ch === "<" ? "&lt;" : "&gt;"
    );

    addMessage("user", safeTxt);
    input.value = "";
    showTyping();

    setTimeout(() => {
      const scriptedReply = findScriptedReply(txt);
      const reply = scriptedReply || buildGenericReply(txt);
      addMessage("assistant", reply);
      hideTyping();
    }, 450);
  });

  // Enter sends, Shift+Enter new line
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // --- Init ---
  loadState();
  updateOwnerUI();
  updateFloatingAvatar();

  console.log(
    "Carrie chat JS initialized.",
    "Mode:", currentMode,
    "Avatar:", currentAvatar,
    "Owner:", isOwner
  );
})();

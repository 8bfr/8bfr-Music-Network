// carrie-chat.js
// Front-end logic for the Carrie chat page only (carrie-chat.html).
// No Closet logic in here – that lives in carrie-closet*.js.

// Wrap everything so we don't leak globals
(function () {
  // --- Grab core DOM nodes ---
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

  // If we’re not on the chat page, bail quietly
  if (!chatLog || !form || !input) {
    console.warn("Carrie chat: required DOM nodes not found, exiting.");
    return;
  }

  // --- Simple owner mode flag (local only for now) ---
  const OWNER_KEY = "8bfr_owner_mode";
  let isOwner = false;

  try {
    isOwner = localStorage.getItem(OWNER_KEY) === "1";
  } catch (e) {
    isOwner = false;
  }

  function updateOwnerUI() {
    if (btnToggleRole && maintRoleLabel) {
      maintRoleLabel.textContent = isOwner
        ? "View as regular user"
        : "View as owner";
    }
    if (trainerBtn) {
      // Only show trainer if "owner" mode is on
      if (isOwner) {
        trainerBtn.classList.remove("hidden");
      } else {
        trainerBtn.classList.add("hidden");
      }
    }
  }

  // --- Local chat storage (just on this device) ---
  const LOG_KEY = "carrie_chat_log_v1";
  const MODE_KEY = "carrie_chat_mode_v1";
  const AVATAR_KEY = "carrie_chat_avatar_v1";

  let currentMode = "business"; // business | personal | girlfriend | boyfriend
  let currentAvatar = "carrie"; // carrie | james | azreen

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

  // --- Typing indicator helpers ---
  function showTyping() {
    if (typingRow) typingRow.classList.remove("hidden");
  }
  function hideTyping() {
    if (typingRow) typingRow.classList.add("hidden");
  }

  // --- Message rendering ---
  function getAvatarSrcForChat() {
    // For now: use the business / casual Carrie PNGs for all three,
    // you can swap these later for separate assets.
    if (currentAvatar === "james") {
      return "assets/images/default_user_25_30.png";
    }
    if (currentAvatar === "azreen") {
      return "assets/images/default_user_35_40_girl.png";
    }
    // Carrie
    return "assets/images/carrie_business.png";
  }

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
      const avatarSrc = getAvatarSrcForChat();
      row.innerHTML = `
        <div class="msg-avatar">
          <img src="${avatarSrc}" alt="Carrie avatar" onerror="this.style.display='none'">
        </div>
        <div class="msg-bubble">
          <div class="msg-body">${htmlContent}</div>
          <div class="msg-meta">Carrie • ${currentMode} mode</div>
        </div>
      `;
    }

    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
    saveLog();
  }

  // --- Simple scripted replies (you can extend later) ---
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
        "stream 8bfr"
      ],
      reply: `
        You can support 8BFR by <b>streaming or buying the music here:</b><br><br>
        • 🎧 <a href="https://open.spotify.com/artist/127tw52iDXr7BvgB0IGG2x" target="_blank" rel="noopener">Spotify</a><br>
        • 🛒 Search <b>"8BFR"</b> on your favorite music platform (Amazon, Apple, etc.)<br><br>
        If you’d like, I can help you pick a track based on your mood. 💜
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
        "change avatar clothes"
      ],
      reply: `
        Want to try outfits and accessories? 👗<br><br>
        • Open <a href="carrie-closet.html">Carrie Closet</a> to change hair, eyes, clothes, and accessories for BF / GF chat.<br>
        • Coins and purchases will connect from the <a href="coinshop.html">Coin Shop</a> later.
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
        "9 ball"
      ],
      reply: `
        🎮 <b>Games & Arcade</b><br><br>
        • Visit the <a href="arcade.html">Game Arcade</a> for tournaments and pool modes.<br>
        • You can win coins, show up on leaderboards, and unlock future upgrades.
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
      vibe = "I'm in chill mode, so feel free to talk to me like a friend. 💜";
    } else if (currentMode === "girlfriend") {
      vibe = "GF chat is in early beta, so I'm still learning how to talk like your partner. 💕";
    } else if (currentMode === "boyfriend") {
      vibe = "BF chat is in early beta, so I'm still learning how to talk like your partner. 💙";
    } else {
      vibe = "I'm here to help you with music, tools, and ideas for 8BFR.";
    }

    return `
      You said:<br>
      <blockquote style="margin:4px 0 6px;border-left:2px solid rgba(148,163,255,.6);padding-left:6px;font-size:0.8rem;">
        ${safe}
      </blockquote>
      I’m still in beta on this page, so I don’t always understand complex questions yet.<br>
      ${vibe}
    `;
  }

  // --- Dropdown helpers (mode / avatar / maintenance / shop) ---

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

  // --- Trainer modal (owner only; local only for now) ---
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
      // For now, this is just local / temporary — no Supabase yet.
      trainerStatus.style.display = "block";
      trainerStatus.style.color = "#bbf7d0";
      trainerStatus.textContent =
        "Saved locally (beta). A future update will sync this to Supabase.";
    });
  }

  // --- Chat submission handler ---
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

    // Simulate thinking
    setTimeout(() => {
      const scriptedReply = findScriptedReply(txt);
      const reply = scriptedReply || buildGenericReply(txt);
      addMessage("assistant", reply);
      hideTyping();
    }, 500);
  });

  // Allow Enter to send, Shift+Enter = newline
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // --- Init everything ---
  loadState();
  updateOwnerUI();

  // Tiny debug
  console.log("Carrie chat JS initialized. Mode:", currentMode, "Avatar:", currentAvatar);
})();

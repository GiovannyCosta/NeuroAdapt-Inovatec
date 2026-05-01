// =============================================
// ARQUIVO: src/js/main.js
// DESCRIÇÃO: Lógica principal, navegação, login, avatar e inicialização.
// =============================================

/**
 * Atualiza o contador de mapas no Header da Biblioteca.
 */
function updateLibraryHeader() {
  const mapCountEl = document.getElementById("library-map-count");
  const starCountEl = document.getElementById("library-star-count"); // NOVO

  if (mapCountEl && starCountEl) {
    let totalStarsGlobal = 0; // SOMA DE RECOMPENSAS POR JORNADA
    let totalMapsGlobal = 0; // SOMA DE RECOMPENSAS DE METAGAME (TODAS AS JORNADAS)

    // 1. Jogo Combine as Formas (ShapeLevels)
    if (typeof ShapeLevels !== "undefined" && ShapeLevels.state) {
      // Estrelas: 1 por jornada completada (Estrelas)
      totalStarsGlobal += ShapeLevels.state.totalStars || 0;
      // Mapas: 1 por MetaGame completado (Total Maps)
      totalMapsGlobal += ShapeLevels.state.totalMaps || 0;
    }

    // 2. Jogo Adivinhe o Som (SoundLevels)
    if (typeof SoundLevels !== "undefined" && SoundLevels.state) {
      // Estrelas: 1 por mundo/jornada (usando totalMaps do Som como estrela de jornada)
      totalStarsGlobal += SoundLevels.state.totalMaps || 0;
    }
    // 3. Jogo Adivinhe a Emoção (EmotionLevels
    if (typeof EmotionLevels !== "undefined" && EmotionLevels.state) {
      totalMapsGlobal += EmotionLevels.state.totalMaps || 0;
    }

    mapCountEl.textContent = totalMapsGlobal;
    starCountEl.textContent = totalStarsGlobal;
  }
}

// --- Variáveis para rastrear tempo de foco (SADU) ---
let currentGameId = null;
let gameStartTime = null;

// Mapa de IDs de tela para IDs de jogo (Analytics)
const screenToGameId = {
  "game-combine-shapes-screen": "combine",
  "game-connect-dots-screen": "connect",
  "game-puzzle-screen": "puzzle",
  "game-emotion-screen": "emotion",
  "game-guess-color-screen": "color",
  "game-connect-numbers-screen": "numbers",
  "game-color-sequence-screen": "sequence",
  "game-sound-screen": "sound",
  "game-guess-word-screen": "guess-word",
};

/**
 * Define o tema da aplicação (Calmo ou Estimulante).
 * @param {string} theme - 'calm' ou 'stimulant'.
 */
function setTheme(theme) {
  const a = document.getElementById("app-shell"),
    c = document.getElementById("calm-mode-btn"),
    s = document.getElementById("stimulant-mode-btn");

  if (theme === "stimulant") {
    a.classList.remove("theme-calm");
    a.classList.add("theme-stimulant");
    s.classList.remove("opacity-60", "border-transparent");
    s.classList.add("opacity-100", "border-amber-500");
    c.classList.add("opacity-60", "border-transparent");
    c.classList.remove("opacity-100", "border-blue-500");
  } else {
    a.classList.remove("theme-stimulant");
    a.classList.add("theme-calm");
    c.classList.remove("opacity-60", "border-transparent");
    c.classList.add("opacity-100", "border-blue-500");
    s.classList.add("opacity-60", "border-transparent");
    s.classList.remove("opacity-100", "border-amber-500");
  }

  // Recarrega pictogramas se necessário
  if (
    document.getElementById("communication-screen") &&
    !document
      .getElementById("communication-screen")
      .classList.contains("hidden")
  ) {
    if (
      typeof CaaBoard !== "undefined" &&
      typeof CaaBoard.loadPictograms === "function" &&
      typeof currentPictogramCategory !== "undefined"
    ) {
      CaaBoard.loadPictograms(currentPictogramCategory);
    }
  }

  // Redesenha canvas dos jogos se visíveis
  if (
    typeof gameInitializationState !== "undefined" &&
    gameInitializationState["game-connect-dots-screen"] &&
    !document
      .getElementById("game-connect-dots-screen")
      .classList.contains("hidden")
  ) {
    if (typeof drawConnectDotsGame === "function") drawConnectDotsGame();
  }
  if (
    typeof gameInitializationState !== "undefined" &&
    gameInitializationState["game-connect-numbers-screen"] &&
    !document
      .getElementById("game-connect-numbers-screen")
      .classList.contains("hidden")
  ) {
    if (typeof drawConnectNumbersGame === "function") drawConnectNumbersGame();
  }
}

/**
 * Mostra uma tela específica e atualiza a navegação.
 */
function showScreen(screenId, navElement) {
  if (typeof stopAllAudio === "function") {
    stopAllAudio();
  }

  // RASTREAMENTO: Salva tempo do jogo anterior
  if (currentGameId && gameStartTime) {
    const timeSpent = (Date.now() - gameStartTime) / 1000;
    if (typeof GameAnalytics !== "undefined") {
      GameAnalytics.recordTime(currentGameId, timeSpent);
    }
    currentGameId = null;
    gameStartTime = null;
  }

  // RASTREAMENTO: Inicia tempo do novo jogo
  if (screenToGameId[screenId]) {
    currentGameId = screenToGameId[screenId];
    gameStartTime = Date.now();
  }

  // Navegação padrão
  const s = document.querySelectorAll(".screen"),
    n = document.querySelectorAll(".nav-item");

  s.forEach(sc => sc.classList.add("hidden"));

  const tS = document.getElementById(screenId);
  if (tS) tS.classList.remove("hidden");

  const aN =
    navElement ||
    document.querySelector(`.nav-item[data-screen="${screenId}"]`);
  n.forEach(i => {
    const ic = i.querySelector("i"),
      tx = i.querySelector("span"),
      h = i.querySelector(".accent-bg-highlight");
    i.classList.remove("active");
    h?.classList.add("hidden");
    ic?.classList.remove("accent-text");
    tx?.classList.remove("accent-text", "font-semibold");
    tx?.classList.add("font-medium", "text-gray-400");

    if (i === aN) {
      i.classList.add("active");
      h?.classList.remove("hidden");
      ic?.classList.add("accent-text");
      tx?.classList.add("accent-text", "font-semibold");
      tx?.classList.remove("font-medium", "text-gray-400");
    }
  });

  // Atualizações específicas por tela
  if (screenId === "reports-screen") {
    if (typeof ReportsHub !== "undefined") ReportsHub.showHub();
  } else if (screenId === "achievements-screen") {
    if (typeof renderAchievements === "function") renderAchievements();
  } else if (screenId === "games-screen") {
    updateLibraryHeader();
  }
}

// =============================================
// PONTO DE ENTRADA PRINCIPAL (window.onload)
// =============================================

// --- Função CRÍTICA para prevenir desalinhamento de modal ---
function toggleAppContainerScroll(disable) {
  const appContainer = document.querySelector(".app-container");
  const overflowElement = document.querySelector(".flex-grow.overflow-hidden");
  if (overflowElement) {
    overflowElement.style.overflowY = disable ? "hidden" : "auto";
  }
}

window.onload = () => {
  // --- LÓGICA DO BOTÃO DE ALERTA (DISCLAIMER) ---
  const disclaimerBtn = document.getElementById("disclaimer-btn");
  const disclaimerModal = document.getElementById("disclaimer-modal");
  const disclaimerCloseBtn = document.getElementById("disclaimer-close-btn");

  if (disclaimerBtn && disclaimerModal) {
    disclaimerBtn.addEventListener("click", () => {
      disclaimerModal.classList.remove("hidden");
      toggleAppContainerScroll(true); // DESABILITA SCROLL
      if (navigator.vibrate) navigator.vibrate(100);
    });

    disclaimerCloseBtn?.addEventListener("click", () => {
      disclaimerModal.classList.add("hidden");
      toggleAppContainerScroll(false); // HABILITA SCROLL
    });
  }
  // --- FIM LÓGICA DO BOTÃO DE ALERTA ---

  // --- 1. CARREGAMENTOS GERAIS E INICIALIZAÇÕES ---
  if (typeof loadAchievements === "function") loadAchievements();
  if (typeof loadCommStats === "function") loadCommStats();
  if (typeof loadUsageState === "function") loadUsageState();
  if (typeof updateStarCount === "function") updateStarCount();

  // Módulos Principais
  if (typeof ReportsHub !== "undefined") ReportsHub.init();
  if (typeof GamesReports !== "undefined") GamesReports.init();
  if (typeof CommReports !== "undefined") CommReports.init();
  if (typeof CommHub !== "undefined") CommHub.init();
  if (typeof ShapeLogic !== "undefined") ShapeLogic.init();
  if (typeof SoundLogic !== "undefined") SoundLogic.init();
  if (typeof initializeGameInteractions === "function")
    initializeGameInteractions();

  // Renderiza ícones Lucide
  if (
    typeof lucide !== "undefined" &&
    typeof lucide.createIcons === "function"
  ) {
    lucide.createIcons();
  }

  // =============================================
  // --- 2. LÓGICA DE LOGIN E SESSÃO ---
  // =============================================
  const fakeUserNames = [
    "Júlia",
    "Alina",
    "Bruno",
    "Giovanny",
    "Renato",
    "Gabriel",
    "Larissa",
    "Gilvana",
  ];
  let isUserLoggedIn = false;

  // Elementos de UI Login
  const loginScreen = document.getElementById("login-screen");
  const loginForm = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error-msg");

  // Elementos para atualizar (Home e Conta)
  const profileBtn = document.getElementById("profile-action-btn");
  const profileBtnText = document.getElementById("profile-btn-text");
  const profileBtnIcon = document.getElementById("profile-btn-icon");
  const sidebarAuthBtn = document.getElementById("sidebar-auth-btn");
  const sidebarAuthText = document.getElementById("sidebar-auth-text");
  const sidebarAuthIcon = document.getElementById("sidebar-auth-icon");

  const titleHome = document.getElementById("app-title-home"); // ID da Home
  const nameAccount = document.getElementById("account-user-name"); // NOVO ID: Nome na tela de Conta
  const statusAccount = document.getElementById("account-status-text"); // NOVO ID: Status na tela de Conta

  // Função Central para Atualizar a Interface de Login
  function updateSessionUI(isLogged, userData = null) {
    isUserLoggedIn = isLogged;

    if (isLogged && userData) {
      // ESTADO: LOGADO
      const userName = userData.name;

      // 1. Atualiza Textos
      if (titleHome) titleHome.textContent = `Olá, ${userName}`;
      if (nameAccount) nameAccount.textContent = userName;
      if (statusAccount) statusAccount.textContent = "Usuário Logado"; // AGORA MOSTRA O STATUS CORRETO

      // 2. Atualiza Botão da Home
      if (profileBtnText) profileBtnText.textContent = "Minha Conta";
      if (profileBtnIcon) {
        profileBtnIcon.setAttribute("data-lucide", "user-circle");
      }
      if (sidebarAuthText) sidebarAuthText.textContent = "Sair";
      if (sidebarAuthIcon) sidebarAuthIcon.setAttribute("data-lucide", "log-out");
      if (sidebarAuthBtn) sidebarAuthBtn.style.backgroundColor = "var(--game-incorrect)";
    } else {
      // ESTADO: DESLOGADO
      if (titleHome) titleHome.textContent = "Ludica+";
      if (nameAccount) nameAccount.textContent = "Ludica+"; // Reset no nome da conta
      if (statusAccount) statusAccount.textContent = "Usuário Visitante"; // AGORA MOSTRA O STATUS CORRETO

      if (profileBtnText) profileBtnText.textContent = "Fazer Login";
      if (profileBtnIcon) {
        profileBtnIcon.setAttribute("data-lucide", "log-in");
      }
      if (sidebarAuthText) sidebarAuthText.textContent = "Fazer Login";
      if (sidebarAuthIcon) sidebarAuthIcon.setAttribute("data-lucide", "log-in");
      if (sidebarAuthBtn) sidebarAuthBtn.style.backgroundColor = "var(--accent-primary)";
    }

    // Recarrega ícones para aplicar mudanças
    if (window.lucide) lucide.createIcons();
  }

  // A. Verificar Login Salvo ao Iniciar
  const savedSession = localStorage.getItem("neuro_user_session");
  if (savedSession) {
    try {
      const sessionData = JSON.parse(savedSession);
      updateSessionUI(true, sessionData);
    } catch (e) {
      console.error("Erro ao carregar sessão", e);
    }
  }

  // B. Evento: Abrir Login ou Conta (Botão da Home)
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (isUserLoggedIn) {
        showScreen("account-screen");
      } else {
        showScreen("login-screen");
        // Limpa campos visuais
        if (document.getElementById("login-email"))
          document.getElementById("login-email").value = "";
        if (document.getElementById("login-password"))
          document.getElementById("login-password").value = "";
        if (errorMsg) errorMsg.textContent = "";
      }
    });
  }

  if (sidebarAuthBtn) {
    sidebarAuthBtn.addEventListener("click", () => {
      if (isUserLoggedIn) {
        localStorage.removeItem("neuro_user_session");
        updateSessionUI(false);
        updateAvatarUI({ type: "default" });
        showScreen("home-screen");
      } else {
        showScreen("login-screen");
        if (document.getElementById("login-email"))
          document.getElementById("login-email").value = "";
        if (document.getElementById("login-password"))
          document.getElementById("login-password").value = "";
        if (errorMsg) errorMsg.textContent = "";
      }
    });
  }

  // C. Evento: Voltar do Login
  document.getElementById("login-back-btn")?.addEventListener("click", () => {
    showScreen("home-screen");
  });

  // D. Evento: Fazer Login (Submit do Formulário)
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const emailInput = document.getElementById("login-email");
      const email = emailInput.value.toLowerCase();

      // Validação Simulada
      if (
        email.includes("@gmail.com") ||
        email.includes("@outlook.com") ||
        email.includes("@hotmail.com")
      ) {
        // 1. Gerar Dados Fictícios
        const randomName =
          fakeUserNames[Math.floor(Math.random() * fakeUserNames.length)];
        const sessionData = { name: randomName, email: email };

        // 2. Salvar no LocalStorage
        localStorage.setItem("neuro_user_session", JSON.stringify(sessionData));

        // 3. Atualizar UI
        updateSessionUI(true, sessionData);

        // 4. Redirecionar
        showScreen("home-screen");
        if (navigator.vibrate) navigator.vibrate(50);
      } else {
        if (errorMsg)
          errorMsg.textContent = "Use um email válido (@gmail, @outlook...)";
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // Feedback visual no input
        emailInput.style.borderColor = "var(--game-incorrect)";
        setTimeout(
          () => (emailInput.style.borderColor = "var(--border-color)"),
          2000
        );
      }
    });
  }

  // E. Evento: Logout (Botão "Sair" na tela de Conta)
  const logoutBtn = document.querySelector(
    '#account-screen button[style*="var(--game-incorrect)"]'
  );
  if (logoutBtn) {
    // Clona para limpar eventos antigos (boa prática em SPAs manuais)
    const newLogout = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogout, logoutBtn);

    newLogout.addEventListener("click", () => {
      if (!isUserLoggedIn) {
        showScreen("login-screen");
        if (errorMsg) errorMsg.textContent = "";
        return;
      }
      // 1. Limpa Storage da Sessão
      localStorage.removeItem("neuro_user_session");

      // 2. Reseta UI
      updateSessionUI(false);

      // 3. Reseta visualmente o avatar para o padrão
      updateAvatarUI({ type: "default" });

      showScreen("home-screen");
    });
  }

  // =============================================
  // --- 3. LÓGICA DE AVATAR (CORES E CONQUISTAS) ---
  // =============================================
  const avatarModal = document.getElementById("avatar-modal");
  const avatarGrid = document.getElementById("avatar-grid");
  const tabColors = document.getElementById("tab-avatar-colors");
  const tabAchievs = document.getElementById("tab-avatar-achievements");

  const homePicContainer = document.getElementById(
    "home-profile-pic-container"
  );
  const accPicBtn = document.getElementById("account-profile-pic-btn");

  const avatarColors = [
    { id: "blue", class: "bg-blue-500", label: "Azul" },
    { id: "red", class: "bg-red-500", label: "Vermelho" },
    { id: "green", class: "bg-green-500", label: "Verde" },
    { id: "purple", class: "bg-purple-500", label: "Roxo" },
    { id: "orange", class: "bg-orange-500", label: "Laranja" },
    { id: "pink", class: "bg-pink-500", label: "Rosa" },
  ];

  let currentTab = "colors";

  // Função para Atualizar o Avatar na Interface
  function updateAvatarUI(data) {
    // Classes de fundo para limpar
    const bgClasses = avatarColors.map(c => c.class);
    bgClasses.push(
      "accent-bg",
      "bg-transparent",
      "border-2",
      "border-gray-200",
      "bg-white"
    );

    // Atualiza os dois locais onde o avatar aparece
    [homePicContainer, accPicBtn].forEach(el => {
      if (!el) return;
      el.classList.remove(...bgClasses);
      el.innerHTML = "";

      if (data.type === "color") {
        // Estilo: Cor Sólida
        const colorObj =
          avatarColors.find(c => c.id === data.value) || avatarColors[0];
        el.classList.add(colorObj.class);
        el.classList.add("text-white");

        const iconSize = el.id.includes("home") ? "w-8 h-8" : "w-10 h-10";
        const icon = document.createElement("i");
        icon.setAttribute("data-lucide", "user");
        icon.className = iconSize;
        el.appendChild(icon);
      } else if (data.type === "achievement") {
        // Estilo: Conquista (Emoji no fundo branco)
        el.classList.add("bg-white", "border-2", "border-gray-200");
        el.classList.remove("text-white");

        const span = document.createElement("span");
        span.className = "text-3xl select-none";
        span.textContent = data.value; // O emoji da conquista
        el.appendChild(span);
      } else {
        // Estilo: Padrão (Deslogado/Reset)
        el.classList.add("accent-bg", "text-white");
        const iconSize = el.id.includes("home") ? "w-8 h-8" : "w-10 h-10";
        const icon = document.createElement("i");
        icon.setAttribute("data-lucide", "user");
        icon.className = iconSize;
        el.appendChild(icon);
      }
    });
    if (window.lucide) lucide.createIcons();
  }

  // Renderiza o Grid do Modal
  function renderAvatarGrid() {
    if (!avatarGrid) return;
    avatarGrid.innerHTML = "";

    if (currentTab === "colors") {
      avatarColors.forEach(color => {
        const card = document.createElement("div");
        card.className = `avatar-option-card shadow-sm`;
        card.innerHTML = `
                    <div class="${color.class} w-12 h-12 rounded-full flex items-center justify-center text-white mb-2">
                        <i data-lucide="user" class="w-6 h-6"></i>
                    </div>
                    <span class="text-xs font-bold text-gray-600">${color.label}</span>
                `;
        card.onclick = () => selectAvatar("color", color.id);
        avatarGrid.appendChild(card);
      });
    } else if (currentTab === "achievements") {
      // Pega conquistas desbloqueadas
      const unlockedIds =
        typeof achievementsState !== "undefined"
          ? achievementsState.unlocked
          : [];
      const allAchievs =
        typeof achievementsList !== "undefined" ? achievementsList : [];
      const unlockedData = allAchievs.filter(a => unlockedIds.includes(a.id));

      if (unlockedData.length === 0) {
        avatarGrid.innerHTML = `<div class="col-span-2 text-center text-gray-400 py-8 text-sm">Jogue para desbloquear conquistas e usá-las como avatar!</div>`;
        return;
      }

      unlockedData.forEach(ach => {
        const card = document.createElement("div");
        card.className = `avatar-option-card shadow-sm bg-white`;
        card.innerHTML = `
                    <span class="text-4xl mb-1">${ach.icon}</span>
                    <span class="text-[10px] font-bold text-gray-500 text-center leading-tight px-2">${ach.name}</span>
                `;
        card.onclick = () => selectAvatar("achievement", ach.icon);
        avatarGrid.appendChild(card);
      });
    }
    if (window.lucide) lucide.createIcons();
  }

  // Salva e Aplica a Seleção
  function selectAvatar(type, value) {
    const avatarData = { type, value };
    localStorage.setItem("neuro_user_avatar", JSON.stringify(avatarData));
    updateAvatarUI(avatarData);
    if (navigator.vibrate) navigator.vibrate(50);
    avatarModal.classList.add("hidden");
  }

  // Carregar Avatar Salvo ao Iniciar
  const savedAvatar = localStorage.getItem("neuro_user_avatar");
  if (savedAvatar) {
    try {
      updateAvatarUI(JSON.parse(savedAvatar));
    } catch (e) {
      console.error("Erro avatar", e);
    }
  }

  // Eventos do Modal de Avatar
  if (accPicBtn) {
    accPicBtn.addEventListener("click", () => {
      if (isUserLoggedIn) {
        avatarModal.classList.remove("hidden");
        renderAvatarGrid();
      } else {
        alert("Faça login para personalizar seu perfil.");
      }
    });
  }
  document.getElementById("avatar-close-btn")?.addEventListener("click", () => {
    avatarModal.classList.add("hidden");
  });

  // Troca de Abas (Cores vs Conquistas)
  if (tabColors && tabAchievs) {
    tabColors.addEventListener("click", () => {
      currentTab = "colors";
      tabColors.classList.add("active");
      tabAchievs.classList.remove("active");
      renderAvatarGrid();
    });
    tabAchievs.addEventListener("click", () => {
      currentTab = "achievements";
      tabAchievs.classList.add("active");
      tabColors.classList.remove("active");
      renderAvatarGrid();
    });
  }

  // =============================================
  // --- 4. LISTENERS GERAIS DO APP ---
  // =============================================
  // Listeners de Tema
  document
    .getElementById("calm-mode-btn")
    ?.addEventListener("click", () => setTheme("calm"));
  document
    .getElementById("stimulant-mode-btn")
    ?.addEventListener("click", () => setTheme("stimulant"));

  // Listeners de Navegação (Bottom Bar)
  document.querySelectorAll(".nav-item").forEach(i =>
    i.addEventListener("click", e => {
      e.preventDefault();
      showScreen(i.dataset.screen, i);
    })
  );

  const sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn");
  const appShell = document.getElementById("app-shell");
  if (sidebarCollapseBtn && appShell) {
    sidebarCollapseBtn.addEventListener("click", () => {
      appShell.classList.toggle("sidebar-collapsed");
      const icon = sidebarCollapseBtn.querySelector("i");
      if (icon) {
        icon.setAttribute(
          "data-lucide",
          appShell.classList.contains("sidebar-collapsed")
            ? "panel-left-open"
            : "panel-left-close"
        );
        if (
          typeof lucide !== "undefined" &&
          typeof lucide.createIcons === "function"
        ) {
          lucide.createIcons();
        }
      }
    });
  }

  // Listeners de Cards de Jogo (Usa gameController.js)
  document.querySelectorAll(".game-card-link").forEach(l =>
    l.addEventListener("click", e => {
      e.preventDefault();
      if (typeof loadGame === "function") {
        loadGame(l.dataset.game);
      }
    })
  );

  // Listeners Botões "Voltar" dos Jogos
  document.querySelectorAll(".game-back-btn").forEach(b =>
    b.addEventListener("click", () => {
      const gN = document.querySelector(
        '.nav-item[data-screen="games-screen"]'
      );
      showScreen("games-screen", gN);
    })
  );

  // Listeners de Categoria (Comunicação)
  document.querySelectorAll(".category-select-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      if (typeof loadSoundCategory === "function") {
        loadSoundCategory(e.currentTarget.dataset.category);
      }
    });
  });
  document.querySelectorAll(".category-select-word-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      if (typeof loadWordCategory === "function") {
        loadWordCategory(e.currentTarget.dataset.category);
      }
    });
  });

  // Listeners Globais de Clique (Pictogramas e Interações)
  document.body.addEventListener("click", e => {
    // Pictogramas da CAA
    const pB = e.target.closest(".pictogram-btn");
    if (pB) {
      if (typeof addToPhrase === "function") {
        addToPhrase(
          pB.dataset.icon,
          pB.dataset.text,
          pB.dataset.speech,
          pB.dataset.type,
          pB.dataset.preposition
        );
      }
      return;
    }

    // Navegação de Categoria CAA
    const catBtn = e.target.closest(".category-nav-btn");
    if (catBtn) {
      if (typeof loadPictograms === "function") {
        loadPictograms(catBtn.dataset.subcategory, currentPictogramCategory);
      }
      return;
    }

    const backBtn = e.target.closest("#category-back-btn");
    if (backBtn) {
      const parentCategory = backBtn.dataset.parent;
      if (parentCategory && typeof loadPictograms === "function") {
        loadPictograms(parentCategory, null);
        document.querySelectorAll(".category-tab").forEach(t => {
          const isActive = t.dataset.category === parentCategory;
          t.classList.toggle("active", isActive);
          t.classList.toggle("accent-text", isActive);
          t.classList.toggle("text-gray-500", !isActive);
          if (isActive) t.style.borderColor = "var(--accent-primary)";
          else t.style.borderColor = "transparent";
        });
      }
      return;
    }

    if (typeof handleClickInteraction === "function") {
      handleClickInteraction(e);
    }
  });

  // Abas de Categoria (Comunicação)
  document.querySelectorAll(".category-tab").forEach(t =>
    t.addEventListener("click", function () {
      document.querySelectorAll(".category-tab").forEach(tb => {
        tb.classList.remove("active", "accent-text", "border-b-2");
        tb.classList.add("text-gray-500");
        tb.style.borderColor = "transparent";
      });
      this.classList.add("active", "accent-text");
      this.classList.remove("text-gray-500");
      this.style.borderColor = "var(--accent-primary)";

      if (typeof loadPictograms === "function") {
        loadPictograms(this.dataset.category, null);
      }
    })
  );

  // Botões de Ajuda
  document.querySelectorAll(".game-help-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const gameType = e.currentTarget.dataset.game;
      if (typeof showHelpModal === "function") showHelpModal(gameType);
    });
  });
  document
    .getElementById("close-help-modal-btn")
    ?.addEventListener("click", () => {
      if (typeof hideHelpModal === "function") hideHelpModal();
    });

  // Navegação Perfil e Configurações
  document
    .getElementById("open-achievements-btn")
    ?.addEventListener("click", () => {
      showScreen("achievements-screen");
    });
  document
    .getElementById("achievements-back-btn")
    ?.addEventListener("click", () => {
      const homeNavItem = document.querySelector(
        '.nav-item[data-screen="home-screen"]'
      );
      showScreen("home-screen", homeNavItem);
    });
  // Nota: "open-account-btn" foi removido da lógica antiga para usar o "profile-action-btn" inteligente
  document.getElementById("account-back-btn")?.addEventListener("click", () => {
    const homeNavItem = document.querySelector(
      '.nav-item[data-screen="home-screen"]'
    );
    showScreen("home-screen", homeNavItem);
  });

  // Reset DEV
  document.getElementById("dev-reset-btn")?.addEventListener("click", () => {
    if (confirm("Isso apagará TUDO (Login, Avatar, Progresso). Continuar?")) {
      localStorage.clear();
      location.reload();
    }
  });

  // --- 5. ANIMAÇÃO DE BOAS-VINDAS ---
  const welcomeScreen = document.getElementById("welcome-screen");
  const welcomeIcon = welcomeScreen
    ? welcomeScreen.querySelector(".welcome-logo-wrap, .accent-bg")
    : null;

  if (welcomeScreen && welcomeIcon) {
    welcomeIcon.style.backgroundColor = "var(--accent-primary)";
    setTimeout(() => {
      welcomeIcon.style.backgroundColor = "var(--accent-primary-stimulant)";
    }, 500);
    setTimeout(() => {
      welcomeIcon.style.transform = "scale(1.5)";
      welcomeIcon.style.opacity = "0";
      welcomeScreen.style.opacity = "0";
    }, 1500);
    setTimeout(() => {
      const homeNavItem = document.querySelector(
        '.nav-item[data-screen="home-screen"]'
      );
      showScreen("home-screen", homeNavItem);
      welcomeScreen.classList.add("hidden");
    }, 2500);
  } else {
    showScreen(
      "home-screen",
      document.querySelector('.nav-item[data-screen="home-screen"]')
    );
  }
};

// Lógica Tela Sobre (Isolada para evitar conflito de escopo)
(function () {
  function ready(fn) {
    if (document.readyState != "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var openBtn = document.getElementById("open-about-btn");
    var aboutScreen = document.getElementById("about-screen");
    var profileScreen = document.getElementById("home-screen");
    var backBtn = document.getElementById("about-back-btn");

    if (!aboutScreen || !profileScreen || !openBtn || !backBtn) return;

    function openAbout() {
      document.querySelectorAll(".screen").forEach(function (s) {
        s.classList.add("hidden");
      });
      aboutScreen.classList.remove("hidden");
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    function closeAbout() {
      aboutScreen.classList.add("hidden");
      profileScreen.classList.remove("hidden");
    }

    openBtn.addEventListener("click", openAbout);
    backBtn.addEventListener("click", closeAbout);
  });
})();

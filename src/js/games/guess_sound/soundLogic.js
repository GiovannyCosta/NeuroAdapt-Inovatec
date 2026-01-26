// =============================================
// ARQUIVO: src/js/games/guess_sound/soundLogic.js
// FINAL: Correção de Fluxo e Blindagem contra Erros
// =============================================

const SoundLogic = {
  currentMode: "journey",
  activeWorld: null,
  activeItemIndex: 0,
  activeItemData: null,
  hintInterval: null,
  isGameActive: false,
  wrongAttempts: 0,
  correctStreak: 0,
  freeModePlayed: false,

  init: function () {
    if (typeof SoundLevels !== "undefined") {
      SoundLevels.init();
    }
    this.renderMainMenu();
  },

  // --- NAVEGAÇÃO E MENU ---

  renderMainMenu: function () {
    this.hideAllScreens();
    const menu = document.getElementById("sound-game-menu");
    const title = document.querySelector("#sound-game-menu header h1");

    if (menu) {
      if (title) title.textContent = "ADIVINHE O SOM";
      menu.classList.remove("hidden");
      this.updateMenuStats();
    }
  },

  startJourney: function (worldId = null) {
    if (!worldId) worldId = SoundLevels.state.currentWorldId;

    this.currentMode = "journey";
    this.activeWorld = SoundJourneyData.find(w => w.id === worldId);

    SoundLevels.state.currentWorldId = worldId;
    SoundLevels.save();

    this.renderMap(this.activeWorld);
  },

  startFreeMode: function () {
    this.currentMode = "free";
    this.freeModePlayed = true;
    // Check seguro
    try {
      if (typeof checkFreeModePlayed === "function") checkFreeModePlayed(31);
    } catch (e) {
      console.warn("Erro ao checar conquista:", e);
    }

    this.renderFreeModeSelector();
  },

  renderFreeModeSelector: function () {
    this.hideAllScreens();
    const selectorScreen = document.getElementById("sound-free-mode-selector");
    const grid = document.getElementById("free-mode-worlds-grid");

    if (!selectorScreen || !grid) return;

    selectorScreen.classList.remove("hidden");
    grid.innerHTML = "";

    SoundJourneyData.forEach((world, index) => {
      const isCompleted = SoundLevels.state.completedWorlds.includes(world.id);
      const progress = SoundLevels.getCurrentLevelIndex(world.id);
      const totalItems = world.items.length;

      const statusIcon = isCompleted
        ? "🗺️"
        : progress > 0
        ? `${progress}/${totalItems}`
        : "";
      const statusClass = isCompleted ? "text-blue-500" : "text-gray-500";

      const btn = document.createElement("button");
      btn.className = `card w-full p-4 rounded-xl shadow-md flex items-center justify-start space-x-4 hover:scale-[1.01] transition-transform`;
      btn.setAttribute(
        "style",
        `border-left: 8px solid var(--game-${world.color});`
      );

      btn.innerHTML = `
            <span class="text-4xl pointer-events-none">${world.icon}</span>
            <span class="text-lg font-bold text-gray-800 flex-grow text-left pointer-events-none">${world.title}</span>
            <span class="text-sm font-bold ${statusClass}">${statusIcon}</span>
        `;

      btn.onclick = () => this.enterFreeModeWorld(world.id);
      grid.appendChild(btn);
    });

    if (typeof lucide !== "undefined") lucide.createIcons();
  },

  enterFreeModeWorld: function (worldId) {
    this.activeWorld = SoundJourneyData.find(w => w.id === worldId);
    this.renderMap(this.activeWorld);
  },

  startRandomMode: function () {
    this.currentMode = "random";
    this.hideAllScreens();
    document.getElementById("sound-game-play").classList.remove("hidden");

    const allWorlds = SoundJourneyData;
    const randomWorld = allWorlds[Math.floor(Math.random() * allWorlds.length)];
    const randomItem =
      randomWorld.items[Math.floor(Math.random() * randomWorld.items.length)];

    this.activeItemData = randomItem;
    this.activeItemIndex = -1;
    this.renderGameplay(randomItem);
  },

  hideAllScreens: function () {
    document.getElementById("sound-game-menu")?.classList.add("hidden");
    document.getElementById("sound-game-map")?.classList.add("hidden");
    document.getElementById("sound-game-play")?.classList.add("hidden");
    document.getElementById("sound-level-up-popup")?.classList.add("hidden");
    document
      .getElementById("sound-free-mode-selector")
      ?.classList.add("hidden");
  },

  updateMenuStats: function () {
    const scoreEl = document.getElementById("sound-menu-score");
    const mapsEl = document.getElementById("sound-menu-stars");

    if (scoreEl) scoreEl.textContent = SoundLevels.state.totalScore;
    if (mapsEl) mapsEl.textContent = SoundLevels.state.totalMaps;

    const currentWorld = SoundJourneyData.find(
      w => w.id === SoundLevels.state.currentWorldId
    );
    const cardTitle = document.getElementById("sound-menu-world-title");
    const cardIcon = document.getElementById("sound-menu-world-icon");
    const progressBar = document.getElementById("sound-menu-progress-bar");

    if (currentWorld && cardTitle) {
      cardTitle.textContent = currentWorld.title;
      cardIcon.textContent = currentWorld.icon;

      const progress = SoundLevels.getCurrentLevelIndex(currentWorld.id);
      const total = currentWorld.items.length;
      const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
    }
  },

  renderMap: function (world) {
    this.hideAllScreens();
    const mapScreen = document.getElementById("sound-game-map");
    mapScreen.classList.remove("hidden");
    document.getElementById("map-world-title").textContent = world.title;
    const mapContainer = document.querySelector(
      "#sound-game-map .map-container"
    );
    mapContainer.className = `map-container flex-grow overflow-y-auto relative bg-gradient-to-b ${world.bgGradient}`;
    const svgContainer = document.getElementById("map-svg-container");
    svgContainer.innerHTML = "";
    const items = world.items;
    const nodeSpacing = 100;
    const paddingBottom = 150;
    const paddingTop = 100;
    const totalHeight = items.length * nodeSpacing + paddingBottom + paddingTop;
    const width = svgContainer.clientWidth || 340;
    const centerX = width / 2;
    const amplitude = width * 0.35;
    const frequency = 0.6;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", totalHeight);
    svg.style.display = "block";
    let pathD = "";
    const points = [];
    for (let i = 0; i < items.length; i++) {
      const y = totalHeight - paddingBottom - i * nodeSpacing;
      const x = centerX + Math.sin(i * frequency) * amplitude;
      points.push({ x, y, index: i });
    }
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cX = (prev.x + curr.x) / 2;
        const cY = (prev.y + curr.y) / 2;
        pathD += ` Q ${prev.x} ${cY} ${cX} ${cY} T ${curr.x} ${curr.y}`;
      }
    }
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathEl.setAttribute("d", pathD);
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("stroke", "white");
    pathEl.setAttribute("stroke-width", "8");
    pathEl.setAttribute("stroke-linecap", "round");
    pathEl.setAttribute("stroke-dasharray", "15, 15");
    pathEl.classList.add("map-path-anim");
    svg.appendChild(pathEl);
    svgContainer.appendChild(svg);
    const nodesLayer = document.getElementById("map-nodes-layer");
    nodesLayer.innerHTML = "";
    nodesLayer.style.height = `${totalHeight}px`;
    points.forEach(pt => {
      const status = SoundLevels.getLevelStatus(world.id, pt.index);
      const item = items[pt.index];
      const node = document.createElement("button");
      node.className = `map-node absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform active:scale-90`;
      node.style.left = `${pt.x}px`;
      node.style.top = `${pt.y}px`;
      if (status === "locked") {
        node.classList.add(
          "bg-gray-300",
          "border-gray-400",
          "cursor-not-allowed"
        );
        if (this.currentMode === "free") {
          node.classList.remove("cursor-not-allowed");
          node.classList.add("hover:scale-110");
          node.onclick = () => this.enterLevel(pt.index);
        } else {
          node.innerHTML = `<i data-lucide="lock" class="w-6 h-6 text-gray-500"></i>`;
        }
      } else if (status === "completed") {
        node.classList.add("bg-blue-400", "border-white");
        node.innerHTML = `<span class="text-xl">🗺️</span>`;
        node.onclick = () => this.enterLevel(pt.index);
      } else if (status === "current") {
        node.classList.add(
          "bg-yellow-400",
          "border-white",
          "animate-pulse-node"
        );
        node.innerHTML = `<span class="text-2xl">${item.emoji}</span>`;
        node.onclick = () => this.enterLevel(pt.index);
      }
      nodesLayer.appendChild(node);
      const label = document.createElement("div");
      label.className =
        "absolute text-xs font-bold text-gray-600 bg-white/80 px-2 py-0.5 rounded-full";
      label.style.left = `${pt.x}px`;
      label.style.top = `${pt.y + 40}px`;
      label.style.transform = "translateX(-50%)";
      label.innerText = pt.index + 1;
      nodesLayer.appendChild(label);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
    setTimeout(() => {
      const currentPt = points.find(
        p => p.index === SoundLevels.getCurrentLevelIndex(world.id)
      );
      if (currentPt) {
        const scrollY = currentPt.y - mapContainer.clientHeight / 2;
        mapContainer.scrollTo({ top: scrollY, behavior: "smooth" });
      } else {
        mapContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  },

  // --- GAMEPLAY ---

  enterLevel: function (index) {
    this.activeItemIndex = index;
    this.activeItemData = this.activeWorld.items[index];
    this.renderGameplay(this.activeItemData);
  },

  renderGameplay: function (itemData) {
    this.hideAllScreens();
    const playScreen = document.getElementById("sound-game-play");
    playScreen.classList.remove("hidden");

    this.isGameActive = true;
    this.wrongAttempts = 0;

    const feedbackEl = document.getElementById("gameplay-feedback");
    feedbackEl.textContent = "";
    feedbackEl.className = "h-8 text-center font-bold text-lg";
    document.getElementById("gameplay-score").textContent =
      SoundLevels.state.totalScore;

    // --- BARRA DE PROGRESSO ---
    let progressPct = 0;
    let progressText = "";
    if (this.currentMode === "journey" || this.currentMode === "free") {
      const total = this.activeWorld.items.length;
      const current = this.activeItemIndex + 1;
      progressPct = (current / total) * 100;
      progressText = `${current}/${total}`;
    } else {
      progressPct = 100;
      progressText = "∞";
    }

    document.getElementById(
      "gameplay-progress-bar"
    ).style.width = `${progressPct}%`;
    document.getElementById("gameplay-progress-text").textContent =
      progressText;

    const helpBtn = document.getElementById("gameplay-help-btn");
    if (helpBtn) {
      helpBtn.onclick = () => {
        if (typeof showHelpModal === "function") showHelpModal("sound");
      };
    }

    const mainEmoji = document.getElementById("gameplay-main-emoji");
    const soundIcon = document.getElementById("gameplay-sound-icon-container");

    mainEmoji.textContent = itemData.emoji;
    mainEmoji.classList.remove("animate-gentle-hint");
    if (soundIcon) soundIcon.classList.remove("animate-gentle-hint");
    void mainEmoji.offsetWidth;

    mainEmoji.onclick = () => {
      this.playItemSound(itemData.speech);
      this.triggerBigEmojiAnimation(mainEmoji);
    };

    setTimeout(() => this.playItemSound(itemData.speech), 500);

    if (this.hintInterval) clearInterval(this.hintInterval);
    this.hintInterval = setInterval(() => {
      if (this.isGameActive) {
        mainEmoji.classList.add("animate-gentle-hint");
        if (soundIcon) soundIcon.classList.add("animate-gentle-hint");
        setTimeout(() => {
          mainEmoji.classList.remove("animate-gentle-hint");
          if (soundIcon) soundIcon.classList.remove("animate-gentle-hint");
        }, 1000);
      }
    }, 4000);

    const optionsGrid = document.getElementById("gameplay-options-grid");
    optionsGrid.innerHTML = "";

    let options = [itemData];
    let otherItems = this.activeWorld.items.filter(
      i => i.name !== itemData.name
    );
    shuffleArray(otherItems);
    options.push(...otherItems.slice(0, 3));
    shuffleArray(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "game-option-btn-3d";
      btn.textContent = opt.name;
      btn.dataset.correct = opt.name === itemData.name;

      btn.onclick = () => this.handleGuess(btn, opt, itemData);
      optionsGrid.appendChild(btn);
    });
  },

  handleGuess: function (btn, selected, correct) {
    if (!this.isGameActive) return;

    const isCorrect = selected.name === correct.name;
    const feedbackEl = document.getElementById("gameplay-feedback");

    // Rastreamento e Streak
    if (typeof GameAnalytics !== "undefined") {
      GameAnalytics.record("sound", isCorrect);
    }

    if (isCorrect) {
      this.correctStreak = (this.correctStreak || 0) + 1;
      this.wrongAttempts = 0;
    } else {
      this.wrongAttempts++;
      this.correctStreak = 0;
    }

    try {
      if (typeof checkCorrectStreak === "function") checkCorrectStreak(30);
      if (typeof checkWrongStreak === "function") checkWrongStreak(29);
    } catch (e) {
      console.warn("Erro ao checar streak:", e);
    }

    if (isCorrect) {
      this.isGameActive = false;
      if (this.hintInterval) clearInterval(this.hintInterval);

      const isStimulant = document
        .getElementById("app-shell")
        ?.classList.contains("theme-stimulant");

      // 1. Áudio de Acerto
      if (isStimulant) {
        try {
          const audio = document.getElementById("correct-guess-sound");
          const willTriggerPerfectFeedback =
            (SoundLevels.state.totalScore + 1) % 5 === 0;
          if (!willTriggerPerfectFeedback && audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn("Erro audio:", e));
          }
        } catch (e) {}
      }

      // 2. Conquistas e Pontuação
      try {
        if (typeof registerProgress === "function") registerProgress(10, 1);
      } catch (e) {}

      try {
        if (typeof triggerStarBurst === "function") {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          triggerStarBurst(centerX, centerY);
        }
      } catch (e) {
        console.warn("Erro no StarBurst:", e);
      }

      // 4. Feedback Visual e Progressão
      btn.classList.add("correct");
      feedbackEl.textContent = "Correto!";
      feedbackEl.className =
        "h-8 text-center text-2xl font-black text-green-600 mb-2 animate-bounce";

      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

      if (this.currentMode === "journey") {
        try {
          const leveledUp = SoundLevels.completeLevel(
            this.activeWorld.id,
            this.activeItemIndex
          );
          if (leveledUp) {
            const willTriggerPerfectFeedback =
              SoundLevels.state.totalScore % 5 === 0;
            if (
              willTriggerPerfectFeedback &&
              typeof showPerfectFeedback === "function"
            ) {
              showPerfectFeedback(SoundLevels.state.totalScore);
            }
            if (typeof checkJourneyCompletion === "function") {
              checkJourneyCompletion(this.activeWorld.id);
            }
          }
        } catch (e) {
          console.error("Erro ao completar nível:", e);
        }
      }

      setTimeout(() => {
        this.nextLevel();
      }, 1500);
    } else {
      // Bloco de erro
      btn.classList.add("incorrect", "animate-shake");
      feedbackEl.textContent = "Tente de novo!";
      feedbackEl.className =
        "h-8 text-center text-xl font-bold text-red-500 mb-2";
      if (navigator.vibrate) navigator.vibrate(200);

      try {
        if (this.wrongAttempts >= 3) {
          const correctBtn = document.querySelector(
            '.game-option-btn-3d[data-correct="true"]'
          );
          if (correctBtn) {
            correctBtn.classList.add("animate-gentle-hint");
            setTimeout(
              () => correctBtn.classList.remove("animate-gentle-hint"),
              1000
            );
          }
        }
      } catch (e) {}

      setTimeout(() => this.playItemSound(correct.speech), 500);
    }
  },

  nextLevel: function () {
    if (this.currentMode === "random") {
      this.startRandomMode();
      return;
    }
    if (this.activeItemIndex < this.activeWorld.items.length - 1) {
      this.activeItemIndex++;
      this.enterLevel(this.activeItemIndex);
    } else {
      this.showWorldComplete();
    }
  },

  showWorldComplete: function () {
    if (document.getElementById("achievement-sound")) {
      const audio = document.getElementById("achievement-sound");
      audio.src = "src/assets/sounds/Achievement.mp3";
      audio.play().catch(e => console.log(e));
    }
    const popup = document.getElementById("sound-level-up-popup");
    const btnText = document.getElementById("level-up-btn-text");
    const btnIcon = document.getElementById("level-up-btn-icon");

    if (popup) {
      if (this.currentMode === "free") {
        if (btnText) btnText.textContent = "Voltar ao Menu Livre";
        if (btnIcon) btnIcon.dataset.lucide = "arrow-left";

        const rewardBox = document.querySelector(
          "#sound-level-up-popup .bg-yellow-50"
        );
        if (rewardBox) rewardBox.classList.add("hidden");
      } else {
        if (btnText) btnText.textContent = "Próxima Jornada";
        if (btnIcon) btnIcon.dataset.lucide = "arrow-right";

        // Recompensa de Mapa
        const rewardBox = document.querySelector(
          "#sound-level-up-popup .bg-yellow-50"
        );
        if (rewardBox) {
          rewardBox.classList.remove("hidden");
          rewardBox.innerHTML = `
                <span class="text-xs font-bold text-yellow-600 uppercase">Recompensa</span>
                <div class="text-lg font-bold text-yellow-700 flex items-center justify-center gap-2">
                    <span class="text-2xl">🗺️</span> +1 Mapa
                </div>
              `;
        }
      }

      popup.classList.remove("hidden");
      if (typeof lucide !== "undefined") lucide.createIcons();
    } else {
      alert(`Parabéns! Você completou o mundo ${this.activeWorld.title}!`);
      this.renderMainMenu();
    }
  },

  closeLevelUpPopup: function () {
    document.getElementById("sound-level-up-popup")?.classList.add("hidden");
    this.renderMainMenu();
    if (typeof stopAllAudio === "function") stopAllAudio();
  },

  proceedToNextWorld: function () {
    if (this.currentMode === "free") {
      document.getElementById("sound-level-up-popup")?.classList.add("hidden");
      this.renderFreeModeSelector();
      return;
    }

    const currentIndex = SoundJourneyData.findIndex(
      w => w.id === this.activeWorld.id
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex < SoundJourneyData.length) {
      const nextWorld = SoundJourneyData[nextIndex];
      SoundLevels.state.currentWorldId = nextWorld.id;
      SoundLevels.save();
      document.getElementById("sound-level-up-popup")?.classList.add("hidden");
      this.activeWorld = nextWorld;
      this.renderMap(nextWorld);
    } else {
      alert("VOCÊ COMPLETOU TODOS OS MUNDOS! INCRÍVEL!");
      this.closeLevelUpPopup();
    }
  },

  playItemSound: function (text) {
    if (typeof speakText === "function") {
      speakText(text);
    }
  },

  triggerBigEmojiAnimation: function (el) {
    el.style.transform = "scale(1.2) rotate(10deg)";
    setTimeout(() => (el.style.transform = "scale(1) rotate(0deg)"), 300);
  },

  goBack: function () {
    const playScreen = document.getElementById("sound-game-play");
    const mapScreen = document.getElementById("sound-game-map");
    const selectorScreen = document.getElementById("sound-free-mode-selector");

    if (!playScreen.classList.contains("hidden")) {
      if (this.currentMode === "journey" || this.currentMode === "free") {
        this.renderMap(this.activeWorld);
      } else {
        this.renderMainMenu();
      }
    } else if (!mapScreen.classList.contains("hidden")) {
      if (this.currentMode === "free") {
        this.renderFreeModeSelector();
      } else {
        this.renderMainMenu();
      }
    } else if (!selectorScreen?.classList.contains("hidden")) {
      this.renderMainMenu();
    } else {
      if (typeof showScreen === "function") {
        const nav = document.querySelector(
          '.nav-item[data-screen="games-screen"]'
        );
        showScreen("games-screen", nav);
      }
    }
  },

  changeWorld: function (direction) {
    const currentIndex = SoundJourneyData.findIndex(
      w => w.id === this.activeWorld.id
    );
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < SoundJourneyData.length) {
      const newWorld = SoundJourneyData[newIndex];
      if (
        this.currentMode === "journey" &&
        SoundLevels.isWorldLocked(newWorld.id)
      ) {
        const btn =
          direction > 0
            ? document.getElementById("map-next-world-btn")
            : document.getElementById("map-prev-world-btn");
        btn.classList.add("animate-shake");
        setTimeout(() => btn.classList.remove("animate-shake"), 500);
        return;
      }
      this.activeWorld = newWorld;
      if (this.currentMode === "journey") {
        SoundLevels.state.currentWorldId = newWorld.id;
        SoundLevels.save();
      }
      this.renderMap(newWorld);
    }
  },
};

window.initializeSoundGame = function () {
  SoundLogic.init();
};

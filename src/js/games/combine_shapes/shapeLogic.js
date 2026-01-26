// =============================================
// ARQUIVO: src/js/games/combine_shapes/shapeLogic.js
// DESCRIÇÃO: Lógica principal para o jogo Combinar Formas
// =============================================

const ShapeLogic = {
  currentMode: "journey",
  activeJourney: null,
  sessionScore: 0,

  init: function () {
    if (typeof ShapeLevels !== "undefined") ShapeLevels.init();
  },

  updateScoreUI: function () {
    const scoreEl = document.getElementById("gameplay-score");
    if (!scoreEl) return;

    if (this.currentMode === "journey") {
      if (typeof ShapeLevels !== "undefined") {
        scoreEl.textContent = ShapeLevels.state.totalScore;
      }
    } else {
      scoreEl.textContent = this.sessionScore;
    }
  },

  addScore: function (amount) {
    if (this.currentMode === "journey") {
      if (typeof ShapeLevels !== "undefined") {
        ShapeLevels.addPoints(amount);
      }
    } else {
      this.sessionScore += amount;
    }
    this.updateScoreUI();
  },
  renderMainMenu: function () {
    this.hideAllScreens();
    const menu = document.getElementById("shape-game-menu");
    if (!menu) return;
    menu.classList.remove("hidden");

    if (typeof ShapeLevels !== "undefined") {
      document.getElementById("shape-menu-score").textContent =
        ShapeLevels.state.totalScore;
      document.getElementById("shape-total-stars").textContent =
        ShapeLevels.state.totalStars;
      document.getElementById("shape-total-maps").textContent =
        ShapeLevels.state.totalMaps;

      const currentId = ShapeLevels.state.currentJourneyId || "j1_basic";
      const currentJourney = ShapeJourneyData.find(j => j.id === currentId);

      if (currentJourney) {
        const titleEl = document.getElementById("shape-menu-world-title");
        const iconEl = document.getElementById("shape-menu-world-icon");
        const barEl = document.getElementById("shape-menu-progress-bar");

        if (titleEl) titleEl.textContent = currentJourney.title;
        if (iconEl) iconEl.textContent = currentJourney.icon;

        const progressIdx = ShapeLevels.getCurrentLevelIndex(currentId);
        const total = currentJourney.levels.length;
        const pct = total > 0 ? Math.round((progressIdx / total) * 100) : 0;
        if (barEl) barEl.style.width = `${pct}%`;
      }
    }
  },

  startJourney: function () {
    this.currentMode = "journey";
    const currentId = ShapeLevels.state.currentJourneyId || "j1_basic";
    this.activeJourney = ShapeJourneyData.find(j => j.id === currentId);
    if (!this.activeJourney) this.activeJourney = ShapeJourneyData[0];
    ShapeLevels.state.currentJourneyId = this.activeJourney.id;
    ShapeLevels.save();
    this.renderMap(this.activeJourney);
  },

  startFreeMode: function () {
    this.currentMode = "free";
    this.sessionScore = 0;
    this.renderFreeModeSelector();
  },

  startRandomMode: function () {
    this.currentMode = "random";
    this.sessionScore = 0;
    this.hideAllScreens();
    const randomJourney =
      ShapeJourneyData[Math.floor(Math.random() * ShapeJourneyData.length)];
    const randomLevel =
      randomJourney.levels[
        Math.floor(Math.random() * randomJourney.levels.length)
      ];
    this.activeJourney = randomJourney;
    this.startGameData(randomLevel);
  },

  renderFreeModeSelector: function () {
    this.hideAllScreens();
    document
      .getElementById("shape-free-mode-selector")
      .classList.remove("hidden");
    const grid = document.getElementById("free-mode-shapes-grid");
    grid.innerHTML = "";

    ShapeJourneyData.forEach(journey => {
      const progress = ShapeLevels.getJourneyProgressPct(journey.id);
      const btn = document.createElement("button");
      btn.className = `card w-full p-4 rounded-xl shadow-md flex items-center justify-start space-x-4 border-l-8 transition-transform bg-white border-blue-500 hover:scale-[1.01]`;
      btn.innerHTML = `
                <span class="text-4xl">${journey.icon}</span>
                <div class="text-left flex-grow">
                    <span class="text-lg font-bold text-gray-800 block">${
                      journey.title
                    }</span>
                    <span class="text-xs font-bold text-blue-500">${Math.round(
                      progress
                    )}% Concluído</span>
                </div>
            `;
      btn.onclick = () => {
        this.activeJourney = journey;
        this.playFreeModeRound();
      };
      grid.appendChild(btn);
    });
  },

  playFreeModeRound: function () {
    if (!this.activeJourney) return;
    const randomLevel =
      this.activeJourney.levels[
        Math.floor(Math.random() * this.activeJourney.levels.length)
      ];
    this.startGameData(randomLevel);
  },

  renderMap: function (journey) {
    this.hideAllScreens();
    document.getElementById("shape-game-map").classList.remove("hidden");
    document.getElementById("shape-map-title").textContent = journey.title;
    const grid = document.getElementById("shape-levels-grid");
    grid.innerHTML = "";

    journey.levels.forEach((level, idx) => {
      const currentIdx = ShapeLevels.getCurrentLevelIndex(journey.id);
      let status = "locked";
      if (idx < currentIdx) status = "completed";
      if (idx === currentIdx) status = "current";

      const btn = document.createElement("button");
      btn.className = `relative h-32 rounded-2xl flex flex-col items-center justify-center p-2 border-b-4 transition-all ${
        status === "locked"
          ? "bg-slate-100 border-slate-200 text-gray-300"
          : status === "completed"
          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
          : "bg-white border-blue-500 text-blue-600 shadow-lg ring-2 ring-blue-100 scale-105 z-10"
      }`;
      const icon = SHAPE_SVGS[level.availableShapes[0]] || "❓";
      btn.innerHTML = `
                <div class="w-12 h-12 mb-1 ${
                  status === "current" ? "animate-bounce" : "opacity-50"
                }">
                    ${
                      status === "locked"
                        ? '<i data-lucide="lock" class="w-8 h-8 mx-auto mt-2"></i>'
                        : icon
                    }
                </div>
                <span class="text-xs font-black uppercase tracking-wide">${
                  level.name
                }</span>
                ${
                  status === "completed"
                    ? '<div class="absolute top-2 right-2 text-emerald-500">✔</div>'
                    : ""
                }
            `;
      if (status !== "locked") btn.onclick = () => this.startGame(idx);
      grid.appendChild(btn);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  },

  startGame: function (levelIndex) {
    const levelData = this.activeJourney.levels[levelIndex];
    this.startGameData(levelData);
  },

  startGameData: function (levelData) {
    this.hideAllScreens();
    document
      .getElementById("game-combine-shapes-screen")
      .classList.remove("hidden");
    const container = document.getElementById("shape-game-container");
    container.style.transform =
      this.activeJourney.theme === "upside_down" ? "rotate(180deg)" : "none";
    if (typeof ShapeGameplay !== "undefined") {
      ShapeGameplay.loadLevel(levelData, this.activeJourney.theme);
      this.updateScoreUI();
    }
  },

  onLevelComplete: function () {
    if (this.currentMode === "random" || this.currentMode === "free") {
      this.showPopup(false, false, true);
      return;
    }
    const currentIdx = ShapeLevels.getCurrentLevelIndex(this.activeJourney.id);
    let leveledUp = ShapeLevels.completeLevel(
      this.activeJourney.id,
      currentIdx
    );
    const totalLevels = this.activeJourney.levels.length;
    const newIdx = ShapeLevels.getCurrentLevelIndex(this.activeJourney.id);
    const isJourneyEnd = newIdx >= totalLevels;

    if (isJourneyEnd) {
      const isGrandFinale =
        ShapeLevels.state.totalMaps > 0 &&
        this.activeJourney.id === "j5_master";
      this.showPopup(isGrandFinale, true);
    } else {
      if (leveledUp) {
        setTimeout(() => {
          this.startGame(newIdx);
        }, 1200);
      } else {
        setTimeout(() => this.renderMap(this.activeJourney), 1000);
      }
    }
  },

  showPopup: function (isGrandFinale, isJourneyEnd, isRandom = false) {
    const popup = document.getElementById("shape-level-up-popup");
    const title = document.getElementById("shape-levelup-title");
    const msg = document.getElementById("shape-levelup-msg");
    const btnText = document.getElementById("shape-levelup-btn-text");
    const rewardBox = document.getElementById("shape-levelup-reward");
    const audio = document.getElementById("achievement-sound");
    if (audio) {
      audio.src = "src/assets/sounds/Achievement.mp3";
      audio.play().catch(() => {});
    }

    if (isRandom) {
      title.textContent = "MUITO BEM!";
      msg.textContent = "Desafio concluído!";
      btnText.textContent = "Próximo Desafio";
      rewardBox.classList.add("hidden");
    } else if (isGrandFinale) {
      title.textContent = "MESTRE SUPREMO!";
      msg.textContent = "Todas as formas dominadas!";
      btnText.textContent = "Voltar ao Menu";
      rewardBox.classList.remove("hidden");
      rewardBox.innerHTML = `<span class="text-xs font-bold text-yellow-600 uppercase">Prêmio</span><div class="text-2xl font-black text-yellow-500 mt-1">🗺️ MAPA DE OURO</div>`;
    } else {
      title.textContent = "JORNADA COMPLETA!";
      msg.textContent = `Você finalizou ${this.activeJourney.title}.`;
      btnText.textContent = "Próxima Jornada";
      rewardBox.classList.remove("hidden");
      rewardBox.innerHTML = `<span class="text-xs font-bold text-yellow-600 uppercase">Prêmio</span><div class="text-2xl font-black text-yellow-500 mt-1">⭐ Nova Estrela</div>`;
    }
    popup.classList.remove("hidden");
    if (typeof lucide !== "undefined") lucide.createIcons();
  },

  proceedNext: function () {
    document.getElementById("shape-level-up-popup").classList.add("hidden");
    if (this.currentMode === "random") {
      this.startRandomMode();
      return;
    }
    if (this.currentMode === "free") {
      this.playFreeModeRound();
      return;
    }

    const currentJIndex = ShapeJourneyData.findIndex(
      j => j.id === this.activeJourney.id
    );
    const nextJIndex = currentJIndex + 1;
    if (nextJIndex < ShapeJourneyData.length) {
      const nextJourney = ShapeJourneyData[nextJIndex];
      ShapeLevels.state.currentJourneyId = nextJourney.id;
      ShapeLevels.save();
      this.activeJourney = nextJourney;
      this.renderMap(nextJourney);
    } else {
      this.renderMainMenu();
    }
  },

  closePopup: function () {
    document.getElementById("shape-level-up-popup").classList.add("hidden");
    if (this.currentMode === "free") this.renderFreeModeSelector();
    else this.renderMainMenu();
  },

  hideAllScreens: function () {
    document.getElementById("shape-game-menu")?.classList.add("hidden");
    document.getElementById("shape-game-map")?.classList.add("hidden");
    document
      .getElementById("game-combine-shapes-screen")
      ?.classList.add("hidden");
    document
      .getElementById("shape-free-mode-selector")
      ?.classList.add("hidden");
    document.getElementById("shape-level-up-popup")?.classList.add("hidden");
  },

  goBack: function () {
    if (
      !document
        .getElementById("game-combine-shapes-screen")
        .classList.contains("hidden")
    ) {
      if (this.currentMode === "random") this.renderMainMenu();
      else if (this.currentMode === "free") this.renderFreeModeSelector();
      else this.renderMap(this.activeJourney);
    } else if (
      !document.getElementById("shape-game-map").classList.contains("hidden")
    ) {
      this.renderMainMenu();
    } else if (
      !document
        .getElementById("shape-free-mode-selector")
        .classList.contains("hidden")
    ) {
      this.renderMainMenu();
    } else {
      document
        .getElementById("game-combine-shapes-wrapper")
        .classList.add("hidden");
      if (typeof showScreen === "function") {
        const nav = document.querySelector(
          '.nav-item[data-screen="games-screen"]'
        );
        showScreen("games-screen", nav);
      }
    }
  },
};

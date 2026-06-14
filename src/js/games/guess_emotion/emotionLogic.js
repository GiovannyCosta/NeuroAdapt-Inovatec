// =============================================
// ARQUIVO: src/js/games/guess_emotion/emotionLogic.js
// DESCRIÇÃO: Lógica Principal (Com Verificação de Conquistas)
// =============================================

const EmotionLogic = {
  currentMode: "journey",
  activeWorld: null,
  activeItemIndex: 0,
  isGameActive: false,
  wrongAttempts: 0,
  correctStreak: 0, 
  hintInterval: null,

  init: function () {
    if (typeof EmotionLevels !== "undefined") EmotionLevels.init();
    this.renderMainMenu();
  },

  handleGuess: function (isCorrect, btn, item) {
    if (!this.isGameActive) return;

    const feedbackEl = document.getElementById("emotion-gameplay-feedback");
    if (typeof GameAnalytics !== "undefined")
      GameAnalytics.record("emotion", isCorrect);

    if (isCorrect) {
      // === ACERTO ===
      this.isGameActive = false;
      this.correctStreak++; 
      if (this.hintInterval) clearInterval(this.hintInterval);

      // --- VERIFICAÇÃO DE CONQUISTAS ---
      if (typeof checkEmotionCollection === "function") {
        checkEmotionCollection(50); // Nova descoberta
        checkEmotionCollection(51); // 5 Emoções
        checkEmotionCollection(52); // 10 Emoções
      }
      if (typeof checkEmotionStreak === "function") {
        checkEmotionStreak(58); // 5 Seguidas
      }
      // ---------------------------------

      btn.classList.remove(
        "bg-white",
        "border-gray-200",
        "text-gray-700",
        "border-blue-200",
        "bg-white"
      );
      btn.classList.add(
        "bg-green-500",
        "border-green-600",
        "text-white",
        "transform",
        "scale-95",
        "transition-transform",
        "duration-100"
      );

      feedbackEl.textContent = "Correto!";
      feedbackEl.className =
        "h-8 text-center text-2xl font-black text-green-600 mt-6 mb-6";

      if (typeof triggerStarBurst === "function")
        triggerStarBurst(
          btn.getBoundingClientRect().left,
          btn.getBoundingClientRect().top
        );

      EmotionLevels.unlockCollectionItem(item.id);

      setTimeout(() => btn.classList.remove("scale-95"), 150);

      if (this.currentMode === "journey") {
        const leveledUp = EmotionLevels.completeLevel(
          this.activeWorld.id,
          this.activeItemIndex
        );

        if (leveledUp) {
          const isWorldComplete = EmotionLevels.state.completedWorlds.includes(
            this.activeWorld.id
          );
          if (isWorldComplete && typeof checkJourneyCompletion === "function") {
            checkJourneyCompletion(this.activeWorld.id);
          }
        }

        if (leveledUp && EmotionLevels.state.totalScore % 5 === 0) {
          if (typeof showPerfectFeedback === "function")
            showPerfectFeedback(EmotionLevels.state.totalScore);
        }
      }

      setTimeout(() => this.nextLevel(), 1500);
    } else {
      // === ERRO ===
      this.wrongAttempts++;
      this.correctStreak = 0; // Reseta Streak

      btn.classList.remove(
        "bg-white",
        "border-gray-200",
        "text-gray-700",
        "border-blue-200",
        "bg-white"
      );
      btn.classList.add(
        "bg-red-500",
        "border-red-600",
        "text-white",
        "animate-shake"
      );
      btn.disabled = true;

      feedbackEl.textContent = "Tente de novo!";
      feedbackEl.className =
        "h-8 text-center text-xl font-bold text-red-500 mt-6 mb-6";

      if (navigator.vibrate) navigator.vibrate(200);

      if (this.wrongAttempts >= 3) {
        const correctBtn = document.querySelector(
          'button[data-correct="true"]'
        );
        if (correctBtn) {
          correctBtn.classList.add("animate-gentle-hint");
          setTimeout(
            () => correctBtn.classList.remove("animate-gentle-hint"),
            1000
          );
        }
      }
    }
  },

  hideAllScreens: function () {
    document.getElementById("emotion-game-menu")?.classList.add("hidden");
    document.getElementById("emotion-game-map")?.classList.add("hidden");
    document.getElementById("emotion-game-play")?.classList.add("hidden");
    document.getElementById("emotion-game-album")?.classList.add("hidden");
    document.getElementById("emotion-level-up-popup")?.classList.add("hidden");
    if (this.hintInterval) clearInterval(this.hintInterval);
  },

  renderMainMenu: function () {
    this.hideAllScreens();
    document.getElementById("emotion-game-menu").classList.remove("hidden");

    if (typeof EmotionLevels !== "undefined") {
      document.getElementById("emotion-menu-score").textContent =
        EmotionLevels.state.totalScore;
      document.getElementById("emotion-menu-maps").textContent =
        EmotionLevels.state.totalMaps;

      const currentWorldId = EmotionLevels.state.currentWorldId;
      const currentWorld =
        EmotionJourneyData.find(w => w.id === currentWorldId) ||
        EmotionJourneyData[0];

      if (currentWorld) {
        const color = currentWorld.color;
        document.getElementById(
          "emotion-menu-card"
        ).className = `card w-full p-6 rounded-3xl shadow-lg bg-white border-l-8 border-${color}-500 animate-fade-in`;
        document.getElementById(
          "emotion-menu-world-icon-bg"
        ).className = `text-5xl bg-${color}-50 p-3 rounded-2xl flex items-center justify-center w-20 h-20`;
        document.getElementById(
          "emotion-menu-main-btn"
        ).className = `w-full py-4 bg-${color}-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-${color}-200 transition-transform flex items-center justify-center space-x-2`;
        document.getElementById("emotion-menu-world-title").textContent =
          currentWorld.title;
        document.getElementById("emotion-menu-world-icon").textContent =
          currentWorld.icon;
        const progress = EmotionLevels.getCurrentLevelIndex(currentWorld.id);
        const total = currentWorld.items.length;
        const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
        const pBar = document.getElementById("emotion-menu-progress-bar");
        pBar.className = `bg-${color}-500 h-full rounded-full transition-all duration-1000 shadow-sm`;
        pBar.style.width = `${pct}%`;
      }
    }
  },

  startJourney: function () {
    this.currentMode = "journey";
    const wId = EmotionLevels.state.currentWorldId;
    this.activeWorld =
      EmotionJourneyData.find(w => w.id === wId) || EmotionJourneyData[0];
    this.renderMap(this.activeWorld);
  },

  startRandomMode: function () {
    this.currentMode = "random";
    const all = EmotionJourneyData;
    this.activeWorld = all[Math.floor(Math.random() * all.length)];
    this.enterLevel(Math.floor(Math.random() * this.activeWorld.items.length));
  },

  renderAlbum: function () {
    this.hideAllScreens();
    document.getElementById("emotion-game-album").classList.remove("hidden");
    const grid = document.getElementById("emotion-album-grid");
    grid.innerHTML = "";
    const collectedIds = EmotionLevels.state.collection || [];

    EmotionJourneyData.forEach(world => {
      const sectionTitle = document.createElement("h3");
      sectionTitle.className =
        "col-span-2 text-sm font-bold text-gray-400 uppercase mt-4 mb-2";
      sectionTitle.textContent = world.title;
      grid.appendChild(sectionTitle);

      world.items.forEach(item => {
        const isUnlocked = collectedIds.includes(item.id);
        const card = document.createElement("div");
        if (isUnlocked) {
          card.className =
            "card p-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center space-x-3 animate-fade-in";
          card.innerHTML = `<div class="text-4xl">${item.emoji}</div><div><div class="font-bold text-gray-800 text-sm">${item.name}</div><div class="text-[10px] text-green-500 font-bold uppercase bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">Aprendido</div></div>`;
          card.onclick = () => {
            if (typeof speakText === "function") speakText(item.speech);
            card.classList.add("scale-105");
            setTimeout(() => card.classList.remove("scale-105"), 200);
          };
        } else {
          card.className =
            "card p-3 rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex items-center space-x-3 opacity-60";
          card.innerHTML = `<div class="text-4xl grayscale opacity-50">❓</div><div><div class="font-bold text-gray-400 text-sm">Bloqueado</div></div>`;
        }
        grid.appendChild(card);
      });
    });
  },

  renderMap: function (world) {
    this.hideAllScreens();
    const mapScreen = document.getElementById("emotion-game-map");
    mapScreen.classList.remove("hidden");
    mapScreen.className = `relative z-10 h-full flex flex-col bg-gradient-to-b ${world.bgGradient}`;
    document.getElementById("emotion-map-world-title").textContent =
      world.title;
    const grid = document.getElementById("emotion-map-grid");
    grid.innerHTML = "";

    world.items.forEach((item, index) => {
      const status = EmotionLevels.getLevelStatus(world.id, index);
      const btn = document.createElement("button");
      const color = world.color;
      let classes =
        "w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform mx-auto ";
      let content = "";

      if (status === "locked") {
        classes += "bg-gray-200 border-gray-300 text-gray-400";
        content = `<i data-lucide="lock" class="w-6 h-6"></i>`;
      } else if (status === "completed") {
        classes += `bg-white border-${color}-400 text-green-600`;
        content = `<span class="text-2xl">✅</span>`;
        btn.onclick = () => this.enterLevel(index);
      } else if (status === "current") {
        classes += `bg-white border-${color}-400 animate-pulse ring-4 ring-${color}-100`;
        content = `<span class="text-3xl">${item.emoji}</span>`;
        btn.onclick = () => this.enterLevel(index);
      }
      btn.className = classes;
      btn.innerHTML = content;
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col items-center space-y-2 z-10";
      wrapper.innerHTML = `<span class="text-xs font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded-full shadow-sm uppercase">Desafio ${
        index + 1
      }</span>`;
      wrapper.prepend(btn);
      grid.appendChild(wrapper);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  },

  changeWorld: function (direction) {
    const idx = EmotionJourneyData.findIndex(w => w.id === this.activeWorld.id);
    const newIdx = idx + direction;
    if (newIdx >= 0 && newIdx < EmotionJourneyData.length) {
      const newWorld = EmotionJourneyData[newIdx];
      if (EmotionLevels.isWorldLocked(newWorld.id)) {
        alert("Complete o nível anterior para desbloquear!");
        return;
      }
      this.activeWorld = newWorld;
      EmotionLevels.state.currentWorldId = newWorld.id;
      EmotionLevels.save();
      this.renderMap(newWorld);
    }
  },

  enterLevel: function (index) {
    this.hideAllScreens();
    document.getElementById("emotion-game-play").classList.remove("hidden");
    this.activeItemIndex = index;
    this.isGameActive = true;
    this.wrongAttempts = 0;

    const progressSection = document.getElementById("emotion-progress-section");
    if (this.currentMode === "random") {
      if (progressSection) progressSection.classList.add("hidden");
    } else {
      if (progressSection) progressSection.classList.remove("hidden");
      const total = this.activeWorld.items.length;
      const pct = ((index + 1) / total) * 100;
      document.getElementById(
        "emotion-gameplay-progress-bar"
      ).style.width = `${pct}%`;
      document.getElementById(
        "emotion-gameplay-progress-text"
      ).textContent = `${index + 1} de ${total}`;
    }

    const item = this.activeWorld.items[index];
    EmotionGameplay.render(
      item,
      this.activeWorld.items,
      (isCorrect, btn) => this.handleGuess(isCorrect, btn, item),
      this.activeWorld.color
    );

    if (this.hintInterval) clearInterval(this.hintInterval);
    const mainEmoji = document.getElementById("emotion-gameplay-main-emoji");
    mainEmoji.onclick = () => {
      if (typeof speakText === "function") speakText(item.speech);
      mainEmoji.classList.remove("animate-gentle-hint");
      void mainEmoji.offsetWidth;
      mainEmoji.classList.add("animate-gentle-hint");
    };
    this.hintInterval = setInterval(() => {
      if (this.isGameActive) {
        mainEmoji.classList.add("animate-gentle-hint");
        setTimeout(
          () => mainEmoji.classList.remove("animate-gentle-hint"),
          1000
        );
      }
    }, 4000);
  },

  nextLevel: function () {
    if (this.currentMode === "random") {
      this.startRandomMode();
      return;
    }
    if (this.activeItemIndex < this.activeWorld.items.length - 1) {
      this.enterLevel(this.activeItemIndex + 1);
    } else {
      this.showLevelUpPopup();
    }
  },

  showLevelUpPopup: function () {
    document
      .getElementById("emotion-level-up-popup")
      .classList.remove("hidden");
    if (document.getElementById("achievement-sound")) {
      document
        .getElementById("achievement-sound")
        .play()
        .catch(() => {});
    }
  },

  closeLevelUpPopup: function () {
    document.getElementById("emotion-level-up-popup").classList.add("hidden");
    this.renderMap(this.activeWorld);
  },

  proceedToNextWorld: function () {
    document.getElementById("emotion-level-up-popup").classList.add("hidden");
    const currentId = this.activeWorld
      ? this.activeWorld.id
      : EmotionLevels.state.currentWorldId;
    const currentIndex = EmotionJourneyData.findIndex(w => w.id === currentId);

    if (currentIndex !== -1 && currentIndex < EmotionJourneyData.length - 1) {
      const nextWorld = EmotionJourneyData[currentIndex + 1];
      EmotionLevels.state.currentWorldId = nextWorld.id;
      EmotionLevels.save();
      this.activeWorld = nextWorld;
      this.enterLevel(0);
    } else {
      alert("Parabéns! Você completou todas as jornadas!");
      this.renderMainMenu();
    }
  },

  goBack: function () {
    if (this.hintInterval) clearInterval(this.hintInterval);
    if (
      !document.getElementById("emotion-game-play").classList.contains("hidden")
    ) {
      if (this.currentMode === "random") this.renderMainMenu();
      else this.renderMap(this.activeWorld);
    } else if (
      !document.getElementById("emotion-game-map").classList.contains("hidden")
    ) {
      this.renderMainMenu();
    } else if (
      !document
        .getElementById("emotion-game-album")
        .classList.contains("hidden")
    ) {
      this.renderMainMenu();
    } else {
      document.getElementById("game-emotion-wrapper").classList.add("hidden");
      if (typeof showScreen === "function") showScreen("games-screen");
    }
  },
};


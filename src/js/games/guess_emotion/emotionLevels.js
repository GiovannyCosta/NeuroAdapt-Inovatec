// =============================================
// ARQUIVO: src/js/games/guess_emotion/emotionLevels.js
// DESCRIÇÃO: Gerencia Progresso e Coleção (Álbum)
// =============================================

const EmotionLevels = {
  STORAGE_KEY: "neuro_emotion_journey_v3",

  state: {
    totalScore: 0,
    totalMaps: 0,
    currentWorldId: "level_1_basic",
    completedWorlds: [],
    worldProgress: {},
    collection: [],
  },

  init: function () {
    this.load();
    if (typeof EmotionJourneyData !== "undefined") {
      EmotionJourneyData.forEach(world => {
        if (typeof this.state.worldProgress[world.id] === "undefined") {
          this.state.worldProgress[world.id] = 0;
        }
      });
    }
  },

  load: function () {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.state = { ...this.state, ...JSON.parse(stored) };
        // Garante que collection existe (para saves antigos)
        if (!this.state.collection) this.state.collection = [];
      }
    } catch (e) {
      console.error("Erro ao carregar progresso Emoção:", e);
    }
  },

  save: function () {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Erro ao salvar progresso Emoção:", e);
    }
  },

  // Adiciona item ao álbum quando acertado pela primeira vez
  unlockCollectionItem: function (itemId) {
    if (!this.state.collection.includes(itemId)) {
      this.state.collection.push(itemId);
      this.save();
      return true; // Novo item desbloqueado!
    }
    return false;
  },

  isWorldLocked: function (worldId) {
    const index = EmotionJourneyData.findIndex(w => w.id === worldId);
    if (index <= 0) return false;
    const prevWorld = EmotionJourneyData[index - 1];
    const prevProgress = this.state.worldProgress[prevWorld.id] || 0;
    return prevProgress < prevWorld.items.length;
  },

  completeLevel: function (worldId, levelIndex) {
    const currentProgress = this.state.worldProgress[worldId] || 0;

    if (levelIndex === currentProgress) {
      this.state.worldProgress[worldId]++;
      this.state.totalScore++;

      const worldData = EmotionJourneyData.find(w => w.id === worldId);
      if (this.state.worldProgress[worldId] >= worldData.items.length) {
        if (!this.state.completedWorlds.includes(worldId)) {
          this.state.completedWorlds.push(worldId);
          this.state.totalMaps++;
        }
      }
      this.save();
      return true;
    }
    return false;
  },

  getLevelStatus: function (worldId, levelIndex) {
    const progress = this.state.worldProgress[worldId] || 0;
    if (levelIndex < progress) return "completed";
    if (levelIndex === progress) return "current";
    return "locked";
  },

  getCurrentLevelIndex: function (worldId) {
    return this.state.worldProgress[worldId] || 0;
  },
};


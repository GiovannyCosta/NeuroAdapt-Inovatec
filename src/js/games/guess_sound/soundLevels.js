// =============================================
// ARQUIVO: src/js/games/guess_sound/soundLevels.js
// DESCRIÇÃO: Gerenciador de Progresso e Persistência
// =============================================

const SoundLevels = {
  STORAGE_KEY: "neuro_sound_journey_v1",

  state: {
    totalScore: 0,
    totalMaps: 0,
    currentWorldId: "wild_life", // Mundo atual em foco
    completedWorlds: [], // IDs dos mundos completados (para ganhar mapa)
    worldProgress: {},
  },

  init: function () {
    this.load();
    // Inicializa o mapa de progresso se estiver vazio
    SoundJourneyData.forEach(world => {
      if (typeof this.state.worldProgress[world.id] === "undefined") {
        this.state.worldProgress[world.id] = 0;
      }
    });

  },

  load: function () {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.state = { ...this.state, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Erro ao carregar progresso do Som:", e);
    }
  },

  save: function () {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Erro ao salvar progresso do Som:", e);
    }
  },

  // Retorna se o mundo está bloqueado
  isWorldLocked: function (worldId) {
    const index = SoundJourneyData.findIndex(w => w.id === worldId);
    if (index <= 0) return false; // Primeiro mundo sempre aberto

    // Verifica se o mundo anterior foi completado (todos os itens jogados)
    const prevWorld = SoundJourneyData[index - 1];
    const prevProgress = this.state.worldProgress[prevWorld.id] || 0;
    return prevProgress < prevWorld.items.length;
  },

  // Registra que um nível (item) foi completado com sucesso
  completeLevel: function (worldId, levelIndex) {
    const currentProgress = this.state.worldProgress[worldId] || 0;

    // Só avança se completou o nível que estava "pendente" (linearidade)
    if (levelIndex === currentProgress) {
      this.state.worldProgress[worldId]++;
      this.state.totalScore++;

      // Verifica se completou o mundo inteiro
      const worldData = SoundJourneyData.find(w => w.id === worldId);
      if (this.state.worldProgress[worldId] >= worldData.items.length) {
        if (!this.state.completedWorlds.includes(worldId)) {
          this.state.completedWorlds.push(worldId);
          this.state.totalMaps++; // INCREMENTA MAPAS

          // Aciona o hook de conclusão para checar conquistas
          if (typeof SoundLogic !== "undefined" && SoundLogic.activeWorld) {
            SoundLogic.onWorldCompletion(worldId);
          }
        }
      }

      this.save();
      return true; // Progresso avançou
    }
    return false; // Já estava completado ou pulou etapa
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

  resetProgress: function () {
    this.state = {
      totalScore: 0,
      totalMaps: 0, // RENOMEADO
      currentWorldId: "wild_life",
      completedWorlds: [],
      worldProgress: {},
    };
    this.init();
    this.save();
  },
};

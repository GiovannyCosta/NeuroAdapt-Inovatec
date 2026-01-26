// =============================================
// ARQUIVO: src/js/games/combine_shapes/shapeLevels.js
// DESCRIÇÃO: Níveis e Progresso das Jornadas de Formas
// =============================================

const ShapeLevels = {
  STORAGE_KEY: "neuro_shape_journey_v5",

  state: {
    totalScore: 0,
    totalStars: 0,
    totalMaps: 0,
    completedJourneys: [],
    levelProgress: {}, // 'journey_id': nível (0-4)
    currentJourneyId: "j1_basic",
  },

  init: function () {
    this.load();
    if (typeof ShapeJourneyData !== "undefined") {
      ShapeJourneyData.forEach(j => {
        if (this.state.levelProgress[j.id] === undefined) {
          this.state.levelProgress[j.id] = 0;
        }
      });
    }
  },

  load: function () {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) this.state = { ...this.state, ...JSON.parse(stored) };
  },

  save: function () {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  // Pontua a cada acerto individual
  addPoints: function (amount) {
    this.state.totalScore += amount;
    this.save();
  },

  isJourneyLocked: function (journeyId) {
    if (typeof ShapeJourneyData === "undefined") return false;
    const index = ShapeJourneyData.findIndex(j => j.id === journeyId);
    if (index <= 0) return false;
    const prevJourney = ShapeJourneyData[index - 1];
    return !this.state.completedJourneys.includes(prevJourney.id);
  },

  completeLevel: function (journeyId, levelIndex) {
    const current = this.state.levelProgress[journeyId] || 0;

    if (levelIndex === current) {
      this.state.levelProgress[journeyId]++;

      const journey = ShapeJourneyData.find(j => j.id === journeyId);
      if (this.state.levelProgress[journeyId] >= journey.levels.length) {
        if (!this.state.completedJourneys.includes(journeyId)) {
          this.state.completedJourneys.push(journeyId);
          this.state.totalStars++;

          if (this.state.completedJourneys.length === ShapeJourneyData.length) {
            this.state.totalMaps++;
          }
        }
      }
      this.save();
      return true;
    }
    this.save();
    return false;
  },

  getCurrentLevelIndex: function (journeyId) {
    return this.state.levelProgress[journeyId] || 0;
  },

  getJourneyProgressPct: function (journeyId) {
    if (typeof ShapeJourneyData === "undefined") return 0;
    const current = this.state.levelProgress[journeyId] || 0;
    const journey = ShapeJourneyData.find(j => j.id === journeyId);
    if (!journey) return 0;
    return Math.min(100, (current / journey.levels.length) * 100);
  },
};

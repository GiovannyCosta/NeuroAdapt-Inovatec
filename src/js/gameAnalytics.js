// =============================================
// ARQUIVO: src/js/gameAnalytics.js
// ATUALIZAÇÃO: Inclusão do GameId 10 (sound)
// =============================================

const GameAnalytics = {
  STORAGE_KEY: "neuro_game_stats_v5",

  categories: {
    sounds: ["sound"],
    colors: ["color", "sequence", "connect"],
    symbols: ["combine", "numbers", "puzzle", "guess-word", "emotion"],
  },

  data: {
    sessions: 0,
    totalHits: 0,
    totalMisses: 0,
    modeUsage: { calm: 0, stimulant: 0 },
    history: [],
    games: {
      combine: {
        id: "combine",
        name: "Combine as Formas",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      connect: {
        id: "connect",
        name: "Ligue os Pontos",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      numbers: {
        id: "numbers",
        name: "Ligue os Números",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      puzzle: {
        id: "puzzle",
        name: "Quebra-Cabeça",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      sequence: {
        id: "sequence",
        name: "Sequência de Cores",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      emotion: {
        id: "emotion",
        name: "Adivinhe a Emoção",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      color: {
        id: "color",
        name: "Adivinhe a Cor",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      sound: {
        id: "sound",
        name: "Adivinhe o Som",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
      "guess-word": {
        id: "guess-word",
        name: "Adivinhe a Palavra",
        played: 0,
        hits: 0,
        misses: 0,
        focusTime: 0,
        history: [],
      },
    },
  },

  load: function () {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const loadedData = JSON.parse(stored);
      this.data = { ...this.data, ...loadedData };

      if (!Array.isArray(this.data.history)) this.data.history = [];
      Object.keys(this.data.games).forEach(key => {
        if (loadedData.games && loadedData.games[key]) {
          this.data.games[key] = {
            ...this.data.games[key],
            ...loadedData.games[key],
          };
          if (!Array.isArray(this.data.games[key].history)) {
            this.data.games[key].history = [];
          }
        }
      });
    } else {
      this.save();
    }
  },

  save: function () {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  record: function (gameId, isHit) {
    const isStimulant =
      document.body.parentElement &&
      document
        .getElementById("app-shell")
        ?.classList.contains("theme-stimulant");
    const mode = isStimulant ? "stimulant" : "calm";

    this.data.sessions++;
    this.data.modeUsage[mode]++;

    if (isHit) this.data.totalHits++;
    else this.data.totalMisses++;

    if (this.data.sessions % 5 === 0) {
      this.pushHistorySnapshot(
        this.data.history,
        this.data.totalHits,
        this.data.totalMisses
      );
    }

    if (this.data.games[gameId]) {
      const g = this.data.games[gameId];
      g.played++;
      if (isHit) g.hits++;
      else g.misses++;
      this.pushHistorySnapshot(g.history, g.hits, g.misses);
      this.save();
    }
  },

  recordTime: function (gameId, seconds) {
    if (this.data.games[gameId] && seconds > 0) {
      const validSeconds = Math.min(seconds, 3600);
      this.data.games[gameId].focusTime =
        (this.data.games[gameId].focusTime || 0) + validSeconds;
      this.save();
    }
  },

  pushHistorySnapshot: function (historyArray, hits, misses) {
    const snapshot = {
      t: Date.now(),
      h: hits,
      m: misses,
      s: hits,
    };
    historyArray.push(snapshot);
    if (historyArray.length > 20) historyArray.shift();
  },

  getStats: function () {
    let totalHits = 0,
      totalMisses = 0;
    let bestGame = null,
      hardestGame = null;
    let minAcc = 101,
      maxPlays = -1;

    Object.values(this.data.games).forEach(g => {
      totalHits += g.hits;
      totalMisses += g.misses;
      if (g.played > maxPlays) {
        maxPlays = g.played;
        bestGame = g;
      }
      if (g.played >= 3) {
        const acc =
          g.hits + g.misses > 0 ? (g.hits / (g.hits + g.misses)) * 100 : 0;
        if (acc < minAcc) {
          minAcc = acc;
          hardestGame = g;
        }
      }
    });

    const total = totalHits + totalMisses;
    const accuracy = total > 0 ? Math.round((totalHits / total) * 100) : 0;

    const getCatAcc = catList => {
      let h = 0,
        m = 0;
      catList.forEach(id => {
        if (this.data.games[id]) {
          h += this.data.games[id].hits;
          m += this.data.games[id].misses;
        }
      });
      return h + m > 0 ? Math.round((h / (h + m)) * 100) : 0;
    };

    return {
      accuracy,
      totalHits,
      totalMisses,
      bestGame,
      hardestGame,
      hardestGameAcc: minAcc === 101 ? 0 : Math.round(minAcc),
      mode:
        this.data.modeUsage.stimulant > this.data.modeUsage.calm
          ? "Estimulante"
          : "Calmo",
      soundAcc: getCatAcc(this.categories.sounds),
      colorAcc: getCatAcc(this.categories.colors),
      symbolAcc: getCatAcc(this.categories.symbols),
      history: this.data.history,
    };
  },
};

GameAnalytics.load();


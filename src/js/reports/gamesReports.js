// =============================================
// ARQUIVO: src/js/reports/gamesReports.js
// DESCRIÇÃO: Gera o relatório visual de Jogos (Barras + Gráfico).
// ATUALIZAÇÃO: Inclusão de Métricas de Jornada do Jogo 'sound'.
// =============================================

const GamesReports = {
  init: function () {
    const filterSelect = document.getElementById("report-games-filter");
    if (filterSelect) {
      filterSelect.addEventListener("change", e => {
        this.render(e.target.value);
      });
    }
  },

  render: function (filterValue = "geral") {
    if (typeof GameAnalytics !== "undefined") GameAnalytics.load();

    // --- NOVO: Força o menu visual a sincronizar com a lógica ---
    const filterSelect = document.getElementById("report-games-filter");
    if (filterSelect) {
      filterSelect.value = filterValue;
    }
    // -----------------------------------------------------------

    const containerGeral = document.getElementById("report-games-general");
    const containerDetail = document.getElementById("report-games-detail");

    if (!containerGeral || !containerDetail) return;

    if (filterValue === "geral") {
      containerGeral.classList.remove("hidden");
      containerDetail.classList.add("hidden");
      this.renderGeneralStats(containerGeral);
    } else {
      containerGeral.classList.add("hidden");
      containerDetail.classList.remove("hidden");
      this.renderSpecificStats(filterValue, containerDetail);
    }

    if (typeof lucide !== "undefined") lucide.createIcons();
  },

  // --- FUNÇÃO AUXILIAR: Renderiza um item de estatística ---
  renderStatItem: function (label, value, icon, colorClass) {
    return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm border border-gray-100">
            <span class="text-sm text-gray-600 flex items-center">
                <span class="text-lg mr-2 ${colorClass}">${icon}</span> ${label}
            </span>
            <span class="text-lg font-bold text-gray-800">${value}</span>
        </div>
    `;
  },

  // --- FUNÇÃO GERADORA DE GRÁFICO SVG ---
  generateSVGChart: function (history) {
    if (!history || history.length < 2)
      return '<div class="flex items-center justify-center h-full text-gray-400 text-sm italic"><i data-lucide="bar-chart-2" class="w-5 h-5 mr-2"></i> Jogue mais partidas para gerar o gráfico.</div>';

    const width = 300;
    const height = 120;
    const padding = 10;

    const maxVal = Math.max(...history.map(d => Math.max(d.h, d.m, d.s))) || 10;

    const getPoints = key => {
      return history
        .map((d, i) => {
          const x =
            (i / (history.length - 1)) * (width - 2 * padding) + padding;
          const y =
            height - padding - (d[key] / maxVal) * (height - 2 * padding);
          return `${x},${y}`;
        })
        .join(" ");
    };

    const pointsHits = getPoints("h");
    const pointsMisses = getPoints("m");

    return `
            <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible">
                <line x1="0" y1="${height - padding}" x2="${width}" y2="${
      height - padding
    }" stroke="#e5e7eb" stroke-width="1" />
                <line x1="0" y1="${padding}" x2="${width}" y2="${padding}" stroke="#f3f4f6" stroke-width="1" stroke-dasharray="4" />
                
                <polyline fill="none" stroke="#f87171" stroke-width="3" points="${pointsMisses}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
                <polyline fill="none" stroke="#34d399" stroke-width="3" points="${pointsHits}" stroke-linecap="round" stroke-linejoin="round" />
                
                <circle cx="${pointsHits.split(" ").pop().split(",")[0]}" cy="${
      pointsHits.split(" ").pop().split(",")[1]
    }" r="4" fill="#34d399" stroke="white" stroke-width="2" />
            </svg>
            <div class="flex justify-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-wide">
                <span class="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full"><span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Acertos</span>
                <span class="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-full"><span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Erros</span>
            </div>
        `;
  },

  // --- VISÃO GERAL ---
  renderGeneralStats: function (container) {
    const stats = GameAnalytics.getStats();
    const gamesData = GameAnalytics.data.games;

    const totalScore = stats.totalHits;

    let totalFocusSeconds = 0;
    Object.values(gamesData).forEach(
      g => (totalFocusSeconds += g.focusTime || 0)
    );

    let focusText = "";
    if (totalFocusSeconds > 3600) {
      focusText = `${Math.floor(totalFocusSeconds / 3600)}h ${Math.round(
        (totalFocusSeconds % 3600) / 60
      )}m`;
    } else {
      focusText = `${Math.max(1, Math.round(totalFocusSeconds / 60))} min`;
    }

    const bestGameId = stats.bestGame ? stats.bestGame.id : "combine";
    const bestCategory =
      (ReportLogic.games[bestGameId] &&
        ReportLogic.games[bestGameId].category) ||
      "Lógica";

    const hitPct = stats.accuracy;
    const missPct = 100 - stats.accuracy;
    const scorePct = Math.min(100, (totalScore / 50) * 100);

    const catSound = stats.soundAcc || 0;
    const catColor = stats.colorAcc || 0;
    const catSymbol = stats.symbolAcc || 0;

    let catInsight = "Continue jogando para gerar análises.";
    if (ReportLogic.categoryInsights) {
      if (catSound < 50)
        catInsight = ReportLogic.categoryInsights.sound.improve;
      else if (catColor < 50)
        catInsight = ReportLogic.categoryInsights.color.improve;
      else if (catSymbol < 50)
        catInsight = ReportLogic.categoryInsights.symbol.improve;
      else catInsight = ReportLogic.categoryInsights.symbol.good;
    }

    const interestText = stats.bestGame
      ? ReportLogic.getText(stats.bestGame.id, "interest")
      : "Continue explorando.";
    const challengeText = stats.hardestGame
      ? ReportLogic.getText(stats.hardestGame.id, "challenge")
      : "Jogue mais para calibração.";
    const lowPerfText = stats.hardestGame
      ? ReportLogic.getText(stats.hardestGame.id, "low_performance")
      : "Desempenho estável.";
    const modeText =
      stats.mode === "Estimulante"
        ? "O Modo Estimulante está gerando maior engajamento."
        : "O Modo Calmo favorece a concentração atual.";

    const evolutionChartHTML = this.generateSVGChart(stats.history);

    container.innerHTML = `
            <div class="card p-6 rounded-3xl shadow-md bg-white border border-gray-100">
                <h2 class="text-xl font-bold accent-text mb-6 flex items-center"><i data-lucide="activity" class="w-6 h-6 mr-2"></i> Resumo de Atividade</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div class="flex flex-col items-center justify-center p-3 bg-green-50 rounded-2xl border border-green-100 h-28">
                        <span class="text-3xl font-extrabold text-green-600 leading-none mb-1">${
                          stats.totalHits
                        }</span>
                        <span class="text-xs font-bold text-green-800 uppercase tracking-wider">Acertos</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 bg-red-50 rounded-2xl border border-red-100 h-28">
                        <span class="text-3xl font-extrabold text-red-500 leading-none mb-1">${
                          stats.totalMisses
                        }</span>
                        <span class="text-xs font-bold text-red-800 uppercase tracking-wider">Erros</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-2xl border border-blue-100 h-28">
                        <span class="text-3xl font-extrabold text-blue-600 leading-none mb-1">${totalScore}</span>
                        <span class="text-xs font-bold text-blue-800 uppercase tracking-wider">Pontos</span>
                    </div>
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-md bg-white border border-gray-100">
                <h3 class="font-bold text-xl mb-6 accent-text">Evolução Cognitiva</h3>
                <div class="space-y-6 mb-8">
                    <div>
                        <div class="flex justify-between text-sm mb-2 font-semibold text-gray-700"><span>Precisão</span><span>${hitPct}%</span></div>
                        <div class="w-full h-5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm transition-all duration-1000" style="width: ${hitPct}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-2 font-semibold text-gray-700"><span>Índice de Dificuldade</span><span>${missPct}%</span></div>
                        <div class="w-full h-5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-red-300 to-red-500 rounded-full shadow-sm transition-all duration-1000" style="width: ${missPct}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-2 font-semibold text-gray-700"><span>Consistência</span><span>Nível Geral</span></div>
                        <div class="w-full h-5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm transition-all duration-1000" style="width: ${scorePct}%"></div></div>
                    </div>
                </div>
                <hr class="border-gray-200 mb-6">
                <div>
                    <h4 class="font-bold text-sm text-gray-600 mb-4 uppercase tracking-wide">Histórico de Desempenho</h4>
                    <div class="w-full h-40 bg-gray-50 rounded-2xl p-3 border border-gray-100 relative shadow-inner">
                        ${evolutionChartHTML}
                    </div>
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-md bg-white border border-gray-100">
                <h3 class="font-bold text-xl mb-6 accent-text">Atenção & Reconhecimento</h3>
                <div class="grid grid-cols-1 gap-6">
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                        <div class="flex items-center"><div class="p-2 bg-white rounded-full shadow-sm mr-3"><i data-lucide="clock" class="w-6 h-6 text-blue-500"></i></div><span class="font-semibold text-gray-700">Tempo de Foco</span></div>
                        <span class="text-2xl font-bold text-gray-800">${focusText}</span>
                    </div>
                    <div class="space-y-4">
                        <div><div class="flex justify-between text-xs mb-1 font-bold text-gray-500"><span>SONS</span><span>${catSound}%</span></div><div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-indigo-400 rounded-full" style="width: ${catSound}%"></div></div></div>
                        <div><div class="flex justify-between text-xs mb-1 font-bold text-gray-500"><span>CORES</span><span>${catColor}%</span></div><div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-pink-400 rounded-full" style="width: ${catColor}%"></div></div></div>
                        <div><div class="flex justify-between text-xs mb-1 font-bold text-gray-500"><span>SÍMBOLOS</span><span>${catSymbol}%</span></div><div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-teal-400 rounded-full" style="width: ${catSymbol}%"></div></div></div>
                    </div>
                    <div class="text-xs bg-blue-50 p-4 rounded-xl text-blue-800 italic border border-blue-100"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i> ${catInsight}</div>
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div class="flex items-start space-x-4">
                    <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><i data-lucide="calendar" class="w-8 h-8 text-white"></i></div>
                    <div>
                        <h3 class="font-bold text-lg mb-2 text-white opacity-90">Recomendação da Semana</h3>
                        <p class="text-base leading-relaxed text-blue-50">Ludica+ está melhorando em <strong class="text-white border-b border-white/40">${bestCategory}</strong>! Sugerimos focar no jogo <strong class="text-yellow-300">"${
      ReportLogic.games[bestGameId]?.name || "Combine as Formas"
    }"</strong> esta semana.</p>
                    </div>
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-md bg-white border-l-8 border-yellow-400">
                <h3 class="font-bold text-xl mb-6 accent-text flex items-center"><i data-lucide="lightbulb" class="w-6 h-6 mr-2 text-yellow-500"></i> Insights</h3>
                <div class="space-y-6">
                    <div class="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                        <h4 class="font-bold text-base text-yellow-800 mb-2">Interesse: '${
                          stats.bestGame ? stats.bestGame.name : "..."
                        }'</h4>
                        <p class="text-sm text-gray-600 bg-white p-3 rounded-xl border border-yellow-200">${interestText}</p>
                    </div>
                    ${
                      stats.hardestGame
                        ? `<div class="bg-red-50 p-5 rounded-2xl border border-red-100"><h4 class="font-bold text-base text-red-800 mb-2">Desafio: '${stats.hardestGame.name}'</h4><p class="text-sm text-gray-600 bg-white p-3 rounded-xl border border-red-200">${challengeText}</p></div>`
                        : ""
                    }
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-md bg-white border-l-8 border-purple-500">
                <h3 class="font-bold text-xl mb-6 accent-text flex items-center"><i data-lucide="settings-2" class="w-6 h-6 mr-2 text-purple-500"></i> Estratégias</h3>
                <div class="space-y-6">
                    <div>
                        <h4 class="font-bold text-gray-800 mb-2">Análise de Erros</h4>
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-600 italic"><i data-lucide="quote" class="w-4 h-4 inline mr-1"></i> ${lowPerfText}</div>
                    </div>
                    <hr class="border-gray-200">
                    <div>
                        <div class="flex items-center justify-between mb-2"><h4 class="font-bold text-gray-800">Uso de Modos</h4><span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">${
                          stats.mode
                        }</span></div>
                        <div class="bg-purple-50 p-4 rounded-xl border border-purple-100 text-sm text-purple-900"><strong class="block mb-1 text-purple-700">Sugestão:</strong> ${modeText}</div>
                    </div>
                </div>
            </div>
        `;
  },

  // --- RELATÓRIO ESPECÍFICO ---
  renderSpecificStats: function (gameId, container) {
    const game = GameAnalytics.data.games[gameId];
    if (!game) return;

    const total = game.hits + game.misses;
    const acc = total > 0 ? Math.round((game.hits / total) * 100) : 0;
    const missPct = 100 - acc;

    const evolutionChartHTML = this.generateSVGChart(game.history);
    const interestText = ReportLogic.getText(gameId, "interest");
    const challengeText = ReportLogic.getText(gameId, "challenge");
    const recText = ReportLogic.getText(gameId, "rec_week");

    let specificDetails = "";

    // --- DETALHES ESPECÍFICOS DO JOGO ADIVINHE O SOM ---
    if (
      gameId === "sound" &&
      typeof SoundLevels !== "undefined" &&
      typeof SoundJourneyData !== "undefined"
    ) {
      // Calculando as Métricas da Jornada
      const completedWorldsCount = SoundLevels.state.completedWorlds.length;
      const totalWorlds = SoundJourneyData.length;

      // Conquistas de Streak (Assumindo que SoundLogic.correctStreak e .wrongAttempts estão disponíveis)
      const correctStreak = SoundLogic.correctStreak || 0;
      const wrongStreak = SoundLogic.wrongAttempts || 0;

      // Adiciona detalhes da jornada (USANDO MAPAS 🗺️)
      specificDetails = `
            <div class="space-y-3 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                ${GamesReports.renderStatItem(
                  "Mapas Obtidos",
                  SoundLevels.state.totalMaps || 0,
                  "🗺️",
                  "text-blue-500"
                )}
                ${GamesReports.renderStatItem(
                  "Jornadas Completas",
                  `${completedWorldsCount}/${totalWorlds}`,
                  "✅",
                  "text-green-500"
                )}
                ${GamesReports.renderStatItem(
                  "Pontos Acumulados",
                  SoundLevels.state.totalScore || 0,
                  "🎯",
                  "accent-text"
                )}
                <hr class="border-gray-300">
                ${GamesReports.renderStatItem(
                  "Acertos Seguidos",
                  `${correctStreak}x`,
                  "🔥",
                  "text-green-600"
                )}
                ${GamesReports.renderStatItem(
                  "Erros Seguidos",
                  `${wrongStreak}x`,
                  "🛑",
                  "text-red-500"
                )}
            </div>
        `;
    }

    container.innerHTML = `
            <div class="card p-6 rounded-3xl shadow-md bg-white border-t-8 border-blue-500 animate-fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold accent-text">${game.name}</h3>
                    <div class="text-right">
                        <span class="block text-4xl font-bold text-gray-800">${acc}%</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Precisão</span>
                    </div>
                </div>
                ${specificDetails} 
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 h-24">
                        <span class="text-3xl font-bold text-gray-700 leading-none mb-1">${game.played}</span>
                        <span class="text-xs font-bold text-gray-500 uppercase">Jogadas</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 bg-green-50 rounded-2xl border border-green-100 h-24">
                        <span class="text-3xl font-bold text-green-600 leading-none mb-1">${game.hits}</span>
                        <span class="text-xs font-bold text-green-800 uppercase">Acertos</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 bg-red-50 rounded-2xl border border-red-100 h-24">
                        <span class="text-3xl font-bold text-red-500 leading-none mb-1">${game.misses}</span>
                        <span class="text-xs font-bold text-red-800 uppercase">Erros</span>
                    </div>
                </div>
            </div>
            
            <div class="card p-6 rounded-3xl shadow-md bg-white border border-gray-100">
                <h3 class="font-bold text-xl mb-4 accent-text">Histórico de Desempenho</h3>
                <div class="space-y-4 mb-6">
                    <div>
                        <div class="flex justify-between text-sm mb-1 font-semibold text-gray-700"><span>Acertos</span><span>${acc}%</span></div>
                        <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-green-500 rounded-full" style="width: ${acc}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1 font-semibold text-gray-700"><span>Dificuldade</span><span>${missPct}%</span></div>
                        <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-red-400 rounded-full" style="width: ${missPct}%"></div></div>
                    </div>
                </div>
                <hr class="border-gray-200 mb-6">
                <div class="w-full h-40 bg-gray-50 rounded-2xl p-3 border border-gray-100 relative shadow-inner">
                    ${evolutionChartHTML}
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div class="flex items-start space-x-4">
                    <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><i data-lucide="calendar" class="w-8 h-8 text-white"></i></div>
                    <div>
                        <h3 class="font-bold text-lg mb-2 text-white opacity-90">Recomendação da Semana</h3>
                        <p class="text-base leading-relaxed text-indigo-50">${recText}</p>
                    </div>
                </div>
            </div>

            <div class="card p-6 rounded-3xl shadow-md bg-white border-l-8 border-yellow-400">
                <h3 class="font-bold text-xl mb-6 accent-text flex items-center"><i data-lucide="lightbulb" class="w-6 h-6 mr-2 text-yellow-500"></i> Análise Pedagógica</h3>
                <div class="space-y-6">
                    <div class="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                        <h4 class="font-bold text-base text-yellow-800 mb-2">Pontos Fortes & Interesse</h4>
                        <p class="text-sm text-gray-600 bg-white p-3 rounded-xl border border-yellow-200">${interestText}</p>
                    </div>
                    <div class="bg-red-50 p-5 rounded-2xl border border-red-100">
                        <h4 class="font-bold text-base text-red-800 mb-2">Desafios & Atenção</h4>
                        <p class="text-sm text-gray-600 bg-white p-3 rounded-xl border border-red-200">${challengeText}</p>
                    </div>
                </div>
            </div>
        `;

    if (typeof lucide !== "undefined") lucide.createIcons();
  },
};



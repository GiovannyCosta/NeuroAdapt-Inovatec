// =============================================
// ARQUIVO: src/js/reports/commReports.js
// DESCRIÇÃO: Relatórios Dinâmicos de CAA
// =============================================

const CommReports = {
  init: function () {
    const filterSelect = document.getElementById("report-comm-filter");
    if (filterSelect) {
      filterSelect.addEventListener("change", () => this.render());
    }
  },

  findIconById: function (id) {
    if (typeof CaaData === "undefined") return "❓";
    const rootItem = CaaData.root.find(i => i.id === id);
    if (rootItem) return rootItem.icon;
    for (const catKey in CaaData.categories) {
      const item = CaaData.categories[catKey].find(i => i.id === id);
      if (item) return item.icon;
    }
    return "📄";
  },

  // --- 1. BASE DE CONHECIMENTO ---
  knowledgeBase: {
    emotions_positive:
      "O predomínio de expressões positivas indica um ambiente seguro onde o usuário se sente confortável para compartilhar bem-estar.",
    emotions_negative:
      "O uso frequente de expressões de desconforto é um sinal vital de desenvolvimento da defesa pessoal e limites.",
    negative_validity:
      "⚠️ Nota: O aumento no registro de sentimentos negativos (Raiva, Tristeza) demonstra amadurecimento cognitivo.",

    quick_responses: {
      root_sim:
        "O uso frequente do SIM indica alta receptividade. Recomendação: Aproveite para apresentar novas atividades imediatamente após um 'Sim'.",
      root_nao:
        "O uso predominante do NÃO demonstra autonomia. Recomendação: Valide a recusa ('Entendi que não quer') e ofereça uma escolha controlada.",
      root_ajuda:
        "A busca por AJUDA sinaliza confiança. Recomendação: Use a 'espera estruturada': aguarde 5 segundos antes de intervir.",
    },

    // Insights específicos por ID (melhora a precisão)
    pictogram_insights: {
      emo_feliz:
        "O registro de FELICIDADE sugere que a atividade atual está ligada a reforçadores positivos. Sugestão: Tente estender ou repetir a atividade. Nomeie o sentimento: 'Você está feliz porque estamos brincando!'",
      emo_triste:
        "O usuário comunicou TRISTEZA (dado positivo!). Atenção: Valide o sentimento ('Eu vejo que você está triste') e ofereça escolha de conforto: 'Quer um abraço ou quer um momento de silêncio?'",
      act_comer:
        "O pedido por COMIDA demonstra consciência interna. Sugestão: Use este momento para nomear os alimentos e expandir o vocabulário sobre o que será comido.",
      act_banheiro:
        "A solicitação de BANHEIRO é um marco de independência funcional. Recomendação: Reforce o comportamento com elogios e monitore a frequência para evitar acidentes.",
      act_dormir:
        "A comunicação de DORMIR é vital. Recomendação: Use este como um ponto de transição: nomeie a sequência (Guarda o brinquedo, escova os dentes, hora de dormir).",
      root_sim:
        "O uso frequente do SIM demonstra aceitação. Sugestão: Use-o como ponte para novas experiências.",
      root_nao:
        "O alto uso do NÃO reforça o desenvolvimento de limites. Sugestão: Continue validando a recusa.",
      root_ajuda:
        "A busca por AJUDA sinaliza confiança. Sugestão: Use a técnica de espera estruturada.",
      default_interest: label =>
        `O interesse em ${label} indica boa percepção visual. Sugestão: Introduza atividades concretas relacionadas a ${label} para ampliar o foco compartilhado.`,
    },

    insight_interest: label =>
      `O interesse em ${label} indica boa percepção visual. Sugestão: Introduza atividades concretas relacionadas a ${label} para ampliar o foco compartilhado.`,
    care_text: label =>
      `O uso do pictograma ${label} demonstra consciência corporal e de rotina. Reforce esse comportamento atendendo prontamente.`,

    getFoodPlan: function (foodName) {
      return `Estratégia de Combinação: Para expandir o paladar com ${foodName}, tente a técnica de "Food Chaining" (Encadeamento): sirva-o junto com um alimento de textura ou cor semelhante que a criança já aceite.`;
    },
  },

  // --- 2. GERADOR DE GRÁFICO SVG ---
  generateSVGChart: function (history) {
    if (!history || history.length < 2) {
      return `<div class="flex flex-col items-center justify-center h-full text-gray-300"><i data-lucide="bar-chart-2" class="w-8 h-8 mb-2 opacity-50"></i><span class="text-xs italic">Aguardando dados emocionais para gerar gráfico...</span></div>`;
    }

    const width = 300;
    const height = 120;
    const padding = 10;

    const dailyStats = {};
    history.forEach(h => {
      const day = new Date(h.t).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      if (!dailyStats[day]) dailyStats[day] = { pos: 0, neg: 0 };
      if (h.id && h.id.startsWith("emo_")) {
        if (["emo_feliz", "emo_contente", "emo_surpreso"].includes(h.id))
          dailyStats[day].pos++;
        else dailyStats[day].neg++;
      }
    });

    const dataPoints = Object.values(dailyStats);
    if (dataPoints.length === 0)
      return '<div class="flex items-center justify-center h-full text-gray-400 text-sm italic">Sem dados emocionais.</div>';

    if (dataPoints.length === 1) dataPoints.push({ ...dataPoints[0] });

    const maxVal =
      Math.max(...dataPoints.map(d => Math.max(d.pos, d.neg))) || 5;

    const getPoints = key => {
      return dataPoints
        .map((d, i) => {
          const x =
            (i / (dataPoints.length - 1)) * (width - 2 * padding) + padding;
          const y =
            height - padding - (d[key] / maxVal) * (height - 2 * padding);
          return `${x},${y}`;
        })
        .join(" ");
    };

    const pointsPos = getPoints("pos");
    const pointsNeg = getPoints("neg");
    const lastPosCoords = pointsPos.split(" ").pop().split(",");

    return `
            <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible">
                <line x1="0" y1="${height - padding}" x2="${width}" y2="${
      height - padding
    }" stroke="#e5e7eb" stroke-width="1" />
                <line x1="0" y1="${padding}" x2="${width}" y2="${padding}" stroke="#f3f4f6" stroke-width="1" stroke-dasharray="4" />
                <polyline fill="none" stroke="#f87171" stroke-width="3" points="${pointsNeg}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
                <polyline fill="none" stroke="#34d399" stroke-width="3" points="${pointsPos}" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="${lastPosCoords[0]}" cy="${
      lastPosCoords[1]
    }" r="4" fill="#34d399" stroke="white" stroke-width="2" />
            </svg>
            <div class="flex justify-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-wide">
                <span class="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full"><span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Bons</span>
                <span class="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-full"><span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Ruins</span>
            </div>
        `;
  },

  // --- 3. PROCESSAMENTO ---
  getStats: function (days = 30) {
    let history = typeof caaHistory !== "undefined" ? caaHistory : [];

    if (days !== 365) {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      history = history.filter(h => h.t >= cutoff);
    }

    const counts = {};
    const commands = {
      root_sim: 0,
      root_nao: 0,
      root_ajuda: 0,
      root_quero: 0,
      root_nao_quero: 0,
      root_estou: 0,
    };
    let emotionsPos = 0;
    let emotionsNeg = 0;
    const negsDetails = {};
    const foodItems = [];
    const careItems = [];
    const conceptCounts = {};

    history.forEach(h => {
      counts[h.id] = (counts[h.id] || 0) + 1;
      if (commands.hasOwnProperty(h.id)) commands[h.id]++;

      if (!h.id.startsWith("root_")) {
        conceptCounts[h.id] = (conceptCounts[h.id] || 0) + 1;
      }

      if (h.id && h.id.startsWith("emo_")) {
        if (["emo_feliz", "emo_contente", "emo_surpreso"].includes(h.id))
          emotionsPos++;
        else {
          emotionsNeg++;
          negsDetails[h.lbl] = (negsDetails[h.lbl] || 0) + 1;
        }
      }

      if (
        [
          "frutas_items",
          "legumes_items",
          "comidas_items",
          "cafe_items",
          "diversos_items",
          "bebidas_items",
        ].includes(h.cat)
      ) {
        const existing = foodItems.find(f => f.id === h.id);
        if (existing) existing.count++;
        else
          foodItems.push({
            id: h.id,
            label: h.lbl,
            count: 1,
            icon: this.findIconById(h.id),
          });
      }

      if (
        h.cat === "cuidados_items" ||
        ["act_banheiro", "act_tomar_banho", "act_dormir"].includes(h.id)
      ) {
        const existing = careItems.find(c => c.id === h.id);
        if (existing) existing.count++;
        else
          careItems.push({
            id: h.id,
            label: h.lbl,
            count: 1,
            icon: this.findIconById(h.id),
          });
      }
    });

    const top3General = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => {
        const hItem = history.find(h => h.id === id);
        return {
          id,
          count,
          label: hItem ? hItem.lbl : id,
          icon: this.findIconById(id),
        };
      });

    const topFoods = foodItems.sort((a, b) => b.count - a.count).slice(0, 3);
    const topCare = careItems.sort((a, b) => b.count - a.count)[0];

    let maxQuick = null;
    if (
      commands["root_sim"] > 0 ||
      commands["root_nao"] > 0 ||
      commands["root_ajuda"] > 0
    ) {
      maxQuick = "root_sim";
      if (commands["root_nao"] > commands[maxQuick]) maxQuick = "root_nao";
      if (commands["root_ajuda"] > commands[maxQuick]) maxQuick = "root_ajuda";
    }

    let topConcept = Object.entries(conceptCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    let topConceptLabel = topConcept
      ? history.find(h => h.id === topConcept[0])?.lbl
      : "...";

    let dominantContext = "EU QUERO";
    if (commands["root_nao_quero"] > commands["root_quero"])
      dominantContext = "EU NÃO QUERO";
    if (
      commands["root_estou"] > commands["root_quero"] &&
      commands["root_estou"] > commands["root_nao_quero"]
    )
      dominantContext = "EU ESTOU";

    let mostUsedPhrase = topConcept
      ? `${dominantContext} ${topConceptLabel}`
      : "SEM DADOS";

    return {
      isEmpty: history.length === 0,
      total: history.length,
      top3: top3General,
      commands,
      quickWinner: maxQuick,
      emotions: { pos: emotionsPos, neg: emotionsNeg, details: negsDetails },
      food: topFoods,
      care: topCare,
      topInsightItem:
        top3General.find(i => !i.id.startsWith("root_")) || top3General[0],
      mostUsedPhrase: mostUsedPhrase.toUpperCase(),
      rawHistory: history,
    };
  },

  // --- 4. RENDERIZAÇÃO ---
  render: function () {
    const filter =
      document.getElementById("report-comm-filter")?.value || "visão geral";
    const days = filter === "semanal" ? 7 : filter === "mensal" ? 30 : 365;
    const stats = this.getStats(days);
    const container = document.getElementById("report-comm-content");

    if (!container) return;

    // PREPARAÇÃO DE PLACEHOLDERS E DADOS
    const displayTop3 = [0, 1, 2].map(
      i => stats.top3[i] || { icon: "⚪", count: 0, label: "---" }
    );
    const displayFoods = [0, 1, 2].map(
      i => stats.food[i] || { icon: "⚪", count: 0, label: "---" }
    );

    // Assegura que topInsightItem e topFoodItem são objetos definidos para evitar crashes
    const topItem =
      stats.topInsightItem && stats.topInsightItem.count > 0
        ? stats.topInsightItem
        : { id: "default_interest", label: "---", icon: "⚪", count: 0 };
    const topFoodItem =
      stats.food[0] && stats.food[0].count > 0
        ? stats.food[0]
        : { label: "Item Favorito", count: 0, icon: "⚪" };

    // Texto Insights
    const topItemId = topItem.id;
    // Tenta obter insight específico do ID, senão usa o fallback
    const insightContent = this.knowledgeBase.pictogram_insights[topItemId]
      ? this.knowledgeBase.pictogram_insights[topItemId]
      : this.knowledgeBase.pictogram_insights["default_interest"](
          topItem.label
        );

    // Texto Cuidados
    const careText =
      stats.care && stats.care.count > 0
        ? this.knowledgeBase.care_text(stats.care.label)
        : "Aguardando dados de cuidados (banho, sono, higiene).";

    let html = "";

    // 1. RESUMO DE ATIVIDADE
    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6 border-l-4 border-blue-500">
                <h3 class="font-bold text-lg mb-4 accent-text flex items-center"><i data-lucide="activity" class="w-5 h-5 mr-2"></i> Resumo de Atividade</h3>
                
                <div class="mb-5">
                    <p class="text-xs font-bold text-gray-400 uppercase mb-2">Pictogramas Mais Usados</p>
                    <div class="grid grid-cols-3 gap-3">
                        ${displayTop3
                          .map(
                            item => `
                            <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center flex flex-col items-center justify-center aspect-square shadow-sm">
                                <span class="text-3xl mb-1 ${
                                  item.count === 0 ? "opacity-30" : ""
                                }">${item.icon}</span>
                                <span class="text-xs font-bold text-blue-600">${
                                  item.count
                                }x</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="mb-5">
                    <p class="text-xs font-bold text-gray-400 uppercase mb-2">Comandos Principais</p>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div class="p-2 bg-purple-50 rounded-lg border border-purple-100"><span class="block text-xl">🙂</span><span class="text-[10px] font-bold text-purple-800 uppercase">Estou</span><span class="block text-xs font-bold mt-1">${
                          stats.commands.root_estou
                        }</span></div>
                        <div class="p-2 bg-blue-50 rounded-lg border border-blue-100"><span class="block text-xl">✋</span><span class="text-[10px] font-bold text-blue-800 uppercase">Quero</span><span class="block text-xs font-bold mt-1">${
                          stats.commands.root_quero
                        }</span></div>
                        <div class="p-2 bg-red-50 rounded-lg border border-red-100"><span class="block text-xl">✊</span><span class="text-[10px] font-bold text-red-800 uppercase">Ñ Quero</span><span class="block text-xs font-bold mt-1">${
                          stats.commands.root_nao_quero
                        }</span></div>
                    </div>
                </div>

                <br>

                <div>
                    <div class="bg-white p-4 rounded-xl text-center shadow-sm w-full max-w-[240px] mx-auto">
                        <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">Frase Mais Frequente</p>
                        <p class="text-lg font-black text-gray-800 uppercase leading-tight tracking-tight">
                            ${stats.mostUsedPhrase}
                        </p>
                    </div>
                </div>
            </div>
        `;

    // 2. HISTÓRICO DE DESEMPENHO (Gráfico SVG)
    const chartHTML = this.generateSVGChart(stats.rawHistory);
    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6">
                <h3 class="font-bold text-lg mb-4 accent-text flex items-center"><i data-lucide="bar-chart-2" class="w-5 h-5 mr-2"></i> Histórico Emocional</h3>
                <div class="w-full h-40 bg-gray-50 rounded-2xl p-3 relative shadow-inner">
                    ${chartHTML}
                </div>
                <p class="text-xs text-gray-500 italic text-center mt-2"><br><br>Linha do Tempo: Bons vs Ruins</p>
            </div>
        `;

    // 3. RESPOSTAS RÁPIDAS
    const winnerId = stats.quickWinner;
    const winnerText = winnerId
      ? this.knowledgeBase.quick_responses[winnerId]
      : "Aguardando dados de Sim/Não/Ajuda.";
    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6 border-l-4 border-yellow-400">
                <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center"><i data-lucide="zap" class="w-5 h-5 mr-2 text-yellow-500"></i> Respostas Rápidas</h3>
                <div class="flex justify-around mb-4 text-center">
                    <div class="${
                      winnerId === "root_sim"
                        ? "opacity-100 scale-110 text-green-700"
                        : "opacity-50 text-gray-500"
                    } transition-all"><span class="text-2xl">👍</span><br><span class="text-xs font-bold">SIM (${
      stats.commands.root_sim
    })</span></div>
                    <div class="${
                      winnerId === "root_nao"
                        ? "opacity-100 scale-110 text-red-700"
                        : "opacity-50 text-gray-500"
                    } transition-all"><span class="text-2xl">👎</span><br><span class="text-xs font-bold">NÃO (${
      stats.commands.root_nao
    })</span></div>
                    <div class="${
                      winnerId === "root_ajuda"
                        ? "opacity-100 scale-110 text-blue-700"
                        : "opacity-50 text-gray-500"
                    } transition-all"><span class="text-2xl">❓</span><br><span class="text-xs font-bold">AJUDA (${
      stats.commands.root_ajuda
    })</span></div>
                </div>
                <div class="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                    <p class="text-sm text-gray-700 leading-relaxed text-justify">${winnerText}</p>
                </div>
            </div>
        `;

    // 4. RECOMENDAÇÃO DA SEMANA
    html += `
            <div class="card p-6 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white mb-6">
                <div class="flex items-start space-x-4">
                    <div class="bg-white/20 p-2 rounded-lg"><i data-lucide="star" class="w-6 h-6 text-yellow-300"></i></div>
                    <div>
                        <h3 class="font-bold text-base mb-1 text-white opacity-95">Recomendação da Semana</h3>
                        <p class="text-sm text-blue-50 leading-snug">Incentive o uso de "Eu Quero" para pedir itens fora de alcance, reforçando a comunicação como ferramenta de acesso.</p>
                    </div>
                </div>
            </div>
        `;

    // 5. INSIGHTS
    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6 border-l-4 border-purple-500">
                <h3 class="font-bold text-lg mb-3 text-purple-800 flex items-center"><i data-lucide="lightbulb" class="w-5 h-5 mr-2"></i> Insights</h3>
                <p class="text-sm font-bold text-gray-700 mb-2">Interesse em: ${topItem.label} ${topItem.icon}</p>
                <p class="text-sm text-gray-600 bg-purple-50 p-3 rounded-xl border border-purple-100 leading-relaxed text-justify">${insightContent}</p>
            </div>
        `;

    // 6. COMUNICAÇÃO FUNCIONAL E CUIDADOS
    const careContent = stats.care
      ? `<div class="flex items-center justify-between bg-cyan-50 p-3 rounded-xl border border-cyan-100 mb-3">
                 <span class="text-sm font-bold text-cyan-900 flex items-center"><span class="text-2xl mr-2">${stats.care.icon}</span> ${stats.care.label}</span>
                 <span class="bg-white px-3 py-1 rounded-full text-xs font-bold text-cyan-600 shadow-sm">${stats.care.count}x</span>
               </div>
               <p class="text-sm text-gray-600 italic text-justify">"${careText}"</p>`
      : `<div class="text-center py-4 text-gray-400 italic"><p>Aguardando dados de cuidados (banho, sono, higiene).</p></div>`;

    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6 border-l-4 border-cyan-500">
                <h3 class="font-bold text-lg mb-3 text-cyan-800 flex items-center"><i data-lucide="accessibility" class="w-5 h-5 mr-2"></i> Funcional & Cuidados</h3>
                ${careContent}
            </div>
        `;

    // 7. PICTOGRAMAS ALIMENTARES + PREFERÊNCIAS
    const topFoodName = topFoodItem.label;
    const topFoodCount = topFoodItem.count;
    const foodPlanText = this.knowledgeBase.getFoodPlan(topFoodName);

    html += `
            <div class="card p-5 rounded-2xl shadow-md bg-white mb-6 border-l-4 border-green-500">
                <h3 class="font-bold text-lg mb-4 text-green-800 flex items-center"><i data-lucide="utensils" class="w-5 h-5 mr-2"></i> Pictogramas Alimentares</h3>
                <div class="grid grid-cols-3 gap-3 mb-5">
                    ${displayFoods
                      .map(
                        f => `
                        <div class="bg-green-50 p-2 rounded-xl border border-green-100 flex flex-col items-center justify-center aspect-square">
                            <span class="text-3xl mb-1 ${
                              f.count === 0 ? "opacity-30" : ""
                            }">${f.icon}</span>
                            <span class="text-xs font-bold text-green-700 text-center leading-tight truncate w-full">${
                              f.label
                            }</span>
                            <span class="text-[10px] text-green-500 font-bold mt-1">${
                              f.count
                            }x</span>
                        </div>
                    `
                      )
                      .join("")}
                    </div>
                <div class="border-t border-green-100 pt-4">
                    <h4 class="font-bold text-sm text-gray-700 mb-2">Preferências e Seletividade</h4>
                    <p class="text-sm text-gray-600 mb-3">Preferência clara por <strong class="text-green-700">${topFoodName}</strong> (${topFoodCount}x).</p>
                    <div class="bg-green-50/50 p-3 rounded-xl border border-green-100 text-sm text-gray-600 leading-relaxed text-justify">
                        <i data-lucide="chef-hat" class="w-4 h-4 inline mr-1 text-green-600"></i> ${foodPlanText}
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();
  },
};


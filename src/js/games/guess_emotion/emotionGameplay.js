// =============================================
// ARQUIVO: src/js/games/guess_emotion/emotionGameplay.js
// DESCRIÇÃO: Gameplay Visual (Barra de Progresso Mais Alta)
// =============================================

const EmotionGameplay = {
  render: function (itemData, allWorldItems, onGuess, worldColor) {
    const feedbackEl = document.getElementById("emotion-gameplay-feedback");
    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.className = "h-8 text-center font-bold text-lg mt-4 mb-4";
    }

    const scoreEl = document.getElementById("emotion-gameplay-score");
    if (scoreEl) scoreEl.textContent = EmotionLevels.state.totalScore;

    // === ATUALIZAÇÃO DA BARRA DE PROGRESSO ===
    const progressFill = document.getElementById(
      "emotion-gameplay-progress-bar"
    );
    if (progressFill) {
      // Removemos 'game-progress-fill' para não travar a altura em 12px
      // Usamos h-full para preencher o container de 24px (h-6)
      progressFill.className = `h-full rounded-full transition-all duration-500 shadow-sm bg-${worldColor}-500`;
    }

    // Emoji Principal
    const mainEmoji = document.getElementById("emotion-gameplay-main-emoji");
    mainEmoji.textContent = itemData.emoji;

    mainEmoji.style.transition = "none";
    mainEmoji.style.transform = "scale(0.5)";
    mainEmoji.style.opacity = "0";
    mainEmoji.classList.remove("animate-gentle-hint");

    if (typeof speakText === "function") {
      setTimeout(() => speakText(itemData.speech), 500);
    }

    setTimeout(() => {
      mainEmoji.style.transition =
        "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      mainEmoji.style.transform = "scale(1)";
      mainEmoji.style.opacity = "1";

      setTimeout(() => {
        mainEmoji.style.transform = "";
        mainEmoji.style.transition = "";
      }, 550);
    }, 50);

    // Opções
    const grid = document.getElementById("emotion-gameplay-options-grid");
    grid.innerHTML = "";
    grid.className = "grid grid-cols-1 gap-3 w-full max-w-sm mt-auto pb-4";

    let options = [itemData];
    let otherItems = allWorldItems.filter(i => i.name !== itemData.name);

    if (typeof shuffleArray === "function") {
      shuffleArray(otherItems);
      options.push(...otherItems.slice(0, 3));
      shuffleArray(options);
    }

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className =
        "w-full py-4 bg-white border-2 border-gray-200 rounded-2xl shadow-sm text-lg font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95";
      btn.textContent = opt.name;

      if (opt.name === itemData.name) {
        btn.dataset.correct = "true";
      }

      btn.onclick = () => {
        const isCorrect = opt.name === itemData.name;
        onGuess(isCorrect, btn);
      };
      grid.appendChild(btn);
    });
  },
};

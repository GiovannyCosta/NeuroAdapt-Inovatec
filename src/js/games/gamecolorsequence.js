// =============================================
// ARQUIVO: src/js/games/gameColorSequence.js
// DESCRIÇÃO: Lógica do Jogo Sequência de Cores
// =============================================

function initializeColorSequenceGame() {
  registerPlayed(7);

  const screen = document.getElementById("game-color-sequence-screen");
  if (screen) {
    const main = screen.querySelector("main");
    if (main) {
      main.classList.remove("justify-center");
      main.classList.add("justify-start", "pt-4");
    }
  }

  const feedbackBox = document.getElementById("sequence-feedback");
  if (feedbackBox) {
    feedbackBox.classList.remove("h-6");
    feedbackBox.classList.add(
      "min-h-[3.5rem]",
      "flex",
      "items-center",
      "justify-center"
    );
  }

  resetColorSequenceGame(true);
}

function resetColorSequenceGame(isNewGame = false) {
  if (isNewGame) {
    sequenceScore = 0;
  }
  sequenceCurrentLevel = 1;
  sequenceGoal = [];

  document.getElementById(
    "sequence-score"
  ).textContent = `Pontuação: ${sequenceScore}`;

  loadSequenceLevel();
}

function loadSequenceLevel() {
  const goalGrid = document.getElementById("sequence-goal-grid");
  const slotsGrid = document.getElementById("sequence-slots-grid");
  const piecesContainer = document.getElementById("sequence-piece-container");

  if (!goalGrid || !slotsGrid || !piecesContainer) return;

  goalGrid.innerHTML = "";
  slotsGrid.innerHTML = "";
  piecesContainer.innerHTML = "";

  // --- CÁLCULO DE DIFICULDADE ---
  let rows, cols;

  if (sequenceScore <= 4) {
    // FÁCIL (0-4): 1 Linha
    rows = 1;
    cols = Math.min(4, sequenceScore + 1);
  } else {
    // MÉDIO/DIFÍCIL (5+): 2 Linhas
    rows = 2;
    cols = Math.min(4, sequenceScore - 5 + 2);
  }

  const totalLevels = rows;

  // --- AJUSTE VISUAL (CSS GRID) ---
  let maxWidth = "max-w-[100px]";
  if (cols === 2) maxWidth = "max-w-[180px]";
  if (cols === 3) maxWidth = "max-w-[260px]";
  if (cols === 4) maxWidth = "max-w-[340px]";

  // Define uma altura mínima para o grid não pular na transição 1->2 linhas
  const minHeightClass = "min-h-[140px]";

  const gridClass = `grid gap-2 w-full mx-auto grid-cols-${cols} ${maxWidth} ${minHeightClass} items-center justify-center content-center`;

  goalGrid.className = gridClass;
  slotsGrid.className = gridClass
    .replace("gap-2", "gap-3")
    .replace("w-full", "w-full p-4 rounded-2xl card shadow-inner");

  // Atualiza Textos
  document.getElementById("sequence-score").classList.remove("hidden");
  document.getElementById("sequence-progress").classList.remove("hidden");
  document.getElementById(
    "sequence-progress"
  ).textContent = `Nível ${sequenceCurrentLevel} de ${totalLevels}`;
  document.getElementById(
    "sequence-score"
  ).textContent = `Pontuação: ${sequenceScore}`;

  // --- GERAÇÃO DO GABARITO ---
  if (sequenceGoal.length === 0) {
    for (let r = 0; r < rows; r++) {
      let colors = [...allGameColors];
      shuffleArray(colors);
      sequenceGoal.push(colors.slice(0, cols));
    }
  }

  // --- RENDERIZAÇÃO DO GABARITO ---
  for (let r = 0; r < rows; r++) {
    const isActiveRow =
      rows === 1 ||
      (sequenceCurrentLevel === 1 && r === 1) ||
      (sequenceCurrentLevel === 2 && r === 0);

    for (let c = 0; c < cols; c++) {
      const color = sequenceGoal[r][c];
      const cell = document.createElement("div");
      cell.className = "goal-cell rounded-md shadow-sm border border-gray-200";
      cell.style.backgroundColor = `var(--game-${color})`;
      cell.style.aspectRatio = "1/1";
      cell.style.width = "100%";

      // Foco Visual no Gabarito
      cell.style.opacity = isActiveRow ? "1" : "0.15";
      cell.style.transition = "opacity 0.5s ease";

      goalGrid.appendChild(cell);
    }
  }

  // --- RENDERIZAÇÃO DOS SLOTS ---
  let piecesForThisLevel = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const slot = document.createElement("div");
      slot.className = "sequence-slot";
      slot.dataset.type = "sequence";
      slot.dataset.row = r;
      slot.dataset.col = c;
      slot.dataset.goalColor = sequenceGoal[r][c];
      slot.style.aspectRatio = "1/1";
      slot.style.width = "100%";

      slot.style.opacity = "1";

      if (rows === 1) {
        piecesForThisLevel.push(sequenceGoal[r][c]);
      } else {
        if (sequenceCurrentLevel === 1) {
          if (r === 0) slot.classList.add("disabled");
          if (r === 1) piecesForThisLevel.push(sequenceGoal[r][c]);
        } else if (sequenceCurrentLevel === 2) {
          if (r === 1) {
            slot.classList.add("matched");
            slot.style.backgroundColor = `var(--game-${sequenceGoal[r][c]})`;
            slot.innerHTML = "";
          } else if (r === 0) {
            piecesForThisLevel.push(sequenceGoal[r][c]);
          }
        }
      }
      slotsGrid.appendChild(slot);
    }
  }

  shuffleArray(piecesForThisLevel);

  piecesForThisLevel.forEach(color => {
    const piece = document.createElement("div");
    piece.className = "sequence-piece";
    piece.dataset.type = "sequence";
    piece.dataset.color = color;
    piece.draggable = true;
    piece.style.backgroundColor = `var(--game-${color})`;
    piece.style.width = "50px";
    piece.style.height = "50px";
    piecesContainer.appendChild(piece);
  });

  if (typeof lucide !== "undefined") lucide.createIcons();
}

/** Jogo 7: Verifica se a etapa atual foi concluída */
function checkSequenceLevelCompletion() {
  const slots = document.querySelectorAll(
    "#sequence-slots-grid .sequence-slot"
  );
  const rows = sequenceScore <= 4 ? 1 : 2;

  if (rows === 1) {
    const allMatched = Array.from(slots).every(s =>
      s.classList.contains("matched")
    );
    if (allMatched) completeRound();
  } else {
    if (sequenceCurrentLevel === 1) {
      const bottomSlots = Array.from(slots).filter(s => s.dataset.row === "1");
      if (bottomSlots.every(s => s.classList.contains("matched"))) {
        sequenceCurrentLevel = 2;

        // VOLTOU AO PADRÃO: Feedback na barra (não usa Overlay)
        showGameFeedback(
          "sequence-feedback",
          "Muito bem! Olhe para cima.",
          true
        );

        setTimeout(loadSequenceLevel, 800);
      }
    } else if (sequenceCurrentLevel === 2) {
      const topSlots = Array.from(slots).filter(s => s.dataset.row === "0");
      if (topSlots.every(s => s.classList.contains("matched"))) {
        completeRound();
      }
    }
  }
}

/** Função auxiliar para finalizar a rodada e dar pontos */
function completeRound() {
  sequenceScore++;
  document.getElementById(
    "sequence-score"
  ).textContent = `Pontuação: ${sequenceScore}`;

  let msg = "Sequência Completa!";
  if (sequenceScore === 5) msg = "Nível Médio Desbloqueado!";

  // VOLTOU AO PADRÃO: Feedback na barra
  showGameFeedback("sequence-feedback", msg, true);

  registerProgress(16, 1);

  if (sequenceScore % 5 === 0) showPerfectFeedback(sequenceScore);

  sequenceGoal = [];
  sequenceCurrentLevel = 1;

  setTimeout(() => {
    loadSequenceLevel();
  }, 1500);
}

// =============================================
// ARQUIVO: src/js/games/gamePuzzle.js
// DESCRIÇÃO: Lógica do Jogo Quebra-Cabeça
// =============================================

function initializePuzzleGame() {
  registerPlayed(8);
  resetPuzzleGame();
}

function resetPuzzleGame() {
  const sC = document.getElementById("puzzle-slots"),
    pC = document.getElementById("puzzle-pieces");
  if (!sC || !pC) return;
  sC.innerHTML = "";
  pC.innerHTML = "";
  const gC = ["red", "green", "blue", "yellow", "purple", "orange"];

  let cPD = [...puzzlePiecesDef];
  cPD.forEach(p => (p.colorId = gC[Math.floor(Math.random() * gC.length)]));

  let sP = [...cPD];
  shuffleArray(sP);

  puzzleLetters.forEach((l, i) => {
    const s = document.createElement("div");
    s.className = "puzzle-slot rounded-md";
    s.dataset.piece = `l${i + 1}`;
    s.dataset.type = "puzzle";
    s.textContent = l;
    sC.appendChild(s);
  });

  sP.forEach(pD => {
    const pE = document.createElement("div");
    pE.className = "puzzle-piece card shadow-md";
    pE.dataset.piece = pD.id;
    pE.dataset.type = "puzzle";
    pE.draggable = true;
    pE.textContent = pD.letter;
    pE.style.backgroundColor = `var(--game-${pD.colorId})`;
    pC.appendChild(pE);
  });
}

function checkPuzzleCompletion() {
  const piecesRemaining =
    document.getElementById("puzzle-pieces").children.length;

  if (piecesRemaining === 0) {
    puzzleScore++;
    document.getElementById(
      "puzzle-score"
    ).textContent = `Pontuação: ${puzzleScore}`;
    showGameFeedback("puzzle-feedback", "Palavra Completa!", true);
    registerProgress(17, 1);
    if (puzzleScore % 5 === 0) {
      triggerStarBurst(null, null);
      showPerfectFeedback(puzzleScore);
    }
    setTimeout(resetPuzzleGame, 1500);
  }
}

// =============================================
// ARQUIVO: src/js/games/gameCombineShapes.js
// DESCRIÇÃO: Lógica do Jogo Combine as Formas
// =============================================

function initializeCombineAsFormasGame() {
  registerPlayed(1); //
  resetCombineAsFormasGame(); //
}

function resetCombineAsFormasGame() {
  const s = document.getElementById("shape-slots"),
    p = document.getElementById("shape-pieces"); //
  if (!s || !p) return;
  s.innerHTML = "";
  p.innerHTML = ""; //
  const c = ["red", "green", "blue", "yellow", "purple", "orange"]; //
  shuffleArray(c); //
  shapes.forEach((sh, i) => (sh.colorId = c[i % c.length])); //
  shuffleArray(shapes); //
  shapes.forEach(sh => {
    const sl = document.createElement("div");
    sl.className = "shape-slot rounded-2xl flex items-center justify-center";
    sl.dataset.piece = sh.id;
    sl.dataset.type = "shape";
    sl.dataset.color = sh.colorId;
    sl.style.color = `var(--game-${sh.colorId})`;
    sl.innerHTML = sh.svg;
    s.appendChild(sl);
  }); //
  shuffleArray(shapes); //
  shapes.forEach(sh => {
    const pc = document.createElement("div");
    pc.className = "shape-piece card shadow-md rounded-2xl";
    pc.dataset.piece = sh.id;
    pc.dataset.type = "shape";
    pc.dataset.color = sh.colorId;
    pc.draggable = true;
    pc.style.color = `var(--game-${sh.colorId})`;
    pc.innerHTML = sh.svg;
    p.appendChild(pc);
  }); //
}

/** Verifica se todas as peças foram combinadas */
function checkGameCompletion() {
  const piecesRemaining =
    document.getElementById("shape-pieces").children.length; //

  if (piecesRemaining === 0) {
    combineShapesScore++; //
    document.getElementById(
      "combine-score"
    ).textContent = `Pontuação: ${combineShapesScore}`; //
    showGameFeedback("combine-feedback", "Correto!", true); //
    registerProgress(10, 1); //
    if (combineShapesScore % 5 === 0) {
      //
      triggerStarBurst(null, null); //
      showPerfectFeedback(combineShapesScore); //
    }
    setTimeout(resetCombineAsFormasGame, 1500); //
  }
}

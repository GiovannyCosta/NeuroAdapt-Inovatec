// =============================================
// ARQUIVO: src/js/games/combine_shapes/shapeGameplay.js
// DESCRIÇÃO: Lógica de Jogabilidade para Combinar Formas
// =============================================

const ShapeGameplay = {
  wrongAttempts: 0,
  currentLevelData: null,
  totalPieces: 6,

  loadLevel: function (levelData, theme) {
    this.currentLevelData = levelData;
    this.wrongAttempts = 0;

    const slotsContainer = document.getElementById("shape-slots");
    const piecesContainer = document.getElementById("shape-pieces");
    const feedback = document.getElementById("combine-feedback");

    if (!slotsContainer || !piecesContainer) return;

    slotsContainer.innerHTML = "";
    piecesContainer.innerHTML = "";
    if (feedback) feedback.textContent = "";

    // Atualiza pontuação visual (Sessão ou Carreira)
    if (typeof ShapeLogic !== "undefined") {
      ShapeLogic.updateScoreUI();
    }

    this.updateProgress(0);

    // Configura Grid 3x2
    slotsContainer.className =
      "grid grid-cols-3 gap-4 w-full p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 items-center justify-items-center";
    slotsContainer.style.maxWidth = "340px";

    // Definir Itens
    const types = levelData.availableShapes;
    const colors = levelData.availableColors;
    let gridItems = [];

    for (let i = 0; i < 6; i++) {
      const typeIndex = i % types.length;
      const colorKey = colors[typeIndex % colors.length];
      let colorVal = SHAPE_COLORS[colorKey];

      // Fallback de cor
      if (!colorVal) {
        colorVal = SHAPE_COLORS[Object.keys(SHAPE_COLORS)[0]];
      }

      // Proteção: Verifica se o SVG existe
      const svgContent = SHAPE_SVGS[types[typeIndex]];
      if (!svgContent) {
        console.error("SVG Faltando para:", types[typeIndex]);
        // Fallback para Círculo se faltar o ícone, para não quebrar o jogo
        gridItems.push({
          id: types[typeIndex],
          color: colorVal,
          svg: SHAPE_SVGS["CIRCULO"],
        });
      } else {
        gridItems.push({
          id: types[typeIndex],
          color: colorVal,
          svg: svgContent,
        });
      }
    }

    shuffleArray(gridItems);

    // Renderiza Slots
    gridItems.forEach(item => {
      const slotEl = document.createElement("div");
      slotEl.className =
        "shape-slot rounded-xl flex items-center justify-center transition-all duration-300 bg-white shadow-md";
      slotEl.style.width = "75px";
      slotEl.style.height = "75px";
      slotEl.style.border = "2px solid rgba(0, 0, 0, 0.06)";
      slotEl.style.color = item.color;

      slotEl.dataset.piece = item.id;
      slotEl.dataset.type = "shape";
      slotEl.dataset.color = item.color;

      slotEl.innerHTML = item.svg;
      // Proteção contra erro de acesso ao style se svg for inválido
      if (slotEl.querySelector("svg")) {
        slotEl.querySelector("svg").style.opacity = "0.3";
      }

      slotsContainer.appendChild(slotEl);
    });

    // Renderiza Peças
    let pieces = [...gridItems];
    shuffleArray(pieces);

    pieces.forEach(p => {
      const pc = document.createElement("div");
      pc.className =
        "shape-piece card shadow-lg rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform border-2 border-gray-100 bg-white";
      pc.style.width = "70px";
      pc.style.height = "70px";
      pc.style.color = p.color;

      if (theme === "upside_down") {
        pc.style.transform = "rotate(180deg)";
        pc.classList.add("is-inverted");
      }

      pc.dataset.piece = p.id;
      pc.dataset.type = "shape";
      pc.dataset.color = p.color;
      pc.draggable = true;
      pc.innerHTML = p.svg;

      piecesContainer.appendChild(pc);
    });
  },

  updateProgress: function (placedCount) {
    const progressText = document.getElementById("shape-progress-text");
    const progressBar = document.getElementById("shape-progress-bar");

    if (progressText && progressBar) {
      const total = 6;
      const pct = (placedCount / total) * 100;
      progressText.textContent = `${placedCount}/${total}`;
      progressBar.style.width = `${pct}%`;
    }
  },

  handleError: function () {
    this.wrongAttempts++;
    const feedback = document.getElementById("combine-feedback");
    if (feedback) {
      feedback.textContent = "Tente de novo";
      feedback.className = "game-feedback incorrect";
    }
    if (this.wrongAttempts >= 3) this.showHint();
  },

  showHint: function () {
    const piece = document.querySelector(".shape-piece:not(.placed)");
    if (!piece) return;

    const slot = Array.from(document.querySelectorAll(".shape-slot")).find(
      s =>
        s.dataset.piece === piece.dataset.piece &&
        s.dataset.color === piece.dataset.color &&
        !s.classList.contains("matched")
    );

    if (slot) {
      slot.style.borderColor = "var(--accent-primary)";
      slot.classList.add("hint-active");
      piece.classList.add("animate-bounce");
      setTimeout(() => {
        slot.style.borderColor = "rgba(0, 0, 0, 0.06)";
        slot.classList.remove("hint-active");
        piece.classList.remove("animate-bounce");
      }, 2000);
    }
  },

  checkVictory: function () {
    const allSlots = document.querySelectorAll(
      "#shape-slots .shape-slot.matched"
    );
    const placedCount = allSlots.length;

    this.updateProgress(placedCount);

    if (typeof ShapeLogic !== "undefined") {
      ShapeLogic.addScore(1);
    }

    if (placedCount >= 6) {
      showGameFeedback("combine-feedback", "Fase Completa!", true);
      if (typeof ShapeLogic !== "undefined") {
        ShapeLogic.onLevelComplete();
      }
    }
  },
};

window.checkGameCompletion = () => ShapeGameplay.checkVictory();

const originalShowFeedback = window.showGameFeedback;
window.showGameFeedback = (id, msg, isCorrect) => {
  if (typeof originalShowFeedback === "function")
    originalShowFeedback(id, msg, isCorrect);
  if (id === "combine-feedback" && !isCorrect) ShapeGameplay.handleError();
};

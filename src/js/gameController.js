// =============================================
// ARQUIVO: src/js/gameController.js
// DESCRIÇÃO: Controlador responsável por inicializar e resetar os jogos.
// =============================================

/**
 * @param {string} gameScreenId
 */
function loadGame(gameScreenId) {
  // ============================================================
  // 1. JOGOS COM ARQUITETURA NOVA (WRAPPERS & LOGIC MODULES)
  // ============================================================
  // --- JOGO: COMBINE AS FORMAS ---
  if (gameScreenId === "game-combine-shapes-screen") {
    document
      .querySelectorAll(".screen")
      .forEach(s => s.classList.add("hidden"));
    const wrapper = document.getElementById("game-combine-shapes-wrapper");
    if (wrapper) wrapper.classList.remove("hidden");

    if (typeof ShapeLogic !== "undefined") {
      ShapeLogic.renderMainMenu();
    } else {
      console.error("ShapeLogic não foi carregado!");
    }
    gameInitializationState[gameScreenId] = true;
    return;
  }

  // --- JOGO: ADIVINHE A EMOÇÃO (NOVO) ---
  if (gameScreenId === "game-emotion-screen") {
    // 1. Esconde todas as telas
    document
      .querySelectorAll(".screen")
      .forEach(s => s.classList.add("hidden"));

    // 2. Mostra o novo Wrapper
    const wrapper = document.getElementById("game-emotion-wrapper");
    if (wrapper) wrapper.classList.remove("hidden");

    // 3. Inicia a Lógica (Força o Menu Principal a aparecer)
    if (typeof EmotionLogic !== "undefined") {
      EmotionLogic.renderMainMenu();
    } else {
      console.error("EmotionLogic não carregado!");
    }

    gameInitializationState[gameScreenId] = true;
    return;
  }

  // ============================================================
  // 2. JOGOS LEGADOS (PADRÃO ANTIGO)
  // ============================================================
  if (typeof showScreen === "function") {
    showScreen(gameScreenId);
  } else {
    const tS = document.getElementById(gameScreenId);
    if (tS) tS.classList.remove("hidden");
  }

  // Inicializa ou reseta os jogos antigos
  if (!gameInitializationState[gameScreenId]) {
    // --- PRIMEIRA VEZ (INICIALIZAÇÃO) ---
    switch (gameScreenId) {
      case "game-connect-dots-screen":
        initializeConnectDotsGame();
        break;
      case "game-puzzle-screen":
        initializePuzzleGame();
        break;
      // game-emotion-screen removido daqui pois agora tem wrapper próprio acima
      case "game-guess-color-screen":
        initializeGuessColorGame();
        break;
      case "game-connect-numbers-screen":
        initializeConnectNumbersGame();
        break;
      case "game-color-sequence-screen":
        initializeColorSequenceGame();
        break;
      case "game-sound-screen":
        initializeSoundGame();
        break;
      case "game-guess-word-screen":
        initializeGuessWordGame();
        break;
    }
    gameInitializationState[gameScreenId] = true;
  } else {
    // --- REENTRADA (RESET) ---
    switch (gameScreenId) {
      case "game-connect-dots-screen":
        resetConnectDotsGame(false);
        break;
      case "game-puzzle-screen":
        resetPuzzleGame();
        break;
      case "game-guess-color-screen":
        displayNextColorRound();
        break;
      case "game-connect-numbers-screen":
        resetConnectNumbersGame(false);
        break;
      case "game-color-sequence-screen":
        resetColorSequenceGame(false);
        break;
      case "game-sound-screen":
        initializeSoundGame();
        break;
      case "game-guess-word-screen":
        initializeGuessWordGame();
        break;
    }
  }
}

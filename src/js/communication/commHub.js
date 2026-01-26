// =============================================
// ARQUIVO: src/js/communication/commHub.js
// DESCRIÇÃO: Hub de Comunicação (CAA, Emoções, Alfabeto, Números)
// =============================================

const CommHub = {
  init: function () {
    // Inicializa os submódulos
    if (typeof CaaLogic !== "undefined") CaaLogic.init();
    if (typeof EmotionsBoard !== "undefined") EmotionsBoard.init();
    if (typeof AlphabetBoard !== "undefined") AlphabetBoard.init();
    if (typeof NumbersBoard !== "undefined") NumbersBoard.init();

    this.setupNavigation();
  },

  setupNavigation: function () {
    // Botões do Menu Principal de Comunicação
    document.querySelectorAll(".comm-menu-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;

        if (typeof showScreen === "function") {
          showScreen(target);
        }

        // Se reabrir a tela de CAA, garante que mostre o menu principal
        if (
          target === "caa-symbols-screen" &&
          typeof CaaLogic !== "undefined"
        ) {
          CaaLogic.renderMainMenu();
        }

        // Se for tela de emoções, reseta para a grid
        if (
          target === "caa-emotions-screen" &&
          typeof EmotionsBoard !== "undefined"
        ) {
          EmotionsBoard.closeDetail();
        }
      });
    });

    // Botões de Voltar para o Menu de Comunicação
    document.querySelectorAll(".back-to-comm-menu").forEach(btn => {
      btn.addEventListener("click", () => {
        const commNav = document.querySelector(
          '.nav-item[data-screen="communication-screen"]'
        );
        if (typeof showScreen === "function") {
          showScreen("communication-screen", commNav);
        }
      });
    });
  },
};

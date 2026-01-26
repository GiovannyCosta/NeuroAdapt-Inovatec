// =============================================
// ARQUIVO: src/js/communication/caaLogic.js
// DESCRIÇÃO: Lógica de renderização, navegação e rastreamento da CAA
// =============================================

const CaaLogic = {
  currentContextPhrase: null, // Ex: "Eu quero"
  navigationStack: [],

  init: function () {
    this.renderMainMenu();
    this.setupBackButton();
  },

  setupBackButton: function () {
    const backBtn = document.getElementById("caa-back-btn");
    if (backBtn) {
      // Clone o nó para remover listeners antigos e garantir limpeza
      const newBtn = backBtn.cloneNode(true);
      backBtn.parentNode.replaceChild(newBtn, backBtn);

      newBtn.addEventListener("click", () => {
        this.goBack();
      });
    }
  },

  goBack: function () {
    if (this.navigationStack.length > 0) {
      // Remove a tela atual do histórico
      this.navigationStack.pop();

      if (this.navigationStack.length > 0) {
        // Se ainda tem histórico, volta para a anterior (Ex: De Frutas para Quero)
        const previousState =
          this.navigationStack[this.navigationStack.length - 1];
        // false = não adicionar ao histórico novamente
        this.renderCategory(
          previousState.categoryId,
          previousState.contextSpeech,
          false
        );
      } else {
        // Se acabou o histórico, volta para o Menu Principal
        this.renderMainMenu();
      }
    } else {
      // Se já está no Menu Principal, sai da tela CAA e volta pro Hub
      const commNav = document.querySelector(
        '.nav-item[data-screen="communication-screen"]'
      );
      if (typeof showScreen === "function") {
        showScreen("communication-screen", commNav);
      }
    }
  },

  renderMainMenu: function () {
    this.currentContextPhrase = null;
    this.navigationStack = []; // Limpa histórico ao voltar para o início

    const container = document.getElementById("caa-grid-container");
    const title = document.getElementById("caa-screen-title");

    if (!container) return;

    if (title) title.textContent = "Falar";
    container.innerHTML = "";
    container.className = "grid grid-cols-2 gap-4 h-full content-start pb-28";

    CaaData.root.forEach(item => {
      const btn = document.createElement("button");
      btn.className = `card flex flex-col items-center justify-center p-4 rounded-3xl shadow-md border-b-4 active:scale-95 transition-transform h-40 ${item.colorClass}`;

      btn.innerHTML = `
                <span class="text-6xl mb-2 pointer-events-none">${item.icon}</span>
                <span class="text-xl font-bold pointer-events-none">${item.label}</span>
            `;

      btn.onclick = () => this.handleRootClick(item);
      container.appendChild(btn);
    });
  },

  // Renderiza uma categoria
  renderCategory: function (categoryId, contextSpeech, pushToHistory = true) {
    const container = document.getElementById("caa-grid-container");
    const title = document.getElementById("caa-screen-title");
    const items = CaaData.categories[categoryId];

    if (!container || !items) return;

    // Atualiza contexto global se fornecido
    if (contextSpeech) this.currentContextPhrase = contextSpeech;

    // Adiciona ao histórico se for uma nova navegação (não se estiver voltando)
    if (pushToHistory) {
      this.navigationStack.push({
        categoryId,
        contextSpeech: this.currentContextPhrase,
      });
    }

    if (title) title.textContent = this.currentContextPhrase;

    container.innerHTML = "";
    container.className = "grid grid-cols-2 gap-4 pb-28";

    items.forEach(item => {
      const btn = document.createElement("button");
      btn.className = `card flex flex-col items-center justify-center p-4 rounded-3xl shadow-sm border-2 active:scale-95 transition-transform h-36 ${item.colorClass}`;

      btn.innerHTML = `
                <span class="text-5xl mb-2 pointer-events-none">${item.icon}</span>
                <span class="text-lg font-bold text-gray-700 pointer-events-none text-center leading-tight">${item.label}</span>
            `;

      btn.onclick = () => {
        // LÓGICA 1: Se for navegar (abrir pasta), abre a nova categoria
        if (item.action === "navigate") {
          this.renderCategory(item.targetCategory, this.currentContextPhrase); // Mantém a frase "Eu quero"
          return;
        }

        // LÓGICA 2: Se for item final, fala a frase completa
        const fullPhrase = `${this.currentContextPhrase} ${item.speechSuffix}`;

        if (typeof speakText === "function") {
          speakText(fullPhrase);
        }

        // --- REGISTRO NO RELATÓRIO ---
        // Aqui chamamos a função que você adicionou no globals.js
        if (typeof registerCaaEvent === "function") {
          registerCaaEvent(item.id, item.label, categoryId);
        }
        // -----------------------------

        if (navigator.vibrate) navigator.vibrate(50);
      };

      container.appendChild(btn);
    });
  },

  handleRootClick: function (item) {
    // Fala o item raiz (Ex: "Sim", "Eu Quero")
    if (typeof speakText === "function") {
      speakText(item.speech);
    }

    // Registra o clique no menu principal também (importante para saber quantas vezes usou "Ajuda" ou "Não")
    if (typeof registerCaaEvent === "function") {
      registerCaaEvent(item.id, item.label, "root");
    }

    if (item.action === "navigate") {
      setTimeout(() => {
        this.renderCategory(item.targetCategory, item.speech);
      }, 500);
    }
  },
};

// =============================================
// ARQUIVO: src/js/communication/emotionsBoard.js
// DESCRIÇÃO: Lógica da tela 'O que sinto' e detalhes de emoções (USANDO TELA DE GUIA).
// =============================================

const EmotionsBoard = {
  emotionData: {
    alegria: {
      name: "Alegria",
      emoji: "😄",
      description:
        "Me sinto feliz, com vontade de brincar, sorrir e contar para todo mundo.",
      coping: [
        { emoji: "😀", text: "Brincar com amigos" },
        { emoji: "🎨", text: "Fazer um desenho legal" },
        { emoji: "🗣️", text: "Contar o motivo da alegria" },
      ],
      speech: "Alegria",
    },
    felicidade: {
      name: "Felicidade",
      emoji: "😊",
      description: "Estou contente, com energia boa e sorriso no rosto.",
      coping: [
        { emoji: "🎶", text: "Dançar ou cantar" },
        { emoji: "💬", text: "Contar para alguém" },
        { emoji: "🎁", text: "Compartilhar algo legal com alguém" },
      ],
      speech: "Felicidade",
    },
    engracado: {
      name: "Engraçado",
      emoji: "😂",
      description: "Tudo parece divertido, dá vontade de rir.",
      coping: [
        { emoji: "😂", text: "Compartilhar com os colegas" },
        { emoji: "🗣️", text: "Rir junto com os colegas" },
        { emoji: "🖍️", text: "Desenhar o que me fez rir" },
      ],
      speech: "Engraçado",
    },
    amor: {
      name: "Amor",
      emoji: "🥰",
      description:
        "Sinto carinho por alguém e quero cuidar, estar perto e abraçar.",
      coping: [
        { emoji: "🫂", text: "Dar um abraço" },
        { emoji: "💌", text: "Fazer um cartão ou desenho" },
        { emoji: "💖", text: "Dizer 'eu gosto de você'" },
      ],
      speech: "Amor",
    },
    surpresa: {
      name: "Surpresa",
      emoji: "😮",
      description: "Algo aconteceu de repente, sem eu esperar.",
      coping: [
        { emoji: "😮‍💨", text: "Respirar fundo" },
        { emoji: "🗣️", text: "Contar para alguém o que aconteceu" },
        { emoji: "💭", text: "Observar como me sinto por dentro" },
      ],
      speech: "Surpresa",
    },
    tristeza: {
      name: "Tristeza",
      emoji: "😢",
      description: "Dá vontade de chorar, ficar quietinho e sozinho.",
      coping: [
        { emoji: "🤗", text: "Pedir um abraço" },
        { emoji: "💬", text: "Contar para alguém como estou" },
        { emoji: "🎧", text: "Ouvir uma música calma" },
      ],
      speech: "Tristeza",
    },
    raiva: {
      name: "Raiva",
      emoji: "😠",
      description: "Sinto o corpo quente, fico com vontade de gritar ou bater.",
      coping: [
        { emoji: "🔟", text: "Contar até 10 bem devagar" },
        { emoji: "🖍️", text: "Desenhar a raiva" },
        { emoji: "🧘", text: "Ficar um tempinho no cantinho da calma" },
      ],
      speech: "Raiva",
    },
    medo: {
      name: "Medo",
      emoji: "😨",
      description: "Fico assustado, com vontade de me esconder ou chorar.",
      coping: [
        { emoji: "🧑‍🤝‍🧑", text: "Procurar um adulto de confiança" },
        { emoji: "😮‍💨", text: "Respirar devagar" },
        { emoji: "🗣️", text: "Contar o que me assustou" },
      ],
      speech: "Medo",
    },
    nervoso: {
      name: "Nervoso",
      emoji: "😬",
      description: "Fico agitado, com medo de errar ou que algo dê errado.",
      coping: [
        { emoji: "😮‍💨", text: "Fazer respiração da flor (cheira e sopra)" },
        { emoji: "🗣️", text: "Conversar com um adulto" },
        { emoji: "🟡", text: "Apertar uma bolinha de massinha" },
      ],
      speech: "Nervoso",
    },
    vergonha: {
      name: "Vergonha",
      emoji: "😳",
      description:
        "Fico com vontade de me esconder, tenho medo que riam de mim.",
      coping: [
        { emoji: "😮‍💨", text: "Respirar fundo" },
        { emoji: "🧑‍🤝‍🧑", text: "Falar com um adulto que confio" },
        { emoji: "✨", text: "Lembrar que todo mundo erra" },
      ],
      speech: "Vergonha",
    },
    inseguranca: {
      name: "Insegurança",
      emoji: "😟",
      description: "Fico com medo de errar, não tenho certeza se consigo.",
      coping: [
        { emoji: "🙏", text: "Pedir ajuda" },
        { emoji: "💡", text: "Pensar em algo que já fiz bem" },
        { emoji: "🐢", text: "Tentar devagar, sem pressa" },
      ],
      speech: "Insegurança",
    },
    ciumes: {
      name: "Ciúmes",
      emoji: "😒",
      description: "Quero atenção só para mim, fico chateado com o outro.",
      coping: [
        { emoji: "🫂", text: "Lembrar que todos podem receber carinho" },
        { emoji: "💬", text: "Conversar sobre o que senti" },
        { emoji: "❤️", text: "Fazer algo legal com quem eu gosto" },
      ],
      speech: "Ciúmes",
    },
    doente: {
      name: "Doente",
      emoji: "🤒",
      description: "Estou com dor, cansado ou meu corpo não está bem.",
      coping: [
        { emoji: "🛌", text: "Descansar" },
        { emoji: "💧", text: "Beber água" },
        { emoji: "🏥", text: "Avisar a professora ou a família" },
      ],
      speech: "Doente",
    },
    cansaco: {
      name: "Cansaço",
      emoji: "😴",
      description: "Meu corpo está mole, sem energia e quero descansar.",
      coping: [
        { emoji: "🛌", text: "Deitar um pouco" },
        { emoji: "💧", text: "Beber água" },
        { emoji: "📣", text: "Pedir ajuda para o adulto" },
      ],
      speech: "Cansaço",
    },
    tedio: {
      name: "Tédio",
      emoji: "🥱",
      description: "Nada parece legal, fico sem vontade de fazer nada.",
      coping: [
        { emoji: "🧩", text: "Procurar uma brincadeira nova" },
        { emoji: "📖", text: "Olhar um livro" },
        { emoji: "🎨", text: "Inventar algo diferente" },
      ],
      speech: "Tédio",
    },
  },

  init: function () {
    this.renderGrid();
    this.setupGuideListeners();

    document
      .getElementById("btn-close-emotion-detail")
      ?.addEventListener("click", () => this.closeDetail());

    window.closeEmotionDetail = this.closeDetail.bind(this);
  },

  setupGuideListeners: function () {
    const openBtn = document.getElementById("btn-open-emotions-guide");
    const closeBtn = document.getElementById("guide-back-btn"); // Botão voltar da nova tela

    if (openBtn) {
      // Abre a nova tela de guia
      openBtn.addEventListener("click", () => this.openGuide());
    }
    if (closeBtn) {
      // Volta para a tela de emoções principal
      closeBtn.addEventListener("click", () => this.closeGuide());
    }
  },

  // --- NOVO: ABRE A TELA DE GUIA ---
  openGuide: function () {
    if (typeof showScreen === "function") {
      showScreen("emotions-guide-screen");
    }
  },

  // --- NOVO: FECHA A TELA DE GUIA ---
  closeGuide: function () {
    if (typeof showScreen === "function") {
      // Volta para a tela principal de emoções
      showScreen("caa-emotions-screen");
    }
  },

  renderGrid: function () {
    const grid = document.getElementById("emotions-grid-container");
    if (!grid) return;
    grid.innerHTML = "";

    Object.values(this.emotionData).forEach(data => {
      const btn = document.createElement("button");
      btn.className =
        "card p-4 rounded-xl flex flex-col items-center justify-center shadow-sm hover:bg-blue-50 transition-colors";
      btn.innerHTML = `<span class="text-5xl mb-2">${data.emoji}</span><span class="font-bold accent-text">${data.name}</span>`;

      btn.onclick = () => this.showDetail(data);
      grid.appendChild(btn);
    });
  },

  showDetail: function (data) {
    document.getElementById("emotions-grid-view").classList.add("hidden");
    document.getElementById("emotion-detail-view").classList.remove("hidden");

    document.getElementById("detail-emoji").textContent = data.emoji;
    document.getElementById("detail-name").textContent = data.name;
    document.getElementById("detail-desc").textContent = data.description;

    const copingList = document.getElementById("detail-coping");
    copingList.innerHTML = "";

    data.coping.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${c.emoji}</strong> ${c.text}`;
      copingList.appendChild(li);
    });

    if (typeof speakText === "function") speakText(data.speech);
  },

  closeDetail: function () {
    const detailView = document.getElementById("emotion-detail-view");
    const gridView = document.getElementById("emotions-grid-view");

    if (detailView && gridView) {
      detailView.classList.add("hidden");
      gridView.classList.remove("hidden");
    }
  },
};

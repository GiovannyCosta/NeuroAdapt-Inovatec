// =============================================
// ARQUIVO: src/js/globals.js (VERSÃO FINAL CORRIGIDA E FUNCIONAL)
// DESCRIÇÃO: Variáveis globais, dados e funções de utilidade.
// =============================================

// =============================================
// PARTE 1: VARIÁVEIS GLOBAIS DE ESTADO
// =============================================

let draggedPiece = null;
let connectDotsCanvas, connectDotsCtx;
// --- Grid 2x4 para Ligue os Pontos ---
const connectDotsGridCols = 2,
  connectDotsGridRows = 4;
let connectDotsCellSizeX, connectDotsCellSizeY;
// -----------------------------------------------
let connectDotsDots = [],
  connectDotsLines = [],
  connectDotsIsDrawing = false,
  connectDotsCurrentLine = null,
  connectDotsColors = {};
let correctEmotion = null,
  emotionGameActive = true;
let correctColor = null,
  colorGameActive = true;
let currentSoundCategory = null;
let correctSound = null;
let soundGameActive = true;
let soundGameScore = 0;
let connectNumbersCanvas, connectNumbersCtx;
let connectNumbersCellSizeX, connectNumbersCellSizeY;
let connectNumbersDots = [],
  connectNumbersLines = [],
  connectNumbersIsDrawing = false,
  connectNumbersCurrentLine = null;
let sequenceGoal = [],
  sequenceCurrentLevel = 1;
let combineShapesScore = 0,
  connectDotsScore = 0,
  connectNumbersScore = 0,
  puzzleScore = 0,
  emotionGameScore = 0,
  colorGameScore = 0,
  sequenceScore = 0;
let wordGameScore = 0;
let correctWordData = null;
let guessedLetters = [];
let wordGameActive = true;
let currentWordCategory = null;
let isFeedbackPerfect = false;
let consecutiveSoundCorrects = 0;
let consecutiveWordCorrects = 0;
let selectedPiece = null; // Para modo calmo (clique)

// Estado de inicialização dos jogos (para carregar apenas uma vez)
const gameInitializationState = {
  "game-combine-shapes-screen": false,
  "game-connect-dots-screen": false,
  "game-puzzle-screen": false,
  "game-emotion-screen": false,
  "game-guess-color-screen": false,
  "game-connect-numbers-screen": false,
  "game-color-sequence-screen": false,
  "game-sound-screen": false,
  "game-guess-word-screen": false,
};

// =============================================
// PARTE 2: DADOS GLOBAIS (CONSTANTES)
// =============================================

// --- DADOS GERAIS ---
const allGameColors = ["red", "green", "blue", "yellow", "purple", "orange"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇÃÕÊÁÉÍÓÚÀÈÌÒÙ".split("");

// --- DADOS DE JOGOS ---
const shapes = [
  {
    id: "circle",
    svg: '<svg width="50" height="50" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>',
  },
  {
    id: "square",
    svg: '<svg width="50" height="50" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="10" fill="currentColor"/></svg>',
  },
  {
    id: "triangle",
    svg: '<svg width="50" height="50" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="currentColor"/></svg>',
  },
  {
    id: "star",
    svg: '<svg width="50" height="50" viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 67,55 78,85 50,65 22,85 33,55 5,35 39,35" fill="currentColor"/></svg>',
  },
  {
    id: "hexagon",
    svg: '<svg width="50" height="50" viewBox="0 0 100 100"><polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="currentColor"/></svg>',
  },
  {
    id: "diamond",
    svg: '<svg width_50" height="50" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="currentColor"/></svg>',
  },
];

const connectDotsGridSize = 4;
const baseConnectDotsPairs = [
  { id: 1, color: "red" },
  { id: 2, color: "green" },
  { id: 3, color: "blue" },
  { id: 4, color: "yellow" },
];

const puzzleLetters = "Ludica+".split("");
const puzzlePiecesDef = puzzleLetters.map((l, i) => ({
  id: `l${i + 1}`,
  letter: l,
}));

const gameColorData = [
  { name: "Vermelho", cssVar: "red" },
  { name: "Verde", cssVar: "green" },
  { name: "Azul", cssVar: "blue" },
  { name: "Amarelo", cssVar: "yellow" },
  { name: "Roxo", cssVar: "purple" },
  { name: "Laranja", cssVar: "orange" },
];

const connectNumbersGridSizeX = 2,
  connectNumbersGridSizeY = 3;

// JOGO: ADIVINHE O SOM (e Adivinhe a Palavra)
const soundGameData = {
  animals: [
    { emoji: "🐶", name: "Cachorro", speech: "Cachorro", type: "item_som" },
    { emoji: "🐱", name: "Gato", speech: "Gato", type: "item_som" },
    { emoji: "🐸", name: "Sapo", speech: "Sapo", type: "item_som" },
    { emoji: "🐮", name: "Vaca", speech: "Vaca", type: "item_som" },
    { emoji: "🦆", name: "Pato", speech: "Pato", type: "item_som" },
    { emoji: "🐷", name: "Porco", speech: "Porco", type: "item_som" },
    { emoji: "🐓", name: "Galo", speech: "Galo", type: "item_som" },
    { emoji: "🐑", name: "Ovelha", speech: "Ovelha", type: "item_som" },
    { emoji: "🐦", name: "Pássaro", speech: "Pássaro", type: "item_som" },
    { emoji: "🦁", name: "Leão", speech: "Leão", type: "item_som" },
    { emoji: "🦒", name: "Girafa", speech: "Girafa", type: "item_som" },
    { emoji: "🐴", name: "Cavalo", speech: "Cavalo", type: "item_som" },
    { emoji: "🐔", name: "Galinha", speech: "Galinha", type: "item_som" },
    { emoji: "🦥", name: "Preguiça", speech: "Preguiça", type: "item_som" },
    { emoji: "🐇", name: "Coelho", speech: "Coelho", type: "item_som" },
  ],
  fruits: [
    { emoji: "🍎", name: "Maçã", speech: "Maçã", type: "item_som" },
    { emoji: "🍌", name: "Banana", speech: "Banana", type: "item_som" },
    { emoji: "🍉", name: "Melancia", speech: "Melancia", type: "item_som" },
    { emoji: "🍓", name: "Morango", speech: "Morango", type: "item_som" },
    { emoji: "🍇", name: "Uva", speech: "Uva", type: "item_som" },
    { emoji: "🍍", name: "Abacaxi", speech: "Abacaxi", type: "item_som" },
    { emoji: "🥭", name: "Manga", speech: "Manga", type: "item_som" },
    { emoji: "🍊", name: "Laranja", speech: "Laranja", type: "item_som" },
    { emoji: "🥝", name: "Kiwi", speech: "Kiwi", type: "item_som" },
    { emoji: "🍒", name: "Cereja", speech: "Cereja", type: "item_som" },
    { emoji: "🥥", name: "Coco", speech: "Coco", type: "item_som" },
  ],
  diversos: [
    { emoji: "🚗", name: "Carro", speech: "Carro", type: "item_som" },
    { emoji: "✈️", name: "Avião", speech: "Avião", type: "item_som" },
    { emoji: "⚽", name: "Bola", speech: "Bola", type: "item_som" },
    { emoji: "🔔", name: "Sino", speech: "Sino", type: "item_som_simples" },
    { emoji: "💧", name: "Chuva", speech: "Chuva", type: "item_som_simples" },
    { emoji: "🥁", name: "Tambor", speech: "Tambor", type: "item_som_simples" },
    {
      emoji: "📞",
      name: "Telefone",
      speech: "Telefone",
      type: "item_som_simples",
    },
    { emoji: "🔑", name: "Chave", speech: "Chave", type: "item_som_simples" },
    { emoji: "🚪", name: "Porta", speech: "Porta", type: "item_som_simples" },
    {
      emoji: "💦",
      name: "Torneira",
      speech: "Torneira",
      type: "item_som_simples",
    },
    { emoji: "🗺️", name: "Mapa", speech: "Mapa", type: "item_som" },
    { emoji: "🧤", name: "Luva", speech: "Luva", type: "item_som" },
    { emoji: "🏆", name: "Trofeu", speech: "Troféu", type: "item_som" },
    { emoji: "📖", name: "Livro", speech: "Livro", type: "item_som" },
    { emoji: "📦", name: "Caixa", speech: "Caixa", type: "item_som" },
  ],
};

// --- DADOS DE AJUDA ---
const gameHelpData = {
  combine: {
    title: "Combine as Formas",
    text: "No Modo Calmo: Toque na peça e depois no local correto. \nNo Modo Estimulante: Arraste a peça até o local correto.",
  },
  connect: {
    title: "Ligue os Pontos",
    text: "Clique em um círculo colorido e arraste para desenhar uma linha. Solte a linha sobre o círculo da mesma cor para conectar. A posição dos pontos muda a cada rodada completa!",
  },
  numbers: {
    title: "Ligue os Números",
    text: "Clique em um número na coluna da esquerda e arraste para o número igual na coluna da direita. O jogo é infinito!",
  },
  puzzle: {
    title: "Quebra-Cabeça",
    text: "No Modo Calmo: Toque na letra e depois no local correto. \nNo Modo Estimulante: Arraste a letra até o local correto. A peça encaixa apenas no local com a mesma letra!",
  },
  emotion: {
    title: "Adivinhe a Emoção",
    text: "Olhe para o emoji no centro da tela. Clique no botão que diz o nome correto da emoção que você vê. Este jogo é infinito!",
  },
  color: {
    title: "Adivinhe a Cor",
    text: "Olhe o bloco colorido. Clique no botão que diz o nome correto da cor. Este jogo é infinito!",
  },
  sound: {
    title: "Adivinhe o Som",
    text: "O jogo Adivinhe o Som é uma jornada linear. O aplicativo irá REPRODUZIR o nome de um item e você deve selecionar a opção correspondente. Toque no emoji grande para ouvir novamente.",
  },
  sequence: {
    title: "Sequência de Cores",
    text: "Olhe o gabarito (GOAL) no topo. Arraste as peças coloridas de baixo para os slots no meio, copiando a sequência. O encaixe é libre, apenas a cor importa.",
  },
  "guess-word": {
    title: "Adivinhe a Palavra",
    text: "Toque no emoji/símbolo para ouvir o nome do item. Toque nas letras no grid para preencher a palavra. O jogo é infinito!",
  },
};

// --- DADOS DE COMUNICAÇÃO E ARMAZENAMENTO ---
const COMM_STATS_STORAGE_KEY = "neuro_comm_stats_v1";
const USER_USAGE_STORAGE_KEY = "neuro_user_usage_v1";

// Estado de uso (SADU)
let userUsageState = {
  emojisUsados: [],
  palavrasUsadas: [],
  frutasUsadas: [],
  intervencoesRecomendadas: [],
  historico: [],
};

const mockCommHistory = [
  {
    data: new Date(Date.now() - 86400000 * 6).toISOString(),
    tipo: "emoji",
    valor: "😄",
  }, // 6 dias atrás
  {
    data: new Date(Date.now() - 86400000 * 5).toISOString(),
    tipo: "palavra",
    valor: "Feliz",
  }, // 5 dias atrás
  {
    data: new Date(Date.now() - 86400000 * 5).toISOString(),
    tipo: "emoji",
    valor: "👍",
  },
  {
    data: new Date(Date.now() - 86400000 * 4).toISOString(),
    tipo: "palavra",
    valor: "Triste",
  }, // 4 dias atrás
  {
    data: new Date(Date.now() - 86400000 * 4).toISOString(),
    tipo: "emoji",
    valor: "😢",
  },
  {
    data: new Date(Date.now() - 86400000 * 3).toISOString(),
    tipo: "palavra",
    valor: "Brincar",
  }, // 3 dias atrás
  {
    data: new Date(Date.now() - 86400000 * 3).toISOString(),
    tipo: "emoji",
    valor: "🧩",
  },
  {
    data: new Date(Date.now() - 86400000 * 2).toISOString(),
    tipo: "palavra",
    valor: "Maçã",
  }, // 2 dias atrás
  {
    data: new Date(Date.now() - 86400000 * 2).toISOString(),
    tipo: "fruta",
    valor: "Maçã",
  },
  {
    data: new Date(Date.now() - 86400000 * 1).toISOString(),
    tipo: "palavra",
    valor: "Raiva",
  }, // Ontem
  {
    data: new Date(Date.now() - 86400000 * 1).toISOString(),
    tipo: "emoji",
    valor: "😠",
  },
  { data: new Date().toISOString(), tipo: "palavra", valor: "Feliz" }, // Hoje
  { data: new Date().toISOString(), tipo: "emoji", valor: "😊" },
  { data: new Date().toISOString(), tipo: "palavra", valor: "Brincar" },
  { data: new Date().toISOString(), tipo: "palavra", valor: "Ajuda" },
  { data: new Date().toISOString(), tipo: "sentimento", valor: "Alegre" },
  { data: new Date().toISOString(), tipo: "sentimento", valor: "Raiva" },
];

let commStats = {
  totalInteractions: 0,
  apathyCount: 0,
  usedEmojis: {},
  usedWords: {},
  apathyList: [
    "Tristeza",
    "Raiva",
    "Medo",
    "Insegurança",
    "Vergonha",
    "Cansaço",
    "Tédio",
  ],
};

// =============================================
// PARTE 3: FUNÇÕES DE UTILIDADE GERAL (COM CONTROLE DE ÁUDIO)
// =============================================

/** Embaralha um array no local (in-place) */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/** NOVO: Para todos os sons (Voz e MP3) imediatamente */
function stopAllAudio() {
  // 1. Para a Síntese de Voz (Web Speech API)
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // 2. Para os arquivos HTML Audio (MP3/WAV)
  const audioIds = ["achievement-sound", "correct-guess-sound"];
  audioIds.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reinicia para o começo
    }
  });
}

/** Usa a síntese de voz do navegador para falar um texto */
function speakText(text) {
  if ("speechSynthesis" in window) {
    try {
      stopAllAudio(); // CRÍTICO: Sempre para o som anterior antes de começar um novo
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.error("Erro ao tentar falar:", e);
    }
  } else {
    console.warn(`SpeechSynthesis não suportado. Fallback: "${text}"`);
  }
}

/** Mostra o modal de ajuda com base no tipo de jogo */
function showHelpModal(gameType) {
  stopAllAudio(); // Garante que para o áudio do jogo (emoji) antes de abrir o modal

  const data = gameHelpData[gameType];
  if (!data) return;

  const modal = document.getElementById("game-help-overlay");
  const listenBtn = document.getElementById("help-modal-listen-btn");

  document.getElementById("help-modal-title").textContent = data.title;
  document.getElementById("help-modal-text").textContent = data.text;
  modal.classList.remove("hidden");

  const textToSpeak = data.text;

  // Remove listeners antigos antes de adicionar um novo para evitar duplicação
  const newBtn = listenBtn.cloneNode(true);
  listenBtn.parentNode.replaceChild(newBtn, listenBtn);

  // Configura o novo listener para o botão de Ouvir
  newBtn.addEventListener("click", () => {
    if (typeof speakText === "function") {
      speakText(textToSpeak); // speakText internamente chama stopAllAudio()
    }
  });
}

/** Esconde o modal de ajuda */
function hideHelpModal() {
  stopAllAudio(); // CRÍTICO: Para o som ao fechar o modal
  if (document.getElementById("game-help-overlay")) {
    document.getElementById("game-help-overlay").classList.add("hidden");
  }
}

/** Vibração sutil para feedback em jogos infinitos (modo estimulante) */
function triggerInfiniteGameFeedback() {
  if (
    document
      .getElementById("app-shell")
      .classList.contains("theme-stimulant") &&
    navigator.vibrate
  ) {
    navigator.vibrate(50);
  }
}

/** Mostra o feedback "PERFEITO!" na tela (para múltiplos de 5) */
function showPerfectFeedback(score) {
  if (score % 5 !== 0 || isFeedbackPerfect) return;
  isFeedbackPerfect = true;

  // --- ALTERAÇÃO: Áudio movido para cá ---
  // Só toca se estiver no modo estimulante para manter consistência
  const isStimulant = document
    .getElementById("app-shell")
    .classList.contains("theme-stimulant");
  if (isStimulant) {
    const audio = document.getElementById("achievement-sound");
    if (audio) {
      audio.src = "src/assets/sounds/perfect.mp3"; // Caminho solicitado
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Áudio bloqueado ou erro:", e));
    }
  }
  // ---------------------------------------

  showOverlayMessage("PERFEITO!", 1050);
  setTimeout(() => {
    isFeedbackPerfect = false;
  }, 1050);
}

/** NOVO: Mostra qualquer mensagem no estilo Overlay Grande */
function showOverlayMessage(text, duration = 2000) {
  // Remove anterior se existir para não sobrepor
  const existing = document.getElementById("custom-overlay-msg");
  if (existing) existing.remove();

  const feedbackEl = document.createElement("div");
  feedbackEl.id = "custom-overlay-msg";
  feedbackEl.textContent = text;

  // Estilo CSS injetado via JS para garantir o visual "Overlay"
  feedbackEl.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.5);
        font-size: 2rem; 
        font-weight: bold;
        color: var(--accent-primary-stimulant);
        text-align: center;
        width: 90%;
        opacity: 1;
        transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0,0,0,0.2);
        z-index: 600;
        pointer-events: none;
        line-height: 1.2;
    `;

  const appContainer = document.querySelector(".app-container");
  if (appContainer) {
    appContainer.appendChild(feedbackEl);
  } else {
    document.body.appendChild(feedbackEl);
  }

  setTimeout(() => {
    feedbackEl.style.transform = "translate(-50%, -50%) scale(0.8)";
    feedbackEl.style.opacity = "0";
  }, duration - 500);

  setTimeout(() => {
    if (feedbackEl.parentNode) feedbackEl.remove();
  }, duration);
}

/** Dispara uma explosão de estrelas (confetes) em um ponto (x, y) */
function triggerStarBurst(x, y) {
  const isStimulant = document
    .getElementById("app-shell")
    .classList.contains("theme-stimulant");

  if (!isStimulant) return;

  if (isStimulant && navigator.vibrate) navigator.vibrate([100, 30, 100]);

  const container = document.getElementById("confetti-container");
  const appRect = document.getElementById("app-shell").getBoundingClientRect();
  if (!container || !appRect) return;

  const relativeX = x ? x - appRect.left : appRect.width / 2;
  const relativeY = y ? y - appRect.top : appRect.height / 2;

  const starCount = 20;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star-particle";

    // --- LÓGICA DE SELEÇÃO DE COR ALEATÓRIA CORRIGIDA ---
    const colorVar = `--game-${
      allGameColors[Math.floor(Math.random() * allGameColors.length)]
    }`;
    // -----------------------------------------------------

    star.style.backgroundColor = `var(${colorVar})`;
    star.style.left = `${relativeX}px`;
    star.style.top = `${relativeY}px`;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    star.style.setProperty("--tx", `${tx}px`);
    star.style.setProperty("--ty", `${ty}px`);
    container.appendChild(star);
    setTimeout(() => {
      star.remove();
    }, 1000);
  }
}

/** Mostra uma mensagem de feedback (certo/errado) em um jogo */
function showGameFeedback(feedbackId, message, isCorrect) {
  const feedbackEl = document.getElementById(feedbackId);
  if (feedbackEl) {
    feedbackEl.textContent = message;
    feedbackEl.className = "game-feedback";
    if (isCorrect) feedbackEl.classList.add("correct");
    else feedbackEl.classList.add("incorrect");

    setTimeout(() => {
      feedbackEl.textContent = "";
      feedbackEl.className = "game-feedback";
    }, 1400);
  }
}

// =============================================
// PARTE 4: FUNÇÕES DE ARMAZENAMENTO (SADU / STATS)
// =============================================

function ensureUnique(list, item) {
  if (!list.includes(item)) list.push(item);
}

window.registerEmoji = emoji => registerUso("emoji", emoji);
window.registerPalavra = texto => registerUso("palavra", texto);
window.registerFruta = fruta => registerUso("fruta", fruta);
window.registerIntervencao = intervencao =>
  registerUso("intervencao", intervencao);

function loadCommStats() {
  try {
    const storedStats = localStorage.getItem(COMM_STATS_STORAGE_KEY);
    if (storedStats) {
      const loaded = JSON.parse(storedStats);
      commStats = { ...commStats, ...loaded };
    }
  } catch (e) {
    console.error("Erro ao carregar estatísticas de comunicação:", e);
  }
}

function saveCommStats() {
  try {
    localStorage.setItem(COMM_STATS_STORAGE_KEY, JSON.stringify(commStats));
  } catch (e) {
    console.error("Erro ao salvar estatísticas de comunicação:", e);
  }
}

function loadUsageState() {
  try {
    const storedState = localStorage.getItem(USER_USAGE_STORAGE_KEY);
    if (storedState) {
      const loaded = JSON.parse(storedState);
      userUsageState = { ...userUsageState, ...loaded };
      userUsageState.emojisUsados = loaded.emojisUsados || [];
      userUsageState.palavrasUsadas = loaded.palavrasUsadas || [];
      userUsageState.frutasUsadas = loaded.frutasUsadas || [];
      userUsageState.intervencoesRecomendadas =
        loaded.intervencoesRecomendadas || [];
      userUsageState.historico = loaded.historico || mockCommHistory; // Injeta mock se não houver
    } else {
      userUsageState.historico = mockCommHistory;
    }
  } catch (e) {
    console.error("Erro ao carregar SADU:", e);
    localStorage.removeItem(USER_USAGE_STORAGE_KEY);
    userUsageState.historico = mockCommHistory;
  }
}

function saveUsageState() {
  try {
    localStorage.setItem(
      USER_USAGE_STORAGE_KEY,
      JSON.stringify(userUsageState)
    );
    document.dispatchEvent(new CustomEvent("userUsageUpdate"));
  } catch (e) {
    console.error("Erro ao salvar SADU:", e);
  }
}

function registerUso(tipo, valor) {
  const date = new Date().toISOString();
  const historicoItem = { data: date, tipo: tipo, valor: valor };

  userUsageState.historico.push(historicoItem);

  // Mantém apenas os últimos 1000 registros para não pesar a memória do celular
  if (userUsageState.historico.length > 1000) userUsageState.historico.shift();

  if (tipo === "emoji") ensureUnique(userUsageState.emojisUsados, valor);
  if (tipo === "palavra") ensureUnique(userUsageState.palavrasUsadas, valor);
  if (tipo === "fruta") ensureUnique(userUsageState.frutasUsadas, valor);
  if (tipo === "intervencao")
    ensureUnique(userUsageState.intervencoesRecomendadas, valor);

  saveUsageState();
}

// =============================================
// PARTE 5 & 6: FUNÇÕES DE ARRASTAR/SOLTAR (DRAG & DROP)
// =============================================

/** Inicializa os listeners de drag/drop e clique para os jogos */
function initializeGameInteractions() {
  const piecesContainer = document.getElementById("shape-pieces");
  const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
  const sequencePiecesContainer = document.getElementById(
    "sequence-piece-container"
  );
  const slotsContainer = document.getElementById("shape-slots");
  const puzzleSlotsContainer = document.getElementById("puzzle-slots");
  const sequenceSlotsContainer = document.getElementById("sequence-slots-grid");

  const allPieceContainers = [
    piecesContainer,
    puzzlePiecesContainer,
    sequencePiecesContainer,
  ];
  const allSlotContainers = [
    slotsContainer,
    puzzleSlotsContainer,
    sequenceSlotsContainer,
  ];

  const handleDragStart = e => {
    let target =
      e.target.closest(".shape-piece") ||
      e.target.closest(".puzzle-piece") ||
      e.target.closest(".sequence-piece");
    if (target && !target.classList.contains("placed")) {
      draggedPiece = target;
      setTimeout(() => {
        if (draggedPiece) draggedPiece.classList.add("dragging");
      }, 0);
      if (
        document
          .getElementById("app-shell")
          .classList.contains("theme-stimulant") &&
        navigator.vibrate
      )
        navigator.vibrate(50);
    }
  };
  const handleDragEnd = e => {
    if (draggedPiece) {
      draggedPiece.classList.remove("dragging");
      draggedPiece = null;
    }
  };
  const handleDragOver = e => {
    e.preventDefault();
  };
  const handleDragEnter = e => {
    let slot =
      e.target.closest(".shape-slot") ||
      e.target.closest(".puzzle-slot") ||
      e.target.closest(".sequence-slot");
    if (
      slot &&
      !slot.classList.contains("matched") &&
      !slot.classList.contains("disabled")
    )
      slot.classList.add("hovered");
  };
  const handleDragLeave = e => {
    let slot =
      e.target.closest(".shape-slot") ||
      e.target.closest(".puzzle-slot") ||
      e.target.closest(".sequence-slot");
    if (slot) slot.classList.remove("hovered");
  };
  const handleDrop = e => {
    e.preventDefault();
    let slot =
      e.target.closest(".shape-slot") ||
      e.target.closest(".puzzle-slot") ||
      e.target.closest(".sequence-slot");
    if (
      slot &&
      draggedPiece &&
      !slot.classList.contains("matched") &&
      !slot.classList.contains("disabled")
    ) {
      slot.classList.remove("hovered");
      checkMatchAndPlace(draggedPiece, slot, e.clientX, e.clientY);
    }
    if (draggedPiece) draggedPiece.classList.remove("dragging");
    draggedPiece = null;
  };

  allPieceContainers.forEach(container => {
    if (container) {
      container.addEventListener("dragstart", handleDragStart);
      container.addEventListener("dragend", handleDragEnd);
    }
  });
  allSlotContainers.forEach(container => {
    if (container) {
      container.addEventListener("dragover", handleDragOver);
      container.addEventListener("dragenter", handleDragEnter);
      container.addEventListener("dragleave", handleDragLeave);
      container.addEventListener("drop", handleDrop);
    }
  });
}

/** Manipula a interação de clique (Modo Calmo) */
function handleClickInteraction(e) {
  const deselect = () => {
    if (selectedPiece) {
      selectedPiece.classList.remove("dragging");
    }
    selectedPiece = null;
  };

  if (!document.getElementById("app-shell").classList.contains("theme-calm")) {
    deselect();
    return;
  }

  const pieceTarget = e.target.closest(
    ".shape-piece, .puzzle-piece, .sequence-piece"
  );
  const slotTarget = e.target.closest(
    ".shape-slot, .puzzle-slot, .sequence-slot"
  );

  if (
    !selectedPiece &&
    pieceTarget &&
    !pieceTarget.classList.contains("placed")
  ) {
    selectedPiece = pieceTarget;
    document
      .querySelectorAll(".shape-piece, .puzzle-piece, .sequence-piece")
      .forEach(p => p.classList.remove("dragging"));
    selectedPiece.classList.add("dragging");
    return;
  }

  if (
    selectedPiece &&
    slotTarget &&
    !slotTarget.classList.contains("matched") &&
    !slotTarget.classList.contains("disabled")
  ) {
    const piece = selectedPiece;
    const slot = slotTarget;

    const slotRect = slot.getBoundingClientRect();
    const x = slotRect.left + slotRect.width / 2;
    const y = slotRect.top + slotRect.height / 2;

    piece.classList.remove("dragging");
    selectedPiece = null;

    checkMatchAndPlace(piece, slot, x, y);
    return;
  }

  deselect();
}

/** Verifica se a peça e o slot correspondem (lógica unificada) */
function checkMatchAndPlace(piece, slot, x, y) {
  if (!piece || !slot) return false;

  const pieceType = piece.dataset.type;
  const slotType = slot.dataset.type;
  const pieceId = piece.dataset.piece;
  const slotId = slot.dataset.piece;

  // Mapeia o tipo da peça para o ID do jogo no Analytics
  let analyticsGameId = "";
  if (pieceType === "shape") analyticsGameId = "combine";
  else if (pieceType === "puzzle") analyticsGameId = "puzzle";
  else if (pieceType === "sequence") analyticsGameId = "sequence";

  let match = false;

  // Lógica de verificação
  if (pieceType === "shape" && slotType === "shape") {
    const pieceColor = piece.dataset.color;
    const slotColor = slot.dataset.color;
    match = pieceId === slotId && pieceColor === slotColor;
  } else if (pieceType === "puzzle" && slotType === "puzzle") {
    const pieceLetter = piece.textContent.trim();
    const slotLetter = slot.textContent.trim();
    match = pieceLetter === slotLetter;
  } else if (pieceType === "sequence" && slotType === "sequence") {
    const goalColor = slot.dataset.goalColor;
    const pieceColor = piece.dataset.color;
    match = goalColor === pieceColor;
    if (slot.querySelector(".sequence-piece:not(.placed)")) {
      match = false;
    }
  }

  if (match) {
    // --- ACERTO ---
    if (analyticsGameId && typeof GameAnalytics !== "undefined") {
      GameAnalytics.record(analyticsGameId, true);
    }

    slot.classList.add("matched");
    piece.classList.add("placed");
    piece.draggable = false;

    if (pieceType === "puzzle") {
      slot.style.backgroundColor = piece.style.backgroundColor;
    } else if (pieceType === "sequence") {
      slot.style.backgroundColor = `var(--game-${piece.dataset.color})`;
      slot.innerHTML = "";
    } else if (pieceType === "shape") {
      slot.querySelector("svg").style.opacity = "1.0";
    }

    piece.remove();
    triggerStarBurst(x, y);

    if (pieceType === "shape") checkGameCompletion();
    else if (pieceType === "puzzle") checkPuzzleCompletion();
    else if (pieceType === "sequence") checkSequenceLevelCompletion();

    return true;
  } else {
    // --- ERRO ---
    if (analyticsGameId && typeof GameAnalytics !== "undefined") {
      GameAnalytics.record(analyticsGameId, false);
    }

    if (
      document
        .getElementById("app-shell")
        .classList.contains("theme-stimulant") &&
      navigator.vibrate
    ) {
      navigator.vibrate(200);
    }

    if (pieceType === "shape")
      showGameFeedback("combine-feedback", "Errado!", false);
    else if (pieceType === "puzzle")
      showGameFeedback("puzzle-feedback", "Errado!", false);
    else if (pieceType === "sequence")
      showGameFeedback("sequence-feedback", "Cor incorreta!", false);
  }
  return false;
}

// =============================================
// --- NOVO: SISTEMA DE RASTREAMENTO CAA (SADU) ---
// =============================================

const COMM_HISTORY_KEY = "neuro_caa_history_v2";
let caaHistory = [];

function loadCaaHistory() {
  try {
    const stored = localStorage.getItem(COMM_HISTORY_KEY);
    caaHistory = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Erro ao carregar histórico CAA", e);
    caaHistory = [];
  }
}

function saveCaaHistory() {
  localStorage.setItem(COMM_HISTORY_KEY, JSON.stringify(caaHistory));
}

/**
 * Registra um evento de comunicação para os relatórios
 * @param {string} itemId - ID único do item (ex: 'fruit_maca')
 * @param {string} label - Nome visível (ex: 'Maçã')
 * @param {string} categoryId - Categoria onde estava (ex: 'frutas_items')
 */
window.registerCaaEvent = function (itemId, label, categoryId) {
  const entry = {
    t: Date.now(), // Data e hora do clique
    id: itemId,
    lbl: label,
    cat: categoryId,
  };

  caaHistory.push(entry);

  // Mantém apenas os últimos 1000 registros para não pesar a memória do celular
  if (caaHistory.length > 1000) caaHistory.shift();

  saveCaaHistory();
};

// Carrega o histórico assim que o arquivo é lido
loadCaaHistory();



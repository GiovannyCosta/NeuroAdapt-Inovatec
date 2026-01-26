// =============================================
// ARQUIVO: src/js/games/combine_shapes/shapeData.js
// DESCRIÇÃO: Dados de Formas, Cores e Jornadas
// =============================================

const SHAPE_COLORS = {
  Preto: "var(--text-primary)",
  Branco: "#B0B0B0", // Cinza claro para contraste no fundo branco
  Vermelho: "var(--game-red)",
  Verde: "var(--game-green)",
  VerdeLima: "var(--game-green)",
  Azul: "var(--game-blue)",
  Amarelo: "var(--game-yellow)",
  Cinza: "var(--fitz-misc)",
  Dourado: "var(--game-yellow)",
  Roxo: "var(--game-purple)",
  Violeta: "var(--game-purple)",
  Laranja: "var(--game-orange)",
  Marrom: "var(--game-orange)",
  Rosa: "var(--fitz-social)",
};

const emojiSVG = emoji =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="75">${emoji}</text></svg>`;

const SHAPE_SVGS = {
  // --- FORMAS GEOMÉTRICAS ---
  CIRCULO:
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>',
  QUADRADO:
    '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="10" fill="currentColor"/></svg>',
  TRIANGULO:
    '<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="currentColor"/></svg>',
  RETANGULO:
    '<svg viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" rx="8" fill="currentColor"/></svg>',
  HEXAGONO:
    '<svg viewBox="0 0 100 100"><polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="currentColor"/></svg>',
  LOSANGO:
    '<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="currentColor"/></svg>',
  ESTRELA:
    '<svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 67,55 78,85 50,65 22,85 33,55 5,35 39,35" fill="currentColor"/></svg>',
  CRUZ: '<svg viewBox="0 0 100 100"><path d="M35,10 L65,10 L65,35 L90,35 L90,65 L65,65 L65,90 L35,90 L35,65 L10,65 L10,35 L35,35 Z" fill="currentColor"/></svg>',
  LINHA:
    '<svg viewBox="0 0 100 100"><rect x="10" y="40" width="80" height="20" rx="5" fill="currentColor"/></svg>',

  // --- FRUTAS ---
  FRUTA_MACA: emojiSVG("🍎"),
  FRUTA_BANANA: emojiSVG("🍌"),
  FRUTA_UVA: emojiSVG("🍇"),
  FRUTA_LARANJA: emojiSVG("🍊"),
  FRUTA_MORANGO: emojiSVG("🍓"),
  FRUTA_MELANCIA: emojiSVG("🍉"),
  FRUTA_ABACAXI: emojiSVG("🍍"),
  FRUTA_PERA: emojiSVG("🍐"),
  FRUTA_CEREJA: emojiSVG("🍒"),
  FRUTA_KIWI: emojiSVG("🥝"),

  // --- FLORESTA SELVAGEM ---
  WILD_JAVALI: emojiSVG("🐗"),
  WILD_ZEBRA: emojiSVG("🦓"),
  WILD_URSO: emojiSVG("🐻"),
  WILD_COALA: emojiSVG("🐨"),
  WILD_URSO_POLAR: emojiSVG("🐻‍❄️"),
  WILD_MACACO: emojiSVG("🐒"),
  WILD_LEOPARDO: emojiSVG("🐆"),
  WILD_TIGRE: emojiSVG("🐅"),
  WILD_GORILA: emojiSVG("🦍"),
  WILD_HIPOPOTAMO: emojiSVG("🦛"),
  WILD_RINOCERONTE: emojiSVG("🦏"),
  WILD_OURICO: emojiSVG("🦔"),
  WILD_PREGUICA: emojiSVG("🦥"),
  WILD_CANGURU: emojiSVG("🦘"),
  WILD_ELEFANTE: emojiSVG("🐘"),
  WILD_LEAO: emojiSVG("🦁"),
  WILD_RAPOSA: emojiSVG("🦊"),
  WILD_GIRAFA: emojiSVG("🦒"),

  // --- FAZENDA FELIZ ---
  FARM_CACHORRO: emojiSVG("🐶"),
  FARM_VACA: emojiSVG("🐮"),
  FARM_PORCO: emojiSVG("🐷"),
  FARM_SAPO: emojiSVG("🐸"),
  FARM_GALINHA: emojiSVG("🐔"),
  FARM_CAO_PASTOR: emojiSVG("🐕"),
  FARM_GATO: emojiSVG("🐈"),
  FARM_LEITAO: emojiSVG("🐖"),
  FARM_ESQUILO: emojiSVG("🐿️"),
  FARM_COELHO: emojiSVG("🐇"),
  FARM_PATO: emojiSVG("🦆"),
  FARM_PERU: emojiSVG("🦃"),
  FARM_PINTINHO: emojiSVG("🐤"),
  FARM_OVELHA: emojiSVG("🐑"),
  FARM_CAVALO: emojiSVG("🐴"),

  // --- MUNDO AQUÁTICO ---
  AQUA_TUBARAO: emojiSVG("🦈"),
  AQUA_GOLFINHO: emojiSVG("🐬"),
  AQUA_FOCA: emojiSVG("🦭"),
  AQUA_BALEIA: emojiSVG("🐳"),
  AQUA_ORCA: emojiSVG("🐋"),
  AQUA_PEIXE: emojiSVG("🐟"),
  AQUA_PEIXE_TROPICAL: emojiSVG("🐠"),
  AQUA_CAMARAO: emojiSVG("🦐"),
  AQUA_LULA: emojiSVG("🦑"),
  AQUA_POLVO: emojiSVG("🐙"),
  AQUA_CARANGUEJO: emojiSVG("🦀"),
  AQUA_CORAL: emojiSVG("🪸"),
  AQUA_AGUA_VIVA: emojiSVG("🪼"),
};

function generateProgressiveLevels(poolShapes, poolColors) {
  const levels = [];
  for (let i = 1; i <= 5; i++) {
    const typeCount = Math.min(i + 2, 6);
    const startIndex = (i - 1) * 2;

    const levelShapes = [];
    const levelColors = [];

    for (let k = 0; k < typeCount; k++) {
      const shapeIdx = (startIndex + k) % poolShapes.length;
      const colorIdx = (startIndex + k) % poolColors.length;
      levelShapes.push(poolShapes[shapeIdx]);
      levelColors.push(poolColors[colorIdx]);
    }

    levels.push({
      id: `phase_${i}`,
      name: `Fase ${i}`,
      typeCount: typeCount,
      availableShapes: levelShapes,
      availableColors: levelColors,
    });
  }
  return levels;
}

const ShapeJourneyData = [
  {
    id: "j1_basic",
    title: "Formas Básicas",
    icon: "🟥",
    theme: "normal",
    levels: generateProgressiveLevels(
      ["CIRCULO", "QUADRADO", "TRIANGULO", "RETANGULO", "LOSANGO", "HEXAGONO"],
      ["Vermelho", "Azul", "Amarelo", "Verde", "Laranja", "Roxo"]
    ),
  },
  {
    id: "j_wild",
    title: "Safari Selvagem",
    icon: "🦁",
    theme: "normal",
    levels: generateProgressiveLevels(
      [
        "WILD_JAVALI",
        "WILD_ZEBRA",
        "WILD_URSO",
        "WILD_COALA",
        "WILD_URSO_POLAR",
        "WILD_MACACO",
        "WILD_LEOPARDO",
        "WILD_TIGRE",
        "WILD_GORILA",
        "WILD_HIPOPOTAMO",
        "WILD_RINOCERONTE",
        "WILD_OURICO",
        "WILD_PREGUICA",
        "WILD_CANGURU",
        "WILD_ELEFANTE",
        "WILD_LEAO",
        "WILD_RAPOSA",
      ],
      [
        "Laranja",
        "Cinza",
        "Amarelo",
        "Preto",
        "Marrom",
        "Vermelho",
        "Verde",
        "Azul",
        "Roxo",
        "Dourado",
        "Marrom",
        "Cinza",
        "Branco",
        "Laranja",
        "Azul",
        "Amarelo",
        "Vermelho",
      ]
    ),
  },
  {
    id: "j_farm",
    title: "Fazenda Feliz",
    icon: "🚜",
    theme: "normal",
    levels: generateProgressiveLevels(
      [
        "FARM_VACA",
        "FARM_PORCO",
        "FARM_GALINHA",
        "FARM_OVELHA",
        "FARM_CAVALO",
        "FARM_PATO",
        "FARM_CACHORRO",
        "FARM_GATO",
        "FARM_SAPO",
        "FARM_LEITAO",
        "FARM_ESQUILO",
        "FARM_COELHO",
        "FARM_PERU",
      ],
      [
        "Branco",
        "Rosa",
        "Vermelho",
        "Branco",
        "Marrom",
        "Verde",
        "Amarelo",
        "Laranja",
        "Cinza",
      ]
    ),
  },
  {
    id: "j_aquatic",
    title: "Fundo do Mar",
    icon: "🐬",
    theme: "normal",
    levels: generateProgressiveLevels(
      [
        "AQUA_PEIXE",
        "AQUA_GOLFINHO",
        "AQUA_POLVO",
        "AQUA_BALEIA",
        "AQUA_CARANGUEJO",
        "AQUA_TUBARAO",
        "AQUA_FOCA",
        "AQUA_ORCA",
        "AQUA_PEIXE_TROPICAL",
        "AQUA_CAMARAO",
        "AQUA_LULA",
        "AQUA_CORAL",
        "AQUA_AGUA_VIVA",
      ],
      [
        "Azul",
        "VerdeLima",
        "Roxo",
        "Azul",
        "Vermelho",
        "Cinza",
        "Laranja",
        "Amarelo",
        "Rosa",
      ]
    ),
  },
  {
    id: "j_fruits",
    title: "Salada Mista",
    icon: "🥗",
    theme: "normal",
    levels: generateProgressiveLevels(
      [
        "FRUTA_MACA",
        "FRUTA_BANANA",
        "FRUTA_UVA",
        "FRUTA_LARANJA",
        "FRUTA_MORANGO",
        "FRUTA_MELANCIA",
        "FRUTA_ABACAXI",
        "FRUTA_PERA",
        "FRUTA_CEREJA",
        "FRUTA_KIWI",
      ],
      [
        "Vermelho",
        "Amarelo",
        "Roxo",
        "Laranja",
        "Vermelho",
        "Verde",
        "Amarelo",
        "VerdeLima",
        "Vermelho",
        "Marrom",
      ]
    ),
  },
  {
    id: "j2_geo",
    title: "Geometria",
    icon: "🔷",
    theme: "normal",
    levels: generateProgressiveLevels(
      ["HEXAGONO", "LOSANGO", "RETANGULO", "CIRCULO", "QUADRADO", "ESTRELA"],
      ["Verde", "Laranja", "Roxo", "Rosa", "Azul", "Vermelho"]
    ),
  },
  {
    id: "j3_star",
    title: "Estrelas e Sinais",
    icon: "⭐",
    theme: "normal",
    levels: generateProgressiveLevels(
      ["ESTRELA", "CRUZ", "LINHA", "TRIANGULO", "HEXAGONO", "LOSANGO"],
      ["Dourado", "Preto", "Rosa", "Azul", "Verde", "Laranja"]
    ),
  },
  {
    id: "j5_master",
    title: "Mestre das Formas",
    icon: "👑",
    theme: "normal",
    levels: generateProgressiveLevels(Object.keys(SHAPE_SVGS), [
      "Vermelho",
      "Azul",
      "Amarelo",
      "Verde",
      "Laranja",
      "Roxo",
      "Rosa",
      "Marrom",
      "Preto",
      "Cinza",
    ]),
  },
];

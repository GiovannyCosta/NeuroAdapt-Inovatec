// =============================================
// ARQUIVO: src/js/games/guess_emotion/emotionData.js
// DESCRIÇÃO: Níveis estruturados
// =============================================

const EmotionJourneyData = [
  {
    id: "level_1_basic",
    title: "Nível 1: Básicas",
    color: "yellow",
    bgGradient: "from-yellow-100 to-orange-100",
    icon: "🙂",
    items: [
      { id: "emo_feliz", emoji: "😄", name: "Feliz", speech: "Feliz" },
      { id: "emo_triste", emoji: "😢", name: "Triste", speech: "Triste" },
      { id: "emo_bravo", emoji: "😠", name: "Bravo", speech: "Bravo" },
      { id: "emo_cansado", emoji: "😴", name: "Cansado", speech: "Cansado" },
      { id: "emo_medo", emoji: "😨", name: "Com Medo", speech: "Com Medo" },
    ],
  },
  {
    id: "level_2_social",
    title: "Nível 2: Sociais",
    color: "pink",
    bgGradient: "from-pink-100 to-rose-200",
    icon: "🤝",
    items: [
      {
        id: "emo_vergonha",
        emoji: "😳",
        name: "Envergonhado",
        speech: "Envergonhado",
      },
      { id: "emo_confuso", emoji: "🤯", name: "Confuso", speech: "Confuso" },
      { id: "emo_surpreso", emoji: "😮", name: "Surpreso", speech: "Surpreso" },
      { id: "emo_ciumes", emoji: "😒", name: "Ciúmes", speech: "Ciúmes" },
      { id: "emo_amor", emoji: "🥰", name: "Amor", speech: "Amor" },
    ],
  },
  {
    id: "level_3_complex",
    title: "Nível 3: Complexas",
    color: "purple",
    bgGradient: "from-purple-100 to-indigo-200",
    icon: "🧠",
    items: [
      {
        id: "emo_frustrado",
        emoji: "😤",
        name: "Frustrado",
        speech: "Frustrado",
      },
      { id: "emo_ansioso", emoji: "😬", name: "Ansioso", speech: "Ansioso" },
      { id: "emo_inseguro", emoji: "🥺", name: "Inseguro", speech: "Inseguro" },
      {
        id: "emo_confiante",
        emoji: "😎",
        name: "Confiante",
        speech: "Confiante",
      },
      {
        id: "emo_pensativo",
        emoji: "🤔",
        name: "Pensativo",
        speech: "Pensativo",
      },
    ],
  },
  {
    id: "level_4_physical",
    title: "Nível 4: Físicas",
    color: "blue",
    bgGradient: "from-blue-100 to-cyan-200",
    icon: "🌡️",
    items: [
      { id: "emo_calor", emoji: "🥵", name: "Com Calor", speech: "Com Calor" },
      { id: "emo_frio", emoji: "🥶", name: "Com Frio", speech: "Com Frio" },
      { id: "emo_doente", emoji: "🤒", name: "Doente", speech: "Doente" },
      { id: "emo_enjoado", emoji: "🤢", name: "Enjoado", speech: "Enjoado" },
      { id: "emo_dor", emoji: "🤕", name: "Machucado", speech: "Machucado" },
    ],
  },
];

// =============================================
// ARQUIVO: src/js/reports/reportLogic.js
// DESCRIÇÃO: Base de conhecimento com sugestões pedagógicas e científicas.
// =============================================

const ReportLogic = {
  // Retorna o texto específico baseado no Jogo e no Tipo de Insight
  getText: function (gameId, type, metric = null) {
    const gameData = this.games[gameId];
    if (!gameData) return this.defaults[type];

    let text = gameData[type];

    // Substitui placeholders como {metric} pelo valor real (ex: 40%)
    if (metric !== null && text) {
      text = text.replace("{metric}", metric);
    }

    return text || this.defaults[type];
  },

  // Textos Genéricos (Fallback)
  defaults: {
    interest:
      "Este jogo desperta grande interesse. Utilize-o como recompensa após atividades mais desafiadoras.",
    challenge:
      "Observe se há dificuldades sensoriais ou motoras. Tente reduzir a complexidade.",
    low_performance:
      "O erro faz parte do aprendizado. Ofereça mais ajuda física ou modelos visuais antes de deixar a criança tentar sozinha.",
    rec_week: "Continue praticando para consolidar as habilidades adquiridas.",
  },

  // --- ESTA É A PARTE QUE FALTAVA ---
  categoryInsights: {
    sound: {
      good: "Excelente discriminação auditiva! A criança associa bem o som à imagem. Sugestão: Enriqueça o vocabulário com músicas, rimas e histórias faladas.",
      improve:
        "Dificuldade em processar estímulos sonoros. Sugestão: Brinque de 'O que é esse barulho?' com objetos reais (bater palmas, amassar papel) em ambiente silencioso.",
    },
    color: {
      good: "Ótima percepção visual e cromática. Sugestão: Peça para a criança agrupar roupas ou brinquedos por cor no dia a dia.",
      improve:
        "Desafio na discriminação de cores. Sugestão: Comece com pareamento de objetos idênticos (bloco vermelho com bloco vermelho) antes de usar nomes abstratos.",
    },
    symbol: {
      good: "Forte compreensão simbólica (Símbolo = Significado). Sugestão: Introduza letras e números gradualmente, associando-os a quantidades ou sons.",
      improve:
        "Abstração visual ainda em desenvolvimento. Sugestão: Use objetos concretos (uma maçã real) junto com a imagem da tela para fazer a ponte para o simbólico.",
    },
  },
  // ----------------------------------

  // Base de Dados por Jogo
  games: {
    combine: {
      name: "Combine as Formas",
      category: "Lógica",
      interest:
        "O interesse em formas geométricas indica boa percepção visual. Sugestão: Introduza a organização de brinquedos físicos por formato (caixas, bolas).",
      challenge:
        "Dificuldade em generalizar formas. Sugestão: Use objetos reais (pratos, almofadas) para mostrar que a forma existe no mundo físico.",
      low_performance:
        "Muitos erros de pareamento. Sugestão: Reduza o número de opções na tela ou use o Modo Calmo para evitar distrações visuais.",
      rec_week: "Focar na discriminação visual com 'Combine as Formas'.",
    },
    connect: {
      name: "Ligue os Pontos",
      category: "Coordenação",
      interest:
        "Ótimo sinal de desenvolvimento da coordenação visuomotora. Sugestão: Proponha atividades de traçado em papel ou areia.",
      challenge:
        "Dificuldade no planejamento do movimento. Sugestão: Guie a mão da criança fisicamente nas primeiras tentativas (ajuda física total).",
      low_performance:
        "Traços incompletos ou erráticos. Sugestão: Trabalhe o conceito de 'início e fim' em atividades do dia a dia.",
      rec_week: "Treinar o controle motor fino com 'Ligue os Pontos'.",
    },
    numbers: {
      name: "Ligue os Números",
      category: "Lógica",
      interest:
        "Fascínio por símbolos numéricos. Sugestão: Use contagem de degraus ou frutas para associar o símbolo à quantidade real.",
      challenge:
        "Confusão entre símbolos similares. Sugestão: Reforce o desenho do número no ar ou com massinha de modelar.",
      low_performance:
        "Erros de sequência ou associação. Sugestão: Volte para pareamento simples (1 com 1) antes de sequências maiores.",
      rec_week: "Reforçar a associação numérica com 'Ligue os Números'.",
    },
    puzzle: {
      name: "Quebra-Cabeça",
      category: "Lógica",
      interest:
        "Habilidade de ver o 'todo' (Gestalt). Sugestão: Aumente o desafio com quebra-cabeças físicos de mais peças.",
      challenge:
        "Foco excessivo em detalhes (hiperfoco local). Sugestão: Mostre a imagem completa antes de começar e nomeie a figura.",
      low_performance:
        "Dificuldade de encaixe. Sugestão: Use o Modo Estimulante para que o feedback visual ajude a entender quando a peça está no lugar certo.",
      rec_week: "Estimular o fechamento visual com 'Quebra-Cabeça'.",
    },
    sequence: {
      name: "Sequência de Cores",
      category: "Memória",
      interest:
        "Excelente memória de trabalho visual. Sugestão: Introduza sequências de rotina (ex: Primeiro sapato, depois amarrar).",
      challenge:
        "Sobrecarga cognitiva. Sugestão: Comece solicitando sequências de apenas 2 cores verbalmente.",
      low_performance:
        "Erros na ordem. Sugestão: Use apoio verbal ('Vermelho, depois Azul') enquanto a criança joga.",
      rec_week: "Exercitar a memória sequencial com 'Sequência de Cores'.",
    },
    emotion: {
      name: "Adivinhe a Emoção",
      category: "Social",
      interest:
        "Interesse em rostos é um excelente sinal social. Sugestão: Brinque de imitar caretas no espelho.",
      challenge:
        "Dificuldade em ler expressões (Teoria da Mente). Sugestão: Use a aba 'O que sinto?' para explorar cada emoção sem pressão de acerto/erro.",
      low_performance:
        "Confusão entre emoções similares (ex: Medo/Surpresa). Sugestão: Foque primeiro nas emoções básicas (Feliz/Triste) antes das complexas.",
      rec_week: "Trabalhar o reconhecimento afetivo com 'Adivinhe a Emoção'.",
    },
    color: {
      name: "Adivinhe a Cor",
      category: "Percepção",
      interest:
        "Boa discriminação cromática. Sugestão: Peça para a criança separar as roupas por cor na hora de lavar.",
      challenge:
        "Dificuldade em nomear. Sugestão: A criança pode saber parear mas não saber o nome (rótulo). Fale o nome da cor enfaticamente.",
      low_performance:
        "Erros de seleção. Sugestão: Verifique se não há daltonismo ou se a tela está com brilho adequado.",
      rec_week: "Reforçar o vocabulário de cores com 'Adivinhe a Cor'.",
    },
    sound: {
      name: "Adivinhe o Som",
      category: "Auditivo",
      interest:
        "Alta sensibilidade auditiva positiva. Sugestão: Utilize músicas e rimas para expansão de vocabulário.",
      challenge:
        "Hipersensibilidade ou falta de atenção auditiva. Sugestão: Reduza o volume e jogue em ambiente silencioso.",
      low_performance:
        "Não associação som-imagem. Sugestão: Mostre o objeto real (ou foto) enquanto toca o som do jogo.",
      rec_week: "Estimular a discriminação auditiva com 'Adivinhe o Som'.",
    },
    "guess-word": {
      name: "Adivinhe a Palavra",
      category: "Linguagem",
      interest:
        "Hiperlexia ou interesse por letras. Sugestão: Espalhe rótulos com nomes nos objetos da casa (Cadeira, Mesa).",
      challenge:
        "Abstração da escrita. Sugestão: Jogue junto, pronunciando o som de cada letra (fônico) e não apenas o nome da letra.",
      low_performance:
        "Muitos erros de ortografia. Sugestão: Focar nas vogais iniciais e finais antes de tentar a palavra toda.",
      rec_week: "Introduzir a literacia com 'Adivinhe a Palavra'.",
    },
  },
};


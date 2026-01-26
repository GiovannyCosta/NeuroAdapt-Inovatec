// =============================================
// ARQUIVO: src/js/games/gameGuessWord.js
// DESCRIÇÃO: Lógica do Jogo Adivinhe a Palavra
// =============================================

/** Inicializa o jogo Adivinhe a Palavra (mostra categorias) */
function initializeGuessWordGame() {
  registerPlayed(9);
  const selector = document.getElementById("word-category-selector");
  const content = document.getElementById("word-game-content");
  if (selector && content) {
    selector.classList.remove("hidden");
    content.classList.add("hidden");
  }

  // Listener para repetir o som ao clicar no emoji
  const displayEmoji = document.getElementById("word-display-emoji");
  if (displayEmoji) {
    // Remove listeners antigos clonando o elemento (evita sons duplicados)
    const newDisplay = displayEmoji.cloneNode(true);
    displayEmoji.parentNode.replaceChild(newDisplay, displayEmoji);

    newDisplay.addEventListener("click", () => {
      if (correctWordData && typeof speakText === "function") {
        speakText(correctWordData.name);
      }
    });
  }

  document
    .getElementById("word-letter-options")
    ?.addEventListener("click", handleWordGuess);

  if (!currentWordCategory) {
    wordGameScore = 0;
  }
}

function loadWordCategory(category) {
  currentWordCategory = category;
  wordGameScore = 0; // Reseta a pontuação ao trocar de categoria
  document.getElementById(
    "word-game-title"
  ).textContent = `Adivinhe a Palavra (${category.toUpperCase()})`;
  document.getElementById("word-category-selector")?.classList.add("hidden");
  document.getElementById("word-game-content")?.classList.remove("hidden");
  resetGuessWordGame(true);
}

function resetGuessWordGame(isInitialSetup = false) {
  if (isInitialSetup) {
    wordGameScore = 0;
    consecutiveWordCorrects = 0; // Reseta a contagem consecutiva
  }
  document.getElementById(
    "word-score"
  ).textContent = `Pontuação: ${wordGameScore}`;
  wordGameActive = true;
  guessedLetters = [];
  displayNextWordRound();
}

function displayNextWordRound() {
  const displayEmoji = document.getElementById("word-display-emoji");
  const slotsContainer = document.getElementById("word-slots-container");
  const letterOptions = document.getElementById("word-letter-options");
  const feedback = document.getElementById("word-guess-feedback");

  if (
    !displayEmoji ||
    !slotsContainer ||
    !letterOptions ||
    !feedback ||
    !currentWordCategory
  )
    return;

  feedback.textContent = "";
  feedback.className = "game-feedback";
  letterOptions.innerHTML = "";
  slotsContainer.innerHTML = "";
  guessedLetters = [];

  // Seleciona palavra aleatória da categoria
  let allItems = [...soundGameData[currentWordCategory]];
  if (typeof shuffleArray === "function") shuffleArray(allItems);

  correctWordData = allItems[0];

  // Remove espaços e converte para maiúsculas
  const word = correctWordData.name.toUpperCase().replace(/\s/g, "");

  displayEmoji.textContent = correctWordData.emoji;

  // Fala o nome do item ao iniciar a rodada
  if (typeof speakText === "function") speakText(correctWordData.name);

  const uniqueLetters = [...new Set(word.split(""))];
  let letterGrid = [...uniqueLetters];

  // Adiciona letras aleatórias até o total de 12 (ou mais se a palavra for longa)
  const targetSize = Math.max(12, uniqueLetters.length + 4);

  let availableLetters = alphabet.filter(l => !uniqueLetters.includes(l));
  if (typeof shuffleArray === "function") shuffleArray(availableLetters);

  let randomLetters = availableLetters.slice(
    0,
    targetSize - uniqueLetters.length
  );
  letterGrid.push(...randomLetters);

  if (typeof shuffleArray === "function") shuffleArray(letterGrid);

  // Renderiza os slots da palavra (tracinhos)
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement("div");
    slot.className = "word-letter-slot";
    slot.textContent = "_";
    slot.dataset.letter = word[i]; // Guarda a letra correta no slot
    slotsContainer.appendChild(slot);
  }

  // Renderiza o grid de botões de letras
  letterGrid.forEach(letter => {
    const button = document.createElement("button");
    button.className = "word-letter-btn";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.dataset.guessed = "false";
    letterOptions.appendChild(button);
  });
  wordGameActive = true;
}

function handleWordGuess(event) {
  const clickedButton = event.target.closest(".word-letter-btn");
  if (
    !wordGameActive ||
    !clickedButton ||
    clickedButton.dataset.guessed === "true"
  ) {
    return;
  }

  // Vibração
  if (
    document
      .getElementById("app-shell")
      .classList.contains("theme-stimulant") &&
    navigator.vibrate
  ) {
    navigator.vibrate(50);
  }

  const letter = clickedButton.dataset.letter;
  const word = correctWordData.name.toUpperCase().replace(/\s/g, "");
  const slots = document.querySelectorAll(
    "#word-slots-container .word-letter-slot"
  );
  const feedback = document.getElementById("word-guess-feedback");

  clickedButton.dataset.guessed = "true";
  clickedButton.classList.remove("correct", "incorrect");
  clickedButton.classList.add("disabled");

  const isHit = word.includes(letter);

  if (typeof GameAnalytics !== "undefined") {
    GameAnalytics.record("guess-word", isHit);
  }

  if (isHit) {
    // === ACERTO DE LETRA ===
    clickedButton.classList.add("correct");
    feedback.textContent = `Boa! Letra ${letter}!`;
    feedback.className = "game-feedback correct";

    if (typeof speakText === "function") speakText(letter); // Fala a letra correta
    guessedLetters.push(letter);

    if (typeof triggerStarBurst === "function") {
      const rect = clickedButton.getBoundingClientRect();
      triggerStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Verifica se a palavra foi completada
    let isWordComplete = true;
    slots.forEach(slot => {
      if (slot.dataset.letter === letter) {
        slot.textContent = letter;
        slot.classList.add("guessed");
      }
      if (slot.textContent === "_") {
        isWordComplete = false;
      }
    });

    // === PALAVRA COMPLETA ===
    if (isWordComplete) {
      wordGameActive = false;
      wordGameScore++;
      document.getElementById(
        "word-score"
      ).textContent = `Pontuação: ${wordGameScore}`;
      feedback.textContent = "Palavra Completa!";
      feedback.className = "game-feedback correct";

      if (typeof registerProgress === "function") registerProgress(18, 1);

      // REMOVIDO: registerWordCompletion(true); -> Causa do erro

      if (
        wordGameScore % 5 === 0 &&
        typeof showPerfectFeedback === "function"
      ) {
        showPerfectFeedback(wordGameScore);
      }

      // Avança para a próxima palavra após 1.5 segundos
      setTimeout(displayNextWordRound, 1500);
    } else {
      if (typeof triggerInfiniteGameFeedback === "function")
        triggerInfiniteGameFeedback();
    }
  } else {
    // === ERRO DE LETRA ===
    clickedButton.classList.add("incorrect");
    feedback.textContent = `Ops! Tente outra letra.`;
    feedback.className = "game-feedback incorrect";

    // REMOVIDO: registerWordCompletion(false); -> Causa do erro

    if (
      document
        .getElementById("app-shell")
        .classList.contains("theme-stimulant") &&
      navigator.vibrate
    ) {
      navigator.vibrate(200);
    }
  }
}

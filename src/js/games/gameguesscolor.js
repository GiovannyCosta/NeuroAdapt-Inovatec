// =============================================
// ARQUIVO: src/js/games/gameGuessColor.js
// DESCRIÇÃO: Lógica do Jogo Adivinhe a Cor
// =============================================

function initializeGuessColorGame() {
  registerPlayed(3);
  const optionsContainer = document.getElementById("color-options");
  if (!optionsContainer) return;
  optionsContainer.addEventListener("click", handleColorGuess);
  resetGuessColorGame(true);
}

/** Reseta o jogo para uma nova rodada (ou inicialização) */
function resetGuessColorGame(isInitialSetup = false) {
  if (isInitialSetup) {
    colorGameScore = 0;
  }
  document.getElementById(
    "color-score"
  ).textContent = `Pontuação: ${colorGameScore}`;
  colorGameActive = true;
  displayNextColorRound();
}

/** Exibe o próximo bloco de cor e as opções */
function displayNextColorRound() {
  const displayBox = document.getElementById("color-display-box");
  const optionsContainer = document.getElementById("color-options");
  const feedback = document.getElementById("color-guess-feedback");

  if (!displayBox || !optionsContainer || !feedback) return;

  feedback.textContent = "";
  feedback.className = "game-feedback";
  optionsContainer.innerHTML = "";

  let allColors = [...gameColorData];
  shuffleArray(allColors);
  correctColor = allColors[0];

  displayBox.style.backgroundColor = `var(--game-${correctColor.cssVar})`;

  let options = [correctColor.name];
  let incorrectOptions = allColors
    .map(c => c.name)
    .filter(name => name !== correctColor.name);
  options.push(incorrectOptions[0]);
  options.push(incorrectOptions[1]);

  shuffleArray(options);

  options.forEach(colorName => {
    const button = document.createElement("button");
    button.className = "game-option-btn";
    button.textContent = colorName;
    button.dataset.colorName = colorName;
    if (colorName === correctColor.name) {
      button.dataset.correct = "true";
    }
    optionsContainer.appendChild(button);
  });

  colorGameActive = true;
}

/** Manipula o clique do usuário em uma opção de cor */
function handleColorGuess(event) {
  if (!colorGameActive || !event.target.matches(".game-option-btn")) return;

  // Vibração leve ao toque
  if (
    document
      .getElementById("app-shell")
      .classList.contains("theme-stimulant") &&
    navigator.vibrate
  ) {
    navigator.vibrate(50);
  }

  colorGameActive = false;
  const clickedButton = event.target;
  const isCorrect = clickedButton.dataset.correct === "true";
  const feedback = document.getElementById("color-guess-feedback");
  const allButtons = document.querySelectorAll(".game-option-btn");
  allButtons.forEach(btn => btn.classList.add("disabled"));

  if (typeof GameAnalytics !== "undefined") {
    GameAnalytics.record("color", isCorrect);
  }

  if (isCorrect) {
    clickedButton.classList.add("correct");
    feedback.textContent = "Correto!";
    feedback.className = "game-feedback correct";
    colorGameScore++;
    document.getElementById(
      "color-score"
    ).textContent = `Pontuação: ${colorGameScore}`;

    registerProgress(12, 1);

    if (colorGameScore % 5 === 0) {
      triggerStarBurst(event.clientX, event.clientY);
      showPerfectFeedback(colorGameScore);
    } else {
      triggerInfiniteGameFeedback();
    }
  } else {
    clickedButton.classList.add("incorrect");
    feedback.textContent = `Errado! A cor era ${correctColor.name}.`;
    feedback.className = "game-feedback incorrect";

    const correctButton = document.querySelector(
      '.game-option-btn[data-correct="true"]'
    );
    if (correctButton) correctButton.classList.add("correct");

    if (
      document
        .getElementById("app-shell")
        .classList.contains("theme-stimulant") &&
      navigator.vibrate
    ) {
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }
  setTimeout(() => {
    displayNextColorRound();
  }, 1500);
}

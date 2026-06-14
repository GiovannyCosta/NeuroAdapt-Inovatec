// =============================================
// ARQUIVO: src/js/games/gameConnectNumbers.js
// DESCRIÇÃO: Lógica do Jogo Conectar Números
// =============================================

function initializeConnectNumbersGame() {
  registerPlayed(6);
  connectNumbersCanvas = document.getElementById("connect-numbers-canvas");
  if (!connectNumbersCanvas) return;
  connectNumbersCtx = connectNumbersCanvas.getContext("2d");

  const containerWidth = connectNumbersCanvas.parentElement.clientWidth;
  const canvasSize = Math.min(containerWidth, 300);

  connectNumbersCanvas.width = canvasSize;
  connectNumbersCanvas.height = canvasSize * 1.5;

  connectNumbersCellSizeX =
    connectNumbersCanvas.width / connectNumbersGridSizeX;
  connectNumbersCellSizeY =
    connectNumbersCanvas.height / connectNumbersGridSizeY;

  connectNumbersCanvas.addEventListener("mousedown", onConnectNumbersMouseDown);
  connectNumbersCanvas.addEventListener("mousemove", onConnectNumbersMouseMove);
  connectNumbersCanvas.addEventListener("mouseup", onConnectNumbersMouseUp);
  connectNumbersCanvas.addEventListener("touchstart", e =>
    onConnectNumbersMouseDown(e.touches[0])
  );
  connectNumbersCanvas.addEventListener("touchmove", e => {
    e.preventDefault();
    onConnectNumbersMouseMove(e.touches[0]);
  });
  connectNumbersCanvas.addEventListener("touchend", onConnectNumbersMouseUp);

  resetConnectNumbersGame(true);
}

function resetConnectNumbersGame(isNewGame = false) {
  if (isNewGame) {
    connectNumbersScore = 0;
  }

  document.getElementById(
    "connect-numbers-score"
  ).textContent = `Pontuação: ${connectNumbersScore}`;

  connectNumbersDots = [];
  connectNumbersLines = [];
  connectNumbersIsDrawing = false;
  connectNumbersCurrentLine = null;

  let allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(allNumbers);
  let roundNumbers = allNumbers.slice(0, 3);

  let leftPositions = [
    { r: 0, c: 0 },
    { r: 1, c: 0 },
    { r: 2, c: 0 },
  ];
  shuffleArray(leftPositions);
  let rightPositions = [
    { r: 0, c: 1 },
    { r: 1, c: 1 },
    { r: 2, c: 1 },
  ];
  shuffleArray(rightPositions);

  let roundPairs = [];
  for (let j = 0; j < 3; j++) {
    roundPairs.push({
      id: j + 1,
      number: roundNumbers[j],
      color: allGameColors[j % allGameColors.length],
      pos: [leftPositions.pop(), rightPositions.pop()],
    });
  }

  const currentRoundPairs = roundPairs;
  currentRoundPairs.forEach(pair => {
    pair.pos.forEach(p => {
      connectNumbersDots.push({
        x: p.c * connectNumbersCellSizeX + connectNumbersCellSizeX / 2,
        y: p.r * connectNumbersCellSizeY + connectNumbersCellSizeY / 2,
        radius: Math.min(connectNumbersCellSizeX, connectNumbersCellSizeY) / 3,
        colorId: pair.color,
        pairId: pair.number,
        number: pair.number,
        isConnected: false,
      });
    });
  });

  drawConnectNumbersGame();
}

function drawConnectNumbersGame() {
  if (!connectNumbersCtx || !connectNumbersCanvas) return;

  connectNumbersCtx.clearRect(
    0,
    0,
    connectNumbersCanvas.width,
    connectNumbersCanvas.height
  );

  const styles = getComputedStyle(document.getElementById("app-shell"));
  const gameColors = {
    red: styles.getPropertyValue("--game-red").trim(),
    green: styles.getPropertyValue("--game-green").trim(),
    blue: styles.getPropertyValue("--game-blue").trim(),
    yellow: styles.getPropertyValue("--game-yellow").trim(),
    purple: styles.getPropertyValue("--game-purple").trim(),
    orange: styles.getPropertyValue("--game-orange").trim(),
  };

  connectNumbersLines.forEach(line => {
    connectNumbersCtx.beginPath();
    connectNumbersCtx.moveTo(line.startX, line.startY);
    connectNumbersCtx.lineTo(line.endX, line.endY);
    connectNumbersCtx.strokeStyle = gameColors[line.colorId];
    connectNumbersCtx.lineWidth = 10;
    connectNumbersCtx.lineCap = "round";
    connectNumbersCtx.stroke();
  });

  if (connectNumbersIsDrawing && connectNumbersCurrentLine) {
    connectNumbersCtx.beginPath();
    connectNumbersCtx.moveTo(
      connectNumbersCurrentLine.startX,
      connectNumbersCurrentLine.startY
    );
    connectNumbersCtx.lineTo(
      connectNumbersCurrentLine.endX,
      connectNumbersCurrentLine.endY
    );
    connectNumbersCtx.strokeStyle =
      gameColors[connectNumbersCurrentLine.colorId];
    connectNumbersCtx.lineWidth = 10;
    connectNumbersCtx.lineCap = "round";
    connectNumbersCtx.stroke();
  }

  connectNumbersDots.forEach(dot => {
    connectNumbersCtx.beginPath();
    connectNumbersCtx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    connectNumbersCtx.fillStyle = gameColors[dot.colorId];
    connectNumbersCtx.fill();
    if (dot.isConnected) {
      connectNumbersCtx.strokeStyle = "#333";
      connectNumbersCtx.lineWidth = 3;
      connectNumbersCtx.stroke();
    }
    connectNumbersCtx.fillStyle = "white";
    connectNumbersCtx.font = `bold ${connectNumbersCellSizeY / 3}px Inter`;
    connectNumbersCtx.textAlign = "center";
    connectNumbersCtx.textBaseline = "middle";
    connectNumbersCtx.fillText(dot.number, dot.x, dot.y);
  });
}

function getConnectNumbersDotAt(x, y) {
  return connectNumbersDots.find(dot => {
    const dx = dot.x - x;
    const dy = dot.y - y;
    return Math.sqrt(dx * dx + dy * dy) < dot.radius;
  });
}

function onConnectNumbersMouseDown(e) {
  const rect = connectNumbersCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const startDot = getConnectNumbersDotAt(x, y);
  if (startDot && !startDot.isConnected) {
    connectNumbersIsDrawing = true;
    connectNumbersCurrentLine = {
      startX: startDot.x,
      startY: startDot.y,
      endX: x,
      endY: y,
      colorId: startDot.colorId,
      pairId: startDot.pairId,
      startDot: startDot,
    };
  }
}

function onConnectNumbersMouseMove(e) {
  if (!connectNumbersIsDrawing || !connectNumbersCurrentLine) return;
  const rect = connectNumbersCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  connectNumbersCurrentLine.endX = x;
  connectNumbersCurrentLine.endY = y;
  drawConnectNumbersGame();
}

function onConnectNumbersMouseUp(e) {
  let cX, cY;
  if (e.changedTouches && e.changedTouches.length > 0) {
    cX = e.changedTouches[0].clientX;
    cY = e.changedTouches[0].clientY;
  } else {
    cX = e.clientX;
    cY = e.clientY;
  }
  if (!connectNumbersIsDrawing) return;
  connectNumbersIsDrawing = false;

  const rect = connectNumbersCanvas.getBoundingClientRect();
  const x = cX - rect.left;
  const y = cY - rect.top;

  const endDot = getConnectNumbersDotAt(x, y);

  if (
    endDot &&
    endDot !== connectNumbersCurrentLine.startDot &&
    endDot.pairId === connectNumbersCurrentLine.pairId &&
    !endDot.isConnected
  ) {
    // --- ACERTO ---
    if (typeof GameAnalytics !== "undefined")
      GameAnalytics.record("numbers", true);

    connectNumbersCurrentLine.endX = endDot.x;
    connectNumbersCurrentLine.endY = endDot.y;
    connectNumbersLines.push(connectNumbersCurrentLine);
    connectNumbersCurrentLine.startDot.isConnected = true;
    endDot.isConnected = true;

    triggerStarBurst(cX, cY);
    checkConnectNumbersCompletion();
  } else if (connectNumbersCurrentLine) {
    // --- ERRO ---
    if (typeof GameAnalytics !== "undefined")
      GameAnalytics.record("numbers", false);

    showGameFeedback("connect-numbers-feedback", "Tente outra vez!", false);
    if (
      document
        .getElementById("app-shell")
        .classList.contains("theme-stimulant") &&
      navigator.vibrate
    ) {
      navigator.vibrate(200);
    }
  }

  connectNumbersCurrentLine = null;
  drawConnectNumbersGame();
}

function checkConnectNumbersCompletion() {
  const allConnected = connectNumbersDots.every(dot => dot.isConnected);
  if (allConnected && connectNumbersDots.length > 0) {
    connectNumbersScore++;
    document.getElementById(
      "connect-numbers-score"
    ).textContent = `Pontuação: ${connectNumbersScore}`;
    showGameFeedback("connect-numbers-feedback", "Correto!", true);
    registerProgress(15, 1);
    if (connectNumbersScore % 5 === 0) showPerfectFeedback(connectNumbersScore);
    setTimeout(() => {
      resetConnectNumbersGame(false);
    }, 1500);
  }
}


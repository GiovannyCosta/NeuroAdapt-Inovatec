// =============================================
// ARQUIVO: src/js/games/gameConnectDots.js
// DESCRIÇÃO: Lógica do Jogo Ligue os Pontos
// =============================================

function initializeConnectDotsGame() {
  registerPlayed(5);
  connectDotsCanvas = document.getElementById("connect-dots-canvas");
  if (!connectDotsCanvas) return;
  connectDotsCtx = connectDotsCanvas.getContext("2d");

  const mainContainer = connectDotsCanvas.parentElement;


  const availableHeight = mainContainer.clientHeight - 240;
  const w = mainContainer.clientWidth - 80;

  connectDotsCanvas.width = w;
  connectDotsCanvas.height = availableHeight;

  connectDotsCellSizeX = connectDotsCanvas.width / connectDotsGridCols; // 2 Colunas
  connectDotsCellSizeY = connectDotsCanvas.height / connectDotsGridRows; // 4 Linhas

  connectDotsCanvas.addEventListener("mousedown", onConnectDotsMouseDown);
  connectDotsCanvas.addEventListener("mousemove", onConnectDotsMouseMove);
  connectDotsCanvas.addEventListener("mouseup", onConnectDotsMouseUp);
  connectDotsCanvas.addEventListener("touchstart", e =>
    onConnectDotsMouseDown(e.touches[0])
  );
  connectDotsCanvas.addEventListener("touchmove", e => {
    e.preventDefault();
    onConnectDotsMouseMove(e.touches[0]);
  });
  connectDotsCanvas.addEventListener("touchend", onConnectDotsMouseUp);

  resetConnectDotsGame(true);
}

function resetConnectDotsGame(isInitialSetup = false) {
  if (isInitialSetup) {
    connectDotsScore = 0;
  }

  document.getElementById(
    "connect-dots-score"
  ).textContent = `Pontuação: ${connectDotsScore}`;

  connectDotsDots = [];
  connectDotsLines = [];
  connectDotsIsDrawing = false;
  connectDotsCurrentLine = null;


  let leftColumnColors = [...baseConnectDotsPairs];
  let rightColumnColors = [...baseConnectDotsPairs];

  // Embaralha cada coluna separadamente
  shuffleArray(leftColumnColors);
  shuffleArray(rightColumnColors);

  // Preenche as 4 linhas
  for (let r = 0; r < connectDotsGridRows; r++) {
    // --- COLUNA ESQUERDA (0) ---
    const pairLeft = leftColumnColors[r];
    connectDotsDots.push({
      x: 0 * connectDotsCellSizeX + connectDotsCellSizeX / 2,
      y: r * connectDotsCellSizeY + connectDotsCellSizeY / 2,
      radius: Math.min(connectDotsCellSizeX, connectDotsCellSizeY) / 4,
      colorId: pairLeft.color,
      pairId: pairLeft.id,
      isConnected: false,
    });

    // --- COLUNA DIREITA (1) ---
    const pairRight = rightColumnColors[r];
    connectDotsDots.push({
      x: 1 * connectDotsCellSizeX + connectDotsCellSizeX / 2,
      y: r * connectDotsCellSizeY + connectDotsCellSizeY / 2,
      radius: Math.min(connectDotsCellSizeX, connectDotsCellSizeY) / 4,
      colorId: pairRight.color,
      pairId: pairRight.id,
      isConnected: false,
    });
  }

  drawConnectDotsGame();
}

function drawConnectDotsGame() {
  if (!connectDotsCtx || !connectDotsCanvas) return;
  connectDotsCtx.clearRect(
    0,
    0,
    connectDotsCanvas.width,
    connectDotsCanvas.height
  );
  const st = getComputedStyle(document.getElementById("app-shell"));
  connectDotsColors = {
    red: st.getPropertyValue("--game-red").trim(),
    green: st.getPropertyValue("--game-green").trim(),
    blue: st.getPropertyValue("--game-blue").trim(),
    yellow: st.getPropertyValue("--game-yellow").trim(),
  };

  // Desenha linhas já conectadas
  connectDotsLines.forEach(l => {
    connectDotsCtx.beginPath();
    connectDotsCtx.moveTo(l.startX, l.startY);
    connectDotsCtx.lineTo(l.endX, l.endY);
    connectDotsCtx.strokeStyle = connectDotsColors[l.colorId];
    connectDotsCtx.lineWidth = 10;
    connectDotsCtx.lineCap = "round";
    connectDotsCtx.stroke();
  });

  // Desenha linha sendo criada (arraste)
  if (connectDotsIsDrawing && connectDotsCurrentLine) {
    connectDotsCtx.beginPath();
    connectDotsCtx.moveTo(
      connectDotsCurrentLine.startX,
      connectDotsCurrentLine.startY
    );
    connectDotsCtx.lineTo(
      connectDotsCurrentLine.endX,
      connectDotsCurrentLine.endY
    );
    connectDotsCtx.strokeStyle =
      connectDotsColors[connectDotsCurrentLine.colorId];
    connectDotsCtx.lineWidth = 10;
    connectDotsCtx.lineCap = "round";
    connectDotsCtx.stroke();
  }

  // Desenha os pontos
  connectDotsDots.forEach(d => {
    connectDotsCtx.beginPath();
    connectDotsCtx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
    connectDotsCtx.fillStyle = connectDotsColors[d.colorId];
    connectDotsCtx.fill();

    // Borda escura se já estiver conectado
    if (d.isConnected) {
      connectDotsCtx.strokeStyle = "#333";
      connectDotsCtx.lineWidth = 3;
      connectDotsCtx.stroke();
    }
  });
}

function getConnectDotsDotAt(x, y) {
  return connectDotsDots.find(d => {
    const dx = d.x - x,
      dy = d.y - y;
    // Área de toque generosa (1.5x o raio)
    return Math.sqrt(dx * dx + dy * dy) < d.radius * 1.5;
  });
}

function onConnectDotsMouseDown(e) {
  const r = connectDotsCanvas.getBoundingClientRect(),
    x = e.clientX - r.left,
    y = e.clientY - r.top;
  const sD = getConnectDotsDotAt(x, y);
  if (sD && !sD.isConnected) {
    connectDotsIsDrawing = true;
    connectDotsCurrentLine = {
      startX: sD.x,
      startY: sD.y,
      endX: x,
      endY: y,
      colorId: sD.colorId,
      pairId: sD.pairId,
      startDot: sD,
    };
  }
}

function onConnectDotsMouseMove(e) {
  if (!connectDotsIsDrawing || !connectDotsCurrentLine) return;
  const r = connectDotsCanvas.getBoundingClientRect(),
    x = e.clientX - r.left,
    y = e.clientY - r.top;
  connectDotsCurrentLine.endX = x;
  connectDotsCurrentLine.endY = y;
  drawConnectDotsGame();
}

function onConnectDotsMouseUp(e) {
  let cX, cY;
  if (e.changedTouches && e.changedTouches.length > 0) {
    cX = e.changedTouches[0].clientX;
    cY = e.changedTouches[0].clientY;
  } else {
    cX = e.clientX;
    cY = e.clientY;
  }
  if (!connectDotsIsDrawing) return;
  connectDotsIsDrawing = false;

  const r = connectDotsCanvas.getBoundingClientRect(),
    x = cX - r.left,
    y = cY - r.top;
  const eD = getConnectDotsDotAt(x, y);

  if (
    eD &&
    eD !== connectDotsCurrentLine.startDot &&
    eD.pairId === connectDotsCurrentLine.pairId &&
    !eD.isConnected
  ) {
    // --- ACERTO ---
    if (typeof GameAnalytics !== "undefined")
      GameAnalytics.record("connect", true);

    connectDotsCurrentLine.endX = eD.x;
    connectDotsCurrentLine.endY = eD.y;
    connectDotsLines.push(connectDotsCurrentLine);
    connectDotsCurrentLine.startDot.isConnected = true;
    eD.isConnected = true;
    const canvasRect = connectDotsCanvas.getBoundingClientRect();
    connectDotsScore++;
    document.getElementById(
      "connect-dots-score"
    ).textContent = `Pontuação: ${connectDotsScore}`;
    triggerStarBurst(canvasRect.left + eD.x, canvasRect.top + eD.y);
    if (connectDotsScore % 5 === 0) showPerfectFeedback(connectDotsScore);
    checkConnectDotsCompletion();
  } else if (connectDotsCurrentLine) {
    // --- ERRO ---
    if (typeof GameAnalytics !== "undefined")
      GameAnalytics.record("connect", false);

    showGameFeedback("connect-dots-feedback", "Tente outra vez!", false);
    if (
      document
        .getElementById("app-shell")
        .classList.contains("theme-stimulant") &&
      navigator.vibrate
    )
      navigator.vibrate(200);
  }

  connectDotsCurrentLine = null;
  drawConnectDotsGame();
}

/** Jogo 2: Verifica se todos os pontos foram conectados */
function checkConnectDotsCompletion() {
  const allConnected = connectDotsDots.every(d => d.isConnected);
  if (allConnected && connectDotsDots.length > 0) {
    showGameFeedback("connect-dots-feedback", "Rodada Completa!", true);
    registerProgress(14, 1);
    setTimeout(() => {
      resetConnectDotsGame(false);
    }, 1500);
  }
}


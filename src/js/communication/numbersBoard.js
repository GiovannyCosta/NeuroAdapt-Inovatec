// =============================================
// ARQUIVO: src/js/communication/numbersBoard.js
// DESCRIÇÃO: Lógica da tela de Números.
// =============================================

const NumbersBoard = {
  data: [
    { icon: "0", speech: "Zero" },
    { icon: "1", speech: "Um" },
    { icon: "2", speech: "Dois" },
    { icon: "3", speech: "Três" },
    { icon: "4", speech: "Quatro" },
    { icon: "5", speech: "Cinco" },
    { icon: "6", speech: "Seis" },
    { icon: "7", speech: "Sete" },
    { icon: "8", speech: "Oito" },
    { icon: "9", speech: "Nove" },
    { icon: "10", speech: "Dez" },
  ],

  init: function () {
    this.render();
  },

  render: function () {
    const grid = document.getElementById("numbers-grid");
    if (!grid) return;
    grid.innerHTML = "";

    this.data.forEach(item => {
      const btn = document.createElement("button");
      btn.className =
        "card flex flex-col items-center justify-center p-4 rounded-2xl shadow-md active:scale-95 transition-transform bg-white border-2 border-transparent hover:border-blue-400";
      btn.style.aspectRatio = "1/1"; // Mantém quadrado para números

      btn.innerHTML = `<span class="text-4xl font-bold accent-text pointer-events-none">${item.icon}</span>`;

      btn.onclick = () => {
        if (typeof speakText === "function") speakText(item.speech);
        btn.style.backgroundColor = "var(--accent-secondary)";
        setTimeout(() => {
          btn.style.backgroundColor = "white";
        }, 200);
      };
      grid.appendChild(btn);
    });
  },
};

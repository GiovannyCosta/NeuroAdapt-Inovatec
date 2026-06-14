// =============================================
// ARQUIVO: src/js/communication/numbersBoard.js
// DESCRIÇÃO: Lógica da tela de Números - Foco em Contagem Visual
// =============================================

const NumbersBoard = {
  data: [
    { icon: "0", speech: "Zero", value: 0 },
    { icon: "1", speech: "Um", value: 1 },
    { icon: "2", speech: "Dois", value: 2 },
    { icon: "3", speech: "Três", value: 3 },
    { icon: "4", speech: "Quatro", value: 4 },
    { icon: "5", speech: "Cinco", value: 5 },
    { icon: "6", speech: "Seis", value: 6 },
    { icon: "7", speech: "Sete", value: 7 },
    { icon: "8", speech: "Oito", value: 8 },
    { icon: "9", speech: "Nove", value: 9 },
    { icon: "10", speech: "Dez", value: 10 },
  ],

  init: function () {
    this.render();
  },

  render: function () {
    const grid = document.getElementById("numbers-grid");
    if (!grid) return;
    grid.innerHTML = "";

    // Ajuste da Grid para preencher melhor o espaço
    grid.className = "grid grid-cols-2 gap-4 w-full pb-32";

    this.data.forEach((item) => {
      const btn = document.createElement("button");
      btn.className =
        "card number-btn flex flex-col items-center justify-center p-6 rounded-[32px] shadow-md active:scale-95 transition-all duration-200 bg-white border-2 border-transparent";

      const dotsHTML = this.generateDotsHTML(item.value);

      btn.innerHTML = `
        <div class="w-full flex flex-col items-center">
          <span class="text-6xl font-black accent-text mb-4">${item.icon}</span>
          <div class="dots-container flex flex-wrap justify-center gap-2 w-full">
            ${dotsHTML}
          </div>
        </div>
      `;

      btn.addEventListener("click", () => {
        this.speakNumberWithExplanation(item);
        this.playClickFeedback(btn);
      });

      grid.appendChild(btn);
    });
  },

  generateDotsHTML: function (count) {
    if (count === 0) return '<div class="text-sm text-gray-300 italic">vazio</div>';
    let dots = "";
    for (let i = 0; i < count; i++) {
      dots += `<span class="dot w-4 h-4 rounded-full bg-blue-400 inline-block"></span>`;
    }
    return dots;
  },

  speakNumberWithExplanation: function (item) {
    let msg =
      item.value === 0
        ? "Zero. Não temos nenhuma bolinha."
        : `${item.speech}. O número ${item.speech} tem ${item.value} bolinhas.`;

    if (typeof speakText === "function") speakText(msg);
  },

  playClickFeedback: function (button) {
    const dots = button.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      setTimeout(() => {
        dot.style.transform = "scale(1.5)";
        dot.style.backgroundColor = "var(--accent-primary)";
        setTimeout(() => {
          dot.style.transform = "scale(1)";
          dot.style.backgroundColor = "#60a5fa";
        }, 300);
      }, i * 50);
    });
  },
};


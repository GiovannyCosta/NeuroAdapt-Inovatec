// =============================================
// ARQUIVO: src/js/communication/alphabetBoard.js
// DESCRIÇÃO: Quadro do Alfabeto interativo
// =============================================

const AlphabetBoard = {
  data: [
    { icon: "A", speech: "A" },
    { icon: "B", speech: "Bê" },
    { icon: "C", speech: "Cê" },
    { icon: "D", speech: "Dê" },
    { icon: "E", speech: "É" },
    { icon: "F", speech: "Éfe" },
    { icon: "G", speech: "Gê" },
    { icon: "H", speech: "Agá" },
    { icon: "I", speech: "I" },
    { icon: "J", speech: "Jota" },
    { icon: "K", speech: "Cá" },
    { icon: "L", speech: "Éle" },
    { icon: "M", speech: "Ême" },
    { icon: "N", speech: "Êne" },
    { icon: "O", speech: "Ó" },
    { icon: "P", speech: "Pê" },
    { icon: "Q", speech: "Quê" },
    { icon: "R", speech: "Érre" },
    { icon: "S", speech: "Ésse" },
    { icon: "T", speech: "Tê" },
    { icon: "U", speech: "U" },
    { icon: "V", speech: "Vê" },
    { icon: "W", speech: "Dáblio" },
    { icon: "X", speech: "Xis" },
    { icon: "Y", speech: "Ípsilon" },
    { icon: "Z", speech: "Zê" },
  ],

  init: function () {
    this.adjustLayout();
    this.render();
  },

  adjustLayout: function () {
    const screen = document.getElementById("alphabet-screen");
    if (!screen) return;

    const main = screen.querySelector("main");
    if (main) {
      // Remove rolagem padrão e paddings antigos
      main.classList.remove(
        "overflow-y-auto",
        "block",
        "pt-6",
        "px-6",
        "pb-28"
      );
      main.classList.add(
        "flex",
        "flex-col",
        "overflow-hidden",
        "h-full",
        "px-2",
        "pt-2",
        "pb-24"
      );
    }
  },

  render: function () {
    const grid = document.getElementById("alphabet-grid");
    if (!grid) return;

    grid.innerHTML = "";

    grid.className = "grid grid-cols-4 gap-2 w-full h-full";
    grid.style.gridTemplateRows = "repeat(7, minmax(0, 1fr))";

    this.data.forEach((item, index) => {
      const btn = document.createElement("button");

      let classes =
        "card flex flex-col items-center justify-center p-1 rounded-xl shadow-sm active:scale-95 transition-transform bg-white border border-transparent w-full h-full";

      if (index >= 24) {
        classes += " col-span-2";
      }

      btn.className = classes;
      btn.innerHTML = `<span class="text-3xl font-bold accent-text pointer-events-none">${item.icon}</span>`;

      btn.onclick = () => {
        if (typeof speakText === "function") speakText(item.speech);
        // Feedback visual de clique
        btn.style.backgroundColor = "var(--accent-secondary)";
        setTimeout(() => {
          btn.style.backgroundColor = "white";
        }, 200);
      };
      grid.appendChild(btn);
    });
  },
};


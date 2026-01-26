const ReportsHub = {
  init: function () {
    // Botões do Menu
    document.querySelectorAll(".report-menu-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.openView(btn.dataset.target);
      });
    });

    // Botões Voltar
    document.querySelectorAll(".back-to-reports-hub").forEach(btn => {
      btn.addEventListener("click", () => {
        this.showHub();
      });
    });
  },

  showHub: function () {
    document.getElementById("reports-games-view").classList.add("hidden");
    document.getElementById("reports-comm-view").classList.add("hidden");
    document.getElementById("reports-hub").classList.remove("hidden");
  },

  openView: function (viewId) {
    document.getElementById("reports-hub").classList.add("hidden");
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove("hidden");
      // Atualiza os dados ao abrir a tela
      if (
        viewId === "reports-games-view" &&
        typeof GamesReports !== "undefined"
      )
        GamesReports.render();
      if (viewId === "reports-comm-view" && typeof CommReports !== "undefined")
        CommReports.render();
    }
  },
};

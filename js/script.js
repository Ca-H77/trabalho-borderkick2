document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  if (menu) menu.addEventListener("click", () => document.querySelector(".topbar").classList.toggle("menu-open"));

  document.querySelectorAll(".demo-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      alert(form.dataset.message || "Demonstração: formulário enviado.");
    });
  });

  document.querySelectorAll("[data-demo-alert]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      alert(link.dataset.demoAlert);
    });
  });

  const search = document.querySelector("#search-torcedor");
  const filter = document.querySelector("#status-filter");
  const rows = [...document.querySelectorAll("#torcedores-table tbody tr")];
  function filterRows() {
    const term = (search?.value || "").toLocaleLowerCase("pt-BR");
    const status = filter?.value || "";
    rows.forEach(row => {
      const matchesTerm = row.innerText.toLocaleLowerCase("pt-BR").includes(term);
      const matchesStatus = !status || row.cells[4].innerText.trim() === status;
      row.hidden = !(matchesTerm && matchesStatus);
    });
  }
  search?.addEventListener("input", filterRows);
  filter?.addEventListener("change", filterRows);

  document.querySelectorAll(".table-action").forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const current = row.cells[3].innerText.trim();
      const options = ["Aprovado", "Pendente", "Reprovado"];
      const selected = prompt(`Status do visto americano para ${button.dataset.person}:\nDigite: Aprovado, Pendente ou Reprovado`, current);
      if (!selected) return;
      const normalized = options.find(option => option.toLowerCase() === selected.trim().toLowerCase());
      if (!normalized) {
        alert("Status inválido. Use Aprovado, Pendente ou Reprovado.");
        return;
      }
      row.cells[3].innerHTML = `<span class="status ${normalized === "Aprovado" ? "approved" : normalized === "Pendente" ? "pending" : "rejected"}">${normalized}</span>`;
      const packageText = row.cells[2].innerText;
      const needsUSVisa = /EUA|Estados Unidos/i.test(packageText);
      row.cells[4].innerHTML = needsUSVisa && normalized !== "Aprovado"
        ? '<span class="status blocked">Bloqueado</span>'
        : '<span class="status approved">Aprovado</span>';
      alert(`Status atualizado apenas nesta demonstração. ${needsUSVisa && normalized !== "Aprovado" ? "Pacotes que incluem os EUA devem ficar bloqueados." : "Revise os documentos antes de emitir o voucher."}`);
    });
  });
});
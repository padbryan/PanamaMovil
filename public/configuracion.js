function toggleMenuConfiguracion() {
  const menu = document.getElementById("menuConfiguracion");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function cambiarTema() {
  const body = document.body;
  const esClaro = document.getElementById("toggleTema").checked;

  if (esClaro) {
    body.classList.remove("tema-oscuro");
    body.classList.add("tema-claro");
  } else {
    body.classList.remove("tema-claro");
    body.classList.add("tema-oscuro");
  }
}

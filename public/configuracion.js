document.addEventListener("DOMContentLoaded", () => {
  // Cargar configuración guardada
  const tema = localStorage.getItem("tema");
  const fuente = localStorage.getItem("fuente");
  const compacto = localStorage.getItem("compacto");

  if (tema === "claro") {
    document.body.classList.add("tema-claro");
    document.getElementById("toggleTema").checked = true;
  } else {
    document.body.classList.add("tema-oscuro");
  }

  if (fuente === "grande") {
    document.body.style.fontSize = "18px";
    document.getElementById("fuenteSelector").value = "grande";
  }

  if (compacto === "true") {
    document.body.classList.add("modo-compacto");
    document.getElementById("modoCompacto").checked = true;
  }

  // Listeners
  document.getElementById("toggleTema").addEventListener("change", cambiarTema);
  document.getElementById("fuenteSelector").addEventListener("change", cambiarFuente);
  document.getElementById("modoCompacto").addEventListener("change", cambiarModoCompacto);
});

function toggleMenuConfiguracion() {
  const menu = document.getElementById("menuConfiguracion");
  menu.classList.toggle("activo");
}

function cambiarTema() {
  const esClaro = document.getElementById("toggleTema").checked;
  document.body.classList.toggle("tema-claro", esClaro);
  document.body.classList.toggle("tema-oscuro", !esClaro);
  localStorage.setItem("tema", esClaro ? "claro" : "oscuro");
}

function cambiarFuente() {
  const valor = document.getElementById("fuenteSelector").value;
  document.body.style.fontSize = valor === "grande" ? "18px" : "14px";
  localStorage.setItem("fuente", valor);
}

function cambiarModoCompacto() {
  const esCompacto = document.getElementById("modoCompacto").checked;
  document.body.classList.toggle("modo-compacto", esCompacto);
  localStorage.setItem("compacto", esCompacto);
}

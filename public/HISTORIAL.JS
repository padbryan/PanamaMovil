function mostrarIconosHistorial() {
  document.getElementById("iconosHistorial").style.opacity = "1";
  document.getElementById("iconosHistorial").style.pointerEvents = "auto";
}

function ocultarIconosHistorial() {
  document.getElementById("iconosHistorial").style.opacity = "0";
  document.getElementById("iconosHistorial").style.pointerEvents = "none";
}

function limpiarHistorial() {
  document.getElementById("historial").innerHTML = "";
}
function buscarEnHistorial() {
  const filtro = prompt("Buscar en historial:");
  const bloques = document.querySelectorAll(".bloque-historial");

  bloques.forEach(bloque => {
    bloque.style.display = bloque.textContent.includes(filtro) ? "block" : "none";
  });
}
function maximizarHistorial() {
  document.querySelector(".historial-container").style.maxHeight = "100vh";
}

function minimizarHistorial() {
  document.querySelector(".historial-container").style.maxHeight = "200px";
}
function renderizarHistorial(data) {
  const contenedor = document.getElementById("historial");
  contenedor.innerHTML = "";

  data.forEach(item => {
    const bloque = document.createElement("div");
    bloque.className = "bloque-historial";
    bloque.innerHTML = `<strong>${item.fecha}</strong> - ${item.descripcion}`;
    contenedor.appendChild(bloque);
  });
}


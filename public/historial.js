// 📋 Historial visual tipo CWP Móvil
function agregarAlHistorial(item, alarmaTexto) {
  const registro = {
    ID: item.ID || "—",
    "Site Name": item["Site Name"] || "—",
    Alarma: alarmaTexto || "—",
    Provincia: item.Provincia || "—",
    NIS: item.NIS || "—",
    "Clientes VIP": item["Clientes VIP"] || [],
    "Codigo del OWNER": item["Codigo del OWNER"] || "—",
    Baterías: item["Baterías"] || "—",
    Generador: item["Generador"] || "—"
  };
  historial.unshift(registro);
  mostrarHistorial();
}

function mostrarHistorial() {
  const contenedor = document.getElementById("historial");
  const wrapper = document.querySelector(".historial-wrapper");

  if (historial.length === 0) {
    contenedor.innerHTML = "";
    if (wrapper) wrapper.style.display = "none";
    return;
  }

  const todasLasFilas = historial.map(item => {
    const vipTexto = Array.isArray(item["Clientes VIP"]) && item["Clientes VIP"].length > 0
      ? item["Clientes VIP"].map(vip => {
          const nombre = vip.nombre || "—";
          const responsable = vip.responsable || "";
          return `<span style="color: #ffcc66;">💡 ${nombre}</span> <span style="color: #ccc;">(${responsable})</span>`;
        }).join("<br>")
      : "—";

    const bateriasTexto = item["Baterías"]?.toUpperCase().includes("SI")
      ? `<span style="color: #2e8131ff;">🔋 Baterías: SI</span>`
      : `<span style="color: #f44336;">❌ Baterías: NO</span>`;

    const generadorTexto = item["Generador"]?.toUpperCase().includes("SI")
      ? `<span style="color: #2e8131ff;">⚙️ Generador: SI</span>`
      : `<span style="color: #f44336;">❌ Generador: NO</span>`;

    const columnaIzquierda = `
      <div style="user-select: text; color: #f1f1f1; background-color: #1e1e1e; padding: 6px 12px; border-radius: 4px; font-size: 0.95rem; margin-bottom: 2px;">
        <strong>-${item.ID}</strong> | ${item["Site Name"]} | ${item.Alarma}
      </div>
    `;

    const columnaDerecha = `
      <div style="user-select: none; color: #aaa; background-color: #1e1e1e; padding: 6px 12px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 2px;">
        ${item.Provincia} | NIS: ${item.NIS}<br>
        ${vipTexto}<br>
        ${bateriasTexto}<br>
        ${generadorTexto}
      </div>
    `;

    return `
      <div style="display: flex; gap: 12px; padding-left: 20px; margin-top: 4px;">
        <div style="flex: 1;">${columnaIzquierda}</div>
        <div style="flex: 1;">${columnaDerecha}</div>
      </div>
    `;
  }).join("");

  contenedor.innerHTML = `
    <div class="card p-3 mt-3 border-0 shadow-sm" style="background-color: #1e1e1e;">
      ${todasLasFilas}
    </div>
  `;

  if (wrapper) wrapper.style.display = "block";
}

// 🧹 Limpiar historial

function limpiarHistorial() {
  if (historial.length === 0) return alert("⚠️ El historial ya está vacío");

  const confirmar = confirm("¿Estás seguro de que deseas borrar todo el historial?");
  if (!confirmar) return;

  historial.length = 0; // Vacía el array sin perder la referencia
  mostrarHistorial();   // Actualiza la vista
}

// 🧾 Exportar historial en CSV
function exportarCSV() {
  if (historial.length === 0) return alert("⚠️ No hay datos en el historial");

  const encabezados = ["ID", "Site Name","Alarma", "Provincia", "NIS","Baterías","Generador", "Provincia", "NIS", "Clientes VIP", "Codigo del OWNER"];

  const filas = historial.map(item =>
    encabezados.map(campo => `"${item[campo] || ""}"`)
  );

  const contenido = [encabezados, ...filas].map(fila => fila.join(",")).join("\n");
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "HistorialTecnico.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function filtrarHistorial() {
  const filtro = document.getElementById("filtroHistorial").value.trim().toLowerCase();
  const bloques = document.querySelectorAll(".bloque-historial");

  bloques.forEach(bloque => {
    const texto = bloque.textContent.toLowerCase();
    bloque.style.display = texto.includes(filtro) ? "block" : "none";
  });
}


function buscarEnHistorial() {
  const wrapper = document.getElementById("filtroHistorialWrapper");
  if (!wrapper) return;

  wrapper.classList.toggle("show");

  const input = document.getElementById("filtroHistorial");
  if (wrapper.classList.contains("show") && input) {
    input.focus();
  }
}


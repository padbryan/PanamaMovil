const API_URL = "https://panamamovil-production-bf10.up.railway.app";

// 🧩 Captura de teclado
const input = document.getElementById("valor");
input.addEventListener("keydown", e => e.key === "Enter" && buscar());

const resultado = document.getElementById("resultado");
const historial = [];

// 🔍 Búsqueda principal conectada al backend
function buscar() {
  const valor = input.value.trim().toUpperCase();
  const alarmaTexto = document.getElementById("alarma").value.trim();
  if (!valor) {
  alert("⚠️ Debes ingresar un valor para buscar");
  return;
}


  fetch(`${API_URL}/buscar?q=${encodeURIComponent(valor)}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(item => {
      mostrarResultado(item);
      agregarAlHistorial(item, alarmaTexto);
    })
    .catch(() => {
      resultado.innerHTML = `
        <div class="alert alert-warning mt-3">
          🚫 No se encontraron datos para <strong>${valor}</strong><br>
          <small>Verifica si escribiste correctamente el ID, NIS o POP. También puedes intentar con otro valor.</small>
        </div>
      `;
    });
}

// 🎨 Renderizado visual del resultado
function mostrarResultado(item) {
  const campos = Object.entries(item).map(([clave, valor]) => {
    let contenido = valor?.toString().trim() || "—";

    if (clave === "Baterías" || clave === "Generador") {
      contenido = contenido.toUpperCase().includes("SI")
        ? `<span class="autonomia-icon pulse">🔋 SI</span>`
        : "❌ NO";
    }

    if (clave === "Clientes VIP" && Array.isArray(valor)) {
      if (valor.length === 0) {
        contenido = "👤 No cuenta con cliente VIP";
      } else {
        const clientes = valor.map(({ nombre, responsable }) => `
          <div style="display: flex; flex-direction: column; align-items: flex-start; margin-right: 12px;">
            <span style="font-size: 0.75rem; color: #ccc; margin-bottom: 2px;">👤 ${responsable}</span>
            <span class="vip-diamond cliente-vip" data-responsable="${responsable}" style="
              display: inline-block;
              background: linear-gradient(135deg, #ffd700, #ff8c00);
              color: #fff;
              padding: 4px 10px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 0.9rem;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              💎 ${nombre}
            </span>
          </div>
        `);
        contenido = `<div style="display: flex; flex-wrap: wrap;">${clientes.join("")}</div>`;
      }
    }

    if (clave === "Codigo del OWNER" && contenido !== "—") {
      contenido = `<span class="owner-tag">👤 ${contenido}</span>`;
    }

    return `<p><strong>${clave}:</strong> ${contenido}</p>`;
  });

  resultado.innerHTML = `
    <div class="card mt-3 p-3 border-0 shadow-sm">
      ${campos.join("")}
    </div>
  `;
}

// 🧠 Tooltip para responsables VIP
setTimeout(() => {
  document.querySelectorAll(".vip-diamond").forEach(el => {
    el.addEventListener("mouseenter", () => {
      const responsable = el.getAttribute("data-responsable");
      if (!responsable || responsable === "No asignado") return;

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip-responsable";
      tooltip.textContent = `Responsable: ${responsable}`;
      document.body.appendChild(tooltip);

      const rect = el.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + window.scrollY}px`;

      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateX(0)";
      });

      el._tooltip = tooltip;
    });

    el.addEventListener("mouseleave", () => {
      if (el._tooltip) {
        el._tooltip.remove();
        el._tooltip = null;
      }
    });
  });
}, 0);

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
  if (!confirm("¿Estás seguro de que deseas borrar todo el historial?")) return;
  historial.length = 0;
  mostrarHistorial();

// 🧾 Exportar historial en CSV
function exportarCSV() {
  if (historial.length === 0) return alert("⚠️ No hay datos en el historial");

  const encabezados = ["ID", "Site Name", "Provincia", "NIS", "Clientes VIP", "Codigo del OWNER"];

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

// 🧠 Inicialización al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  // ⚙️ Menú de configuración
  const configToggle = document.getElementById("configToggle");
  const configMenu = document.getElementById("configMenu");

  if (configToggle && configMenu) {
    configToggle.addEventListener("click", () => {
      configMenu.style.display = configMenu.style.display === "none" ? "block" : "none";
    });
  }



 // 🧩 Activar menú de alarma
  const icono = document.getElementById("iconoDesplegar");
  const menu = document.getElementById("menuAlarma");
  const campoAlarma = document.getElementById("alarma");

  if (icono && menu && campoAlarma) {
    icono.addEventListener("click", () => menu.style.display = "block");
    campoAlarma.addEventListener("input", () => menu.style.display = "none");
  }
});

}
// 🧩 Funciones para el campo de alarma editable con menú desplegable
function mostrarMenuAlarma() {
  const menu = document.getElementById("menuAlarma");
  if (menu) menu.style.display = "block";
}

function ocultarMenuAlarma() {
  const menu = document.getElementById("menuAlarma");
  if (menu) menu.style.display = "none";
}

function seleccionarAlarma(valor) {
  const campo = document.getElementById("alarma");
  if (campo) campo.value = valor;
  ocultarMenuAlarma();
}

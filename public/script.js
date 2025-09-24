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



});


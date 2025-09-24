require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 8080;


app.get("/ping", (req, res) => {
  res.send("pong desde producción");
});


app.get("/inspeccion", async (req, res) => {
  try {
    const response = await fetch(process.env.SHEETS_API_URL);
    const json = await response.json();
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

console.log("Log de peticiones HTTP");
console.log("🚀 Servidor iniciado en modo desarrollo");
console.log(`🕒 Última actualización: ${new Date().toLocaleString()}`);
console.log("🔗 SHEETS_API_URL en producción:", process.env.SHEETS_API_URL);




 
// 🔧 Funciones auxiliares
const normalize = val => val?.toString().trim().toUpperCase();

const obtenerCampo = (obj, columna) => {
  if (!obj || typeof obj !== "object") return "";
  const claveReal = Object.keys(obj).find(k => k.trim().toUpperCase() === columna.trim().toUpperCase());
  return claveReal ? obj[claveReal] : "";
};

// 🔍 Función principal de búsqueda
async function buscarFicha(valor) {
  const SHEETS_URL = process.env.SHEETS_API_URL;
  const idBuscado = normalize(valor);
console.log("🧠 Valor recibido:", valor);
console.log("🧠 Normalizado:", normalize(valor));

  const res = await fetch(SHEETS_URL);
  console.log("🔗 SHEETS_API_URL:", SHEETS_URL);
 if (!res.ok) {
  throw new Error(`Error al consultar Sheets: ${res.status} ${res.statusText}`);
}
const datos = await res.json();


  const { DatosEquipos = [], network = [], baterias = [], redcwp = [], SITECWP = [], sitiosVIP = [] } = datos;

  // Detectar tipo de búsqueda
  let idFinal = idBuscado;

  const porNIS = DatosEquipos.find(e => normalize(obtenerCampo(e, "NIS")) === idBuscado);
  const porMedidor = DatosEquipos.find(e => normalize(obtenerCampo(e, "Medidor")) === idBuscado);
  const porPOP = network.find(e => normalize(obtenerCampo(e, "POP(Before)")) === idBuscado);

  if (porNIS) idFinal = normalize(obtenerCampo(porNIS, "ID"));
  else if (porMedidor) idFinal = normalize(obtenerCampo(porMedidor, "ID"));
  else if (porPOP) idFinal = normalize(obtenerCampo(porPOP, "POP CWP"));

  // Construcción de ficha
  const netRow = network.find(e => normalize(obtenerCampo(e, "POP CWP")) === idFinal) || {};
  const batRow = baterias.find(e => normalize(obtenerCampo(e, "ID")) === idFinal) || {};
  const redRow = redcwp.find(e => normalize(obtenerCampo(e, "ID")) === idFinal) || {};
  const datosRow = DatosEquipos.find(e => normalize(obtenerCampo(e, "ID")) === idFinal) || {};

 const popOriginalRaw = obtenerCampo(netRow, "POP(Before)") || "";
const popOriginal = normalize(popOriginalRaw);

const sitioCoincidente = SITECWP.find(site =>
  normalize(obtenerCampo(site, "POP(Before)")) === popOriginal
);


const codigoOwner = obtenerCampo(sitioCoincidente, "Codigos") || "—";


  const clientesVIP = sitiosVIP.filter(row => {
    const rbsRaw = row["RBS"];
    if (!rbsRaw) return false;
    const listaRBS = rbsRaw.split(/[,;]/).map(r => normalize(r));
    return listaRBS.includes(idFinal);
  }).map(row => ({
    nombre: row["CLIENTE"]?.toString().trim() || "—",
    responsable: row["Responsable"]?.toString().trim() || "No asignado"
  }));

  const ficha = {
    ID: idFinal,
    "Site Name": obtenerCampo(netRow, "Site Name"),
    "Clientes VIP": clientesVIP,
    "Propietario": obtenerCampo(redRow, "Propietario"),
    "Codigo del OWNER": codigoOwner,
    "Ubicación": obtenerCampo(datosRow, "Ubicación"),
    "Medidor": obtenerCampo(datosRow, "Medidor"),
    "NIS": obtenerCampo(datosRow, "NIS"),
    "Provincia": obtenerCampo(batRow, "Provincia"),
    "Distrito": obtenerCampo(batRow, "Distrito"),
    "Corregimiento": obtenerCampo(batRow, "Corregimiento"),
    "Latitude": obtenerCampo(netRow, "Latitude"),
    "Longitude": obtenerCampo(netRow, "Longitude"),
    "POP": obtenerCampo(netRow, "POP(Before)"),
    "Baterías": normalize(obtenerCampo(batRow, "Baterías")) === "SI" ? "SI" : "NO",
    "Generador": normalize(obtenerCampo(batRow, "Generador")) === "SI" ? "SI" : "NO"
  };

  const completos = Object.values(ficha).filter(v => v !== "" && v !== null).length;
  if (completos <= 3) {
    throw new Error("No se encontraron datos suficientes para ese valor");
  }

  return ficha;
}

// 🔎 Ruta de búsqueda
app.get("/buscar", async (req, res) => {
  try {
    const ficha = await buscarFicha(req.query.q);
    res.json(ficha);
  } catch (error) {
    console.error("❌ Error al consultar Google Sheets:", error.message);
    res.status(500).json({ error: "Error al consultar Google Sheets" });
  }
});

// Ruta de salud
app.get("/status", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.set("trust proxy", true);

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});

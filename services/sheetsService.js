const fetch = require("node-fetch");
const SHEETS_URL = process.env.SHEETS_API_URL;

const normalize = val => val?.toString().trim().toUpperCase();

async function buscarFicha(valor) {
  const idBuscado = normalize(valor);
  const res = await fetch(SHEETS_URL);
  const datos = await res.json();

  const { DatosEquipos, network, baterias, redcwp, SITECWP, sitiosVIP } = datos;

  // Detectar tipo de búsqueda
  let tipo = "ID";
  let idFinal = idBuscado;

  const porNIS = DatosEquipos?.find(e => normalize(e.nis) === idBuscado);
  const porMedidor = DatosEquipos?.find(e => normalize(e.Medidor) === idBuscado);
  const porPOP = network?.find(e => normalize(e["POP(Before)"]) === idBuscado);

  if (porNIS) {
    tipo = "NIS";
    idFinal = normalize(porNIS.ID);
  } else if (porMedidor) {
    tipo = "Medidor";
    idFinal = normalize(porMedidor.ID);
  } else if (porPOP) {
    tipo = "POP";
    idFinal = normalize(porPOP.ID);
  }

  // Log para depuración
  console.log(`🔍 Tipo de búsqueda: ${tipo}`);
  console.log(`🔑 ID final detectado: ${idFinal}`);

  // Función auxiliar para buscar por ID en una hoja
  const buscarPorID = (hoja, campo = "ID") =>
    hoja?.find(e => normalize(e[campo]) === idFinal) || {};

  const fichaEquipos = buscarPorID(DatosEquipos);
  const fichaBaterias = buscarPorID(baterias);
  const fichaNetwork = buscarPorID(network);
  const fichaRedCWP = buscarPorID(redcwp);
  const fichaSiteCWP = SITECWP?.find(e => normalize(e["POP(Before)"]) === idFinal) || {};

  const clientesVIP = sitiosVIP?.filter(e => {
    const lista = e.RBS?.toString().split(/[,;]/).map(r => normalize(r));
    return lista?.includes(idFinal);
  }).map(e => ({
    nombre: e.CLIENTE || "—",
    responsable: e.Responsable || "No asignado"
  })) || [];

  return {
    ID: idFinal,
    "Tipo de búsqueda": tipo,
    "Site Name": fichaEquipos["Site Name"] || "—",
    "Clientes VIP": clientesVIP,
    "Propietario": fichaRedCWP.Propietario || "—",
    "Codigo del OWNER": fichaSiteCWP.Codigos || "—",
    "Ubicación": fichaEquipos.Ubicacion || "—",
    "Medidor": fichaEquipos.Medidor || "—",
    "NIS": fichaEquipos.nis || "—",
    "Provincia": fichaBaterias.Provincia || "—",
    "Distrito": fichaBaterias.Distrito || "—",
    "Corregimiento": fichaBaterias.corregimiento || "—",
    "Latitude": fichaNetwork.Latitude || "—",
    "Longitude": fichaNetwork.Longitude || "—",
    "POP": fichaNetwork["POP(Before)"] || "—",
    "Baterías": normalize(fichaBaterias.baterias) === "SI" ? "SI" : "NO",
    "Generador": normalize(fichaBaterias.generador) === "SI" ? "SI" : "NO"
  };
}

module.exports = { buscarFicha };

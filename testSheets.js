require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

(async () => {
  try {
    const res = await fetch(process.env.SHEETS_API_URL);
    const json = await res.json();
    console.log("✅ JSON recibido:", Object.keys(json));
  } catch (error) {
    console.error("❌ Error al consultar Sheets:", error.message);
  }
})();

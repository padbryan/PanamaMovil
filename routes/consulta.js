const express = require("express");
const router = express.Router();
const { obtenerFicha } = require("../services/sheetsService");

router.get("/consulta", async (req, res) => {
  const { valor } = req.query;

  if (!valor) {
    return res.status(400).json({ error: "Debes enviar un valor" });
  }

  try {
    const ficha = await obtenerFicha(valor);

    if (!ficha || !ficha.id) {
      return res.status(404).json({
        mensaje: "No se encontraron datos suficientes para ese valor",
      });
    }

    res.json(ficha);
  } catch (error) {
    console.error("Error en consulta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

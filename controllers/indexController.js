const Vacante = require("../models/Vacante.js");

paginaPrincipal = async (req, res) => {
  const vacantesPlainObject = await Vacante.find().lean();
  res.render("index", {
    nombrePagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para Desarrolladores Web",
    barra: true,
    boton: true,
    vacantes: vacantesPlainObject,
    mensajes: req.flash(),
  });
};

buscarTermino = async (req, res) => {
  const { termino } = req.body;
  const vacantes = await Vacante.find({
    titulo: { $regex: termino, $options: "i" },
  }).limit(4);
  return res.json({ vacantes });
};

module.exports = {
  paginaPrincipal,
  buscarTermino,
};

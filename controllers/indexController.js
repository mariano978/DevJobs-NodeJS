const Vacante = require("../models/Vacante.js");

paginaPrincipal = async (req, res) => {
  const vacantesPlainObject = await Vacante.find().lean();

  res.render("index", {
    nombrePagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para Desarrolladores Web",
    barra: true,
    boton: true,
    vacantes: vacantesPlainObject,
  });
};

module.exports = {
  paginaPrincipal,
};

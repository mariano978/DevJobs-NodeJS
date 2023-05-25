const Vacante = require("../models/Vacante.js");

mostrarTrabajos = async (req, res) => {
  const vacantes = await Vacante.find();
  console.log(vacantes);
  res.render("index", {
    nombrePagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para Desarrolladores Web",
    barra: true,
    boton: true,
    vacantes,
  });
};

module.exports = {
  mostrarTrabajos,
};

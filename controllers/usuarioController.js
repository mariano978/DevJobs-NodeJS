//const Vacante = require("../models/Vacante.js");

formularioRegister = async (req, res) => {
  res.render("usuarios/auth/register", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline: "Comienza a publicar tus vacantes gratis !",
  });
};

module.exports = {
  formularioRegister,
};

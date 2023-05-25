const Vacante = require("../models/Vacante.js");

formularioCrear = (req, res) => {
  res.render("vacantes/crud/crear", {
    nombrePagina: "Nueva Vacante",
    tagLine: "Llena el formulario y publica una vacante",
    trixScript: true,
    vacantesFormScript: true,
  });
};

crear = async (req, res) => {
  const datosVacante = req.body;
  const vacanteInstance = new Vacante(datosVacante);

  //convertimos las skills a arreglo
  vacanteInstance.skills = datosVacante.skills.split(",");

  console.log(vacanteInstance.titulo);

  const vacante = await vacanteInstance.save();

  res.redirect(`/vacantes/${vacante.url}`);
};

module.exports = {
  formularioCrear,
  crear,
};

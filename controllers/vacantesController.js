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

formularioEditar = async (req, res) => {
  const { url: vacanteURL } = req.params;
  const vacante = await getVacante(vacanteURL);

  if (!vacante) {
    res.redirect("/");
  }

  res.render("vacantes/crud/editar", {
    nombrePagina: "Editar Vacante",
    tagLine: "Llena el formulario y guarda la vacante",
    trixScript: true,
    vacantesFormScript: true,
    vacante,
  });
};

editar = (req, res) => {};

mostrarByURL = async (req, res, next) => {
  const { url: vacanteURL } = req.params;
  const vacante = await getVacante(vacanteURL);

  if (!vacante) {
    res.redirect("/");
  }

  res.render("vacantes/crud/mostrar", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true,
  });
};

async function getVacante(url) {
  const vacantePlainObject = await Vacante.findOne({ url }).lean();
  return vacantePlainObject;
}

module.exports = {
  formularioCrear,
  crear,
  formularioEditar,
  editar,
  mostrarByURL,
};

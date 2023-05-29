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

  if (vacante) {
    console.log("Documento creado con éxito");
  } else {
    console.error("Error al crear el documento");
    return res.redirect("/");
  }

  res.redirect(`/vacantes/${vacante.url}`);
};

formularioEditar = async (req, res) => {
  const { url: vacanteURL } = req.params;
  const vacante = await getVacante(vacanteURL);

  if (!vacante) {
    return res.redirect("/");
  }

  res.render("vacantes/crud/editar", {
    nombrePagina: "Editar Vacante",
    tagLine: "Llena el formulario y guarda la vacante",
    trixScript: true,
    vacantesFormScript: true,
    vacante,
  });
};

editar = async (req, res) => {
  const datosNuevos = req.body;
  datosNuevos.skills = datosNuevos.skills.split(",");
  const { url: vacanteURL } = req.params;

  const vacanteActualizada = await Vacante.findOneAndUpdate(
    { url: vacanteURL },
    datosNuevos,
    {
      new: true,
    }
  );

  if (vacanteActualizada) {
    console.log("Documento actualizado con éxito");
  } else {
    console.error("Error al actualizar el documento");
    return res.redirect("/");
  }

  res.redirect(`/vacantes/${vacanteActualizada.url}`);
};

mostrarByURL = async (req, res, next) => {
  const { url: vacanteURL } = req.params;
  const vacante = await getVacante(vacanteURL);

  if (!vacante) {
    return res.redirect("/");
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

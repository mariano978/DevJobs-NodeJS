const Vacante = require("../models/Vacante.js");
const { body, validationResult } = require("express-validator");

formularioCrear = (req, res) => {
  const vacanteFormData = Object.keys(req.body).length > 0 ? req.body : false; //si el body esta vacio le pasamos false

  res.render("vacantes/crud/crear", {
    nombrePagina: "Nueva Vacante",
    tagLine: "Llena el formulario y publica una vacante",
    trixScript: true,
    vacantesFormScript: true,
    mensajes: req.flash(),
    vacanteFormData,
    cerrarSesion: true,
  });
};

crear = async (req, res) => {
  const datosVacante = req.body;
  const vacanteInstance = new Vacante(datosVacante);

  //agregamos la referencia del creador de la vacante
  vacanteInstance.usuario_id = req.user._id;

  //convertimos las skills a arreglo
  vacanteInstance.skills = datosVacante.skills.split(",");

  const vacante = await vacanteInstance.save();

  if (!vacante) {
    return res.redirect("/");
  }

  res.redirect(`/vacantes/${vacante.url}`);
};

formularioEditar = async (req, res) => {
  const vacanteFormData = Object.keys(req.body).length > 0 ? req.body : false; //si el body esta vacio le pasamos false

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
    mensajes: req.flash(),
    vacanteFormData,
    cerrarSesion: true,
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

  if (!vacanteActualizada) {
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

validateVacante = async (req, res, next) => {
  const rules = [
    body("titulo").not().isEmpty().withMessage("Falta Titulo").escape(),
    body("empresa").not().isEmpty().withMessage("Falta Empresa").escape(),
    body("ubicacion").not().isEmpty().withMessage("Falta Ubicacion").escape(),
    body("contrato").not().isEmpty().withMessage("Falta Contrato").escape(),
    body("descripcion").not().isEmpty().withMessage("Falta Descripcion"),
    body("skills")
      .not()
      .isEmpty()
      .withMessage("Agrega al menos una habilidad")
      .escape(),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const result = validationResult(req);
  const errores = result.errors;
  if (errores.length > 0) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    const { url: vacanteURL } = req.params;
    if (vacanteURL) {
      return formularioEditar(req, res);
    }

    return formularioCrear(req, res);
  }
  //si la validacion es correcta pasamos al siguiente midelware
  next();
};

verifyVancanteOfTheUser = (vacante, user) => {
  return vacante.usuario_id.equals(user._id);
};

eliminarVacante = async (req, res) => {
  try {
    const { id: vacanteId } = req.params;
    const vacante = await Vacante.findById(vacanteId);

    if (vacante && verifyVancanteOfTheUser(vacante, req.user)) {
      await vacante.deleteOne();
      res.status(200).send("Correcto");
      return;
    }
    res.status(403).send("Error");
  } catch (error) {
    console.log(error);
    res.status(403).send("Error");
  }

  return;
};

module.exports = {
  formularioCrear,
  crear,
  formularioEditar,
  editar,
  mostrarByURL,
  validateVacante,
  eliminarVacante,
};

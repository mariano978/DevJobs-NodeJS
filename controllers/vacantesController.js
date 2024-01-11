const Vacante = require("../models/Vacante.js");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { cloneObject } = require("../helpers/functions.js");
const shortid = require("shortid");
exports.formularioCrear = (req, res) => {
  const vacanteFormData = Object.keys(req.body).length > 0 ? req.body : false; //si el body esta vacio le pasamos false

  res.render("vacantes/crud/crear", {
    nombrePagina: "Nueva Vacante",
    tagLine: "Llena el formulario y publica una vacante",
    trixScript: true,
    vacantesFormScript: true,
    mensajes: req.flash(),
    vacanteFormData,
    cerrarSesion: true,
    avatar: cloneObject(req.user).avatar,
  });
};

exports.crear = async (req, res) => {
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

exports.formularioEditar = async (req, res) => {
  const vacanteFormData = Object.keys(req.body).length > 0 ? req.body : false; //si el body esta vacio le pasamos false

  const { url: vacanteURL } = req.params;
  const vacante = await Vacante.findOne({ vacanteURL }).lean();

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
    avatar: cloneObject(req.user).avatar,
  });
};

exports.editar = async (req, res) => {
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

exports.mostrarByURL = async (req, res, next) => {
  const { url: vacanteURL } = req.params;
  const vacante = await Vacante.findOne({ url: vacanteURL }).populate(
    "usuario_id"
  );

  if (!vacante) {
    return res.redirect("/");
  }

  res.render("vacantes/crud/mostrar", {
    vacante: cloneObject(vacante),
    nombrePagina: vacante.titulo,
    barra: true,
    editarVacante:
      vacante.usuario_id._id.toString() === req.user._id.toString(),
    mensajes: req.flash(),
  });
};

exports.validateVacante = async (req, res, next) => {
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

exports.verifyVancanteOfTheUser = (vacante, user) => {
  return vacante.usuario_id.equals(user._id);
};

exports.eliminarVacante = async (req, res) => {
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

const uploadCv = multer({
  limits: {
    fileSize: 1000000, //1Mb
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/../public/uploads/cvs");
    },
    filename: function (req, file, cb) {
      const formato = file.mimetype.split("/")[1];
      cb(null, `${req.user.nombre}-${shortid.generate()}.${formato}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Sube un archivo PDF"), false);
    }
  },
}).single("cv");

exports.subirCv = (req, res, next) => {
  console.log("subiendoCV");
  uploadCv(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "Archivo muy pesado. Máx. 1Mb");
        } else {
          req.flash(
            "error",
            err.msg
              ? err.msg
              : "Lo siento ha ocurrido un error, intente mas tarde"
          );
        }
      } else {
        req.flash("error", err.message);
      }
      return res.redirect("back");
    }

    next();
  });
};
exports.guardarCandidato = async (req, res) => {
  try {
    const vacante = await Vacante.findOne({ url: req.params.url });

    const candidato = {
      nombre: req.body.nombre,
      email: req.body.email,
      cv: req.file.filename,
    };

    vacante.candidatos.push(candidato);
    await vacante.save();

    req.flash("success", "Datos enviados al reclutador");
    return res.redirect(`/vacantes/${vacante.url}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
    return res.redirect("/");
  }
};

exports.mostrarCandidatos = async (req, res) => {
  console.log("hola");
  try {
    const urlVacante = req.params.url;
    const vacante = await Vacante.findOne({ url: urlVacante });

    if (vacante.usuario_id.toString() !== req.user._id.toString()) {
      req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
      return res.redirect("/");
    }

    console.log(vacante);
    res.render("vacantes/candidatos", {
      nombrePagina: `Candidatos de ${vacante.titulo}`,
      mensajes: req.flash(),
      cerrarSesion: true,
      avatar: cloneObject(req.user).avatar,
      candidatos:  cloneObject(vacante.candidatos) ,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
    return res.redirect("/dashboard");
  }
};

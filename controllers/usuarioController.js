const { body, validationResult } = require("express-validator");
//const Vacante = require("../models/Vacante.js");
const Usuario = require("../models/Usuario.js");

formularioRegistrar = (req, res) => {
  res.render("usuarios/auth/register", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline: "Comienza a publicar tus vacantes gratis !",
  });
};

validarRegistro = async (req, res, next) => {
  const rules = [
    body("nombre")
      .not()
      .isEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("email")
      .isEmail()
      .withMessage("El email es obligatorio")
      .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("El password es obligatorio")
      .escape(),
    body("confirmar")
      .not()
      .isEmpty()
      .withMessage("Confirmar password es obligatorio")
      .escape(),
    body("confirmar")
      .equals(req.body.password)
      .withMessage("Los passwords no son iguales"),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const result = validationResult(req);
  const errores = result.errors;
  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    res.render("usuarios/auth/register", {
      nombrePagina: "Crea tu cuenta en DevJobs",
      tagline: "Comienza a publicar tus vacantes gratis !",
      mensajes: req.flash(),
    });
    return;
  }
  //si la validacion es correcta pasamos al siguiente midelware
  next();
};

registrar = async (req, res, next) => {
  const datosForm = req.body;
  const usuarioInstance = new Usuario(datosForm);

  try {
    const usuario = await usuarioInstance.save();
    console.log(usuario);
  } catch (error) {
    next();
  }
};

module.exports = {
  formularioRegistrar,
  validarRegistro,
  registrar,
};

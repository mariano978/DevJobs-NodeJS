const { body, validationResult } = require("express-validator");
//const Vacante = require("../models/Vacante.js");
const Usuario = require("../models/Usuario.js");
const passport = require("passport");

exports.formRegister = (req, res) => {
  res.render("usuarios/auth/register", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline: "Comienza a publicar tus vacantes gratis !",
    mensajes: req.flash(),
  });
};

exports.validateRegisterData = async (req, res, next) => {
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
  if (errores.length > 0) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    res.redirect("/register");
    return;
  }
  //si la validacion es correcta pasamos al siguiente midelware
  next();
};

exports.registerUser = async (req, res, next) => {
  const datosForm = req.body;
  const usuarioInstance = new Usuario(datosForm);
  try {
    const usuario = await usuarioInstance.save();
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/register");
  }
};

exports.formLogin = (req, res) => {
  res.render("usuarios/auth/login", {
    nombrePagina: "Inicia Sesion en DevJobs",
    tagline: "Comienza a publicar tus vacantes gratis !",
    mensajes: req.flash(),
  });
};

//passport Autenticacion
exports.authenticateUser = (req, res, next) => {
  //autenticamos el usuario que intenta iniciar sesion
  passport.authenticate("local", (err, user, info, status) => {
    //esta funcion es la que le llega como parametro al metodo con el nombre de "done"
    if (user) {
      //Si se autentica correctamente significa que tenemos definido "user"
      //establecemos la autenticacion manualmente
      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "Ocurrio un error, intentelo mas tarde");
          return res.redirect("/login");
        }
        console.log("Usuario Logeado:", user);
        return res.redirect("/dashboard");
      });
    }

    //Caso constrario mostramos los errores con flash
    if (err) {
      console.log(err);
      req.flash("error", "Ocurrio un error, intentelo mas tarde");
    } else if (status === 400) {
      //Este error se presenta cuando no se ingresan datos
      req.flash("error", "Ambos campor requeridos");
    } else {
      req.flash("error", info.message);
    }

    res.redirect("/login");
    return next();
  })(req, res, next); //Esto le proporciona los parametros que requiere "authenticate"
};

//verifica si el usuario esta autenticado
exports.userIsAuthenticated = (req, res, next) => {
  console.log("Usuario autenticado:", req.user);
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "Debes iniciar sesion");

  return res.redirect("/login");
};

exports.rederDashboard = (req, res, next) => {
  res.render("usuarios/dashboard", {
    nombrePagina: "Panel de Administracion",
    tagline: "Crea y administra tus vacantes aqui",
    mensajes: req.flash(),
  });
};

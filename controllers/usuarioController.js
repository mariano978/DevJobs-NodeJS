const { body, validationResult } = require("express-validator");
//const Vacante = require("../models/Vacante.js");
const Usuario = require("../models/Usuario.js");
const passport = require("passport");
const Vacante = require("../models/Vacante.js");

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
  passport.authenticate("local", (err, user, info, status) => {
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "Ocurrió un error, inténtelo más tarde");
          return res.redirect("/login");
        }
        return res.redirect("/dashboard");
      });
    } else {
      if (err) {
        console.log(err);
        req.flash("error", "Ocurrió un error, inténtelo más tarde");
      } else if (status === 400) {
        req.flash("error", "Ambos campos son requeridos");
      } else if (info) {
        req.flash("error", info.message);
      }
      return res.redirect("/login");
    }
  })(req, res, next);
};

//verifica si el usuario esta autenticado
exports.userIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "Debes iniciar sesion");

  res.redirect("/login");
};

exports.renderDashboard = async (req, res, next) => {
  try {
    const page = req.query.page ?? 1;
    if (page < 1) {
      res.redirect("/dashboard");
    }
 

    const result = await Vacante.paginate(
      { usuario_id: req.user._id },
      {
        page,
        limit: process.env.PAGINATION_LIMIT,
      }
    );

    //Opciones de Mongoose Paginate v2
    // result.docs
    // result.totalDocs = 100
    // result.limit = 10
    // result.page = 1
    // result.totalPages = 10
    // result.hasNextPage = true
    // result.nextPage = 2
    // result.hasPrevPage = false
    // result.prevPage = null
    // result.pagingCounter = 1
    res.render("usuarios/dashboard", {
      nombrePagina: "Panel de Administracion",
      tagline: "Crea y administra tus vacantes aqui",
      mensajes: req.flash(),
      paginateData: JSON.parse(JSON.stringify(result)),
      cerrarSesion: true,
      eliminarVacanteScript: true,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
    res.redirect("/login");
    return next();
  }
};

exports.formEditProfile = (req, res) => {
  res.render("usuarios/edit-profile", {
    nombrePagina: "Edita tu perfil",
    tagline: "Comienza a publicar tus vacantes gratis !",
    mensajes: req.flash(),
    usuario: JSON.parse(JSON.stringify(req.user)),
    cerrarSesion: true,
  });
};

exports.validateEditProfileData = async function (req, res, next) {
  const rules = {
    nombre: body("nombre")
      .not()
      .isEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    email: body("email")
      .isEmail()
      .withMessage("El email es obligatorio")
      .normalizeEmail(),
    password: body("password").escape(),
  };

  await Promise.all(
    Object.entries(rules).map(([campo, validation]) => {
      if (campo === "password" && !req.body.password) {
        return null;
      }
      return validation.run(req);
    })
  );
  const result = validationResult(req);
  const errores = result.errors;
  if (errores.length > 0) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    return res.redirect("/edit-profile");
  }
  //si la validacion es correcta pasamos al siguiente midelware
  next();
};

exports.editProfile = (req, res) => {
  Usuario.findById(req.user._id)
    .then(async (user) => {
      user.nombre = req.body.nombre;
      user.email = req.body.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      try {
        await user.save();
        req.flash("success", "Datos guardados correctamente");
      } catch (error) {
        console.log(error);
        req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
      }

      res.redirect("/dashboard");
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
      res.redirect("/dashboard");
    });
};

exports.logoutFromUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
      return res.redirect("/dashboard");
    }
    req.flash("success", "Se ha cerrado sesion");
    res.redirect("/login");
  });
};

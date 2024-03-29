const { body, validationResult } = require("express-validator");
//const Vacante = require("../models/Vacante.js");
const Usuario = require("../models/Usuario.js");
const passport = require("passport");
const Vacante = require("../models/Vacante.js");

const crypto = require("crypto");

const { cloneObject } = require("../helpers/functions.js");

//Para manejar archivos con node
const fs = require("fs");
const path = require("path");
//Configurando Multer para subir el avatar
const multer = require("multer");
const { sendEmailResetPassword } = require("../handlers/email.js");
const uploadAvatar = multer({
  limits: {
    fileSize: 1000000, //1Mb
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/../public/uploads/avatars");
    },
    filename: function (req, file, cb) {
      const formato = file.mimetype.split("/")[1];
      cb(null, `${req.user._id}.${formato}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Sube una imagen JPG o PNG"), false);
    }
  },
}).single("avatar");

exports.uploadAvatar = (req, res, next) => {
  uploadAvatar(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "Imagen muy pesada. Máx. 1Mb");
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

      return res.redirect("/edit-profile");
    }

    next();
  });
};

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
      avatar: cloneObject(req.user).avatar,
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
    avatar: cloneObject(req.user).avatar,
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

removeLastAvatar = (userId, actualFile) => {
  //removemos todos los avatar cuya extension sea distinta a la actual
  const actualExtension = actualFile.mimetype.split("/")[1];
  const directorioAvatars = path.join(__dirname, "../public/uploads/avatars");

  // Array de extensiones a verificar
  const extensiones = ["png", "jpg", "jpeg"];

  extensiones.forEach((extension) => {
    if (extension !== actualExtension) {
      const rutaArchivo = path.join(
        `${directorioAvatars}/${userId}.${extension}`
      );

      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }
    }
  });
};
exports.editProfile = (req, res) => {
  Usuario.findById(req.user._id)
    .then(async (user) => {
      user.nombre = req.body.nombre;
      user.email = req.body.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.file) {
        removeLastAvatar(user._id, req.file);
        user.avatar = req.file.filename;
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

exports.formResetPassword = (req, res) => {
  res.render("usuarios/auth/reset-password", {
    nombrePagina: "Recupera tu contraseña",
    tagline: "Coloca tu email para cambiar la contraseña",
    mensajes: req.flash(),
  });
};

exports.sendEmailToken = async (req, res) => {
  if (!req.body.email) {
    req.flash("error", "Ingresar el email");
    return res.redirect("/reset-password");
  }

  const usuario = await Usuario.findOne({ email: req.body.email });
  if (!usuario) {
    req.flash("error", "El email no existe");
    return res.redirect("/reset-password");
  }

  //Enviar Mail
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expira = Date.now() + 3600000; //

  try {
    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reset-password/${usuario.token}`;

    const seEnvio = await sendEmailResetPassword(usuario.email, resetUrl);
    if (seEnvio) {
      req.flash("success", "Revisa tu email");
    } else {
      req.flash("error", "No se pudo enviar el email, intenta mas tarde");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
  }
  return res.redirect("/reset-password");
};

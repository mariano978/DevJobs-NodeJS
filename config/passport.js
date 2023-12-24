const Usuario = require("../models/Usuario.js");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

//Configuro la estrategia local que usará passport

//Por defecto, LocalStrategy espera que el nombre de
//usuario se encuentre en el campo llamado "username" en la solicitud.
passport.use(
  {
    usernameField: "email", // Usar 'email' en lugar de 'username'
    passwordField: "password",
  },
  new LocalStrategy(async (email, password, done) => {
    try {
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return done(null, false, { message: "Nombre de usuario incorrecto" });
      }
      if (!usuario.comparePassword(password)) {
        return done(null, false, { message: "Contraseña incorrecta" });
      }
      return done(null, usuario);
    } catch (err) {
      return done(err);
    }
  })
);

//Determinamos 'QUE' informacion del usuario se almacena en la sesion (en este caso el id)
passport.serializeUser((usuario, done) => done(null, usuario._id));

//Passport recupera toda la info del usuario con el id guardado en "serializeUser"
//y este la entrega de manera facil en req.user, para si poder comprobar
//en cada solicitud quien es el usuario, ahorrandome el trabajo
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findById(id);
    return done(null, usuario);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;

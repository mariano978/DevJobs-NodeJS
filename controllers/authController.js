const passport = require("passport");

exports.authenticateUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info, status) => {
    //esta funcion es la que le llega como parametro al metodo con el nombre de "done"
    if (user) {
      //Si se autentica correctamente significa que tenemos definido "user"
      console.log(user);
      res.redirect("/");
      return next();
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

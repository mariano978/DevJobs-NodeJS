const express = require("express");
const router = express.Router();
const {
  formRegister,
  validateRegisterData,
  registerUser,
  formLogin,
  authenticateUser,
  rederDashboard,
  userIsAuthenticated
} = require("../controllers/usuarioController.js");
const passport = require("passport");

//Parte publica, cualquiera puede navegar 🌐
//crear cuenta
router.get("/register", formRegister);
router.post("/register", validateRegisterData, registerUser);

//iniciar sesion
router.get("/login", formLogin);
//router.post("/login", authenticateUser);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

//Parte privada, aqui debe estar autenticado el usuario 🔒
//dashboard
router.get("/dashboard", userIsAuthenticated, rederDashboard);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  formRegister,
  validateRegisterData,
  registerUser,
  formLogin,
  authenticateUser,
  renderDashboard,
  userIsAuthenticated,
  formEditProfile,
  validateEditProfileData,
  editProfile,
  logoutFromUser,
  uploadAvatar,
} = require("../controllers/usuarioController.js");
const passport = require("passport");

//Parte publica, cualquiera puede navegar 🌐
//crear cuenta
router.get("/register", formRegister);
router.post("/register", validateRegisterData, registerUser);

//iniciar sesion
router.get("/login", formLogin);
router.post("/login", authenticateUser);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Parte privada, aqui debe estar autenticado el usuario 🔒
//dashboard
router.get("/dashboard", userIsAuthenticated, renderDashboard);

//Editar perfil
router.get("/edit-profile", userIsAuthenticated, formEditProfile);
router.post(
  "/edit-profile",
  userIsAuthenticated,
  //validateEditProfileData,
  uploadAvatar,
  editProfile
);

//Cerrar sesion
router.get("/logout", userIsAuthenticated, logoutFromUser);

module.exports = router;

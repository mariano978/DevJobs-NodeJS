const express = require("express");
const router = express.Router();
const {
  formRegister,
  validateRegisterData,
  registerUser,
  formLogin,
} = require("../controllers/usuarioController.js");
const { authenticateUser } = require("../controllers/authController.js");

//crear cuenta
router.get("/register", formRegister);
router.post("/register", validateRegisterData, registerUser);

//iniciar sesion
router.get("/login", formLogin);
router.post("/login", authenticateUser);

module.exports = router;


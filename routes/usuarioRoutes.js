const express = require("express");
const router = express.Router();
const {
  formularioRegistrar,
  validarRegistro,
  registrar,
} = require("../controllers/usuarioController.js");

//crear cuenta
router.get("/register", formularioRegistrar);
router.post("/register", validarRegistro, registrar);

module.exports = router;

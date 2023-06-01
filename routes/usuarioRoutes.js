const express = require("express");
const router = express.Router();
const { formularioRegister } = require("../controllers/usuarioController.js");

//crear cuenta
router.get("/register", formularioRegister);

module.exports = router;

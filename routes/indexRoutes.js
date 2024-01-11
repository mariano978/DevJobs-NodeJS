const express = require("express");
const router = express.Router();
const {
  paginaPrincipal,
  buscarTermino,
} = require("../controllers/indexController.js");
const { userIsAuthenticated } = require("../controllers/usuarioController.js");
const { mostrarCandidatos } = require("../controllers/vacantesController.js");

//home
router.get("/", paginaPrincipal);

//buscador
router.post("/find", buscarTermino);

//Muestra los candidatos por vacante del usuario
router.get("/candidatos/:url", userIsAuthenticated, mostrarCandidatos);

module.exports = router;

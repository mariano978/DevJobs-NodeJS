const express = require("express");
const router = express.Router();
const {
  formularioCrear,
  crear,
  formularioEditar,
  editar,
  mostrarByURL,
} = require("../controllers/vacantesController.js");

const { userIsAuthenticated } = require("../controllers/usuarioController.js");

//CRUD
router.get("/crear", userIsAuthenticated, formularioCrear);
router.post("/crear", userIsAuthenticated, crear);
router.get("/editar/:url", userIsAuthenticated, formularioEditar);
router.post("/editar/:url", userIsAuthenticated, editar);

//Publico, cualquiera puede ver las vacantes
router.get("/:url", mostrarByURL);

module.exports = router;

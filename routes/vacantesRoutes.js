const express = require("express");
const router = express.Router();
const {
  formularioCrear,
  crear,
  formularioEditar,
  editar,
  mostrarByURL,
  validateVacante,
  eliminarVacante
} = require("../controllers/vacantesController.js");

const { userIsAuthenticated } = require("../controllers/usuarioController.js");

//CRUD
router.get("/crear", userIsAuthenticated, formularioCrear);
router.post("/crear", userIsAuthenticated, validateVacante, crear);
router.get("/editar/:url", userIsAuthenticated, formularioEditar);
router.post("/editar/:url", userIsAuthenticated, validateVacante, editar);
router.delete("/eliminar/:id", userIsAuthenticated, eliminarVacante);

//Publico, cualquiera puede ver las vacantes
router.get("/:url", mostrarByURL);

module.exports = router;

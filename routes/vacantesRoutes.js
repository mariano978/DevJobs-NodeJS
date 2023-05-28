const express = require("express");
const router = express.Router();
const {
  formularioCrear,
  crear,
  formularioEditar,
  editar,
  mostrarByURL,
} = require("../controllers/vacantesController.js");

//CRUD
router.get("/crear", formularioCrear);
router.post("/crear", crear);
router.get("/editar/:url", formularioEditar);
router.post("/editar/:url",editar);
router.get("/:url", mostrarByURL);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  paginaPrincipal,
  buscarTermino,
} = require("../controllers/indexController.js");

//home
router.get("/", paginaPrincipal);

//buscador
router.post("/find", buscarTermino);

module.exports = router;

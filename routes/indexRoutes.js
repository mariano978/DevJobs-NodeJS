const express = require("express");
const router = express.Router();
const {
  paginaPrincipal,
  buscarTermino,
} = require("../controllers/indexController.js");

router.get("/", paginaPrincipal);

router.post("/find", buscarTermino);

module.exports = router;

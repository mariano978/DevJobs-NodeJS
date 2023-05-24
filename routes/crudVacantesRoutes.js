const express = require("express");
const router = express.Router();
const {
  formularioCrear,
  crear,
} = require("../controllers/vacantesController.js");

//CRUD
router.get("/crear", formularioCrear);
router.post("/crear", crear);

module.exports = router;

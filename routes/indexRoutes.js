const express = require("express");
const router = express.Router();
const { mostrarTrabajos } = require("../controllers/indexController.js");

router.get("/", mostrarTrabajos);

module.exports = router;

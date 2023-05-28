const express = require("express");
const router = express.Router();
const { paginaPrincipal } = require("../controllers/indexController.js");

router.get("/", paginaPrincipal);

module.exports = router;

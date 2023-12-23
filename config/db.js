const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Conexión exitosa a MongoDB Atlas :D");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB Atlas >:(", error);
  });

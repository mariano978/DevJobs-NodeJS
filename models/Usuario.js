const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: "Agrega tu nombre",
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
  expira: Date,
});

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

module.exports = mongoose.model("Usuario", usuarioSchema);

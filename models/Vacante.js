const mongoose = require("mongoose");
const slug = require("slug");
const shortid = require("shortid");
const mongoosePaginate = require('mongoose-paginate-v2');

const vacanteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: "El nombre de la vacante es obligatorio",
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    required: "Ubicacion obligatoria",
    trim: true,
  },
  salario: {
    type: String,
    trim: true,
    defaut: 0,
  },
  contrato: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

vacanteSchema.pre("save", function (next) {
  console.log(this.titulo);
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

vacanteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Vacante", vacanteSchema, "vacantes");

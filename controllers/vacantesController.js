formularioCrear = (req, res) => {
  res.render("vacantes/crud/crear", { barra: true });
};

crear = (req, res) => {};

module.exports = {
  formularioCrear,
  crear,
};

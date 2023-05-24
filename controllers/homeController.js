exports.mostrarTrabajos = (req, res) => {
  res.render("home", {
    nombrePagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para Desarrolladores Web",
    barra: true,
    boton: true,
  });
};

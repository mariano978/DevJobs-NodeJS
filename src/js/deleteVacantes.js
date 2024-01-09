const axios = require("axios");
const Swal = require("sweetalert2");

document.addEventListener("DOMContentLoaded", () => {
  const eliminarVacanteDOM = (btnDeleteThisVacante) => {
    const contenedorVacante = btnDeleteThisVacante.parentElement.parentElement;
    contenedorVacante.remove();
    //Como tengo la paginacion del lado del servidor no me queda otra que recargar
    window.location.reload();
  };

  const axiosDeleteVacante = (id) => {
    return new Promise((resolve, reject) => {
      console.log(id);
      axios
        .delete(`/vacantes/eliminar/${id}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleEliminarVacante = (e) => {
    const id = e.target.dataset.eliminar;
    if (id) {
      Swal.fire({
        title: "Estas seguro?",
        text: "Se eliminara la vacante !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c80045",
        cancelButtonColor: "#00a4b6",
        confirmButtonText: "Si, borrar",
      }).then((result) => {
        if (result.isConfirmed) {
          //Enviar peticion con axios
          axiosDeleteVacante(id)
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                eliminarVacanteDOM(e.target);
              }
            })
            .catch((err) => {
              Swal.fire({
                title: "Oops...",
                text: "Algo salió mal",
                icon: "error",
              });
            });
        }
      });
    }
  };

  const btnsEliminar = document.querySelectorAll("#deleteVacante");
  if (btnsEliminar) {
    btnsEliminar.forEach((btnEliminar) => {
      btnEliminar.onclick = handleEliminarVacante;
    });
  }
});

const inputBuscador = document.querySelector(".buscar");
const apiUrlBuscador = "/find";
const cajaBusqueda = document.querySelector(".caja-busqueda");
const lupa = document.querySelector("#lupa");
const quitButton = document.querySelector("#quit");
const menuMobile = document.querySelector(".busqueda-mobile");
const divBuscador = document.querySelector(".buscador");

lupa.addEventListener("click", menuBusqueda);
quitButton.addEventListener("click", quitMenuBusqueda);
inputBuscador.addEventListener("input", buscar);

function buscar(event) {
  const termino = event.target.value;
  if (termino.length > 1) {
    fetch(apiUrlBuscador, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ termino }),
    })
      .then((response) => response.json())
      .then((data) => {
        mostrarVacantes(data.vacantes);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    removerAllChilds(cajaBusqueda);
  }
}

function mostrarVacantes(vacantes) {
  vacantes.forEach((vacante) => {
    const liVacante = document.createElement("LI");
    liVacante.classList.add("resultado-busqueda");
    liVacante.textContent = vacante.titulo;
    if (window.innerWidth > 768) {
      removerAllChilds(cajaBusqueda);
      cajaBusqueda.appendChild(liVacante);
    } else {
      //esta en un mobile
      removerAllChilds(menuMobile);
      menuMobile.appendChild(liVacante);
    }
  });
}

function removerAllChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function menuBusqueda() {
  if (window.innerWidth <= 768) {
    menuMobile.style.display = "block";
    inputBuscador.style.display = "block";
    inputBuscador.focus();
    lupa.style.display = "none";
    quitButton.style.display = "block";
    divBuscador.style.position = "fixed";
  }
}

function quitMenuBusqueda(event) {
  removerAllChilds(cajaBusqueda);
  removerAllChilds(menuMobile);
  menuMobile.style.display = "none";
  inputBuscador.style.display = "none";
  inputBuscador.value = "";
  lupa.style.display = "block";
  quitButton.style.display = "none";
  divBuscador.style.position = "absolute";
}

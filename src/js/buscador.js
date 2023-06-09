const apiUrlBuscador = "/find";
const inputBuscador = document.querySelector(".buscar");

const cajaBusqueda = document.querySelector(".caja-busqueda");
const menuMobile = document.querySelector(".busqueda-mobile");

const lupa = document.querySelector("#lupa");
const quitButton = document.querySelector("#quit");

const divBuscador = document.querySelector(".buscador");

lupa.addEventListener("click", MostarMenuBusqueda);
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
    removerAllChilds(menuMobile);
  }
}

function mostrarVacantes(vacantes) {
  removerAllChilds(cajaBusqueda);
  removerAllChilds(menuMobile);

  vacantes.forEach((vacante) => {
    const liVacante = generarVacantesResultado(vacante);

    if (estaEnMobile()) {
      menuMobile.appendChild(liVacante);
    } else {
      cajaBusqueda.appendChild(liVacante);
    }
  });
}

function estaEnMobile() {
  return window.innerWidth <= 768;
}

function generarVacantesResultado(vacante) {
  const liVacante = document.createElement("LI");
  liVacante.classList.add("resultado-busqueda");

  const div = document.createElement("DIV");
  div.classList.add("resultado-izquierda");

  const empresa = document.createElement("H3");
  empresa.classList.add("resultado-empresa");
  empresa.textContent = vacante.empresa;

  const titulo = document.createElement("P");
  titulo.classList.add("resultado-texto");
  titulo.textContent = vacante.titulo;

  const enlaceVacante = document.createElement("A");
  enlaceVacante.classList.add("btn", "btn-verde");
  enlaceVacante.textContent = "Más Info.";
  enlaceVacante.setAttribute("href", `/vacantes/${vacante.url}`);

  div.append(empresa, titulo);
  liVacante.append(div, enlaceVacante);

  console.log(liVacante);

  return liVacante;
}

function removerAllChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function MostarMenuBusqueda() {
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

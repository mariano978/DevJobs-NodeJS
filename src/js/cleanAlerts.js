document.addEventListener("DOMContentLoaded", () => {
  const alertas = document.querySelector(".alertas");
  let intervalCleaner;
  const limpiarAlertas = () => {
    if (alertas.children.length > 0) {
      intervalCleaner = setInterval(() => {
        alertas.removeChild(alertas.children[0]);
      }, 2000);
      return;
    }
    alertas.parentElement.removeChild(alertas);
    if (intervalCleaner) {
      clearInterval(intervalCleaner);
    }
  };

  if (alertas) {
    //limpiarAlertas();
  }
});

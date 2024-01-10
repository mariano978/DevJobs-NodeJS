/**
 * Realiza una copia profunda de un objeto para su uso en plantillas Handlebars.
 *
 * @param {Object} obj - El objeto que se va a copiar.
 * @returns {Object} - Una nueva instancia del objeto sin referencias compartidas.
 *
 * @description
 * En plantillas Handlebars, es común necesitar una copia independiente de un objeto para evitar
 * efectos secundarios no deseados al manipular datos. Esta función utiliza la serialización JSON
 * para realizar una copia profunda, garantizando que no hayan referencias compartidas entre el
 * objeto original y la copia. Esto es particularmente útil cuando se envían datos complejos a las
 * plantillas y se desea mantener la simplicidad y seguridad, evitando la manipulación directa de
 * objetos complejos desde las plantillas.
 */

exports.cloneObject = (object) => {
  //retorna una copia del obejeto que recibe
  //esto es util p
  return JSON.parse(JSON.stringify(object));
};

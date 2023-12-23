const seleccionarSkills = (seleccionadas = []) => {
  const skills = [
    "HTML5",
    "CSS3",
    "CSSGrid",
    "Flexbox",
    "JavaScript",
    "jQuery",
    "Node",
    "Angular",
    "VueJS",
    "ReactJS",
    "React Hooks",
    "Redux",
    "Apollo",
    "GraphQL",
    "TypeScript",
    "PHP",
    "Laravel",
    "Symfony",
    "Python",
    "Django",
    "ORM",
    "Sequelize",
    "Mongoose",
    "SQL",
    "MVC",
    "SASS",
    "WordPress",
  ];

  let html = "";

  skills.forEach((skill) => {
    html += `<li ${
      seleccionadas.includes(skill) ? 'class="activo"' : ""
    }  >${skill}</li>`;
  });

  return html;
};

const tipoContrato = (seleccionado, opciones) => {
  let contenidoHelper = opciones.fn(this);

  contenidoHelper = contenidoHelper.replace(
    ` value="${seleccionado}"`,
    "$& selected"
  );

  contenidoHelper = contenidoHelper.replace(
    "<option disabled selected>--Selecciona--</option>",
    "<option disabled>--Selecciona--</option>"
  );

  return contenidoHelper;
};

const mostrarAlertas = (messages = {}, alertas) => {
  const msgTypes = Object.keys(messages); //error, correcto...
  let msgHtml = "";
  if (msgTypes.lenght !== 0) {
    msgTypes.forEach((msgType) => {
      const messagesThisType = messages[msgType]; //Aca tenemos los mensajes de alguno de los tipos (ej. errores)
      messagesThisType.forEach((message) => {
        msgHtml += `<div class="${msgType}">${message}</div>`;
      });
    });
  }

  //Iyectamos HTML
  return (alertas.fn().html = msgHtml);
};

module.exports = {
  seleccionarSkills,
  tipoContrato,
  mostrarAlertas,
};

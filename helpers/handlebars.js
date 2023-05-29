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

module.exports = {
  seleccionarSkills,
  tipoContrato,
};

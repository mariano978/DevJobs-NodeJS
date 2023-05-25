document.currentScript.setAttribute("async", "true");

document.addEventListener("DOMContentLoaded", () => {
  const ul_skills = document.querySelector(".lista-conocimientos");

  if (ul_skills) {
    ul_skills.addEventListener("click", toggleSkill);
  }
});

//la ventaja de usar set en lugar de un arreglo
//es que set solo agregara los elementos una vez
//y no se duplican

const skillsList = new Set();

const toggleSkill = (event) => {
  const skillClicked = event.target;

  if (skillClicked.tagName === "LI") {
    const skillName = skillClicked.textContent;

    if (skillsList.has(skillName)) {
      skillsList.delete(skillName);
    } else {
      skillsList.add(skillName);
    }

    skillClicked.classList.toggle("activo");

    console.log(skillsList);
  }

  const inputHiddenSkills = document.querySelector("#skills");

  const skillsListArray = [...skillsList];

  inputHiddenSkills.value = skillsListArray;
};

import Trix from "trix";
import "trix/dist/trix.css";

document.currentScript.setAttribute('async', 'true');

setTimeout(() => {
  const trixEditor = document.querySelector("trix-editor");
  trixEditor.style.borderRadius = 0;
}, 0);

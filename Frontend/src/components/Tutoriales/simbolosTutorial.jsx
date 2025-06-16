import React from "react";
import "../../styles/Tutoriales/simbolsTutorial.css";

const SimbolosTutorial = ({ onResume }) => {
  return (
    <div className="simbolos-tutorial">
      <h2>Instrucciones</h2>
      <div className="simbolos-tutorial-container">
        <img
          src="/simbolosTutorial.png"
          alt="Simbolos Example"
          className="simbolos-example"
        />
        <p>
          En esta prueba trabajarás tu memoria a corto plazo. Se presentará un
          icono en la parte superior de la pantalla, cada símbolo esta
          relacionado con una letra que podrás observar en las opciones de la
          parte inferior. Los iconos desaparecerán de las opciones y se
          mostrarán únicamente las letras que representan a los iconos.
        </p>
        <p>
          El objetivo es seleccionar la opción correcta, recordando cual era la
          letra que correspondía con el símbolo que se esta mostrando.
        </p>
      </div>

      <button className="simbolos-btn-continuar" onClick={onResume}>
        Continuar
      </button>
    </div>
  );
};

export default SimbolosTutorial;

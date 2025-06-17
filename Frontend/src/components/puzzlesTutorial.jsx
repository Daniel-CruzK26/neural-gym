import React from "react";
import "../styles/Tutoriales/StroopTutorial.css";

const PuzzlesTutorial = ({ onResume }) => {
  return (
    <div className="stroop-tutorial">
      <h2>Instrucciones</h2>
      <div className="stroop-tutorial-container">
        <img
          src="/stroopIns.png"
          alt="Stroop instrucción"
          className="stroop-example"
        />
        <p>
          En esta prueba deberás poner atención al dibujo que aparece en la
          parte superior de la pantalla, este dibujo estará compuesto por
          diferentes figuras geométricas
        </p>
        <p>
          El objetivo es seleccionar las 3 figuras geométricas que unidas forman
          el dibujo.
        </p>
        <p>Esta prueba trabaja tu razonamiento espacial y geométrico.</p>
      </div>

      <button className="stroop-btn-continuar" onClick={onResume}>
        Continuar
      </button>
    </div>
  );
};

export default PuzzlesTutorial;

import React from "react";
import "../styles/Tutoriales/puzzlesTutorial.css";

const PuzzlesTutorial = ({ onResume }) => {
  return (
    <div className="puzzles-tutorial">
      <h2>Instrucciones</h2>
      <div className="puzzles-tutorial-container">
        <img
          src="/puzzlesTutorial.png"
          alt="puzzles instrucción"
          className="puzzles-example"
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

      <button className="puzzles-btn-continuar" onClick={onResume}>
        Continuar
      </button>
    </div>
  );
};

export default PuzzlesTutorial;

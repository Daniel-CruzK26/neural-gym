import React from "react";
import "../styles/Tutoriales/StroopTutorial.css";

const StroopTutorial = ({ onResume }) => {
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
          Observa con atención la palabra del centro en la pantalla. Aparecerán
          6 opciones con el nombre de diferentes colores, deberás seleccionar la
          opción que corresponda al color con el que esta escrita la palabra
          superior.
        </p>
        <p>
          En este ejemplo la opción correcta sería "Azul" aunque la palabra diga
          "Naranja".
        </p>
      </div>

      <button className="stroop-btn-continuar" onClick={onResume}>
        Continuar
      </button>
    </div>
  );
};

export default StroopTutorial;

import React, { useState, useEffect } from "react";
import "../../styles/Tutoriales/StroopTutorial.css";

const StroopTutorial = ({ onResume }) => {
  const [step, setStep] = useState(0);
  const siguiente = () => setStep((prev) => prev + 1);
  const anterior = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (step >= 4) {
      onResume?.();
    }
  }, [step]);

  return (
    <div className="stroop-tutorial">
      <h2>Instrucciones</h2>
      <div className="stroop-tutorial-container">
        <div className="stroop-img-container">
          {step == 0 ? (
            <img
              src="/stroopTutorial1.png"
              alt="stroop Example"
              className="stroop-example"
            />
          ) : step == 1 ? (
            <img
              src="/stroopTutorial2.png"
              alt="stroop Example"
              className="stroop-example"
            />
          ) : step == 2 ? (
            <img
              src="/stroopTutorial3.png"
              alt="stroop Example"
              className="stroop-example"
            />
          ) : (
            step == 3 && (
              <img
                src="/stroopTutorial4.png"
                alt="stroop Example"
                className="stroop-example"
              />
            )
          )}
        </div>

        <div className="stroop-text-container">
          {step == 0 ? (
            <p>
              Esta prueba trabaja tu atención, para esto se presentará el nombre
              de algún color en la parte superior central de la pantalla.
            </p>
          ) : step == 1 ? (
            <p>
              Las opciones estan conformadas por los nombres de diferentes
              colores El objetivo es seleccionar el nombre del color con el que
              esta coloreada la palabra central.
            </p>
          ) : step == 2 ? (
            <p>
              En este ejemplo, la respuesta correcta sería "Morado" a pesar de
              que la palabra central sea "Naranja".
            </p>
          ) : (
            step == 3 && (
              <p>
                Si contestas correctamente 10 veces seguidas y eres lo
                suficientemente rápido, las respuestas cambiaran de color para
                confundirte.
              </p>
            )
          )}
        </div>
      </div>

      {step > 0 ? (
        <div className="btns-container">
          <button className="stroop-btn-continuar" onClick={anterior}>
            Anterior
          </button>
          <button className="stroop-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="btns-container">
          <button className="stroop-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default StroopTutorial;

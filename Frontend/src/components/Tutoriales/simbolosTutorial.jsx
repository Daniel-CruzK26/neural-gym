import React, { useState, useEffect } from "react";
import "../../styles/Tutoriales/simbolsTutorial.css";

const SimbolosTutorial = ({ onResume }) => {
  const [step, setStep] = useState(0);
  const siguiente = () => setStep((prev) => prev + 1);
  const anterior = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (step >= 3) {
      onResume?.();
    }
  }, [step]);

  return (
    <div className="simbolos-tutorial">
      <h2>Instrucciones</h2>
      <div className="simbolos-tutorial-container">
        <div className="simbols-img-container">
          {step == 0 ? (
            <img
              src="/SimbolsTutorial1.png"
              alt="Simbolos Example"
              className="simbolos-example"
            />
          ) : step == 1 ? (
            <img
              src="/SimbolsTutorial2.png"
              alt="Simbolos Example"
              className="simbolos-example"
            />
          ) : (
            step == 2 && (
              <img
                src="/SimbolsTutorial3.png"
                alt="Simbolos Example"
                className="simbolos-example"
              />
            )
          )}
        </div>

        <div className="simbols-text-container">
          {step == 0 ? (
            <p>
              En esta prueba trabajarás tu memoria a corto plazo. Cada símbolo
              esta relacionado con una letra que podrás observar en las opciones
              de la parte inferior.
            </p>
          ) : step == 1 ? (
            <p>
              Los iconos desaparecerán de las opciones y se mostrarán únicamente
              las letras que representan a los íconos.
            </p>
          ) : (
            step == 2 && (
              <p>
                El objetivo es seleccionar la opción que contenga la letra que
                corresponde al ícono mostrado en la parte superior de la
                pantalla.
              </p>
            )
          )}
        </div>
      </div>

      {step > 0 ? (
        <div className="btns-container">
          <button className="simbolos-btn-continuar" onClick={anterior}>
            Anterior
          </button>
          <button className="simbolos-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="btns-container">
          <button className="simbolos-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default SimbolosTutorial;

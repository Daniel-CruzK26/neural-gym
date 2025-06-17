import React, { useState, useEffect } from "react";
import "../../styles/Tutoriales/MeaningTutorial.css";

const MeaningTutorial = ({ onResume }) => {
  const [step, setStep] = useState(0);
  const siguiente = () => setStep((prev) => prev + 1);
  const anterior = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (step >= 4) {
      onResume?.();
    }
  }, [step]);

  return (
    <div className="meaning-tutorial">
      <h2>Instrucciones</h2>
      <div className="meaning-tutorial-container">
        <div className="meaning-img-container">
          {step == 0 ? (
            <img
              src="/meaningTutorial1.png"
              alt="meaning Example"
              className="meaning-example"
            />
          ) : step == 1 ? (
            <img
              src="/meaningTutorial2.png"
              alt="meaning Example"
              className="meaning-example"
            />
          ) : step == 2 ? (
            <img
              src="/meaningTutorial3.png"
              alt="meaning Example"
              className="meaning-example"
            />
          ) : (
            step == 3 && (
              <img
                src="/meaningTutorial4.png"
                alt="meaning Example"
                className="meaning-example"
              />
            )
          )}
        </div>

        <div className="meaning-text-container">
          {step == 0 ? (
            <p>
              Esta prueba consiste en poner atención a la instrucción que
              aparece en la parte superior de la palabra central en la pantalla,
              a su vez que pones atención en la palabra central.
            </p>
          ) : step == 1 ? (
            <p>
              Las opciones estan conformadas por números e íconos de diferentes
              colores. El objetivo es seleccionar la opción correcta dependiendo
              la instrucción que aparezca al centro de la pantalla.
            </p>
          ) : step == 2 ? (
            <p>
              Por ejemplo, en este caso la instrucción es "COLOR" por lo que la
              opción correcta sería el ícono o número que sea del mismo color
              que la palabra central, para este caso la respuesta es la
              "estrella" a pesar de que la palabra central dice "cruz".
            </p>
          ) : (
            step == 3 && (
              <>
                <p>
                  Para este otro caso, la instrucción es "SIGNIFICADO" por lo
                  que la respuesta sería el ícono "Cruz", dejando de lado el
                  color en el que esta escrita la palabra.
                </p>
                <p>
                  En esta prueba se trabaja tu capacidad de atención y
                  resistencia a diferentes estímulos.
                </p>
              </>
            )
          )}
        </div>
      </div>

      {step > 0 ? (
        <div className="btns-container">
          <button className="meaning-btn-continuar" onClick={anterior}>
            Anterior
          </button>
          <button className="meaning-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="btns-container">
          <button className="meaning-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default MeaningTutorial;

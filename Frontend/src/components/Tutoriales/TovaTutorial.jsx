import React, { useState, useEffect } from "react";
import "../../styles/Tutoriales/TovaTutorial.css";

const TovaTutorial = ({ onResume }) => {
  const [step, setStep] = useState(0);
  const siguiente = () => setStep((prev) => prev + 1);
  const anterior = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (step >= 4) {
      onResume?.();
    }
  }, [step]);

  return (
    <div className="tova-tutorial">
      <h2>Instrucciones</h2>
      <div className="tova-tutorial-container">
        <div className="tova-img-container">
          {step == 0 ? (
            <img
              src="/tovaTutorial1.png"
              alt="tova Example"
              className="tova-example"
            />
          ) : step == 1 ? (
            <img
              src="/tovaTutorial2.png"
              alt="tova Example"
              className="tova-example"
            />
          ) : step == 2 ? (
            <img
              src="/tovaTutorial3.png"
              alt="tova Example"
              className="tova-example"
            />
          ) : (
            step == 3 && (
              <img
                src="/tovaTutorial4.png"
                alt="tova Example"
                className="tova-example"
              />
            )
          )}
        </div>

        <div className="tova-text-container">
          {step == 0 ? (
            <p>
              Durante el tiempo que dure la prueba se mostrarán diferentes
              números (del 1 al 9) en el circulo central en la pantalla. Tu
              objetivo es presionar el botón lo más rápido posible cada vez que
              el número mostrado sea diferente al número objetivo.
            </p>
          ) : step == 1 ? (
            <p>
              Cada número se muestra únicamente 0.4s, cuando el circulo este en
              color amarillo puedes presionar el botón. Solo tienes 1 segundo
              para decidir si presionas el botón o no.
            </p>
          ) : step == 2 ? (
            <p>
              Si presionaste el botón cuando el número mostrado era distinto al
              número objetivo, el circulo se iluminará en verde. Si el número
              mostrado es el objetivo, no presiones el botón y al pasar 1
              segundo, se iluminará en color verde.
            </p>
          ) : (
            step == 3 && (
              <>
                <p>
                  Si presionas el botón cuando el número mostrado fue el
                  objetivo, el circulo se iluminará en rojo.
                </p>
                <p>Esta prueba trabaja tu atención y velocidad de respuesta.</p>
              </>
            )
          )}
        </div>
      </div>

      {step > 0 ? (
        <div className="btns-container">
          <button className="tova-btn-continuar" onClick={anterior}>
            Anterior
          </button>
          <button className="tova-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="btns-container">
          <button className="tova-btn-continuar" onClick={siguiente}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default TovaTutorial;

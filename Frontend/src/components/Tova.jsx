import React, { useRef, useState, forwardRef, useEffect } from "react";
import "../styles/TOVA/TovaTest.css";

const TovaTest = forwardRef(
  (
    { onCorrect, onRespuestaMedida, onIncorrect, isPaused, isInstruction },
    ref
  ) => {
    const [shownNumber, setShownNumber] = useState(0);
    const [numObj, setNumObj] = useState(0);
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [show, setShow] = useState(true);
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());
    const [showObjetive, setShowObjetive] = useState(true);

    const clickPushRef = useRef(false);
    const timeoutIdRef = useRef(null);

    const generarRandom = (anterior) => {
      let n;
      do {
        n = Math.floor(Math.random() * 9) + 1; // 1‒9
      } while (n === anterior); // rehacer si se repite
      return n;
    };

    const evaluarRespuesta = () => {
      const correcta = numObj !== shownNumber;
      return correcta;
    };

    const toggleSeleccion = () => {
      if (isPaused || isInstruction) return;
      clearTimeout(timeoutIdRef.current);
      clickPushRef.current = true;

      if (evaluarRespuesta()) {
        const tiempoRespuesta = Date.now() - tiempoInicio;
        onRespuestaMedida?.(tiempoRespuesta);
        onCorrect?.();
        setEstadoRespuesta("correcto");
      } else {
        onIncorrect?.();
        setEstadoRespuesta("incorrecto");
      }

      setTimeout(() => {
        setEstadoRespuesta("");
        showNewNumber();
      }, 800);
    };

    const showNewNumber = () => {
      clickPushRef.current = false;
      setTiempoInicio(Date.now());
      setShownNumber((prev) => generarRandom(prev));
      setEstadoRespuesta("showing");
      setShow(true);

      setTimeout(() => {
        setShow(false);
        setEstadoRespuesta("waiting");
      }, 250);
    };

    useEffect(() => {
      setNumObj((prev) => generarRandom(prev));

      setTimeout(() => {
        setShowObjetive(false);
        showNewNumber();
      }, 1000);
    }, []);

    useEffect(() => {
      if (clickPushRef.current) return;

      timeoutIdRef.current = setTimeout(() => {
        if (!evaluarRespuesta()) {
          onCorrect?.();
          setEstadoRespuesta("correcto");
        } else {
          onIncorrect?.();
          setEstadoRespuesta("incorrecto");
        }

        setTimeout(() => {
          setEstadoRespuesta("");
          showNewNumber();
        }, 800);
      }, 1250);

      return () => clearTimeout(timeoutIdRef.current);
    }, [shownNumber]);

    return (
      <div className="tova-wrapper">
        {showObjetive ? (
          <h1 className="num-objetive">Número objetivo: {numObj}</h1>
        ) : (
          <>
            <div className={`number-display ${estadoRespuesta}`}>
              {show ? <h2 className="number">{shownNumber}</h2> : <h2></h2>}
            </div>
            <button className="btn-action" onClick={toggleSeleccion}></button>
          </>
        )}
      </div>
    );
  }
);

export default TovaTest;

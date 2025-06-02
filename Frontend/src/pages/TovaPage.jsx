import React, { useState, useRef, useEffect } from "react";
import GameHeader from "../components/GameHeader";
import TovaTest from "../components/Tova";
import Resultados from "../components/Resultados";
import "../styles/TOVA/Tovapage.css";

export default function TovaPage() {
  const [score, setScore] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const tovaref = useRef();
  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);

  const onTimeEnd = () => {
    setShowResultados(true);
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  const incrementarScore = () => setScore((prev) => prev + 1);

  const respIncorrecta = () => setIncorrectas((prev) => prev + 1);

  const pasarNivel = () => {
    if (incorrectas < 4) {
      if (tovaref.current) {
        tovaref.current.newOption();
      }
    }
    setIncorrectas(0);
  };

  const reiniciarJuego = () => {
    setScore(0);
    setIncorrectas(0);
    setTiempos([]);
    setShowResultados(false);
    setResetTimerSignal((prev) => prev + 1);

    if (tovaref.current) {
      tovaref.current.reiniciarPrueba();
    }
  };

  useEffect(() => {
    if (tovaref.current) {
      tovaref.current.reiniciarPrueba();
    }
  }, []);

  return (
    <div className="tova-container">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
      />

      <TovaTest
        ref={tovaref}
        onCorrect={incrementarScore}
        onRespuestaMedida={agregarTiempoRespuesta}
        onIncorrect={respIncorrecta}
        onFinPruebas={pasarNivel}
      />
      {showResultados && (
        <div className="overlay">
          <Resultados
            puntaje={score}
            velocidad={velocidadPromedio()}
            onContinuar={reiniciarJuego}
            causa={"tiempo"}
          />
        </div>
      )}
    </div>
  );
}

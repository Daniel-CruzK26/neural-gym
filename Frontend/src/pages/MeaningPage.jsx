import React, { useState, useRef, useEffect } from "react";
import MeaningTest from "../components/Meaning";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import "../styles/Meaning/MeaningPage.css";

export default function MeaningPage() {
  const [score, setScore] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [nivelActual, setNivel] = useState(6);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const meamingRef = useRef();
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
    let nivel = nivelActual;
    if (incorrectas < 4) {
      nivel = nivelActual + 1;
      setNivel((prev) => prev + 1);
    }

    setIncorrectas(0);
    if (meamingRef.current) {
      meamingRef.current.pasarNivel(nivel);
    }
  };

  const reiniciarJuego = () => {
    setScore(0);
    setIncorrectas(0);
    setTiempos([]);
    setShowResultados(false);
    setResetTimerSignal((prev) => prev + 1);

    if (meamingRef.current) {
      meamingRef.current.reiniciarPrueba(6);
    }
  };

  useEffect(() => {
    if (meamingRef.current) {
      meamingRef.current.reiniciarPrueba(6);
    }
  }, []);

  return (
    <div className="app-container">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        prueba="Meaning"
      />
      <MeaningTest
        ref={meamingRef}
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

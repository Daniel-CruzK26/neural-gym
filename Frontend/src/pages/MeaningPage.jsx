import React, { useState, useRef, useEffect } from "react";
import MeaningTest from "../components/Meaning";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import { useNavigate } from "react-router-dom";
import "../styles/Meaning/MeaningPage.css";

export default function MeaningPage() {
  const [score, setScore] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [nivelActual, setNivel] = useState(6);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // 👈 PAUSA
  const meaningRef = useRef();
  const navigate = useNavigate();

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

  const reiniciarJuego = () => {
    setScore(0);
    setIncorrectas(0);
    setTiempos([]);
    setShowResultados(false);
    setResetTimerSignal((prev) => prev + 1);
    setNivel(6);
    if (meaningRef.current) {
      meaningRef.current.reiniciarPrueba(nivelActual);
    }
  };

  useEffect(() => {
    if (meaningRef.current) {
      meaningRef.current.pasarNivel(nivelActual);
    }
  }, [nivelActual]);

  return (
    <div className="app-container-meaning">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        onPauseToggle={() => setIsPaused(true)} // 👈 botón "pausar"
        isPaused={isPaused}
      />

      {/* 👇 Componente principal de prueba */}
      <MeaningTest
        ref={meaningRef}
        onCorrect={incrementarScore}
        onIncorrect={respIncorrecta}
        onRespuestaMedida={agregarTiempoRespuesta}
        onFinPruebas={() => setShowResultados(true)}
        isPaused={isPaused} // 👈 se pasa a MeaningTest
      />

      {/* 👇 Resultados */}
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

      {/* 👇 Pausa activa */}
      {isPaused && (
        <div className="overlay">
          <div className="pause-menu">
            <h2>Juego en Pausa</h2>
            <button onClick={() => setIsPaused(false)}>Reanudar</button>
            <button onClick={() => navigate("/main-menu")}>Salir</button>
          </div>
        </div>
      )}
    </div>
  );
}

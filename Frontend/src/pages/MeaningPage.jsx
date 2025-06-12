import React, { useState, useRef, useEffect } from "react";
import MeaningTest from "../components/Meaning";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import { useNavigate } from "react-router-dom";
import Pausa from "../components/Pausa";
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
  const incrementarNivel = () => setNivel((prev) => prev + 1);

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const volverMenuPrincipal = () => {
    navigate("/main-menu"); // Cambia "/" por la ruta que sea tu menú principal
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
        onPauseToggle={handlePauseToggle}
        isPaused={isPaused}
      />

      {/* 👇 Componente principal de prueba */}
      <MeaningTest
        ref={meaningRef}
        onCorrect={incrementarScore}
        onIncorrect={respIncorrecta}
        onRespuestaMedida={agregarTiempoRespuesta}
        onFinPruebas={incrementarNivel}
        isPaused={isPaused} // 👈 se pasa a MeaningTest
      />

      {/* 👇 Resultados */}
      {showResultados && (
        <div className="overlay">
          <Resultados
            puntaje={score}
            velocidad={velocidadPromedio()}
            onContinuar={volverMenuPrincipal}
            causa={"tiempo"}
          />
        </div>
      )}

      {isPaused && (
        <div className="overlay">
          <Pausa
            onResume={() => setIsPaused(false)}
            onExit={volverMenuPrincipal}
          />
        </div>
      )}
    </div>
  );
}

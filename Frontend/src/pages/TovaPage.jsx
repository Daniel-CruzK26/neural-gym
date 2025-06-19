import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../components/GameHeader";
import TovaTest from "../components/Tova";
import Resultados from "../components/Resultados";
import Pausa from "../components/Pausa";
import TovaTutorial from "../components/Tutoriales/TovaTutorial";
import "../styles/TOVA/TovaPage.css";

export default function TovaPage() {
  const [score, setScore] = useState(0);
  const [totalPruebas, setTotalPruebas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInstruction, setInstructions] = useState(true);
  const navigate = useNavigate();
  const tovaRef = useRef();

  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);

  const incrementarScore = () => {
    const puntaje = score;
    setScore((prev) => prev + 1);

    if (puntaje !== 0 && puntaje % 15 === 0) {
      if (tovaRef.current) {
        tovaRef.current.newOption();
      }
    }
  };
  const incrementarPruebas = () => setTotalPruebas((prev) => prev + 1);

  const onTimeEnd = () => {
    setShowResultados(true);
  };

  const precision = () => {
    if (totalPruebas === 1) return 0;
    const precision = (score / totalPruebas) * 100;
    return precision.toFixed(2);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const handleInstructionToggle = () => {
    setInstructions((prev) => !prev);
  };

  const volverMenuPrincipal = () => {
    navigate("/main-menu"); // Cambia "/" por la ruta que sea tu menú principal
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  return (
    <div className="app-container-stoop">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        isInstruction={isInstruction}
        onPauseToggle={handlePauseToggle}
        onInstructionToggle={handleInstructionToggle}
      />
      {!isInstruction && !showResultados && (
        <TovaTest
          ref={tovaRef}
          onCorrect={incrementarScore}
          onRespuestaMedida={agregarTiempoRespuesta}
          incrementarPruebas={incrementarPruebas}
          isPaused={isPaused}
          isInstruction={isInstruction}
        />
      )}

      {isPaused && (
        <div className="overlay">
          <Pausa
            onResume={() => setIsPaused(false)}
            onExit={volverMenuPrincipal}
          />
        </div>
      )}
      {showResultados && (
        <div className="overlay">
          <Resultados
            puntaje={score}
            velocidad={velocidadPromedio()}
            precision={precision()}
            onContinuar={volverMenuPrincipal}
          />
        </div>
      )}

      {isInstruction && (
        <div className="overlay-instruction">
          <TovaTutorial onResume={() => setInstructions(false)} />
        </div>
      )}
    </div>
  );
}

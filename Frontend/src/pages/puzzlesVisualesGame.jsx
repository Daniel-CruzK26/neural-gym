import React, { useState, useRef, useEffect } from "react";
import PuzzleVisualGame from "../components/puzzlesVisuales";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import { useNavigate } from "react-router-dom";
import Pausa from "../components/Pausa";
import "../styles/PuzzlesVisuales/PuzzlesPage.css";
import PuzzlesTutorial from "../components/puzzlesTutorial";

export default function PuzzlePage() {
  const [score, setScore] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [causaFinalizacion, setCausaFinalizacion] = useState("");
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [totalPruebas, setTotalPruebas] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ Estado para pausa
  const [isInstruction, setInstructions] = useState(true);

  const puzzleRef = useRef();
  const navigate = useNavigate();

  const incrementarScore = () => setScore((prev) => prev + 1);
  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);
  const incrementarPruebas = () => setTotalPruebas((prev) => prev + 1);

  const onTimeEnd = () => {
    setCausaFinalizacion("tiempo");
    setShowResultados(true);
  };

  const onPuzzlesCompletados = () => {
    setCausaFinalizacion("puzzles");
    setShowResultados(true);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const precision = () => {
    if (totalPruebas === 1) return 0;
    const precision = (score / totalPruebas) * 100;
    return precision.toFixed(2);
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
    <div className="app-container-puzzles">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        onPauseToggle={handlePauseToggle}
        onInstructionToggle={handleInstructionToggle}
        isInstruction={isInstruction}
      />

      <PuzzleVisualGame
        ref={puzzleRef}
        onCorrect={incrementarScore}
        onRespuestaMedida={agregarTiempoRespuesta}
        onPuzzlesCompletados={onPuzzlesCompletados}
        incrementarPruebas={incrementarPruebas}
        isPaused={isPaused}
        isInstruction={isInstruction}
      />

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
            causa={causaFinalizacion}
          />
        </div>
      )}

      {isInstruction && (
        <div className="overlay-instruction">
          <PuzzlesTutorial onResume={() => setInstructions(false)} />
        </div>
      )}
    </div>
  );
}

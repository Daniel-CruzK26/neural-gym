import React, { useState, useRef } from "react";
import PuzzleVisualGame from "../components/puzzlesVisuales";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import "../styles/PuzzlesVisuales/PuzzlesPage.css";

export default function PuzzlePage() {
  const [score, setScore] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [causaFinalizacion, setCausaFinalizacion] = useState("");
  const [resetTimerSignal, setResetTimerSignal] = useState(0);

  const puzzleRef = useRef();

  const incrementarScore = () => setScore((prev) => prev + 1);
  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);

  const onTimeEnd = () => {
    setCausaFinalizacion("tiempo");
    setShowResultados(true);
  };

  const onPuzzlesCompletados = () => {
    setCausaFinalizacion("puzzles");
    setShowResultados(true);
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  const reiniciarJuego = () => {
    fetch("http://localhost:8000/puzzles-visuales/reiniciar-puzzle/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setScore(0);
        setTiempos([]);
        setShowResultados(false);
        setResetTimerSignal((prev) => prev + 1);
        if (puzzleRef.current) {
          puzzleRef.current.reiniciarPuzzle(); // 🔥 recargar el primer puzzle automáticamente
        }
      })
      .catch((error) => {
        console.error("Error al reiniciar en backend:", error);
      });
  };

  return (
    <div className="app-container-puzzles">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
      />
      <PuzzleVisualGame
        ref={puzzleRef} // 🔥 pasa la referencia
        onCorrect={incrementarScore}
        onRespuestaMedida={agregarTiempoRespuesta}
        onPuzzlesCompletados={onPuzzlesCompletados}
      />

      {showResultados && (
        <div className="overlay">
          <Resultados
            puntaje={score}
            velocidad={velocidadPromedio()}
            onContinuar={reiniciarJuego}
            causa={causaFinalizacion}
          />
        </div>
      )}
    </div>
  );
}

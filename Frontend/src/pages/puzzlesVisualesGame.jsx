import React, { useState, useRef, useEffect } from "react";
import PuzzleVisualGame from "../components/puzzlesVisuales";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import { useNavigate } from "react-router-dom"; // ✅ Para navegar al menú principal
import "../styles/PuzzlesVisuales/PuzzlesPage.css";

export default function PuzzlePage() {
  const [score, setScore] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [causaFinalizacion, setCausaFinalizacion] = useState("");
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setPaused] = useState(false); // ✅ Estado para pausa

  const puzzleRef = useRef();
  const navigate = useNavigate(); // ✅

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
        setPaused(false); // ✅ Reinicia pausa
        setResetTimerSignal((prev) => prev + 1);
        if (puzzleRef.current) {
          puzzleRef.current.reiniciarPuzzle();
        }
      })
      .catch((error) => {
        console.error("Error al reiniciar en backend:", error);
      });
  };

  const handlePauseToggle = () => {
    setPaused(true);
  };

  return (
    <div className="app-container-puzzles">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        onPauseToggle={handlePauseToggle}
      />

      {!isPaused && (
        <PuzzleVisualGame
          ref={puzzleRef}
          onCorrect={incrementarScore}
          onRespuestaMedida={agregarTiempoRespuesta}
          onPuzzlesCompletados={onPuzzlesCompletados}
        />
      )}

      {isPaused && (
        <div className="overlay">
          <div className="pause-menu">
            <h2>Juego en Pausa</h2>
            <button onClick={() => setPaused(false)}>Reanudar</button>
            <button onClick={() => navigate("/main-menu")}>Salir</button>
          </div>
        </div>
      )}


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

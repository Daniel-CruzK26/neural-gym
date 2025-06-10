import React, { useState, useRef } from "react";
import DigitGame from "../components/Digitos";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import { useNavigate } from "react-router-dom";
import "../styles/Digitos/DigitGamePage.css";

export default function DigitGamePage() {
  const [score, setScore] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [causaFinalizacion, setCausaFinalizacion] = useState("");
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setPaused] = useState(false);

  const digitRef = useRef();
  const navigate = useNavigate();

  const incrementarScore = () => setScore((prev) => prev + 1);
  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);

  const onTimeEnd = () => {
    setCausaFinalizacion("tiempo");
    setShowResultados(true);
  };

  const onSecuenciasCompletadas = () => {
    setCausaFinalizacion("secuencias");
    setShowResultados(true);
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  const reiniciarJuego = () => {
    fetch("http://localhost:8000/digitos/reiniciar-secuencia/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setScore(0);
        setTiempos([]);
        setShowResultados(false);
        setPaused(false);
        setResetTimerSignal((prev) => prev + 1);
        if (digitRef.current) {
          digitRef.current.reiniciarSecuencia();
        }
      })
      .catch((error) => console.error("Error al reiniciar en backend:", error));
  };

  const handlePauseToggle = () => setPaused(true);

  return (
    <div className="app-container-digits">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        onPauseToggle={handlePauseToggle}
      />

      {!isPaused && (
        <DigitGame
          ref={digitRef}
          onCorrect={incrementarScore}
          onRespuestaMedida={agregarTiempoRespuesta}
          onSecuenciasCompletadas={onSecuenciasCompletadas}
          isPaused={isPaused}
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

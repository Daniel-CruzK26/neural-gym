import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../components/GameHeader";
import TovaTest from "../components/Tova";
import Resultados from "../components/Resultados";
import "../styles/StoopTest/StoopPage.css"; // ✅ usamos el mismo CSS que Stoop

export default function TovaPage() {
  const [score, setScore] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ igual que en Stoop

  const navigate = useNavigate();
  const tovaRef = useRef();

  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);
  const incrementarScore = () => setScore((prev) => prev + 1);
  const respIncorrecta = () => setIncorrectas((prev) => prev + 1);

  const onTimeEnd = () => {
    setShowResultados(true);
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  const pasarNivel = () => {
    if (incorrectas < 4 && tovaRef.current) {
      tovaRef.current.newOption();
    }
    setIncorrectas(0);
  };

  const reiniciarJuego = () => {
    setScore(0);
    setIncorrectas(0);
    setTiempos([]);
    setIsPaused(false); // ✅ igual que en Stoop
    setShowResultados(false);
    setResetTimerSignal((prev) => prev + 1);

    if (tovaRef.current) {
      tovaRef.current.reiniciarPrueba();
    }
  };

  useEffect(() => {
    if (tovaRef.current) {
      tovaRef.current.reiniciarPrueba();
    }
  }, []);

  return (
    <div className="app-container-stoop"> {/* ✅ mismo estilo que Stoop */}
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(true)} // ✅ mismo control
      />

      {!isPaused && (
        <TovaTest
          ref={tovaRef}
          onCorrect={incrementarScore}
          onRespuestaMedida={agregarTiempoRespuesta}
          onIncorrect={respIncorrecta}
          onFinPruebas={pasarNivel}
          isPaused={isPaused}
        />
      )}

      {isPaused && (
        <div className="overlay">
          <div className="pause-menu">
            <h2>Juego en Pausa</h2>
            <button onClick={() => setIsPaused(false)}>Reanudar</button>
            <button onClick={() => navigate("/main-menu")}>Salir</button> {/* ✅ */}
          </div>
        </div>
      )}

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

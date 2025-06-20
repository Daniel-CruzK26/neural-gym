import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoopTest from "../components/Stoop";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import Pausa from "../components/Pausa";
import StroopTutorial from "../components/Tutoriales/StroopTutorial";
import "../styles/StoopTest/StoopPage.css";

export default function StoopPage() {
  const [score, setScore] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const [nivelActual, setNivel] = useState(1);
  const [totalPruebas, setTotalPruebas] = useState(0);
  const [racha, setRacha] = useState(0);
  const [incorrectSeguidos, setIncorrectos] = useState(0);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInstruction, setInstructions] = useState(true);
  const navigate = useNavigate();
  const stoopRef = useRef();

  const agregarTiempoRespuesta = (ms) => setTiempos((prev) => [...prev, ms]);
  const incrementarPruebas = () => setTotalPruebas((prev) => prev + 1);

  const onTimeEnd = () => {
    setShowResultados(true);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const handleInstructionToggle = () => {
    setInstructions((prev) => !prev);
  };

  const volverMenuPrincipal = () => {
    navigate("/main-menu");
  };

  const precision = () => {
    if (totalPruebas === 1) return 0;
    const precision = (score / totalPruebas) * 100;
    console.log(totalPruebas);
    console.log(score);
    return precision.toFixed(2);
  };

  const incrementarScore = () => {
    const rachaActual = racha + 1;
    const tiempoPromedio = velocidadPromedio();

    setScore((prev) => prev + 1);
    setRacha((prev) => prev + 1);
    setIncorrectos(0);

    if (rachaActual >= 10 && tiempoPromedio < 3.0) {
      if (nivelActual === 1) {
        setNivel(2);
        setRacha(0);
      } else if (nivelActual === 2) {
        setNivel(3);
        setRacha(0);
      }
    }

    if (rachaActual > 8 && nivelActual === 3) {
      setRacha(0);
      if (stoopRef.current) {
        stoopRef.current.pasarNivel(nivelActual);
      }
    }
  };

  const respIncorrecta = () => {
    setRacha(0);
    const newErrors = incorrectSeguidos + 1;
    setIncorrectos((prev) => prev + 1);

    if (newErrors >= 3) {
      if (nivelActual === 3) {
        setNivel(2);
      } else if (nivelActual === 2) {
        setNivel(1);
      }
      setIncorrectos(0);
    }
  };

  const velocidadPromedio = () => {
    if (tiempos.length === 0) return 0;
    const total = tiempos.reduce((a, b) => a + b, 0);
    return (total / tiempos.length / 1000).toFixed(2);
  };

  useEffect(() => {
    if (stoopRef.current) {
      stoopRef.current.pasarNivel(nivelActual);
    }
  }, [nivelActual]);

  return (
    <div className="app-container-stoop">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        onPauseToggle={handlePauseToggle}
        onInstructionToggle={handleInstructionToggle}
        isPaused={isPaused}
        isInstruction={isInstruction}
      />

      {showResultados && (
        <div className="overlay">
          <Resultados
            puntaje={score}
            velocidad={velocidadPromedio()}
            precision={precision()}
            onContinuar={volverMenuPrincipal}
            causa={"tiempo"}
          />
        </div>
      )}

      <StoopTest
        ref={stoopRef}
        onCorrect={incrementarScore}
        onRespuestaMedida={agregarTiempoRespuesta}
        onIncorrect={respIncorrecta}
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

      {isInstruction && (
        <div className="overlay-instruction">
          <StroopTutorial onResume={() => setInstructions(false)} />
        </div>
      )}
    </div>
  );
}

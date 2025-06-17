import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar hook para navegación
import SimbolosTest from "../components/Simbolos";
import GameHeader from "../components/GameHeader";
import Resultados from "../components/Resultados";
import Pausa from "../components/Pausa";
import "../styles/Simbolos/SimbolosPage.css";
import SimbolosTutorial from "../components/Tutoriales/simbolosTutorial";

export default function SimbolosPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [showResultados, setShowResultados] = useState(false);
  const [isInstruction, setInstructions] = useState(true);
  const [tiempos, setTiempos] = useState([]);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const simbolref = useRef();

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
    if (incorrectas < 4 && simbolref.current) {
      simbolref.current.newOption();
    }
    setIncorrectas(0);
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

  useEffect(() => {
    if (simbolref.current) {
      simbolref.current.reiniciarPrueba();
    }
  }, []);

  return (
    <div className="app-container-simbols">
      <GameHeader
        score={score}
        onTimeEnd={onTimeEnd}
        resetTimerSignal={resetTimerSignal}
        isPaused={isPaused}
        isInstruction={isInstruction}
        onPauseToggle={handlePauseToggle}
        onInstructionToggle={handleInstructionToggle}
      />

      <SimbolosTest
        ref={simbolref}
        onCorrect={incrementarScore}
        onRespuestaMedida={agregarTiempoRespuesta}
        onIncorrect={respIncorrecta}
        onFinPruebas={pasarNivel}
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
            onContinuar={volverMenuPrincipal}
            causa={"tiempo"}
          />
        </div>
      )}

      {isInstruction && (
        <div className="overlay-instruction">
          <SimbolosTutorial onResume={() => setInstructions(false)} />
        </div>
      )}
    </div>
  );
}

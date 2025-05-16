import React, { useEffect, useState, useRef } from "react";
import "../styles/utils/GameHeader.css";

function GameHeader({ score = 0, onTimeEnd, resetTimerSignal }) {
  const TIEMPO_INICIAL = 90;
  const [timeLeft, setTimeLeft] = useState(TIEMPO_INICIAL);
  const timerRef = useRef(null); 

  const iniciarTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(TIEMPO_INICIAL);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (onTimeEnd) onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    iniciarTimer(); // iniciar al cargar
    return () => clearInterval(timerRef.current); // limpiar al desmontar
  }, []);

  useEffect(() => {
    if (resetTimerSignal !== 0) {
      iniciarTimer(); // 🔥 reiniciar al cambiar resetTimerSignal
    }
  }, [resetTimerSignal]);

  return (
    <header className="game-header">
      <div className="icon pause">❚❚</div>
      <div className="score">{score}</div>
      <div className="timer-alert">
        <div className="timer">Tiempo: {timeLeft}</div>
        <div className="icon alert">!</div>
      </div>
    </header>
  );
}

export default GameHeader;



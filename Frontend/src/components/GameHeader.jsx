import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faBook } from "@fortawesome/free-solid-svg-icons";
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
    <div className="game-header-container">
      <header className="game-header">
        <div className="icon-pause">
          <FontAwesomeIcon className="icono-game-header" icon={faPause} />
        </div>
        <div className="score">
          <h5>score</h5>
          <h4>{score}</h4>
        </div>
        <div className="timer-alert">
          <div className="timer">Tiempo: {timeLeft}</div>
          <div className="icon alert">
            <FontAwesomeIcon className="icono-game-header" icon={faBook} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default GameHeader;

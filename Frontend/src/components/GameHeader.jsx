import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faBook } from "@fortawesome/free-solid-svg-icons";
import "../styles/utils/GameHeader.css";

function GameHeader({
  score = 0,
  onTimeEnd,
  resetTimerSignal,
  onPauseToggle,
  onInstructionToggle,
  isPaused,
  isInstruction,
}) {
  const TIEMPO_INICIAL = 90;
  const [timeLeft, setTimeLeft] = useState(TIEMPO_INICIAL);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused || isInstruction) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onTimeEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, isInstruction]);

  useEffect(() => {
    if (resetTimerSignal !== 0) {
      setTimeLeft(TIEMPO_INICIAL);
      if (!isPaused || !isInstruction) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              onTimeEnd?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, [resetTimerSignal, isPaused, isInstruction]);

  return (
    <div className="game-header-container">
      <header className="game-header">
        <div className="icon-pause" onClick={onPauseToggle}>
          <FontAwesomeIcon className="icono-game-header" icon={faPause} />
        </div>
        <div className="score">
          <h5>score</h5>
          <h4>{score}</h4>
        </div>
        <div className="timer-alert">
          <div className="timer">Tiempo: {timeLeft}</div>
          <div className="icon-pause" onClick={onInstructionToggle}>
            <FontAwesomeIcon className="icono-game-header" icon={faBook} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default GameHeader;

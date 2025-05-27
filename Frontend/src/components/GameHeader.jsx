import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/utils/GameHeader.css";

function GameHeader({ score = 0, onTimeEnd, resetTimerSignal, prueba }) {
  const TIEMPO_INICIAL = 90;
  const [timeLeft, setTimeLeft] = useState(TIEMPO_INICIAL);
  const timerRef = useRef(null);

  const guardarScore = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/scores/",
        {
          score: score,
          prueba: prueba,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Score enviado con éxito:", res.data);
    } catch (err) {
      console.error("❌ Error al enviar el score:", err);
    }
  };

  // ✅ Esta función se llama cuando acaba el tiempo
  const handleTimeEnd = () => {
    guardarScore(); // guardar automáticamente
    if (onTimeEnd) onTimeEnd(); // llamar también al callback externo
  };

  const iniciarTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIEMPO_INICIAL);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeEnd(); // ✅ usar función unificada
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    iniciarTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (resetTimerSignal !== 0) {
      iniciarTimer();
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

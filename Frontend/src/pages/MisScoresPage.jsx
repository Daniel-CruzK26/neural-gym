import React from "react";
import UserScores from "../components/UserScores";
import "../styles/utils/GameHeader.css"; // Usa el mismo estilo de cabecera si ya lo tienes

const MisScoresPage = () => {
  return (
    <div>
      <header className="game-header">
        <div className="icon pause">📊</div>
        <div className="score">Historial</div>
        <div className="timer-alert">
          <div className="timer">Puntajes Registrados</div>
          <div className="icon alert">🧠</div>
        </div>
      </header>

      <div style={{ padding: "2rem", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
        <UserScores />
      </div>
    </div>
  );
};

export default MisScoresPage;

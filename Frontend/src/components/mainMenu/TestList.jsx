import React from "react";
import { Link } from "react-router-dom";
import "../../styles/mainMenu/TestList.css";
import GameCard from "./gameCard";

const TestList = ({ pruebas, categoria }) => {
  return (
    <div className="test-container">
      <h3>{categoria}</h3>
      <div className="test-wrapper">
        {pruebas.map((prueba) => (
          <div className="game">
            <Link to={prueba.game_url} key={prueba.id}>
              <GameCard name={prueba.name} key={prueba.id} />
            </Link>
            <h4>{prueba.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestList;

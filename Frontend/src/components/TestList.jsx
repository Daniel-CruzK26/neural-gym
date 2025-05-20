import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/TestList.css";

const TestList = () => {
  const [pruebas, setPruebas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/pruebas/actividades/")
      .then((response) => response.json())
      .then((data) => setPruebas(data))
      .catch((error) => console.error("Error al obtener las pruebas:", error));
  }, []);

  return (
    <div className="test-container">
      <h2>Pruebas disponibles</h2>
      <div className="test-grid">
        {pruebas.map((prueba) => (
          <div key={prueba.id} className="test-card">
            <h3>{prueba.nombre}</h3>
            <Link to={prueba.game_url}>
              <p>{prueba.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestList;

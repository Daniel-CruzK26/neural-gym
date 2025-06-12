import "../styles/mainMenu.css";
import TestList from "../components/mainMenu/TestList";
import SideBar from "../components/mainMenu/SideBar";
import ScoresHistory from '../components/ScoresHistory';
import { React, useState, useEffect } from "react";

function MainMenu() {
  const [categorias, setCategorias] = useState([
    "Atención",
    "Memoria",
    "Razonamiento",
  ]);
  const [pruebas, setPruebas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/pruebas/actividades/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPruebas(data))
      .catch((error) => console.error("Error al obtener las pruebas", error));
  }, []);

  return (
    <div className="container">
      <SideBar />
      <main className="main-content">
        {categorias.map((category) => {
          const pruebasXcategory = pruebas.filter(
            (item) => item.categoria === category
          );
          return (
            <TestList
              key={category}
              pruebas={pruebasXcategory}
              categoria={category}
            />
          );
        })}
      </main>
    </div>
  );
}

export default MainMenu;

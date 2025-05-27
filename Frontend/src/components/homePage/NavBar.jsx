import React from "react";
import { Link } from "react-router-dom";
import "../../styles/homePage/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/">
          <h1>NeuralGym</h1>
        </Link>
        <div className="nav-links">
          <Link to="/login">
            <button className="btn">Iniciar sesión</button>
          </Link>
          <Link to="/register">
            <button className="btn">Registrarse</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="NeuralGym Logo" />
        <span className="brand">NeuralGym</span>
      </div>
      <nav className="nav">
        {/* Usamos Link en lugar de <a> para navegación sin recarga */}
        <Link to="/login">
          <button className="register-button">Inicio</button>
        </Link>

        {/* Usamos Link para la página de login */}
        <Link to="/login">
          <button className="register-button">Iniciar sesión</button>
        </Link>

        {/* Usamos Link para la página de registro */}
        <Link to="/register">
          <button className="register-button">Regístrate</button>
        </Link>

        {/* Aquí añades Estadísticas */}
        <Link to="/estadisticas">
          <button className="register-button">Estadísticas</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;


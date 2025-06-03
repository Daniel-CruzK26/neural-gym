import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChartBar,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/mainMenu/sidebar.css";

const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/main-menu";
};

const SideBar = () => {
  return (
    <aside className="sidebar">
      <div className="header">
        <img src="logo.png" alt="Logo de NeuralGym" className="logo" />
        <span className="title">NeuralGym</span>
      </div>
      <nav className="menu">
        <button className="menu-button">
          <FontAwesomeIcon className="icon" icon={faUser} /> Perfil
        </button>
        <button className="menu-button">
          <FontAwesomeIcon className="icon" icon={faChartBar} /> Estadísticas
        </button>
        <form onSubmit={handleLogout}>
          <button button className="menu-button">
            <FontAwesomeIcon className="icon" icon={faArrowRightFromBracket} />
            Cerrar sesión
          </button>
          </form>
      </nav>
    </aside>
  );
};

export default SideBar;

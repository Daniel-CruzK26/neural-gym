import React from "react";
import "./styles/HomePage.css";
import { Brain, Volume2, Puzzle } from "lucide-react";
import NavBar from "./components/homePage/NavBar";

export default function NeuralGymHomePage() {
  return (
    <div className="page-container">
      <NavBar />
      {/* Main Content */}
      <main className="main">
        <h2 className="main-title">
          Entrena tu mente con <strong>NeuralGym</strong>
        </h2>

        {/* Info Boxes */}
        <section className="info-section">
          <div className="info-box">
            Te ofrecemos diferentes actividades para entrenar tus habilidades
            neuropsicológicas.
          </div>
          <div className="info-box">
            Entrena a tu manera o siguiendo una guía personalizada basada en tus
            habilidades.
          </div>
        </section>

        {/* Feature Cards */}
        <section className="features-grid">
          <div className="feature-card">
            <Brain />
            <p>Entrena y mejora tu memoria a corto y largo plazo.</p>
          </div>
          <div className="feature-card">
            <Volume2 />
            <p>Pon a prueba tu capacidad para poner atención.</p>
          </div>
          <div className="feature-card">
            <Puzzle />
            <p>Utiliza tu razonamiento para resolver puzzles.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import LYNGame from '../components/numsyletras/LYNGame.jsx'; // Componente del juego principal
import Modal from '../components/numsyletras/Modal.jsx'; // Modal reutilizable
import '../styles/NumsYLetras/LYNApp.css'; // Asegúrate de tener este archivo

export default function LYNAppWrapper() {
  const [mostrarPausa, setMostrarPausa] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [puntajeFinal, setPuntajeFinal] = useState(0);

  const lynRef = useRef(null);

  const volverAlMenu = () => {
    window.location.href = '/main-menu'; // Ajusta la ruta según tu sistema de rutas
  };

  return (
    <div className="lyn-root">
      <LYNGame
        ref={lynRef}
        onPause={() => setMostrarPausa(true)}
        onEndGame={(puntaje) => {
          setPuntajeFinal(puntaje);
          setJuegoTerminado(true);
        }}
      />

      {/* Overlay de pausa */}
      {mostrarPausa && (
        <div className="overlay">
          <Modal isOpen={true} onClose={() => setMostrarPausa(false)}>
            <h2>Prueba en pausa</h2>
            <div className="lyn-botones-pausa">
              <button onClick={() => setMostrarPausa(false)}>Reanudar</button>
              <button onClick={() => lynRef.current?.reiniciarJuego?.()}>Reiniciar</button>
              <button onClick={volverAlMenu}>Menú principal</button>
            </div>
          </Modal>
        </div>
      )}

      {/* Overlay de fin del juego */}
      {juegoTerminado && (
        <div className="overlay">
          <Modal isOpen={true} onClose={volverAlMenu}>
            <h2>⏱️ Tiempo terminado</h2>
            <p>Puntaje final: <strong>{puntajeFinal}</strong></p>
            <div className="lyn-botones-pausa">
              <button onClick={volverAlMenu}>Volver al menú</button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

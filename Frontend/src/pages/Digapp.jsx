import React, { useState, useRef } from 'react';
import DigitosGame from './componentes/digitos/DigitosGame';
import Modal from './componentes/digitos/Modal';
import '../styles/Digitos/Digapp.css';

export default function DigAppWrapper() {
  const [showPausa, setShowPausa] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [puntajeFinal, setPuntajeFinal] = useState(0);

  const digitosRef = useRef(null);

  const volverAlMenu = () => {
    window.location.href = '/main-menu';
  };

  return (
    <div className="digitos-root">
      {/* Aquí va el componente principal del juego */}
      <DigitosGame
        ref={digitosRef}
        onPause={() => setShowPausa(true)}
        onEndGame={(puntaje) => {
          setPuntajeFinal(puntaje);
          setJuegoTerminado(true);
        }}
      />

      {/* Overlay de pausa */}
      {showPausa && (
        <div className="overlay">
          <Modal isOpen={true} onClose={() => setShowPausa(false)}>
            <h2>Juego en pausa</h2>
            <div className="digitos-botones-pausa">
              <button onClick={() => setShowPausa(false)}>Reanudar</button>
              <button onClick={() => digitosRef.current?.reiniciarJuego?.()}>Reiniciar</button>
              <button onClick={volverAlMenu}>Menú principal</button>
            </div>
          </Modal>
        </div>
      )}

      {/* Overlay de resultados al terminar */}
      {juegoTerminado && (
        <div className="overlay">
          <Modal isOpen={true} onClose={volverAlMenu}>
            <h2>¡Tiempo terminado!</h2>
            <p>Puntaje final: <strong>{puntajeFinal}</strong></p>
            <div className="digitos-botones-pausa">
              <button onClick={volverAlMenu}>Volver al menú</button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

import "../styles/utils/Pausa.css";

function Pausa({ onResume, onExit }) {
  return (
    <div className="pause-menu">
      <h2>Prueba en pausa</h2>
      <button className="pause-btn-continuar" onClick={onResume}>
        Reanudar
      </button>

      <button className="btn-salir" onClick={onExit}>
        Salir
      </button>
    </div>
  );
}

export default Pausa;

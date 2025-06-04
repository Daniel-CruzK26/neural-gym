import "../styles/utils/Resultados.css";

function Pausa({ puntaje, onResume, onSalir }) {
  return (
    <div className="resultado-box">
      <div className="resultado-header">Juego en Pausa</div>

      <div className="resultado-body">
        <p>Puntaje actual: {puntaje}</p>

        <button className="btn-continuar" onClick={onResume}>
          Reanudar
        </button>

        <button className="btn-continuar" onClick={onSalir}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default Pausa;

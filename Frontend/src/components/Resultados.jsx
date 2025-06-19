import "../styles/utils/Resultados.css";

function Resultados({ puntaje, velocidad, precision, onContinuar }) {
  return (
    <div className="resultado-box">
      <div className="resultado-header">
        <h3>Resultados</h3>
      </div>

      <div className="resultado-body">
        <h3>Puntaje: {puntaje}</h3>
        <h3>Precisión: {precision}%</h3>
        <h3>Velocidad de reacción: {velocidad} seg</h3>

        <button className="btn-continuar" onClick={onContinuar}>
          Continuar
        </button>
      </div>
    </div>
  );
}

export default Resultados;

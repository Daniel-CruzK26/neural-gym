import "../styles/utils/Resultados.css"

function Resultados({ puntaje, velocidad, onContinuar, causa }) {
  return (
    <div className="resultado-box">
      <div className="resultado-header">
        {causa === "puzzles" ? "¡Felicidades!" : "Tiempo Agotado"}
      </div>

      <div className="resultado-body">
        {causa === "puzzles" ? (
          <p>¡Completaste todos los puzzles!</p>
        ) : (
          <p>El tiempo ha terminado.</p>
        )}

        <p>Puntaje: {puntaje}</p>
        <p>Velocidad de reacción: {velocidad} seg</p>

        <button className="btn-continuar" onClick={onContinuar}>
          Reiniciar prueba
        </button>
      </div>
    </div>
  );
}
  
  export default Resultados;
  
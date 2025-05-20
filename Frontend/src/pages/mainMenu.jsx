import "../styles/mainMenu.css";
import TestList from "../components/TestList";

function mainMenu() {
  return (
    <div className="container">
      <aside className="sidebar">
        <div className="header">
          <img src="logo.jpg" alt="Logo de NeuralGym" className="logo" />
          <span className="title">NeuralGym</span>
        </div>
        <nav className="menu">
          <button className="menu-button">
            <span className="icon">👤</span> Perfil
          </button>
          <button className="menu-button">
            <span className="icon">📈</span> Estadísticas
          </button>
          <button button className="menu-button">
            <span className="icon">🚪</span> Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <TestList />
      </main>
    </div>
  );
}

export default mainMenu;

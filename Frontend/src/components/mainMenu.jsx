import '../styles/mainMenu.css'

function mainMenu() {
    return (
        <div class="container">
            <aside class="sidebar">
                <div class="header">
                    <img src="logo.jpg" alt="Logo de NeuralGym" class="logo"/>
                    <span class="title">NeuralGym</span>
                </div>
                <nav class="menu">
                    <button class="menu-button">
                        <span class="icon">👤</span> Perfil
                    </button>
                    <button class="menu-button">
                        <span class="icon">📈</span> Estadísticas
                    </button>
                    <button button class="menu-button">
                        <span class="icon">🚪</span> Cerrar sesión
                    </button>
                </nav>
            </aside>

            <main class="main-content">
            </main>
        </div>
    );
}

export default mainMenu
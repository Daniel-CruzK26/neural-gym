import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import PuzzlePage from "./pages/puzzlesVisualesGame";
import StoopPage from "./pages/StoopGamePage";
import MeaningPage from "./pages/MeaningPage";
import SimbolosPage from "./pages/SimbolosPage";
import MainMenu from "./pages/mainMenu";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Aquí definimos las rutas de nuestras pantallas*/}
        <Routes>
          <Route
            exact
            path="/"
            element={() => <h1>Bienvenido a NeuralGym</h1>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/puzzles" element={<PuzzlePage />} />
          <Route path="/StoopTest" element={<StoopPage />} />
          <Route path="/MeaningTest" element={<MeaningPage />} />
          <Route path="/SimbolsTest" element={<SimbolosPage />}></Route>
          <Route path="/main-menu" element={<MainMenu />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

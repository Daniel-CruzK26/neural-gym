import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./components/register";
import PuzzlePage from "./pages/puzzlesVisualesGame";
import StoopPage from "./pages/StoopGamePage";
import MeaningPage from "./pages/MeaningPage";
import SimbolosPage from "./pages/SimbolosPage";
import TovaPage from "./pages/TovaPage";
import MainMenu from "./pages/mainMenu";
import NeuralGymHomePage from "./HomePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal: componente o h1 directamente */}
          <Route path="/" element={<NeuralGymHomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/puzzles" element={<PuzzlePage />} />
          <Route path="/stoop-test" element={<StoopPage />} />
          <Route path="/meaning-test" element={<MeaningPage />} />
          <Route path="/simbols-test" element={<SimbolosPage />} />
          <Route path="/tova-test" element={<TovaPage />}></Route>
          <Route path="/main-menu" element={<MainMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

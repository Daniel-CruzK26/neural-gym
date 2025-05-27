import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import PuzzlePage from "./pages/puzzlesVisualesGame";
import StoopPage from "./pages/StoopGamePage";
import MeaningPage from "./pages/MeaningPage";
import SimbolosPage from "./pages/SimbolosPage";
import MisScoresPage from "./pages/MisScoresPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<h1>Bienvenido a NeuralGym</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/puzzles" element={<PuzzlePage />} />
          <Route path="/stoop" element={<StoopPage />} />
          <Route path="/meaning" element={<MeaningPage />} />
          <Route path="/simbolos" element={<SimbolosPage />} />
          <Route path="/mis-scores" element={<MisScoresPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

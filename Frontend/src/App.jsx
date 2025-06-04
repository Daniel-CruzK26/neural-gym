import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import PuzzlePage from "./pages/puzzlesVisualesGame";
import StoopPage from "./pages/StoopGamePage";
import MeaningPage from "./pages/MeaningPage";
import SimbolosPage from "./pages/SimbolosPage";
import TovaPage from "./pages/TovaPage";
import MainMenu from "./pages/mainMenu";
import NeuralGymHomePage from "./HomePage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal: componente o h1 directamente */}
          <Route path="/" element={<NeuralGymHomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/main-menu"
            element={
              <PrivateRoute>
                <MainMenu />
              </PrivateRoute>
            }
          />
          <Route
            path="/puzzles"
            element={
              <PrivateRoute>
                <PuzzlePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stoop-test"
            element={
              <PrivateRoute>
                <StoopPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/meaning-test"
            element={
              <PrivateRoute>
                <MeaningPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/simbols-test"
            element={
              <PrivateRoute>
                <SimbolosPage />
              </PrivateRoute>
            }
          />
          <Route path="/tova-test" element={<TovaPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

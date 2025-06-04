import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import "../styles/StoopTest/Stoop.css";

const StoopTest = forwardRef(
  ({ onCorrect, onRespuestaMedida, onIncorrect, isPaused }, ref) => {
    const [game, setGame] = useState({
      nombre_color: "",
      color_objetivo: "",
      hex: "",
      opciones: [],
    });
    const [seleccionada, setSeleccionada] = useState("");
    const [opciones, setOpciones] = useState([]);
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());

    const obtenerTest = (nivelAct) => {
      fetch("http://127.0.0.1:8000/stoop/getTest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nivel: nivelAct }),
      })
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setOpciones(data.opciones);
          setSeleccionada([]);
          setTiempoInicio(Date.now());
        })
        .catch((error) => {
          console.error("Error al obtener el test", error);
        });
    };

    const obtenerNewTest = () => {
      fetch("http://127.0.0.1:8000/stoop/generarPrueba/", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setTiempoInicio(Date.now());
        })
        .catch((error) => {
          console.error("Error al obtener nuevo test", error);
        });
    };

    useEffect(() => {
      obtenerTest(1);
    }, []);

    useImperativeHandle(ref, () => ({
      reiniciarPrueba() {
        obtenerTest(1);
      },
      pasarNivel(nivelAct) {
        obtenerTest(nivelAct);
      },
    }));

    const toggleSeleccion = (name, index) => {
      if (isPaused) return;
      
      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);
      setSeleccionada([index]);

      if (name === game.color_objetivo) {
        onCorrect?.();
        setEstadoRespuesta("correcto");
      } else {
        setEstadoRespuesta("incorrecto");
        onIncorrect?.();
      }

      setTimeout(() => {
        setSeleccionada([]);
        setEstadoRespuesta("");
        obtenerNewTest();
      }, 800);
    };

    return (
      <div className="stoop-wrapper">
        <div className={`name-color ${estadoRespuesta}`}>
          <h3 style={{ color: game.hex }}>{game.nombre_color}</h3>
        </div>

        <div className="grid-options fade-in">
          {opciones.map((opc, i) => (
            <div
              className={`option-stoop ${
                seleccionada.includes(i) ? "seleccionada" : ""
              }`}
              key={i}
              onClick={() => toggleSeleccion(opc[0], i)}
              style={{ backgroundColor: opc[1] }}
            >
              <h4 style={{ color: opc[2] }}>{opc[0]}</h4>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default StoopTest;

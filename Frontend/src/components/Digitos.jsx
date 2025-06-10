// DigitGame.jsx
import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import "../styles/Digitos/DigitGame.css";

const DigitGame = forwardRef(
  ({ onCorrect, onRespuestaMedida, onSecuenciasCompletadas, isPaused }, ref) => {
    const [secuencia, setSecuencia] = useState([]);
    const [respuestaUsuario, setRespuestaUsuario] = useState("");
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());
    const [estadoRespuesta, setEstadoRespuesta] = useState("");

    const obtenerSecuencia = () => {
      fetch("http://localhost:8000/digitos/generar-secuencia/", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.mensaje && data.mensaje.includes("Ya viste todas")) {
            onSecuenciasCompletadas?.();
          } else {
            setSecuencia(data.secuencia);
            setRespuestaUsuario("");
            setEstadoRespuesta("");
            setTiempoInicio(Date.now());
          }
        })
        .catch((error) => console.error("Error obteniendo secuencia:", error));
    };

    useEffect(() => {
      obtenerSecuencia();
    }, []);

    useImperativeHandle(ref, () => ({
      reiniciarSecuencia() {
        obtenerSecuencia();
      },
    }));

    const manejarCambio = (e) => {
      if (isPaused) return;
      setRespuestaUsuario(e.target.value);
    };

    const manejarEnvio = (e) => {
      e.preventDefault();
      if (isPaused || respuestaUsuario.trim() === "") return;

      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);

      fetch("http://localhost:8000/digitos/verificar-respuesta/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ respuesta: respuestaUsuario }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.correcta) {
            onCorrect?.();
            setEstadoRespuesta("correcto");
          } else {
            setEstadoRespuesta("incorrecto");
          }

          setTimeout(() => {
            setRespuestaUsuario("");
            setEstadoRespuesta("");
            obtenerSecuencia();
          }, 800);
        })
        .catch((error) => console.error("Error verificando respuesta:", error));
    };

    return (
      <div className="digit-wrapper">
        <div className={`secuencia ${estadoRespuesta}`}>
          <p>{secuencia.join(" ")}</p>
        </div>
        <form onSubmit={manejarEnvio}>
          <input
            type="text"
            value={respuestaUsuario}
            onChange={manejarCambio}
            placeholder="Escribe la secuencia"
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    );
  }
);

export default DigitGame;
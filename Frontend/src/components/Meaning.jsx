import React, { useImperativeHandle, useState, forwardRef } from "react";
import IconoSVG from "./Icono";
import "../styles/Meaning/Meaning.css";

const MeaningTest = forwardRef(
  ({ onCorrect, onRespuestaMedida, onIncorrect, onFinPruebas }, ref) => {
    const [pruebas, setPruebas] = useState([]);
    const [pruebaActual, setPruebaActual] = useState({
      objetivo: "",
      word: "",
      hex: "",
    });
    const [seleccionada, setSeleccionada] = useState("");
    const [opciones, setOpciones] = useState([]);
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());

    const obtenerTest = (nivel) => {
      fetch("http://127.0.0.1:8000/ColorMean/startTest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nivel: nivel }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPruebas(data.pruebas);
          setOpciones(data.options);
          setSeleccionada([]);
          setTiempoInicio(Date.now());

          if (data.pruebas.length > 0) {
            setPruebaActual(data.pruebas[0]); // 👈 agrega esta línea
          }
        })
        .catch((error) => {
          console.error("Error al obtener el test", error);
        });
    };

    const toggleSeleccion = (opc, index) => {
      if (isPaused) return;
      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);
      setSeleccionada([index]);

      if (pruebaActual.objetivo === "COLOR") {
        if (opc.hex === pruebaActual.hex) {
          onCorrect?.();
          setEstadoRespuesta("correcto");
        } else {
          onIncorrect?.();
          setEstadoRespuesta("incorrecto");
        }
      } else if (pruebaActual.objetivo === "SIGNIFICADO") {
        if (opc.nombre === pruebaActual.word) {
          onCorrect?.();
          setEstadoRespuesta("correcto");
        } else {
          onIncorrect?.();
          setEstadoRespuesta("incorrecto");
        }
      }

      setTimeout(() => {
        setSeleccionada([]);
        setEstadoRespuesta("");

        if (pruebas.length > 1) {
          const nuevasPruebas = pruebas.slice(1);
          setPruebas(nuevasPruebas);
          setPruebaActual(nuevasPruebas[0]);
        } else {
          onFinPruebas?.();
        }
      }, 800);
    };

    useImperativeHandle(ref, () => ({
      reiniciarPrueba(nivel) {
        obtenerTest(nivel);
      },

      pasarNivel(nivel) {
        obtenerTest(nivel);
      },
    }));

    return (
      <div className="meaning-wrapper">
        <div className={`objetive-meanings ${estadoRespuesta}`}>
          <h5>{pruebaActual.objetivo}</h5>
          <h3 style={{ color: pruebaActual.hex }}>{pruebaActual.word}</h3>
        </div>

        <div className="grid-options fade-in">
          {opciones.map((opc, i) => (
            <div
              className={`option-meanings ${
                seleccionada.includes(i) ? "seleccionada" : ""
              }`}
              key={i}
              onClick={() => toggleSeleccion(opc, i)}
            >
              <IconoSVG
                url={`http://127.0.0.1:8000${opc.archivo}`}
                color={opc.hex}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default MeaningTest;

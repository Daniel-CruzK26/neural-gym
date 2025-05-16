import React, { useImperativeHandle, useRef, useState, forwardRef, useEffect } from "react";
import '../styles/PuzzlesVisuales/Puzzles.css'

const PuzzleVisualGame = forwardRef(({ onCorrect, onRespuestaMedida, onPuzzlesCompletados }, ref) => {
  const [piezas, setPiezas] = useState({ figura_base: "", correctas: [], distractoras: [] });
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mezcladas, setMezcladas] = useState([]);
  const [tiempoInicio, setTiempoInicio] = useState(Date.now());
  const [estadoRespuesta, setEstadoRespuesta] = useState("");
  const [rotaciones, setRotaciones] = useState([]);

  const randomAngle = () => Math.floor(Math.random() * 40) - 15;

  const obtenerPuzzle = () => {
    fetch("http://localhost:8000/puzzles-visuales/generar-puzzle/", { method: 'GET', credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.mensaje && data.mensaje.includes("Ya viste todos")) {
          onPuzzlesCompletados?.();
        } else {
          setPiezas(data);
          const todas = [...data.correctas, ...data.distractoras];
          setMezcladas(todas.sort(() => Math.random() - 0.5));
          const nuevasRotaciones = todas.map(() => randomAngle());
          setRotaciones(nuevasRotaciones);
          setSeleccionadas([]);
          setEstadoRespuesta("");
          setTiempoInicio(Date.now());
        }
      })
      .catch((error) => {
        console.error("Error obteniendo puzzle:", error);
      });
  };

  useEffect(() => {
    obtenerPuzzle();
  }, []);

  // 🔥 Esto expone una función `reiniciarPuzzle()` al padre
  useImperativeHandle(ref, () => ({
    reiniciarPuzzle() {
      obtenerPuzzle();
    }
  }));

  const toggleSeleccion = (index) => {
    let nuevas;

    if (seleccionadas.includes(index)) {
      nuevas = seleccionadas.filter((i) => i !== index);
    } else {
      nuevas = [...seleccionadas, index];
    }

    setSeleccionadas(nuevas);

    if (nuevas.length === 3) {
      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);

      const seleccionadasURLs = nuevas.map((i) => mezcladas[i]);
      const esCorrecto = piezas.correctas.every((url) => seleccionadasURLs.includes(url));

      if (esCorrecto) {
        onCorrect?.();
        setEstadoRespuesta('correcto');
      } else {
        setEstadoRespuesta('incorrecto');
      }

      setTimeout(() => {
        setSeleccionadas([]);
        setEstadoRespuesta("");
        obtenerPuzzle();
      }, 800);
    }
  };

  return (
    <div className="puzzle-wrapper">
      <div className={`figura-base ${estadoRespuesta}`}>
        <img src={piezas.figura_base} alt="Figura base" />
      </div>
      <div className="grid-piezas fade-in">
        {mezcladas.map((url, i) => (
          <div
            className={`pieza ${seleccionadas.includes(i) ? "seleccionada" : ""}`}
            key={i}
            onClick={() => toggleSeleccion(i)}
          >
            <img src={url} alt={`pieza ${i + 1}`} style={{ transform: `rotate(${rotaciones[i]}deg)` }} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default PuzzleVisualGame;




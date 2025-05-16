import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import IconoSVG from "./Icono";
import "../styles/Simbolos/Simbolos.css";

const SimbolosTest = forwardRef(
  ({ onCorrect, onRespuestaMedida, onIncorrect, onFinPruebas }, ref) => {
    const [game, setGame] = useState([]);
    const [pruebaActual, setPruebaActual] = useState({});
    const [seleccionada, setSeleccionada] = useState("");
    const [nombres, setNombres] = useState([]);
    const [letras, setLetras] = useState([]);
    const [ocultas, setOcultas] = useState([]);
    const [fails, setFails] = useState([]);
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [iterador, setIterador] = useState(0);
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());

    const sumIterador = () => setIterador((prev) => prev + 1);

    const obtenerTest = () => {
      fetch("http://127.0.0.1:8000/Simbolos/startTest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setSeleccionada([]);
          setTiempoInicio(Date.now());
          setOcultas([]);
          setFails([]);

          const listaNombre = data.map((opc) => opc.nombre);
          const listaLetras = data.map((opc) => opc.letra);
          setLetras(listaLetras);
          setNombres(listaNombre);

          const idx = Math.floor(Math.random() * data.length);
          setPruebaActual(data[idx]);
        })
        .catch((error) => {
          console.error("Error al obtener el test", error);
        });
    };

    const agregarOpcion = () => {
      fetch("http://127.0.0.1:8000/Simbolos/newOption/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nombres: nombres, letras: letras }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setGame([...game, data]);
          setNombres([...nombres, data.nombre]);
          setLetras([...letras, data.letra]);
          setSeleccionada([]);
          setTiempoInicio(Date.now());
        });
    };

    const toggleSeleccion = (opc, index) => {
      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);
      setSeleccionada([index]);

      if (pruebaActual.nombre === opc.nombre) {
        onCorrect?.();
        setEstadoRespuesta("correcto");

        if (!ocultas.includes(index)) {
          setOcultas([...ocultas, index]);
        }

        if (fails.includes(opc.nombre)) {
          setFails(fails.filter((nombre) => nombre !== opc.nombre));
        }
      } else {
        onIncorrect?.();
        setEstadoRespuesta("incorrecto");

        if (!fails.includes(pruebaActual.nombre)) {
          setFails([...fails, pruebaActual.nombre]);
        }
      }

      setTimeout(() => {
        setSeleccionada([]);
        setEstadoRespuesta("");
        sumIterador();
      }, 1000);
    };

    useEffect(() => {
      if (iterador < 10) {
        const idx = Math.floor(Math.random() * game.length);
        setPruebaActual(game[idx]);
      } else {
        setIterador(0);
        onFinPruebas?.();
      }
    }, [iterador]);

    useEffect(() => {
      if (game.length > 0) {
        const idx = Math.floor(Math.random() * game.length);
        setPruebaActual(game[idx]);
      }
    }, [game]);

    useImperativeHandle(ref, () => ({
      reiniciarPrueba() {
        obtenerTest();
      },

      newOption() {
        agregarOpcion();
      },
    }));

    if (!pruebaActual || !pruebaActual.nombre) {
      return <div>Cargando...</div>;
    }
    return (
      <div className="simbols-wrapper">
        <div className={`objetive ${estadoRespuesta}`}>
          {fails.includes(pruebaActual.nombre) ? (
            <>
              <IconoSVG
                url={`http://127.0.0.1:8000${pruebaActual.archivo}`}
                color={pruebaActual.hex}
              />
              <h3 className="fade-in">= {pruebaActual.letra}</h3>
            </>
          ) : (
            <IconoSVG
              url={`http://127.0.0.1:8000${pruebaActual.archivo}`}
              color={pruebaActual.hex}
            />
          )}
        </div>

        <div className="grid-options fade-in">
          {game.map((opc, i) => (
            <div
              className={`option ${
                seleccionada.includes(i) ? "seleccionada" : ""
              }`}
              key={i}
              onClick={() => toggleSeleccion(opc, i)}
            >
              {ocultas.includes(i) ? (
                <h3>{opc.letra}</h3>
              ) : (
                <>
                  <IconoSVG
                    url={`http://127.0.0.1:8000${opc.archivo}`}
                    color={opc.hex}
                  />
                  <h3>= {opc.letra}</h3>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default SimbolosTest;

import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconoSVG from "./Icono";
import "../styles/Simbolos/Simbolos.css";

const SimbolosTest = forwardRef(
  (
    {
      onCorrect,
      onRespuestaMedida,
      onIncorrect,
      incrementarPruebas,
      onFinPruebas,
      isPaused,
    },
    ref
  ) => {
    const [game, setGame] = useState([]);
    const [pruebaActual, setPruebaActual] = useState({});
    const [seleccionada, setSeleccionada] = useState("");
    const [anteriores, setAnteriores] = useState([]);
    const [nombres, setNombres] = useState([]);
    const [letras, setLetras] = useState([]);
    const [ocultas, setOcultas] = useState([]);
    const [fails, setFails] = useState([]);
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [iterador, setIterador] = useState(0);
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());

    const sumIterador = () => setIterador((prev) => prev + 1);

    const calcularIdx = () => {
      let idx;
      do {
        idx = Math.floor(Math.random() * game.length);
      } while (anteriores.includes(idx));
      return idx;
    };

    const nuevoIcono = () => {
      const idx = calcularIdx();
      setPruebaActual(game[idx]);

      if (anteriores.length < game.length - 2) {
        setAnteriores([...anteriores, idx]);
      } else {
        let ants = [...anteriores];
        ants.shift();
        ants.push(idx);
        setAnteriores(ants);
      }
      return;
    };

    const moverElemento = (indice, direccion) => {
      setGame((prevGame) => {
        const nuevoArreglo = [...prevGame];

        if (direccion === "adelante") {
          [nuevoArreglo[indice], nuevoArreglo[indice + 1]] = [
            nuevoArreglo[indice + 1],
            nuevoArreglo[indice],
          ];
        } else if (direccion === "atras") {
          [nuevoArreglo[indice], nuevoArreglo[indice - 1]] = [
            nuevoArreglo[indice - 1],
            nuevoArreglo[indice],
          ];
        }

        return nuevoArreglo;
      });
    };

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
          setAnteriores([...anteriores, idx]);
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
          nuevoIcono();
          setTiempoInicio(Date.now());
        });
    };

    const toggleSeleccion = (opc, index) => {
      if (isPaused) return;
      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);
      setSeleccionada([index]);
      incrementarPruebas?.();

      if (pruebaActual.nombre === opc.nombre) {
        onCorrect?.();
        setEstadoRespuesta("correcto");

        if (!ocultas.includes(opc.nombre)) {
          setOcultas([...ocultas, opc.nombre]);
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
      if (iterador < 12) {
        nuevoIcono();
        setTiempoInicio(Date.now());
      } else {
        setIterador(0);
        onFinPruebas?.();
      }
    }, [iterador]);

    useEffect(() => {
      if (iterador % 5 === 0 && iterador !== 0) {
        setTimeout(() => {
          const idx = Math.floor(Math.random() * (game.length - 2)) + 1;
          moverElemento(idx, Math.random() < 0.5 ? "adelante" : "atras");
        }, 50);
      }
    }, [iterador]);

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
        <div className={`objetive-simbols ${estadoRespuesta}`}>
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
          <AnimatePresence>
            {game.map((opc, i) => (
              <motion.div
                layout="position"
                key={opc.nombre}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`option ${
                  seleccionada.includes(i) ? "seleccionada" : ""
                }`}
                onClick={() => toggleSeleccion(opc, i)}
              >
                {ocultas.includes(opc.nombre) ? (
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

export default SimbolosTest;

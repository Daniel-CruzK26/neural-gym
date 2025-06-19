import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import "../styles/StoopTest/Stoop.css";

const StoopTest = forwardRef(
  (
    {
      onCorrect,
      onRespuestaMedida,
      onIncorrect,
      incrementarPruebas,
      isPaused,
      isInstruction,
    },
    ref
  ) => {
    const [seleccionada, setSeleccionada] = useState("");
    const [colores, setColores] = useState([]);
    const [hexadecimales, setHexadecimales] = useState([]);
    const [opciones, setOpciones] = useState([]);
    const [prueba, setPrueba] = useState({ nombre: "", objetivo: "", hex: "" });
    const [estadoRespuesta, setEstadoRespuesta] = useState("");
    const [anteriores, setAnteriores] = useState([]);
    const [nombresAnteriores, setNomAnteriores] = useState([]);
    const [tiempoInicio, setTiempoInicio] = useState(Date.now());

    const calcularIdxColor = () => {
      let idx;
      let color;
      do {
        idx = Math.floor(Math.random() * colores.length);
        color = colores[idx];
      } while (anteriores.includes(color));
      return color;
    };

    const construirPrueba = (color) => {
      const nombresColores = Object.keys(hexadecimales);
      let indx;
      let objetivoNombre;
      do {
        indx = Math.floor(Math.random() * nombresColores.length);
        objetivoNombre = nombresColores[indx];
      } while (nombresAnteriores.includes(objetivoNombre));

      const objetivoColor = hexadecimales[objetivoNombre];
      const pruebaActual = {
        nombre: color,
        objetivo: objetivoNombre,
        hex: objetivoColor,
      };

      return pruebaActual;
    };

    const nuevaPrueba = () => {
      const color = calcularIdxColor();
      const pruebaGenerada = construirPrueba(color);
      setPrueba(pruebaGenerada);

      if (anteriores.length < colores.length - 2) {
        setAnteriores([...anteriores, color]);
        setNomAnteriores([...nombresAnteriores, pruebaGenerada.objetivo]);
      } else {
        let ants = [...anteriores];
        let nomAnts = [...nombresAnteriores];
        ants.shift();
        ants.push(color);
        setAnteriores(ants);

        nomAnts.shift();
        nomAnts.push(pruebaGenerada.objetivo);
        setNomAnteriores(nomAnts);
      }
    };

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
          setColores(data.colores);
          setHexadecimales(data.hexadecimales);
          setOpciones(data.opciones);
          setSeleccionada([]);
        })
        .catch((error) => {
          console.error("Error al obtener el test", error);
        });
    };

    useEffect(() => {
      nuevaPrueba();
      setTiempoInicio(Date.now());
    }, [colores, hexadecimales]);

    useEffect(() => {
      obtenerTest(1);
    }, []);

    useImperativeHandle(ref, () => ({
      pasarNivel(nivelAct) {
        obtenerTest(nivelAct);
      },
    }));

    const toggleSeleccion = (name, index) => {
      if (isPaused || isInstruction) return;

      const tiempoRespuesta = Date.now() - tiempoInicio;
      onRespuestaMedida?.(tiempoRespuesta);
      setSeleccionada([index]);
      incrementarPruebas?.();

      if (name === prueba.objetivo) {
        onCorrect?.();
        setEstadoRespuesta("correcto");
      } else {
        setEstadoRespuesta("incorrecto");
        onIncorrect?.();
      }

      setTimeout(() => {
        setSeleccionada([]);
        setEstadoRespuesta("");
        nuevaPrueba();
        setTiempoInicio(Date.now());
      }, 800);
    };

    return (
      <div className="stoop-wrapper">
        <div className={`name-color ${estadoRespuesta}`}>
          <h3 style={{ color: prueba.hex }}>{prueba.nombre}</h3>
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

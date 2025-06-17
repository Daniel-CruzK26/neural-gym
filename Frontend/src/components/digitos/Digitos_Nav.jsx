import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import "../../styles/Digitos/Navbar.css";
function Navbar() {
  const [tiempo, setTiempo] = useState(60);
  const [activo, setActivo] = useState(false);
  const [score, setScore] = useState(0);
  const [grabando, setGrabando] = useState(false);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  const grabAndRecognizeTriggered = useRef(false);

  const [numeros, setNumeros] = useState([]);
  const [modo, setModo] = useState("");
  const [transcripcion, setTranscripcion] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [esCorrecto, setEsCorrecto] = useState(false);
  const [mostrarNumeros, setMostrarNumeros] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const modosDisponibles = [
    "Memoriza",
    "Ordena de mayor a menor",
    "Ordena de menor a mayor",
  ];
  const [cuentaRegresiva, setCuentaRegresiva] = useState(null);

  const [textoEnTiempoReal, setTextoEnTiempoReal] = useState("");
  const [cargando, setCargando] = useState(false);
  const [puedeGrabar, setPuedeGrabar] = useState(false);

  const [modoAbierto, setModalAbierto] = useState(true);
  const [modoModal, setModoModal] = useState("inicio");
  const [mostrarModalPausa, setMostrarModalPausa] = useState(false);

  const [resultadoAPI, setResultadoAPI] = useState(null);

  const currentRoundFullTextRef = useRef("");
  const stopInitiatedByUser = useRef(false);

  const limpiarRecursosDeGrabacion = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      console.log("SpeechRecognition detenido y referencia limpiada.");
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      console.log("MediaRecorder detenido y referencia limpiada.");
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      console.log("Stream del micrófono liberado y referencia limpiada.");
    }
    setGrabando(false);
    grabAndRecognizeTriggered.current = false;
    recordedChunksRef.current = [];
  };

  const detenerGrabacionYReconocimiento = () => {
    if (grabando) {
      stopInitiatedByUser.current = true;
      limpiarRecursosDeGrabacion();
      console.log("Detención iniciada por el usuario/juego.");
    } else {
      limpiarRecursosDeGrabacion();
    }
  };

  const iniciarGrabacionYReconocimiento = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(
        "getUserMedia no es compatible con tu navegador. Por favor, usa Chrome o Firefox."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        console.log("MediaRecorder.onstop: Audio Blob listo para enviar.");
        enviarAudioAlBackend(audioBlob);
        recordedChunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error("Error de MediaRecorder:", event.error);
        alert("Error en la grabación de audio: " + event.error.name);
        limpiarRecursosDeGrabacion();
      };

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = "es-ES";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interimTranscript += event.results[i][0].transcript;
          }
          setTextoEnTiempoReal(interimTranscript);
        };

        recognition.onerror = (event) => {
          console.error(
            "Error de reconocimiento de voz (real-time):",
            event.error
          );
        };

        recognition.onend = () => {
          console.log("SpeechRecognition.onend fired.");
          if (!stopInitiatedByUser.current) {
            console.log("SpeechRecognition terminó inesperadamente.");
            setGrabando(false);
          }
        };
        recognition.start();
      } else {
        console.warn(
          "Web Speech API no es compatible con tu navegador. El texto en tiempo real no estará disponible."
        );
      }

      mediaRecorder.start();
      setGrabando(true);
      console.log("Grabación de audio y SpeechRecognition iniciados.");
    } catch (error) {
      console.error(
        "Error al acceder al micrófono o iniciar grabación:",
        error
      );
      alert("Error al acceder al micrófono: " + error.message);
      setGrabando(false);
      limpiarRecursosDeGrabacion();
    }
  };

  const enviarAudioAlBackend = async (audioBlob) => {
    setCargando(true);
    setMostrarNumeros(false);

    const formData = new FormData();
    formData.append("audio", audioBlob, "grabacion.webm");
    formData.append("modo", modo);
    formData.append("numeros", JSON.stringify(numeros));

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/digitos/procesar_audio/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error del servidor: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Respuesta de la API:", data);
      setResultadoAPI(data);
      setTranscripcion(data.transcripcion);
      setEsCorrecto(data.correcto);
      setScore((prevScore) => prevScore + data.puntos);
      setMostrarResultado(true);
    } catch (error) {
      console.error("Error al enviar el audio:", error);
      alert("Error al procesar el audio: " + error.message);
      setMostrarResultado(true);
      setEsCorrecto(false);
      setTranscripcion(
        textoEnTiempoReal
          ? textoEnTiempoReal.split(" ")
          : ["Error de red/servidor"]
      );
    } finally {
      setCargando(false);
      setTimeout(generarRonda, 2000);
    }
  };

  const iniciarJuego = () => {
    setModalAbierto(false);
    setModoModal("inicio");
    setJuegoTerminado(false);
    setTiempo(60);
    setScore(0);
    setCuentaRegresiva(3);

    const intervalo = setInterval(() => {
      setCuentaRegresiva((prev) => {
        if (prev === 1) {
          clearInterval(intervalo);
          setCuentaRegresiva("¡Comencemos!");
          setTimeout(() => {
            setCuentaRegresiva(null);
            generarRonda();
            setActivo(true);
          }, 1000);
        }
        return typeof prev === "number" ? prev - 1 : prev;
      });
    }, 1000);
  };

  const toggleActivo = () => {
    if (activo) {
      setActivo(false);
      setMostrarModalPausa(true);
      detenerGrabacionYReconocimiento();
    } else {
      setActivo(true);
      setMostrarModalPausa(false);
    }
  };

  const reiniciarJuego = () => {
    detenerGrabacionYReconocimiento();
    setTiempo(60);
    setScore(0);
    setJuegoTerminado(false);
    setMostrarModalPausa(false);
    setCuentaRegresiva(3);

    const intervalo = setInterval(() => {
      setCuentaRegresiva((prev) => {
        if (prev === 1) {
          clearInterval(intervalo);
          setCuentaRegresiva("¡Comencemos!");
          setTimeout(() => {
            setCuentaRegresiva(null);
            generarRonda();
            setActivo(true);
          }, 1000);
        }
        return typeof prev === "number" ? prev - 1 : prev;
      });
    }, 1000);
  };

  const mostrarAyuda = () => {
    setModoModal("ayuda");
    setModalAbierto(true);
    setActivo(false);
    detenerGrabacionYReconocimiento();
  };

  function generarNumeros() {
    const posiblesNumeros = Array.from({ length: 9 }, (_, i) => i + 1);
    const secuencia = [];

    while (secuencia.length < 5) {
      const randomIndex = Math.floor(Math.random() * posiblesNumeros.length);
      const numero = posiblesNumeros.splice(randomIndex, 1)[0];
      secuencia.push(numero);
    }
    return secuencia;
  }

  const generarRonda = () => {
    limpiarRecursosDeGrabacion();
    setTextoEnTiempoReal("");

    const nuevosNumeros = generarNumeros();
    const nuevoModo =
      modosDisponibles[Math.floor(Math.random() * modosDisponibles.length)];

    setNumeros(nuevosNumeros);
    setModo(nuevoModo);

    setMostrarResultado(false);
    setEsCorrecto(false);
    setTranscripcion([]);
    setGrabando(false);
    setPuedeGrabar(false);
    setResultadoAPI(null);

    currentRoundFullTextRef.current = "";

    setMostrarNumeros(true);
  };

  useEffect(() => {
    let timer;
    if (activo && tiempo > 0) {
      timer = setInterval(() => {
        setTiempo((prevTiempo) => prevTiempo - 1);
      }, 1000);
    } else if (tiempo <= 0 && !juegoTerminado) {
      setJuegoTerminado(true);
      setActivo(false);
      detenerGrabacionYReconocimiento();
    }
    return () => clearInterval(timer);
  }, [activo, tiempo, juegoTerminado]);

  useEffect(() => {
    let timer;
    if (activo && mostrarNumeros) {
      timer = setTimeout(() => {
        setMostrarNumeros(false);
        setPuedeGrabar(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [mostrarNumeros, activo]);

  useEffect(() => {
    if (
      activo &&
      !juegoTerminado &&
      !grabando &&
      !mostrarResultado &&
      !cargando &&
      puedeGrabar &&
      !mediaRecorderRef.current
    ) {
      console.log("useEffect: Condiciones para iniciar grabación met.");
      const delayBeforeRecording = setTimeout(() => {
        iniciarGrabacionYReconocimiento();
      }, 500);
      return () => clearTimeout(delayBeforeRecording);
    }
    if (
      grabando &&
      (!activo ||
        juegoTerminado ||
        mostrarResultado ||
        cargando ||
        !puedeGrabar)
    ) {
      console.log("useEffect: Condiciones para detener grabación met.");

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        stopInitiatedByUser.current = true;
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setGrabando(false);
    }
  }, [
    activo,
    juegoTerminado,
    grabando,
    mostrarResultado,
    cargando,
    puedeGrabar,
  ]);

  useEffect(() => {
    return () => {
      limpiarRecursosDeGrabacion();
    };
  }, []);

  return (
    <div className="digitos-navbar-container">
      <div className="instrucciones">
        {modoAbierto && (
          <Modal isOpen={modoAbierto} onClose={() => setModalAbierto(false)}>
            {modoModal === "inicio" ? (
              <>
                <h2>PRUEBA DÍGITOS</h2>
                <br></br>
                <p>
                  Esta prueba estimula la resistencia a la distracción, la
                  memoria inmediata y la memoria de trabajo.
                </p>
                <br></br>
                <h5>Lee atentamente las instrucciones:</h5>
                <ol style={{ textAlign: "justify" }}>
                  <li>Se presentan una serie de números.</li>
                  <li>Memoriza o repite los números en el orden indicado.</li>
                  <li>
                    Luego, di tu respuesta en voz alta cuando comience la
                    grabación.
                  </li>
                  <li>
                    Da click en detener cuando hayas terminado de decir tu
                    respuesta.
                  </li>
                  <li>
                    Se te mostrará si la respuesta es correcta o incorrecta.
                  </li>
                  <li>Ganas puntos por cada respuesta correcta.</li>
                </ol>
                <div className="botoncomenzar">
                  <button
                    onClick={iniciarJuego}
                    disabled={cuentaRegresiva !== null}
                  >
                    Comenzar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Recordando ...</h2>
                <br></br>
                <p>
                  Esta prueba evalúa la atención, concentración y memoria de
                  trabajo.
                </p>
                <br></br>
                <ul style={{ textAlign: "left" }}>
                  <li>
                    {" "}
                    Observa la secuencia de números que aparece por 5 segundos.
                  </li>
                  <li>
                    {" "}
                    Cuando empiece la grabación, di la secuencia según la
                    instrucción mostrada y da click en detener cuando hayas
                    terminado.
                  </li>
                  <li>
                    {" "}
                    Si aciertas, ganas puntos. Si te equivocas, no pasa nada.
                    ¡Sigue intentando!
                  </li>
                </ul>
                <br></br>
                <h6>
                  Puedes pausar el juego con el botón de pausa, o volver a ver
                  esta ayuda cuando quieras.
                </h6>
              </>
            )}
          </Modal>
        )}
      </div>
      <div className="Pausa">
        {mostrarModalPausa && (
          <Modal
            isOpen={mostrarModalPausa}
            onClose={() => setMostrarModalPausa(false)}
          >
            <h2>Prueba en pausa</h2>
            <br></br>
            <div className="botonesPausa">
              <button onClick={toggleActivo}>Reanudar</button>
              <br></br>
              <button onClick={reiniciarJuego}>Reintentar</button>
              <br></br>
              <button disabled>Menú</button>
              <br></br>
              <button disabled>Salir</button>
            </div>
          </Modal>
        )}
      </div>
      {cuentaRegresiva !== null ? (
        <div className="pantalla-cuenta">
          <h1>{cuentaRegresiva}</h1>
        </div>
      ) : juegoTerminado ? (
        <div className="pantalla-final">
          <h2>⏱️ TIEMPO TERMINADO</h2>
          <p>
            Tu puntaje final fue: <strong>{score}</strong>
          </p>
        </div>
      ) : (
        <div className="digitos-navbar">
          <div className="Numeros">
            {cargando ? (
              <div className="pantalla-cargando">
                <h3>Evaluando respuesta...</h3>
              </div>
            ) : mostrarNumeros && activo ? (
              <>
                <h5>{modo}</h5>
                <p>{numeros.join(" ")}</p>
              </>
            ) : mostrarResultado ? (
              <>
                <h3>{esCorrecto ? "✅ Correcto" : "❌ Incorrecto"}</h3>
                <br></br>
                <h6>
                  <strong>Dijiste:</strong>{" "}
                  {Array.isArray(transcripcion)
                    ? transcripcion.join(" ").toUpperCase()
                    : "Sin transcripción"}
                </h6>
                <br></br>
                <h6>
                  <strong>Respuesta correcta: </strong>
                  {resultadoAPI && resultadoAPI.esperado
                    ? resultadoAPI.esperado.join(" ").toUpperCase()
                    : "Cargando..."}
                </h6>
              </>
            ) : null}
          </div>

          <button className="boton-pausa" onClick={toggleActivo}>
            {activo ? "⏸" : "▶️"}
          </button>

          <div className="tiempo">{tiempo}</div>

          <div className="Score">Score:{score}</div>

          <button className="boton-ayuda" onClick={mostrarAyuda}>
            !
          </button>

          {grabando && !mostrarResultado && (
            <div className="grabando-voz">
              <h6>Escuchando...</h6>
              <p className="texto-usuario">
                {" "}
                {textoEnTiempoReal.toUpperCase()}
              </p>
              <button onClick={detenerGrabacionYReconocimiento}>
                🟥 Detener
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;

import React, {useState, useEffect, useRef} from 'react';
import Modal from './Modal';
import './Navbar.css';

function Navbar() {
    const [tiempo, setTiempo] = useState(60);
    const[activo, setActivo] = useState(false);
    const[score, setScore] = useState(0);
    const[grabando, setGrabando] = useState(false);
    const recorderRef = useRef(null); 
    const [numeros, setNumeros] = useState([]);
    const [modo, setModo] = useState('');
    const [transcripcion, setTranscripcion] = useState([]);
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);
    const [mostrarNumeros, setMostrarNumeros] = useState(false);
    const [juegoTerminado, setJuegoTerminado] = useState(false);

    const modosDisponibles = ["Memoriza", "Ordena de mayor a menor", "Ordena de menor a mayor"];
    const [cuentaRegresiva, setCuentaRegresiva] = useState(null);
    const recognitionRef = useRef(null);

    const [textoEnTiempoReal, setTextoEnTiempoReal] = useState('');
    const [ultimaTranscripcionFinal, setUltimaTranscripcionFinal] = useState('');
    const grabAndRecognizeTriggered = useRef(false);
    const [cargando, setCargando] = useState(false);
    const [puedeGrabar, setPuedeGrabar] = useState(false);

    const [modoModal, setModoModal] = useState('inicio');
    const [modoAbierto, setModalAbierto] = useState(true);
    const [mostrarModalPausa, setMostrarModalPausa] = useState(false);

    const [resultadoAPI, setResultadoAPI] = useState(null);
    const mediaStreamRef = useRef(null);

    const currentRoundFullTextRef = useRef('');
    const stopInitiatedByUser = useRef(false); 

    const limpiarRecursosDeGrabacion = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            console.log("SpeechRecognition detenido y referencia limpiada.");
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
            console.log("Stream del micrófono liberado y referencia limpiada.");
        }
        setGrabando(false);
        grabAndRecognizeTriggered.current = false;
    };

    const detenerGrabacionYReconocimiento = () => {
        if (grabando && recognitionRef.current) {
            stopInitiatedByUser.current = true; 
            limpiarRecursosDeGrabacion();
            console.log("Detención iniciada por el usuario/juego.");
        } else {
            limpiarRecursosDeGrabacion();
        }
    };

    const iniciarGrabacionYReconocimiento = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('getUserMedia no es compatible con tu navegador. Prueba con Chrome o Firefox.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Web Speech API no es compatible con tu navegador.");
                stream.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "es-ES";
            recognition.continuous = true; 
            recognition.interimResults = true;

            setTextoEnTiempoReal('');
            setUltimaTranscripcionFinal('');
            currentRoundFullTextRef.current = ''; 
            grabAndRecognizeTriggered.current = true; 
            stopInitiatedByUser.current = false; 

            recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                    console.log("RAW FINAL TRANSCRIPT PART:", transcript); 
                } else {
                    interimTranscript += transcript;
                }
            }

            setTextoEnTiempoReal(interimTranscript); 
            //console.log("INTERIM (real-time) text:", interimTranscript);

            if (finalTranscript) {
                const trimmedFinal = finalTranscript.trim();
                if (trimmedFinal) {
                    currentRoundFullTextRef.current += trimmedFinal + ' ';
                    //console.log("Segmento final acumulado:", trimmedFinal); 
                    //console.log("Current FULL accumulated text:", currentRoundFullTextRef.current); 
                }
                setUltimaTranscripcionFinal(currentRoundFullTextRef.current.trim()); 
            }
        };

            recognition.onerror = (event) => {
                console.error("Error de reconocimiento de voz:", event.error);
                let errorMessage = "";
                if(event.error === 'no-speech'){
                    errorMessage = "No se detectó voz. Por favor, asegúrate de hablar claro.";
                } else if (event.error === 'aborted'){
                    errorMessage = "La grabación fue cancelada.";
                } else if (event.error === 'audio-capture'){
                    errorMessage = "Problema con el micrófono. Asegúrate de que esté conectado y no esté en uso por otra aplicación.";
                } else if (event.error === 'not-allowed') {
                    errorMessage = "Permiso de micrófono denegado. Por favor, habilítalo en la configuración de tu navegador.";
                } else {
                    errorMessage = "Ocurrió un error inesperado en el reconocimiento de voz: " + event.error;
                }
                alert(errorMessage);
                stopInitiatedByUser.current = true;
                limpiarRecursosDeGrabacion();
            };

            recognition.onend = () => {
                console.log("Recognition onend fired. 'grabando' state (before cleanup):", grabando);
                console.log("stopInitiatedByUser.current:", stopInitiatedByUser.current);
                console.log("grabAndRecognizeTriggered.current:", grabAndRecognizeTriggered.current);

                if (stopInitiatedByUser.current || (grabando && grabAndRecognizeTriggered.current)) {
                    const textToSend = currentRoundFullTextRef.current.trim();
                    console.log("ONEND: Texto final para enviar:", textToSend, "Length:", textToSend.length);
                    
                    if (textToSend || grabAndRecognizeTriggered.current) {
                        enviarTranscripcionAlBackend(textToSend);
                    }
                }
                currentRoundFullTextRef.current = ''; 
                stopInitiatedByUser.current = false;
            };

            recognition.start();
            setGrabando(true);
            console.log("SpeechRecognition iniciado en modo continuo.");

        } catch (error) {
            console.error("Error al acceder al micrófono o iniciar grabación:", error);
            alert('Error al acceder al micrófono: ' + error.message);
            setGrabando(false);
            limpiarRecursosDeGrabacion(); 
            currentRoundFullTextRef.current = '';
        }
    };

    const enviarTranscripcionAlBackend = async (transcripcionTexto) => {
        setCargando(true);
        setMostrarNumeros(false);

        const formData = new FormData();
        formData.append('transcripcion_texto', transcripcionTexto);
        formData.append('modo', modo);
        formData.append('numeros', JSON.stringify(numeros));

        try {
            const response = await fetch('http://127.0.0.1:8000/api/procesar_texto/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error del servidor: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            setResultadoAPI(data);
            setTranscripcion(data.transcripcion);
            setEsCorrecto(data.correcto);
            setScore(prevScore => prevScore + data.puntos);
            setMostrarResultado(true);
        } catch (error) {
            console.error('Error al enviar la transcripción:', error);
            alert('Error al procesar la transcripción: ' + error.message);
            setMostrarResultado(true);
            setEsCorrecto(false);
            setTranscripcion(transcripcionTexto ? [transcripcionTexto] : ["Error de red/servidor"]);
        } finally {
            setCargando(false);
            setTimeout(generarRonda, 2000); 
        }
    };

    const iniciarJuego = () => {
        setModalAbierto(false);
        setModoModal('inicio');
        setJuegoTerminado(false); 
        setTiempo(60);            
        setScore(0); 
        setCuentaRegresiva(3);

        const intervalo = setInterval(() => {
            setCuentaRegresiva(prev => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    setCuentaRegresiva("¡Comencemos!");
                    setTimeout(() => {
                        setCuentaRegresiva(null);
                        generarRonda();
                        setActivo(true);
                    }, 1000);
                }
                return typeof prev === 'number' ? prev - 1 : prev;
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
            setCuentaRegresiva(prev => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    setCuentaRegresiva("¡Comencemos!");
                    setTimeout(() => {
                        setCuentaRegresiva(null);
                        generarRonda();
                        setActivo(true);
                    }, 1000);
                }
                return typeof prev === 'number' ? prev - 1 : prev;
            });
        }, 1000);
    };

    const mostrarAyuda = () => {
            setModoModal('ayuda');
            setModalAbierto(true);
            setActivo(false);
            detenerGrabacionYReconocimiento();
    };

    function generarSecuenciaMixta() {
        const posiblesNumeros = Array.from({ length: 9 }, (_, i) => i + 1);
        const posiblesLetras = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const mezcla = [];

        while (mezcla.length < 5) {
            const usarLetra = Math.random() < 0.5;
            if (usarLetra && posiblesLetras.length > 0) {
                const letra = posiblesLetras.splice(Math.floor(Math.random() * posiblesLetras.length), 1)[0];
                mezcla.push(letra);
            } else if (posiblesNumeros.length > 0) {
                const numero = posiblesNumeros.splice(Math.floor(Math.random() * posiblesNumeros.length), 1)[0];
                mezcla.push(numero);
            }
        }
        return mezcla;
    }
        
    const generarRonda = () => {
        limpiarRecursosDeGrabacion();
        setTextoEnTiempoReal('');
        setUltimaTranscripcionFinal('');

        if(!activo && cuentaRegresiva == null && !juegoTerminado) {}

        const nuevosNumeros = generarSecuenciaMixta();
        const nuevoModo = modosDisponibles[Math.floor(Math.random() * modosDisponibles.length)];

        setNumeros(nuevosNumeros);
        setModo(nuevoModo);

        setMostrarResultado(false);
        setEsCorrecto(false);
        setTranscripcion([]);
        setGrabando(false);    
        setPuedeGrabar(false);
        setResultadoAPI(null);

        currentRoundFullTextRef.current = '';

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
        if (activo && !juegoTerminado && !grabando && !mostrarResultado && !cargando && puedeGrabar && !recognitionRef.current) {
            console.log("useEffect: Condiciones para iniciar grabación met.")
            const delayBeforeRecording = setTimeout(() => {
                iniciarGrabacionYReconocimiento();
            }, 500);
            return () => clearTimeout(delayBeforeRecording);
        } 
        if (grabando && (!activo || juegoTerminado || mostrarResultado || cargando || !puedeGrabar)) {
            console.log("useEffect: Condiciones para detener grabación met.");
            limpiarRecursosDeGrabacion();
        }
    }, [activo, juegoTerminado, grabando, mostrarResultado, cargando, puedeGrabar]);

    useEffect(() => {
        return () => {
            limpiarRecursosDeGrabacion(); 
            currentRoundFullTextRef.current = '';
        };
    }, []); 

    return (
        <div className='navbar-container'>
            <div className = 'instrucciones'>
            {modoAbierto && (
                <Modal isOpen={modoAbierto} onClose={() => setModalAbierto(false)}>
                    {modoModal === 'inicio' ? (
                        <>
                            <h2>PRUEBA LETRAS Y NÚMEROS</h2>
                            <br></br>
                            <p>Esta prueba evalúa la atención, concentración y memoria de trabajo.</p>
                            <br></br>
                            <h5>Lee atentamente las instrucciones:</h5>
                            <ol style={{ textAlign: 'justify' }}>
                                <li>Se presentan una serie de números y letras.</li>
                                <li>Memoriza u ordena en tu mente la serie de numeros y letras que se te muestran (Recuerda que las letras son según el orden alfabético) </li>
                                <li>PRIMERO DI LOS NÚMEROS Y LUEGO LAS LETRAS cuando comience la grabación.</li>
                                <li>Da click en detener cuando hayas terminado de decir tu respuesta.</li>
                                <li>Se te mostrará si la respuesta es correcta o incorrecta.</li>
                                <li>Ganas puntos por cada respuesta correcta, SUERTE!!!</li>
                            </ol>
                            <div className = 'botoncomenzar'>
                            <button onClick={iniciarJuego} disabled={cuentaRegresiva !== null}>Comenzar</button> 
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Recordando ...</h2>
                            <br></br>
                            <p>Esta prueba evalúa la atención, concentración y memoria de trabajo.</p>
                            <br></br>
                            <ul style={{ textAlign: 'left' }}>
                                <li> Observa la secuencia de números o letras que aparece por 5 segundos.</li>
                                <li> Cuando empiece la grabación, di la secuencia comenzando con los NÚMEROS, según la instrucción mostrada y da click en detener cuando hayas terminado.</li>
                                <li> Si aciertas, ganas puntos. Si te equivocas, no pasa nada. ¡Sigue intentando!</li>
                            </ul>
                            <br></br>
                            <h6>Puedes pausar el juego con el botón de pausa, o volver a ver esta ayuda cuando quieras.</h6>
                        </>
                    )}
                </Modal>
            )}
            </div>
            <div className = 'Pausa'>
            {mostrarModalPausa && (
                <Modal isOpen={mostrarModalPausa} onClose={() => setMostrarModalPausa(false)}>
                    <h2>Prueba en pausa</h2>
                    <br></br>
                    <div className = 'botonesPausa'>
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
                    <p>Tu puntaje final fue: <strong>{score}</strong></p>
                </div>
            ) : (
                <div className='navbar'>
                    <div className="Numeros">
                    {cargando ? (
                    <div className = "pantalla-cargando">
                        <h3>Evaluando respuesta...</h3>
                    </div>
                    ) : (mostrarNumeros && activo) ? (
                            <>
                                <h5>{modo}</h5>
                                <p>{numeros.map(n => typeof n === 'string' ? n.toUpperCase() : n).join(" ")}</p>
                            </>
                        ) : mostrarResultado ? (
                            <>
                                <h3>{esCorrecto ? '✅ Correcto' : '❌ Incorrecto'}</h3>
                                <br></br>
                                <h6><strong>Dijiste: </strong> {(transcripcion.join(" ")).toUpperCase() || "Sin transcripción"}</h6>
                                <br></br>
                                <h6><strong>Respuesta correcta: </strong>{resultadoAPI && resultadoAPI.esperado ? (resultadoAPI.esperado.join(" ")).toUpperCase() : "Cargando..."}</h6>
                            </>
                        ) : null}
                    </div>

                    <button className='boton-pausa' onClick={toggleActivo}>
                        {activo ? "⏸" : "▶️"} 
                    </button>

                    <div className='tiempo'>{tiempo}</div>

                    <div className='Score'>Score:{score}</div>

                    <button className="boton-ayuda" onClick={mostrarAyuda}>
                        !
                    </button>

                    {grabando && !mostrarResultado && (
                        <div className="grabando-voz">
                            <h6>Escuchando...</h6>
                            <p className = "texto-usuario"> {textoEnTiempoReal.toUpperCase()}</p>
                            <button onClick = {detenerGrabacionYReconocimiento}>🟥 Detener</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default Navbar;
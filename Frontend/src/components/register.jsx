import React, { useState } from "react";
import "../styles/register.css";
import NavBar from "./homePage/NavBar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Enviar solicitud al backend (modificar la URL según corresponda)
    const data = {
      email,
      username,
      password,
    };

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert("Registro exitoso");
          // Puedes redirigir a otra página después de un registro exitoso
        }
      })
      .catch((err) => {
        console.error("Error al registrar", err);
        setError("Ocurrió un error. Intenta de nuevo.");
      });
  };

  return (
    <>
      <NavBar />
      <div className="register-container">
        <div className="register-box">
          <h2>Regístrate</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Registrarse</button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </>
  );
};

export default Register;

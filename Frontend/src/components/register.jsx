import React, { useState } from "react";
import "../styles/register.css";
import NavBar from "./homePage/NavBar";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const data = { email, username, password, password2: confirmPassword };

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          const errorText = Object.values(data).flat().join(" ");
          throw new Error(errorText);
        }
        return response.json();
      })
      .then(() => {
        setSuccess("¡Registro exitoso!");
        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          localStorage.setItem("access", data.token);
          localStorage.setItem("refresh", data["refresh-token"]);
          console.log("Usuario:", data.user);
          window.location.href = "/main-menu";
        }, 1500);
      })
      .catch((err) => {
        console.error("Error al registrar", err);
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      });
  };

  return (
    <>
      <NavBar />
      <div className="register-container">
        <div className="register-box">
          <h2>Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Registrarse</button>
          </form>

          {error && <p className="message error-message">{error}</p>}
          {success && <p className="message success-message">{success}</p>}
        </div>
      </div>
    </>
  );
};

export default Register;

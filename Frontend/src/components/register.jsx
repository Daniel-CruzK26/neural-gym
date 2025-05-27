import React, { useState } from 'react';
import '../styles/register.css'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const data = {
      email,
      username,
      password,
      password2: confirmPassword, // Django espera 'password2'
    };

    fetch('http://localhost:8000/register/', { // Asegúrate que este sea el puerto del backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            const errors = Object.values(data).flat().join(' ');
            throw new Error(errors);
          });
        }
        return response.json();
      })
      .then(() => {
        alert('Registro exitoso');
        // Redireccionar si lo deseas, por ejemplo:
        // window.location.href = "/login";
      })
      .catch((err) => {
        console.error('Error al registrar', err);
        setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
      });
  };

  return (
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
  );
};

export default Register;

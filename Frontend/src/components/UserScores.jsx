import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function UserScores() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token no disponible. Por favor inicia sesión.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/scores/", {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Asegúrate de que es Bearer, no solo el token.
          },
        });
        setScores(res.data);
      } catch (err) {
        setError("No se pudieron obtener los puntajes. Verifica tu sesión.");
        console.error("Error al obtener puntajes:", err);
      }
    };

    fetchScores();
  }, []);

  const formattedData = scores.map((item, index) => ({
    ...item,
    fecha: item.fecha ? new Date(item.fecha).toLocaleDateString() : `#${index + 1}`,
  }));

  return (
    <div className="scores-section">
      <h2 className="user-scores-title">Mis Puntajes</h2>

      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <>
          <ResponsiveContainer width="95%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <table className="score-table visible-table">
            <thead>
              <tr>
                <th>Prueba</th>
                <th>Score</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.prueba}</td>
                  <td>{item.score}</td>
                  <td>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

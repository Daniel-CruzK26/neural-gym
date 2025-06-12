import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const ScoresHistory = () => {
  const [tests, setTests] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Carga las pruebas
        const resTests = await fetch('http://localhost:8000/pruebas/actividades/');
        const testsData = await resTests.json();
        setTests(testsData);
        setSelectedTest(testsData[0]?.name || '');

        // 2) Carga los puntajes (sin token para depurar)
        const resScores = await fetch('http://localhost:8000/pruebas/scores/');
        const scoresData = await resScores.json();
        setScores(scoresData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando datos...</p>;
  }
  if (!tests.length) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No hay pruebas disponibles.</p>;
  }

  // Filtra los scores por el nombre de la prueba seleccionada
  const filtered = scores.filter((s) => s.prueba === selectedTest);

  // Prepara los datos de la gráfica
  const chartData = filtered.map((s, i) => ({
    label: s.fecha
      ? new Date(s.fecha).toLocaleDateString()
      : `#${i + 1}`,
    score: s.score,
  }));

return (
    
  <div
    style={{
      width: '100%',        // ocupa todo el ancho
      height: '100%',       // ocupa todo el alto del main
      padding: '2rem',      // separa de los bordes
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
    }}
  >
      <h2 style={{ color: 'black', textAlign: 'center', marginBottom: '1rem', fontSize: '1.75rem' }}>
        Historial de Puntajes
      </h2>

      <div style={{ color: 'black', marginBottom: '1.5rem', textAlign: 'center' }}>
        <label
          htmlFor="test-select"
          style={{ marginRight: '0.5rem', fontWeight: 'bold' }}
        >
          Prueba:
        </label>
        <select
          id="test-select"
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            minWidth: '200px',
          }}
        >
          {tests.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No hay datos registrados para <strong>{selectedTest}</strong>.
        </p>
      )}

      {filtered.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black', }}>
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: '2px solid #ddd',
                  padding: '0.75rem',
                  textAlign: 'left',
                }}
              >
                Intento
              </th>
              <th
                style={{
                  borderBottom: '2px solid #ddd',
                  padding: '0.75rem',
                  textAlign: 'right',
                }}
              >
                Puntuación
              </th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '0.5rem 0.75rem' }}>{item.label}</td>
                <td
                  style={{
                    padding: '0.5rem 0.75rem',
                    textAlign: 'right',
                  }}
                >
                  {item.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScoresHistory;

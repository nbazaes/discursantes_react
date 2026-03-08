import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Historial() {
  const [domingos, setDomingos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/discursos/domingos').then(res => {
      setDomingos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatFecha = (f) => {
    const d = new Date(f + 'T00:00:00');
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const eliminarDiscurso = async (id) => {
    if (!window.confirm('¿Eliminar este discurso?')) return;
    try {
      await axios.delete(`/discursos/${id}`);
      // Recargar
      const res = await axios.get('/discursos/domingos');
      setDomingos(res.data);
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Historial de Domingos</h1>
        <p>Registro completo de discursos pasados</p>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : domingos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📅</div>
            <p>No hay domingos registrados aún</p>
          </div>
        </div>
      ) : (
        domingos.map(domingo => (
          <div key={domingo.fecha} className="card domingo-group">
            <div className="domingo-fecha">
              📅 {formatFecha(domingo.fecha)}
            </div>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Discursante</th>
                  <th>Llamamiento</th>
                  <th>Tema</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {domingo.discursos.map(d => (
                  <tr key={d.id}>
                    <td>
                      <strong>
                        {d.discursante
                          ? `${d.discursante.Nombres} ${d.discursante.Apellidos}`
                          : 'Desconocido'}
                      </strong>
                    </td>
                    <td>{d.discursante?.Llamamiento || '—'}</td>
                    <td>{d.Tema}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDiscurso(d.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default Historial;

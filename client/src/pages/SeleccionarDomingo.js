import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = '/api';

function SeleccionarDomingo() {
  const [discursantes, setDiscursantes] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [fecha, setFecha] = useState('');
  const [entradas, setEntradas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargandoFecha, setCargandoFecha] = useState(false);

  const cargarDiscursosFecha = useCallback(async (f) => {
    if (!f) return;
    setCargandoFecha(true);
    try {
      const res = await axios.get(`${API}/discursos/fecha/${f}`);
      if (res.data.length > 0) {
        setEntradas(res.data.map(d => ({
          id: d.id,
          DiscursanteId: String(d.DiscursanteId),
          Tema: d.Tema
        })));
        setModoEdicion(true);
      } else {
        setEntradas([]);
        setModoEdicion(false);
      }
    } catch {
      setEntradas([]);
      setModoEdicion(false);
    }
    setCargandoFecha(false);
  }, []);

  useEffect(() => {
    // Calcular el próximo domingo
    const hoy = new Date();
    const dia = hoy.getDay();
    const diasHastaDomingo = dia === 0 ? 0 : 7 - dia;
    const proximoDomingo = new Date(hoy);
    proximoDomingo.setDate(hoy.getDate() + diasHastaDomingo);
    const yyyy = proximoDomingo.getFullYear();
    const mm = String(proximoDomingo.getMonth() + 1).padStart(2, '0');
    const dd = String(proximoDomingo.getDate()).padStart(2, '0');
    const fechaInicial = `${yyyy}-${mm}-${dd}`;
    setFecha(fechaInicial);

    // Cargar discursantes y sugerencias
    axios.get(`${API}/discursantes`).then(res => {
      setDiscursantes(res.data);
    });
    axios.get(`${API}/discursantes/accion/sugerencia`).then(res => {
      setSugerencias(res.data);
    });

    // Cargar discursos existentes para esa fecha
    cargarDiscursosFecha(fechaInicial);
  }, [cargarDiscursosFecha]);

  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setMensaje(null);
    cargarDiscursosFecha(nuevaFecha);
  };

  const agregarEntrada = () => {
    setEntradas([...entradas, { DiscursanteId: '', Tema: '' }]);
  };

  const agregarSugerido = (discursanteId) => {
    if (entradas.some(e => String(e.DiscursanteId) === String(discursanteId))) return;
    setEntradas([...entradas, { DiscursanteId: String(discursanteId), Tema: '' }]);
  };

  const actualizarEntrada = (index, campo, valor) => {
    const nuevas = [...entradas];
    nuevas[index][campo] = valor;
    setEntradas(nuevas);
  };

  const quitarEntrada = (index) => {
    setEntradas(entradas.filter((_, i) => i !== index));
  };

  const guardar = async () => {
    if (!fecha) { alert('Selecciona una fecha'); return; }
    const validos = entradas.filter(e => e.DiscursanteId && e.Tema.trim());
    if (validos.length === 0) { alert('Agrega al menos un discursante con tema'); return; }

    setGuardando(true);
    try {
      const discursos = validos.map(e => ({
        Tema: e.Tema.trim(),
        DiscursanteId: parseInt(e.DiscursanteId)
      }));

      if (modoEdicion) {
        await axios.put(`${API}/discursos/fecha/${fecha}`, { discursos });
        setMensaje('¡Discursos actualizados correctamente!');
      } else {
        const payload = discursos.map(d => ({ ...d, Fecha: fecha }));
        await axios.post(`${API}/discursos`, { discursos: payload });
        setMensaje('¡Discursos guardados correctamente!');
      }

      // Recargar
      await cargarDiscursosFecha(fecha);
      const res = await axios.get(`${API}/discursantes/accion/sugerencia`);
      setSugerencias(res.data);
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.error || err.message));
    }
    setGuardando(false);
  };

  const formatFecha = (f) => {
    if (!f) return 'Nunca';
    const d = new Date(f + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Seleccionar Discursantes para el Domingo</h1>
        <p>Asigna quiénes van a hablar y sobre qué tema</p>
      </div>

      {mensaje && (
        <div className="card" style={{ background: '#f0fff4', borderLeft: '4px solid #38a169' }}>
          <p style={{ color: '#276749', fontWeight: 600 }}>{mensaje}</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setMensaje(null)} style={{ marginTop: '0.5rem' }}>
            Cerrar
          </button>
        </div>
      )}

      <div className="card">
        <h2>📅 Fecha del Domingo</h2>
        <div className="domingo-header">
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={e => cambiarFecha(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
          {cargandoFecha && <span style={{ color: '#a0aec0' }}>Cargando...</span>}
          {!cargandoFecha && modoEdicion && (
            <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              ✏️ Editando domingo existente
            </span>
          )}
          {!cargandoFecha && !modoEdicion && fecha && (
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              ✨ Nuevo domingo
            </span>
          )}
        </div>
      </div>

      {/* Sugerencias */}
      <div className="card">
        <h2>💡 Sugerencias (hace más tiempo sin hablar)</h2>
        {sugerencias.length === 0 ? (
          <p style={{ color: '#a0aec0' }}>No hay discursantes registrados</p>
        ) : (
          <div className="sugerencia-list">
            {sugerencias.slice(0, 10).map(s => (
              <button
                key={s.id}
                className={`sugerencia-chip ${!s.ultimaFecha ? 'nunca' : ''}`}
                onClick={() => agregarSugerido(s.id)}
                title={s.ultimaFecha ? `Último: ${formatFecha(s.ultimaFecha)}` : 'Nunca ha hablado'}
              >
                {s.Nombres} {s.Apellidos}
                <small style={{ marginLeft: '0.3rem', opacity: 0.7 }}>
                  {s.ultimaFecha ? formatFecha(s.ultimaFecha) : '(nunca)'}
                </small>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entradas de discursantes */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Discursantes del Domingo</h2>
          <button className="btn btn-success" onClick={agregarEntrada}>+ Agregar Discursante</button>
        </div>

        {entradas.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>Haz clic en una sugerencia o en "+ Agregar Discursante" para comenzar</p>
          </div>
        ) : (
          entradas.map((entrada, idx) => (
            <div key={idx} className="domingo-entry">
              <div className="form-group" style={{ margin: 0 }}>
                <label>Discursante</label>
                <select
                  className="form-control"
                  value={entrada.DiscursanteId}
                  onChange={e => actualizarEntrada(idx, 'DiscursanteId', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {discursantes.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.Apellidos}, {d.Nombres}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Tema</label>
                <input
                  className="form-control"
                  value={entrada.Tema}
                  onChange={e => actualizarEntrada(idx, 'Tema', e.target.value)}
                  placeholder="Tema del discurso"
                />
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => quitarEntrada(idx)} style={{ alignSelf: 'flex-end' }}>
                ✕
              </button>
            </div>
          ))
        )}

        {entradas.length > 0 && (
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={guardar}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : modoEdicion ? '💾 Actualizar Discursos del Domingo' : '💾 Guardar Discursos del Domingo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarDomingo;

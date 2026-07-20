import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getDiscursantes, getSugerencias, getDiscursosPorFecha, replaceDiscursosFecha, createDiscursos } from '../lib/db';

function SeleccionarDomingo() {
  const { t, i18n } = useTranslation();
  const [discursantes, setDiscursantes] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [fecha, setFecha] = useState('');
  const [entradas, setEntradas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargandoFecha, setCargandoFecha] = useState(false);
  const [ocultos, setOcultos] = useState([]);

  const cargarDiscursosFecha = useCallback(async (f) => {
    if (!f) return;
    setCargandoFecha(true);
    try {
      const data = await getDiscursosPorFecha(f);
      if (data.length > 0) {
        setEntradas(data.map(d => ({
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
    getDiscursantes().then(data => {
      setDiscursantes(data);
    });
    getSugerencias().then(data => {
      setSugerencias(data);
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

  const ocultarSugerencia = (id) => {
    setOcultos([...ocultos, id]);
  };

  const guardar = async () => {
    if (!fecha) { alert(t('sundayPage.dateRequired')); return; }
    const validos = entradas.filter(e => e.DiscursanteId && e.Tema.trim());
    if (validos.length === 0) { alert(t('sundayPage.atLeastOne')); return; }

    setGuardando(true);
    try {
      const discursos = validos.map(e => ({
        Tema: e.Tema.trim(),
        DiscursanteId: parseInt(e.DiscursanteId)
      }));

      if (modoEdicion) {
        await replaceDiscursosFecha(fecha, discursos);
        setMensaje(t('sundayPage.updateSuccess'));
      } else {
        const payload = discursos.map(d => ({ ...d, Fecha: fecha }));
        await createDiscursos(payload);
        setMensaje(t('sundayPage.saveSuccess'));
      }

      // Recargar
      await cargarDiscursosFecha(fecha);
      const data = await getSugerencias();
      setSugerencias(data);
    } catch (err) {
      alert(t('sundayPage.saveError', { error: err.message }));
    }
    setGuardando(false);
  };

  const formatFecha = (f) => {
    if (!f) return t('common.never');
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('sundayPage.title')}</h1>
        <p>{t('sundayPage.subtitle')}</p>
      </div>

      {mensaje && (
        <div className="toast toast--success" role="status" aria-live="polite">
          <span className="toast__content">{mensaje}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => setMensaje(null)}
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>
      )}

      <div className="card">
        <h2>📅 {t('sundayPage.sundayDate')}</h2>
        <div className="domingo-header">
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={e => cambiarFecha(e.target.value)}
            />
          </div>
          {cargandoFecha && <span style={{ color: 'var(--color-text-muted)' }}>{t('sundayPage.loadingDate')}</span>}
          {!cargandoFecha && modoEdicion && (
            <span className="status-badge status-badge--warning">
              ✏️ {t('sundayPage.editingExistingSunday')}
            </span>
          )}
          {!cargandoFecha && !modoEdicion && fecha && (
            <span className="status-badge status-badge--success">
              ✨ {t('sundayPage.newSunday')}
            </span>
          )}
        </div>
      </div>

      {/* Sugerencias */}
      <div className="card">
        <h2>💡 {t('sundayPage.suggestionsTitle')}</h2>
        {sugerencias.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>{t('sundayPage.noRegisteredSpeakers')}</p>
        ) : (
          <div className="suggestion-grid">
            {sugerencias
              .filter(s => !ocultos.includes(s.id))
              .slice(0, 10)
              .map(s => (
                <div
                  key={s.id}
                  className={`sugerencia-chip ${!s.ultimaFecha ? 'nunca' : ''}`}
                  onClick={() => agregarSugerido(s.id)}
                  title={s.ultimaFecha ? t('sundayPage.last', { date: formatFecha(s.ultimaFecha) }) : t('sundayPage.neverSpoken')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') agregarSugerido(s.id); }}
                >
                  <span>{s.Nombres} {s.Apellidos}</span>
                  <small>{s.ultimaFecha ? formatFecha(s.ultimaFecha) : t('sundayPage.neverTag')}</small>
                  <button
                    type="button"
                    className="sugerencia-chip__remove"
                    onClick={e => { e.stopPropagation(); ocultarSugerencia(s.id); }}
                    title={t('common.delete')}
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Entradas de discursantes */}
      <div className="card">
        <div className="card-header">
          <h2>{t('sundayPage.sundaySpeakers')}</h2>
          <button className="btn btn-success" onClick={agregarEntrada}>+ {t('sundayPage.addSpeaker')}</button>
        </div>

        {entradas.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>{t('sundayPage.startHint')}</p>
          </div>
        ) : (
          entradas.map((entrada, idx) => (
            <div key={idx} className="entry-card">
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('sundayPage.selectSpeaker')}</label>
                <select
                  className="form-control"
                  value={entrada.DiscursanteId}
                  onChange={e => actualizarEntrada(idx, 'DiscursanteId', e.target.value)}
                >
                  <option value="">{t('sundayPage.selectOption')}</option>
                  {discursantes.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.Apellidos}, {d.Nombres}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('sundayPage.topic')}</label>
                <input
                  className="form-control"
                  value={entrada.Tema}
                  onChange={e => actualizarEntrada(idx, 'Tema', e.target.value)}
                  placeholder={t('sundayPage.topicPlaceholder')}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm entry-card__remove"
                onClick={() => quitarEntrada(idx)}
              >
                ✕ {t('common.delete')}
              </button>
            </div>
          ))
        )}

        {entradas.length > 0 && (
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={guardar}
              disabled={guardando}
            >
              {guardando
                ? t('sundayPage.saving')
                : modoEdicion
                  ? `💾 ${t('sundayPage.updateSundaySpeeches')}`
                  : `💾 ${t('sundayPage.saveSundaySpeeches')}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarDomingo;
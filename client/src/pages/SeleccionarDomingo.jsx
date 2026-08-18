import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getDiscursantes, getSugerencias, getDiscursosPorFecha, replaceDiscursosFecha, createDiscursos } from '../lib/db';
import { useSupabase } from '../lib/SupabaseProvider';
import { IconSunday, IconSpark, IconPlus, IconClose, IconSave, IconWhatsApp, IconCalendar } from '../components/Icons';

function SeleccionarDomingo() {
  const { t, i18n } = useTranslation();
  const supabase = useSupabase();
  const [discursantes, setDiscursantes] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [fecha, setFecha] = useState('');
  const [entradas, setEntradas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [enviandoWhatsApp, setEnviandoWhatsApp] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargandoFecha, setCargandoFecha] = useState(false);
  const [ocultos, setOcultos] = useState([]);
  const [justWired, setJustWired] = useState([]);

  const cargarDiscursosFecha = useCallback(async (f) => {
    if (!f) return;
    setCargandoFecha(true);
    try {
      const data = await getDiscursosPorFecha(supabase, f);
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
    getDiscursantes(supabase).then(data => {
      setDiscursantes(data);
    });
    getSugerencias(supabase).then(data => {
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
    const id = String(discursanteId);
    if (entradas.some(e => String(e.DiscursanteId) === id)) return;
    setEntradas([...entradas, { DiscursanteId: id, Tema: '' }]);
    setJustWired(prev => [...prev, id]);
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
        await replaceDiscursosFecha(supabase, fecha, discursos);
        setMensaje(t('sundayPage.updateSuccess'));
      } else {
        const payload = discursos.map(d => ({ ...d, Fecha: fecha }));
        await createDiscursos(supabase, payload);
        setMensaje(t('sundayPage.saveSuccess'));
      }

      // Recargar
      await cargarDiscursosFecha(fecha);
      const data = await getSugerencias(supabase);
      setSugerencias(data);
    } catch (err) {
      alert(t('sundayPage.saveError', { error: err.message }));
    }
    setGuardando(false);
  };

  const enviarNotificaciones = async () => {
    if (!fecha) {
      alert(t('sundayPage.whatsAppNoDate'));
      return;
    }
    setEnviandoWhatsApp(true);
    setMensaje(null);
    try {
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: { fecha },
      });
      if (error) throw error;
      setMensaje(t('sundayPage.whatsAppResult', {
        sent: data?.sent?.length ?? 0,
        skipped: data?.skipped?.length ?? 0,
        failed: data?.failed?.length ?? 0,
      }));
    } catch (err) {
      alert(t('sundayPage.whatsAppError', { error: err.message }));
    }
    setEnviandoWhatsApp(false);
  };

  const formatFecha = (f) => {
    if (!f) return t('common.never');
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatFechaLarga = (f) => {
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const diasDesde = (f) => {
    if (!f) return null;
    const d = new Date(f + 'T00:00:00');
    const hoy = new Date();
    return Math.floor((hoy - d) / 86400000);
  };

  const contadorDe = (s) => {
    if (!s.ultimaFecha) return t('sundayPage.neverTag');
    const dias = diasDesde(s.ultimaFecha);
    return t('sundayPage.agoDays', { count: dias });
  };

  const nombreDiscursante = (id) => {
    const d = discursantes.find(x => String(x.id) === String(id));
    return d ? `${d.Apellidos}, ${d.Nombres}` : '';
  };

  const llamamientoDiscursante = (id) => {
    const d = discursantes.find(x => String(x.id) === String(id));
    return d?.Llamamiento || '';
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
            <IconClose size={16} />
          </button>
        </div>
      )}

      {/* La fecha del domingo — la cabecera del registro */}
      <div className="card">
        <div className="date-heading">
          <span className="date-heading__emoji" aria-hidden="true"><IconSunday size={28} /></span>
          {fecha ? formatFechaLarga(fecha) : '—'}
        </div>
        <div className="domingo-header">
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={e => cambiarFecha(e.target.value)}
              aria-label={t('sundayPage.sundayDate')}
            />
          </div>
          {cargandoFecha && <span className="counter">{t('sundayPage.loadingDate')}</span>}
          {!cargandoFecha && modoEdicion && (
            <span className="status-badge status-badge--warning">
              {t('sundayPage.editingExistingSunday')}
            </span>
          )}
          {!cargandoFecha && !modoEdicion && fecha && (
            <span className="status-badge status-badge--success">
              {t('sundayPage.newSunday')}
            </span>
          )}
        </div>
      </div>

      {/* Nodos pendientes — las sugerencias de rotación */}
      <div className="card">
        <h2>{t('sundayPage.suggestionsTitle')}</h2>
        {sugerencias.length === 0 ? (
          <p className="empty-state" style={{ marginTop: 'var(--space-md)' }}>
            {t('sundayPage.noRegisteredSpeakers')}
          </p>
        ) : (
          <div className="pending-nodes">
            {sugerencias
              .filter(s => !ocultos.includes(s.id))
              .slice(0, 10)
              .map((s, idx) => (
                <div
                  key={s.id}
                  className={`sugerencia-node ${!s.ultimaFecha ? 'nunca' : ''}`}
                  onClick={() => agregarSugerido(s.id)}
                  title={s.ultimaFecha ? t('sundayPage.last', { date: formatFecha(s.ultimaFecha) }) : t('sundayPage.neverSpoken')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); agregarSugerido(s.id); } }}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <span className="sugerencia-node__main">
                    <span className="sugerencia-node__name">{s.Nombres} {s.Apellidos}</span>
                    {s.Llamamiento && <span className="sugerencia-node__calling">{s.Llamamiento}</span>}
                  </span>
                  <span className="counter">{contadorDe(s)}</span>
                  <button
                    type="button"
                    className="sugerencia-node__remove"
                    onClick={e => { e.stopPropagation(); ocultarSugerencia(s.id); }}
                    title={t('common.delete')}
                    aria-label={`${t('common.delete')} ${s.Nombres} ${s.Apellidos}`}
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* La generación — los asignados sobre la línea */}
      <div className="card">
        <div className="card-header">
          <h2>{t('sundayPage.sundaySpeakers')}</h2>
          <button className="btn btn-success" onClick={agregarEntrada}>
            <IconPlus size={16} /> {t('sundayPage.addSpeaker')}
          </button>
        </div>

        {entradas.length === 0 ? (
          <div className="empty-state">
            <span className="icon" aria-hidden="true"><IconSpark size={40} /></span>
            <p>{t('sundayPage.startHint')}</p>
          </div>
        ) : (
          <div className="generation">
            {entradas.map((entrada, idx) => (
              <div
                key={idx}
                className={`gen-node ${!entrada.DiscursanteId ? 'gen-node--manual' : ''} ${justWired.includes(String(entrada.DiscursanteId)) ? 'gen-node--just-wired' : ''}`}
              >
                <div className="gen-node__head">
                  <div className="gen-node__identity">
                    <div className="gen-node__name">
                      {entrada.DiscursanteId ? nombreDiscursante(entrada.DiscursanteId) : t('sundayPage.selectOption')}
                    </div>
                    {entrada.DiscursanteId && llamamientoDiscursante(entrada.DiscursanteId) && (
                      <div className="gen-node__calling">{llamamientoDiscursante(entrada.DiscursanteId)}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="gen-node__remove"
                    onClick={() => quitarEntrada(idx)}
                    aria-label={`${t('common.delete')} ${entrada.DiscursanteId ? nombreDiscursante(entrada.DiscursanteId) : t('common.unknown')}`}
                  >
                    <IconClose size={16} />
                  </button>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={`sel-${idx}`}>{t('sundayPage.selectSpeaker')}</label>
                  <select
                    id={`sel-${idx}`}
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
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={`tema-${idx}`}>{t('sundayPage.topic')}</label>
                  <input
                    id={`tema-${idx}`}
                    className="form-control"
                    value={entrada.Tema}
                    onChange={e => actualizarEntrada(idx, 'Tema', e.target.value)}
                    placeholder={t('sundayPage.topicPlaceholder')}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {entradas.length > 0 && (
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={guardar}
              disabled={guardando || enviandoWhatsApp}
            >
              <IconSave size={18} />
              {guardando
                ? t('sundayPage.saving')
                : modoEdicion
                  ? t('sundayPage.updateSundaySpeeches')
                  : t('sundayPage.saveSundaySpeeches')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={enviarNotificaciones}
              disabled={enviandoWhatsApp || guardando}
            >
              <IconWhatsApp size={18} />
              {enviandoWhatsApp ? t('sundayPage.sendingWhatsApp') : t('sundayPage.sendWhatsApp')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarDomingo;
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDiscursantes, createDiscursante, updateDiscursante, deleteDiscursante } from '../lib/db';
import { useSupabase } from '../lib/SupabaseProvider';

function Discursantes() {
  const { t, i18n } = useTranslation();
  const supabase = useSupabase();
  const [discursantes, setDiscursantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar'
  const [form, setForm] = useState({ Nombres: '', Apellidos: '', Llamamiento: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const cargar = () => {
    setLoading(true);
    getDiscursantes(supabase).then(data => {
      setDiscursantes(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setForm({ Nombres: '', Apellidos: '', Llamamiento: '' });
    setEditId(null);
    setModal('crear');
  };

  const abrirEditar = (d) => {
    setForm({ Nombres: d.Nombres, Apellidos: d.Apellidos, Llamamiento: d.Llamamiento || '' });
    setEditId(d.id);
    setModal('editar');
  };

  const guardar = async () => {
    if (!form.Nombres.trim() || !form.Apellidos.trim()) return;
    try {
      if (modal === 'crear') {
        await createDiscursante(supabase, form);
      } else {
        await updateDiscursante(supabase, editId, form);
      }
      setModal(null);
      cargar();
    } catch (err) {
      alert(t('speakersPage.saveError', { error: err.message }));
    }
  };

  const eliminar = async (id, nombre) => {
    if (!window.confirm(t('speakersPage.deleteConfirm', { name: nombre }))) return;
    try {
      await deleteDiscursante(supabase, id);
      cargar();
    } catch {
      alert(t('speakersPage.deleteError'));
    }
  };

  const ultimaFecha = (disc) => {
    if (!disc.discursos || disc.discursos.length === 0) return null;
    const fechas = disc.discursos.map(d => d.Fecha).sort().reverse();
    return fechas[0];
  };

  const formatFecha = (f) => {
    if (!f) return t('common.noData');
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return discursantes;
    return discursantes.filter(d =>
      `${d.Nombres} ${d.Apellidos}`.toLowerCase().includes(term) ||
      (d.Llamamiento || '').toLowerCase().includes(term)
    );
  }, [discursantes, search]);

  const renderLastSpeechBadge = (d) => {
    const fecha = ultimaFecha(d);
    return fecha ? (
      <span className="badge badge-info">{formatFecha(fecha)}</span>
    ) : (
      <span className="badge badge-warning">{t('common.never')}</span>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('speakersPage.title')}</h1>
        <p>{t('speakersPage.subtitle')}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>{t('speakersPage.listTitle')}</h2>
          <div className="card-header__actions">
            <div className="search">
              <span className="search__icon">🔍</span>
              <input
                type="text"
                className="search__input"
                placeholder={t('speakersPage.search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label={t('speakersPage.search')}
              />
            </div>
            <button className="btn btn-primary" onClick={abrirCrear}>+ {t('speakersPage.newSpeaker')}</button>
          </div>
        </div>

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : discursantes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <p>{t('speakersPage.noSpeakers')}</p>
            <button className="btn btn-primary" onClick={abrirCrear} style={{ marginTop: '1rem' }}>
              {t('speakersPage.addFirst')}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>{t('speakersPage.noSearchResults')}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="table-container hide-mobile">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>{t('speakersPage.name')}</th>
                    <th>{t('speakersPage.calling')}</th>
                    <th>{t('speakersPage.lastSpeech')}</th>
                    <th>{t('speakersPage.total')}</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id}>
                      <td><strong>{d.Apellidos}</strong>, {d.Nombres}</td>
                      <td>{d.Llamamiento || <span style={{ color: 'var(--color-text-muted)' }}>{t('common.noData')}</span>}</td>
                      <td>{renderLastSpeechBadge(d)}</td>
                      <td>{d.discursos ? d.discursos.length : 0}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(d)}>{t('common.edit')}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminar(d.id, `${d.Nombres} ${d.Apellidos}`)}>{t('common.delete')}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="hide-desktop">
              <div className="speaker-cards">
                {filtered.map(d => (
                  <div key={d.id} className="speaker-card">
                  <div className="speaker-card__main">
                    <div className="speaker-card__name">{d.Apellidos}, {d.Nombres}</div>
                    <div className="speaker-card__calling">
                      {d.Llamamiento || t('common.noData')}
                    </div>
                    <div className="speaker-card__meta">
                      {renderLastSpeechBadge(d)}
                      <span className="badge badge-success">{t('speakersPage.total')}: {d.discursos ? d.discursos.length : 0}</span>
                    </div>
                  </div>
                  <div className="speaker-card__actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(d)}>{t('common.edit')}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(d.id, `${d.Nombres} ${d.Apellidos}`)}>{t('common.delete')}</button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'crear' ? t('speakersPage.newSpeakerTitle') : t('speakersPage.editSpeakerTitle')}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t('speakersPage.firstNames')} <span className="required">*</span></label>
                <input
                  className="form-control"
                  value={form.Nombres}
                  onChange={e => setForm({ ...form, Nombres: e.target.value })}
                  placeholder={t('speakersPage.firstNames')}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>{t('speakersPage.lastNames')} <span className="required">*</span></label>
                <input
                  className="form-control"
                  value={form.Apellidos}
                  onChange={e => setForm({ ...form, Apellidos: e.target.value })}
                  placeholder={t('speakersPage.lastNames')}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('speakersPage.calling')}</label>
              <input
                className="form-control"
                value={form.Llamamiento}
                onChange={e => setForm({ ...form, Llamamiento: e.target.value })}
                placeholder={t('speakersPage.callingPlaceholder')}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={guardar}>
                {modal === 'crear' ? t('common.create') : t('speakersPage.saveChanges')}
              </button>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discursantes;

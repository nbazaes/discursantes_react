import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API = '/api/discursantes';

function Discursantes() {
  const { t, i18n } = useTranslation();
  const [discursantes, setDiscursantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar'
  const [form, setForm] = useState({ Nombres: '', Apellidos: '', Llamamiento: '' });
  const [editId, setEditId] = useState(null);

  const cargar = () => {
    setLoading(true);
    axios.get(API).then(res => {
      setDiscursantes(res.data);
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
        await axios.post(API, form);
      } else {
        await axios.put(`${API}/${editId}`, form);
      }
      setModal(null);
      cargar();
    } catch (err) {
      alert(t('speakersPage.saveError', { error: err.response?.data?.error || err.message }));
    }
  };

  const eliminar = async (id, nombre) => {
    if (!window.confirm(t('speakersPage.deleteConfirm', { name: nombre }))) return;
    try {
      await axios.delete(`${API}/${id}`);
      cargar();
    } catch (err) {
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

  return (
    <div>
      <div className="page-header">
        <h1>{t('speakersPage.title')}</h1>
        <p>{t('speakersPage.subtitle')}</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>{t('speakersPage.listTitle')}</h2>
          <button className="btn btn-primary" onClick={abrirCrear}>+ {t('speakersPage.newSpeaker')}</button>
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
        ) : (
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
              {discursantes.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.Apellidos}</strong>, {d.Nombres}</td>
                  <td>{d.Llamamiento || <span style={{ color: '#a0aec0' }}>{t('common.noData')}</span>}</td>
                  <td>
                    {ultimaFecha(d) ? (
                      <span className="badge badge-info">{formatFecha(ultimaFecha(d))}</span>
                    ) : (
                      <span className="badge badge-warning">{t('common.never')}</span>
                    )}
                  </td>
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
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'crear' ? t('speakersPage.newSpeakerTitle') : t('speakersPage.editSpeakerTitle')}</h2>
            <div className="form-group">
              <label>{t('speakersPage.firstNames')} *</label>
              <input
                className="form-control"
                value={form.Nombres}
                onChange={e => setForm({ ...form, Nombres: e.target.value })}
                placeholder={t('speakersPage.firstNames')}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>{t('speakersPage.lastNames')} *</label>
              <input
                className="form-control"
                value={form.Apellidos}
                onChange={e => setForm({ ...form, Apellidos: e.target.value })}
                placeholder={t('speakersPage.lastNames')}
              />
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

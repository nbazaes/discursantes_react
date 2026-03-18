import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Historial() {
  const { t, i18n } = useTranslation();
  const [domingos, setDomingos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/discursos/domingos').then(res => {
      setDomingos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatFecha = (f) => {
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const eliminarDiscurso = async (id) => {
    if (!window.confirm(t('historyPage.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/discursos/${id}`);
      // Recargar
      const res = await axios.get('/api/discursos/domingos');
      setDomingos(res.data);
    } catch {
      alert(t('historyPage.deleteError'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('historyPage.title')}</h1>
        <p>{t('historyPage.subtitle')}</p>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : domingos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📅</div>
            <p>{t('historyPage.empty')}</p>
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
                  <th>{t('historyPage.speaker')}</th>
                  <th>{t('speakersPage.calling')}</th>
                  <th>{t('historyPage.topic')}</th>
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
                            : t('common.unknown')}
                      </strong>
                    </td>
                    <td>{d.discursante?.Llamamiento || t('common.noData')}</td>
                    <td>{d.Tema}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDiscurso(d.id)}
                      >
                        {t('common.delete')}
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

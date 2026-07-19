import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTemas } from '../lib/db';

function VerTemas() {
  const { t, i18n } = useTranslation();
  const [discursos, setDiscursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemas().then(data => {
      setDiscursos(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatFecha = (f) => {
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('topicsPage.title')}</h1>
        <p>{t('topicsPage.subtitle')}</p>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : discursos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📖</div>
            <p>{t('topicsPage.empty')}</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2>{t('topicsPage.topicList')}</h2>
          </div>

          {/* Desktop table */}
          <div className="table-container hide-mobile">
            <table className="tabla">
              <thead>
                <tr>
                  <th>{t('topicsPage.topic')}</th>
                  <th>{t('topicsPage.speaker')}</th>
                  <th>{t('topicsPage.date')}</th>
                </tr>
              </thead>
              <tbody>
                {discursos.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.Tema}</strong></td>
                    <td>
                      {d.discursante
                        ? `${d.discursante.Nombres} ${d.discursante.Apellidos}`
                        : t('common.noData')}
                    </td>
                    <td>
                      <span className="badge badge-info">{formatFecha(d.Fecha)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="hide-desktop">
            <div className="topic-list">
              {discursos.map(d => (
                <div key={d.id} className="topic-item">
                <div className="topic-item__title">{d.Tema}</div>
                <div className="topic-item__meta">
                  <span>{d.discursante ? `${d.discursante.Nombres} ${d.discursante.Apellidos}` : t('common.noData')}</span>
                  <span className="badge badge-info">{formatFecha(d.Fecha)}</span>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerTemas;
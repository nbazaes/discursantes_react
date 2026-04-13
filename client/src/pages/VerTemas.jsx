import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function VerTemas() {
  const { t, i18n } = useTranslation();
  const [discursos, setDiscursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/discursos/temas').then(res => {
      setDiscursos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatFecha = (f) => {
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Agrupar por tema
  const temasMap = {};
  discursos.forEach(d => {
    const tema = d.Tema;
    if (!temasMap[tema]) temasMap[tema] = [];
    temasMap[tema].push(d);
  });

  const temas = Object.keys(temasMap).sort();

  return (
    <div>
      <div className="page-header">
        <h1>{t('topicsPage.title')}</h1>
        <p>{t('topicsPage.subtitle')}</p>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : temas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📖</div>
            <p>{t('topicsPage.empty')}</p>
          </div>
        </div>
      ) : (
        <div className="card">
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
      )}
    </div>
  );
}

export default VerTemas;

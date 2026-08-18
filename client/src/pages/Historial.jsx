import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDomingos, deleteDiscurso } from '../lib/db';
import { useSupabase } from '../lib/SupabaseProvider';
import { IconHistory } from '../components/Icons';

function Historial() {
  const { t, i18n } = useTranslation();
  const supabase = useSupabase();
  const [domingos, setDomingos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDomingos(supabase).then(data => {
      setDomingos(data);
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
      await deleteDiscurso(supabase, id);
      const data = await getDomingos(supabase);
      setDomingos(data);
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
            <span className="icon" aria-hidden="true"><IconHistory size={40} /></span>
            <p>{t('historyPage.empty')}</p>
          </div>
        </div>
      ) : (
        domingos.map((domingo, index) => (
          <div key={domingo.fecha} className="history-card" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="history-card__date">
              <span className="history-card__node" aria-hidden="true" />
              {formatFecha(domingo.fecha)}
            </div>

            {/* Desktop table */}
            <div className="table-container hide-mobile">
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
                          type="button"
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

            {/* Mobile list */}
            <div className="hide-desktop">
              <div className="history-list">
                {domingo.discursos.map(d => (
                  <div key={d.id} className="history-item">
                  <div className="history-item__main">
                    <div className="history-item__name">
                      {d.discursante
                        ? `${d.discursante.Nombres} ${d.discursante.Apellidos}`
                        : t('common.unknown')}
                    </div>
                    <div className="history-item__calling">
                      {d.discursante?.Llamamiento || t('common.noData')}
                    </div>
                  </div>
                  <div className="history-item__topic">{d.Tema}</div>
                  <div className="history-item__actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDiscurso(d.id)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Historial;
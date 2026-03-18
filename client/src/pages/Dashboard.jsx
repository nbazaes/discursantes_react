import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.subtitle')}</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/seleccionar-domingo" className="dash-card">
          <div className="card-icon">🗓️</div>
          <h3>{t('dashboard.sundaySelectionTitle')}</h3>
          <p>{t('dashboard.sundaySelectionDesc')}</p>
        </Link>

        <Link to="/discursantes" className="dash-card">
          <div className="card-icon">👥</div>
          <h3>{t('dashboard.speakersTitle')}</h3>
          <p>{t('dashboard.speakersDesc')}</p>
        </Link>

        <Link to="/temas" className="dash-card">
          <div className="card-icon">📖</div>
          <h3>{t('dashboard.topicsTitle')}</h3>
          <p>{t('dashboard.topicsDesc')}</p>
        </Link>

        <Link to="/historial" className="dash-card">
          <div className="card-icon">📅</div>
          <h3>{t('dashboard.historyTitle')}</h3>
          <p>{t('dashboard.historyDesc')}</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

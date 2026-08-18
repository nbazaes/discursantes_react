import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconSunday, IconSpeakers, IconTopics, IconHistory, IconCalendar } from '../components/Icons';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
  const todayLabel = today.toLocaleDateString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const cards = [
    {
      to: '/seleccionar-domingo',
      icon: IconSunday,
      title: t('dashboard.sundaySelectionTitle'),
      desc: t('dashboard.sundaySelectionDesc'),
    },
    {
      to: '/discursantes',
      icon: IconSpeakers,
      title: t('dashboard.speakersTitle'),
      desc: t('dashboard.speakersDesc'),
    },
    {
      to: '/temas',
      icon: IconTopics,
      title: t('dashboard.topicsTitle'),
      desc: t('dashboard.topicsDesc'),
    },
    {
      to: '/historial',
      icon: IconHistory,
      title: t('dashboard.historyTitle'),
      desc: t('dashboard.historyDesc'),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.subtitle')}</p>
        <div className="page-header__meta">
          <IconCalendar size={15} />
          <span>{todayLabel}</span>
        </div>
      </div>

      <div className="dashboard-tree">
        <div className="dashboard-cards">
          {cards.map((card, index) => (
            <Link
              key={card.to}
              to={card.to}
              className="dash-node"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="card-icon"><card.icon size={32} /></div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

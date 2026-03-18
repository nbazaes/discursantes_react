import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dashboard from './pages/Dashboard';
import Discursantes from './pages/Discursantes';
import SeleccionarDomingo from './pages/SeleccionarDomingo';
import VerTemas from './pages/VerTemas';
import Historial from './pages/Historial';
import { STORAGE_KEY, SUPPORTED_LANGUAGES } from './i18n';

function NavBar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/seleccionar-domingo', label: t('nav.newSunday') },
    { to: '/discursantes', label: t('nav.speakers') },
    { to: '/temas', label: t('nav.topics') },
    { to: '/historial', label: t('nav.history') },
  ];

  const currentLanguage = SUPPORTED_LANGUAGES.includes(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : 'es';

  const changeLanguage = (lang) => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📋 {t('appName')}</Link>
      </div>

      <div className="navbar-actions">
        <div className="navbar-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="lang-switch" aria-label={t('nav.language')}>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              className={`lang-btn ${currentLanguage === lang ? 'active' : ''}`}
              onClick={() => changeLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discursantes" element={<Discursantes />} />
            <Route path="/seleccionar-domingo" element={<SeleccionarDomingo />} />
            <Route path="/temas" element={<VerTemas />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

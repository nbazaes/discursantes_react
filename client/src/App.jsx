import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dashboard from './pages/Dashboard';
import Discursantes from './pages/Discursantes';
import SeleccionarDomingo from './pages/SeleccionarDomingo';
import VerTemas from './pages/VerTemas';
import Historial from './pages/Historial';
import { STORAGE_KEY, SUPPORTED_LANGUAGES } from './i18n';

const THEME_KEY = 'discursantes_theme';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#2a2342' : '#5B3A8C');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
}

function NavBar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/seleccionar-domingo', label: t('nav.newSunday'), icon: '🗓️' },
    { to: '/discursantes', label: t('nav.speakers'), icon: '👥' },
    { to: '/temas', label: t('nav.topics'), icon: '📖' },
    { to: '/historial', label: t('nav.history'), icon: '📅' },
  ];

  const currentLanguage = SUPPORTED_LANGUAGES.includes(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : 'es';

  const changeLanguage = (lang) => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>
            <span className="brand-icon">📋</span>
            {t('appName')}
          </Link>
        </div>

        <div className="navbar-desktop">
          <div className="navbar-actions">
            <div className="navbar-links">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? 'active' : ''}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={t('nav.theme', { theme: theme === 'dark' ? t('nav.dark') : t('nav.light') })}
              title={t('nav.theme', { theme: theme === 'dark' ? t('nav.dark') : t('nav.light') })}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

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
        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={t('nav.menu')}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`navbar-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="navbar-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={closeMenu}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t('nav.theme', { theme: theme === 'dark' ? t('nav.dark') : t('nav.light') })}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

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
      </div>
    </>
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

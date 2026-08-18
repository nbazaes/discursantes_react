import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useOrganization, UserButton } from '@clerk/react';
import Dashboard from './pages/Dashboard';
import Discursantes from './pages/Discursantes';
import SeleccionarDomingo from './pages/SeleccionarDomingo';
import VerTemas from './pages/VerTemas';
import Historial from './pages/Historial';
import { STORAGE_KEY, SUPPORTED_LANGUAGES } from './i18n';
import { useTheme } from './lib/theme';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import { buildUserButtonElements } from './lib/clerkAppearance';
import { IconTree, IconSunday, IconSpeakers, IconTopics, IconHistory, IconSun, IconMoon, IconMenu, IconClose, IconWard } from './components/Icons';

function WardBadge() {
  const { organization } = useOrganization();
  if (!organization) return null;
  return (
    <span className="ward-badge" title={organization.name}>
      <IconWard size={15} />
      {organization.name}
    </span>
  );
}

function AuthActions({ theme }) {
  return (
    <div className="navbar-auth">
      <WardBadge />
      <UserButton appearance={{ elements: buildUserButtonElements(theme) }} />
    </div>
  );
}

function NavBar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: '/', label: t('nav.home'), icon: IconTree },
    { to: '/seleccionar-domingo', label: t('nav.newSunday'), icon: IconSunday },
    { to: '/discursantes', label: t('nav.speakers'), icon: IconSpeakers },
    { to: '/temas', label: t('nav.topics'), icon: IconTopics },
    { to: '/historial', label: t('nav.history'), icon: IconHistory },
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
            <span className="brand-icon"><IconTree size={26} /></span>
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
                  <span className="nav-node" aria-hidden="true" />
                  <span aria-hidden="true"><link.icon size={18} /></span>
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
              {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
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

            <AuthActions theme={theme} />
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
          {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
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
              <span className="nav-node" aria-hidden="true" />
              <span aria-hidden="true"><link.icon size={20} /></span>
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
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
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

          <AuthActions theme={theme} />
        </div>
      </div>
    </>
  );
}

function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();

  if (!isLoaded) return <div className="loading">{t('common.loading')}</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <Outlet />;
}

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="App">
      <Router>
        {isLoaded && isSignedIn && <NavBar />}
        <main className="main-content">
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/discursantes" element={<Discursantes />} />
              <Route path="/seleccionar-domingo" element={<SeleccionarDomingo />} />
              <Route path="/temas" element={<VerTemas />} />
              <Route path="/historial" element={<Historial />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <a href="/privacy.html">{t('footer.privacy')}</a>
        </footer>
      </Router>
    </div>
  );
}

export default App;

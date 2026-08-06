import { useEffect, useState } from 'react';

export const THEME_KEY = 'discursantes_theme';

function getStoredTheme() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(THEME_KEY, theme);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#2a2342' : '#5B3A8C');
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const next = document.documentElement.getAttribute('data-theme');
          if (next === 'light' || next === 'dark') {
            setTheme(next);
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return { theme, toggleTheme };
}

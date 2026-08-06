import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkThemeProvider } from './components/ClerkThemeProvider';
import App from './App';
import './i18n';
import { SupabaseProvider } from './lib/SupabaseProvider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkThemeProvider publishableKey={PUBLISHABLE_KEY}>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </ClerkThemeProvider>
  </React.StrictMode>,
);

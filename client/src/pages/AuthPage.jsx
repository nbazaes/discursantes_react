import { useTranslation } from 'react-i18next';
import { SignIn, SignUp } from '@clerk/react';
import { useTheme } from '../lib/theme';
import { buildSignInElements } from '../lib/clerkAppearance';

function AuthShell({ children, tagline }) {
  const { t } = useTranslation();

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <span className="auth-brand__icon" aria-hidden="true">📋</span>
        <span className="auth-brand__name">{t('appName')}</span>
      </div>
      <p className="auth-tagline">{tagline}</p>
      {children}
    </div>
  );
}

export function SignInPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <AuthShell tagline={t('auth.tagline')}>
      <SignIn
        afterSignInUrl="/"
        signUpUrl="/sign-up"
        appearance={{ elements: buildSignInElements(theme) }}
      />
    </AuthShell>
  );
}

export function SignUpPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <AuthShell tagline={t('auth.tagline')}>
      <SignUp
        afterSignUpUrl="/"
        signInUrl="/sign-in"
        appearance={{ elements: buildSignInElements(theme) }}
      />
    </AuthShell>
  );
}

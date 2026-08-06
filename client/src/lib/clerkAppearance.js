const TOKENS = {
  light: {
    primary: '#5B3A8C',
    primaryDark: '#4A2F73',
    primaryFade: 'rgba(91, 58, 140, 0.12)',
    bg: '#faf9f7',
    surface: '#ffffff',
    raised: '#ffffff',
    border: '#e5e0d8',
    text: '#1f2937',
    muted: '#6b7280',
    shadow: '0 12px 32px rgba(31, 41, 55, 0.14)',
    focusRing: '0 0 0 4px rgba(91, 58, 140, 0.12)',
    danger: '#be123c',
    success: '#4d7c59',
    warning: '#b45309',
  },
  dark: {
    primary: '#9B7ED8',
    primaryDark: '#B8A4E6',
    primaryFade: 'rgba(155, 126, 216, 0.18)',
    bg: '#1F1A2E',
    surface: '#2a2342',
    raised: '#342b50',
    border: '#4b4458',
    text: '#f3f4f6',
    muted: '#9ca3af',
    shadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
    focusRing: '0 0 0 4px rgba(155, 126, 216, 0.2)',
    danger: '#f43f5e',
    success: '#6fa37c',
    warning: '#fbbf24',
  },
};

function resolveTokens(theme) {
  return TOKENS[theme === 'dark' ? 'dark' : 'light'];
}

export function buildVariables(theme) {
  const c = resolveTokens(theme);
  return {
    colorPrimary: c.primary,
    colorBackground: c.surface,
    colorInputBackground: c.raised,
    colorInputText: c.text,
    colorText: c.text,
    colorTextSecondary: c.muted,
    colorNeutral: c.border,
    colorTextOnPrimaryBackground: '#ffffff',
    colorDanger: c.danger,
    colorSuccess: c.success,
    colorWarning: c.warning,
    colorShimmer: c.border,
    fontFamily: "'Source Sans 3', system-ui, -apple-system, sans-serif",
    fontFamilyButtons: "'Source Sans 3', system-ui, -apple-system, sans-serif",
    borderRadius: '14px',
    fontSize: '1rem',
  };
}

export function buildSignInElements(theme) {
  const c = resolveTokens(theme);
  const dark = theme === 'dark';

  return {
    card: {
      boxShadow: c.shadow,
      border: `1px solid ${c.border}`,
    },
    headerTitle: {
      fontFamily: "'Crimson Pro', Georgia, serif",
      fontWeight: '600',
      letterSpacing: '-0.01em',
      color: c.text,
    },
    headerSubtitle: {
      color: c.muted,
    },
    formFieldLabel: {
      fontWeight: '600',
      fontSize: '0.9rem',
      color: c.text,
    },
    formFieldInput: {
      minHeight: '44px',
      border: `1.5px solid ${c.border}`,
      borderRadius: '10px',
      '&:focus': {
        borderColor: c.primary,
        boxShadow: c.focusRing,
      },
    },
    formFieldHintText: {
      color: c.muted,
    },
    formFieldErrorText: {
      color: c.danger,
    },
    formButtonPrimary: {
      background: c.primary,
      color: '#ffffff',
      fontWeight: '600',
      '&:hover': {
        background: c.primaryDark,
        boxShadow: `0 4px 12px ${c.primaryFade}`,
      },
    },
    formButtonSecondary: {
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    },
    footerActionText: {
      color: c.muted,
    },
    footerActionLink: {
      color: c.primary,
      fontWeight: '600',
    },
    dividerLine: {
      background: c.border,
    },
    dividerText: {
      color: c.muted,
    },
    alert: {
      borderRadius: '10px',
    },
    alertText: {
      color: c.text,
    },
    socialButtonsBlockButton: {
      border: `1px solid ${c.border}`,
      color: c.text,
      '&:hover': {
        background: c.primaryFade,
      },
    },
    ...(dark && {
      socialButtonsBlockButton__apple: {
        '& svg': { filter: 'invert(1)' },
      },
    }),
    alternativeMethodsBlockButton: {
      border: `1px solid ${c.border}`,
      color: c.text,
      '&:hover': {
        background: c.primaryFade,
      },
    },
  };
}

export function buildUserButtonElements(theme) {
  const c = resolveTokens(theme);

  return {
    popoverCard: {
      boxShadow: c.shadow,
      border: `1px solid ${c.border}`,
      borderRadius: '14px',
    },
    userButtonPopoverFooter: {
      borderTop: `1px solid ${c.border}`,
    },
  };
}

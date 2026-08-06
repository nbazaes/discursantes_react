import { ClerkProvider } from '@clerk/react';
import { esES, enUS } from '@clerk/localizations';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../lib/theme';
import { buildVariables } from '../lib/clerkAppearance';

const LOCALES = { es: esES, en: enUS };

export function ClerkThemeProvider({ children, publishableKey }) {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const localization = LOCALES[i18n.language] || esES;
  const appearance = { variables: buildVariables(theme) };

  return (
    <ClerkProvider publishableKey={publishableKey} localization={localization} appearance={appearance}>
      {children}
    </ClerkProvider>
  );
}

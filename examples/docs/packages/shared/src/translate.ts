import type { TranslateConfig } from '@idealyst/translate';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enInstallation from './locales/en/installation.json';
import enComponents from './locales/en/components.json';
import enTheme from './locales/en/theme.json';
import enNavigation from './locales/en/navigation.json';

// French translations
import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frInstallation from './locales/fr/installation.json';
import frComponents from './locales/fr/components.json';
import frTheme from './locales/fr/theme.json';
import frNavigation from './locales/fr/navigation.json';

export const translateConfig: TranslateConfig = {
  defaultLanguage: 'en',
  languages: ['en', 'fr'],
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      installation: enInstallation,
      components: enComponents,
      theme: enTheme,
      navigation: enNavigation,
    },
    fr: {
      common: frCommon,
      home: frHome,
      installation: frInstallation,
      components: frComponents,
      theme: frTheme,
      navigation: frNavigation,
    },
  },
  defaultNamespace: 'common',
  fallbackLanguage: 'en',
  debug: false,
};

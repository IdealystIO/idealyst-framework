import React, { useEffect, useState, createContext, useContext, useMemo } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import type { TranslateProviderProps, TranslateContextValue, TranslateConfig } from './types';

/**
 * Internal context for additional translate features
 */
const TranslateContext = createContext<TranslateContextValue | null>(null);

/**
 * Hook to access the translate context
 */
export function useTranslateContext(): TranslateContextValue {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslateContext must be used within a TranslateProvider');
  }
  return context;
}

/**
 * Creates and initializes an i18next instance with the given config
 */
function createI18nInstance(config: TranslateConfig): typeof i18next {
  // If a custom instance is provided, use it directly
  if (config.i18nInstance) {
    return config.i18nInstance;
  }

  const instance = i18next.createInstance();

  instance.use(initReactI18next).init({
    lng: config.defaultLanguage,
    fallbackLng: config.fallbackLanguage ?? config.defaultLanguage,
    supportedLngs: config.languages,
    defaultNS: config.defaultNamespace ?? 'translation',
    resources: config.resources,
    debug: config.debug ?? false,

    interpolation: {
      escapeValue: config.interpolation?.escapeValue ?? false, // React already escapes
    },

    react: {
      useSuspense: false,
    },
  });

  return instance;
}

/**
 * Provider component that initializes i18next and provides translation context
 *
 * @example
 * ```tsx
 * import { TranslateProvider } from '@idealyst/translate';
 * import en from './locales/en/common.json';
 * import es from './locales/es/common.json';
 *
 * const config = {
 *   defaultLanguage: 'en',
 *   languages: ['en', 'es'],
 *   resources: {
 *     en: { common: en },
 *     es: { common: es },
 *   },
 *   defaultNamespace: 'common',
 * };
 *
 * export function App() {
 *   return (
 *     <TranslateProvider config={config}>
 *       <MyApp />
 *     </TranslateProvider>
 *   );
 * }
 * ```
 */
export function TranslateProvider({
  config,
  children,
  onInitialized,
  onLanguageChanged,
}: TranslateProviderProps) {
  const [i18n] = useState(() => createI18nInstance(config));
  const [ready, setReady] = useState(i18n.isInitialized);
  const [language, setLanguage] = useState(i18n.language || config.defaultLanguage);

  useEffect(() => {
    // Handle initialization
    if (!i18n.isInitialized) {
      i18n.on('initialized', () => {
        setReady(true);
        onInitialized?.(i18n);
      });
    } else {
      onInitialized?.(i18n);
    }

    // Handle language changes
    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
      onLanguageChanged?.(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, onInitialized, onLanguageChanged]);

  const contextValue = useMemo<TranslateContextValue>(
    () => ({
      ready,
      i18n,
      language,
      languages: config.languages,
    }),
    [ready, i18n, language, config.languages]
  );

  return (
    <TranslateContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </TranslateContext.Provider>
  );
}

export default TranslateProvider;

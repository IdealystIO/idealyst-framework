// Provider
export { TranslateProvider, useTranslateContext } from './provider';
export type { TranslateConfig, TranslateProviderProps, TranslateContextValue } from './provider';

// Hooks
export { useTranslation, useLanguage } from './hooks';
export type {
  UseTranslationOptions,
  UseTranslationResult,
  TranslationOptions,
  UseLanguageResult,
} from './hooks';

// Components
export { Trans } from './components';
export type { TransProps } from './components';

// Utils
export { parseKey, hasNestedKey, getNestedValue, flattenKeys } from './utils';

// Config
export { defineConfig } from './config';

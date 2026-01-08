import type { i18n, Resource } from 'i18next';
import type { ReactNode } from 'react';

/**
 * Configuration options for the TranslateProvider
 */
export interface TranslateConfig {
  /**
   * Default language code (e.g., 'en', 'es', 'fr')
   */
  defaultLanguage: string;

  /**
   * List of supported language codes
   */
  languages: string[];

  /**
   * Pre-loaded translation resources
   * Format: { [lang]: { [namespace]: { key: value } } }
   */
  resources?: Resource;

  /**
   * Default namespace to use when none is specified
   * @default 'translation'
   */
  defaultNamespace?: string;

  /**
   * Fallback language when translation is missing
   * @default defaultLanguage
   */
  fallbackLanguage?: string;

  /**
   * Enable debug mode for i18next
   * @default false
   */
  debug?: boolean;

  /**
   * Custom i18next instance (for advanced use cases)
   * If provided, other config options are ignored
   */
  i18nInstance?: i18n;

  /**
   * Interpolation options
   */
  interpolation?: {
    /**
     * Escape HTML in interpolated values
     * @default true for web, false for native
     */
    escapeValue?: boolean;
  };

  /**
   * Backend configuration for loading translations dynamically
   */
  backend?: {
    /**
     * URL pattern for loading translations
     * Use {{lng}} for language and {{ns}} for namespace
     */
    loadPath?: string;
  };
}

/**
 * Props for the TranslateProvider component
 */
export interface TranslateProviderProps {
  /**
   * Configuration for i18next
   */
  config: TranslateConfig;

  /**
   * Child components
   */
  children: ReactNode;

  /**
   * Callback when i18next is initialized
   */
  onInitialized?: (i18n: i18n) => void;

  /**
   * Callback when language changes
   */
  onLanguageChanged?: (language: string) => void;
}

/**
 * Context value provided by TranslateProvider
 */
export interface TranslateContextValue {
  /**
   * Whether i18next is initialized and ready
   */
  ready: boolean;

  /**
   * The i18next instance
   */
  i18n: i18n;

  /**
   * Current language
   */
  language: string;

  /**
   * Available languages
   */
  languages: string[];
}

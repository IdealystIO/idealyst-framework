import type { i18n, TFunction, Namespace, KeyPrefix } from 'i18next';

/**
 * Options for the useTranslation hook
 */
export interface UseTranslationOptions<TKPrefix extends KeyPrefix<Namespace> = undefined> {
  /**
   * Namespace(s) to use for translations
   */
  ns?: Namespace;

  /**
   * Key prefix to prepend to all translation keys
   */
  keyPrefix?: TKPrefix;

  /**
   * Whether to bind the t function to i18n instance
   * @default true
   */
  bindI18n?: string;

  /**
   * Whether to bind the t function to store
   * @default false
   */
  bindI18nStore?: string;
}

/**
 * Result of the useTranslation hook
 */
export interface UseTranslationResult<TKPrefix extends KeyPrefix<Namespace> = undefined> {
  /**
   * Translation function
   */
  t: TFunction<Namespace, TKPrefix>;

  /**
   * Current language
   */
  language: string;

  /**
   * All available languages
   */
  languages: readonly string[];

  /**
   * Whether translations are ready
   */
  ready: boolean;

  /**
   * The i18next instance
   */
  i18n: i18n;
}

/**
 * Options for the t() function
 */
export interface TranslationOptions {
  /**
   * Default value if key is not found
   */
  defaultValue?: string;

  /**
   * Count for pluralization
   */
  count?: number;

  /**
   * Context for contextual translations
   */
  context?: string;

  /**
   * Interpolation values
   */
  [key: string]: unknown;
}

/**
 * Result of the useLanguage hook
 */
export interface UseLanguageResult {
  /**
   * Current language code
   */
  language: string;

  /**
   * All available languages
   */
  languages: readonly string[];

  /**
   * Change the current language
   */
  setLanguage: (lang: string) => Promise<void>;

  /**
   * Check if a language is supported
   */
  isSupported: (lang: string) => boolean;

  /**
   * Get the display name for a language code
   */
  getDisplayName: (lang: string, inLanguage?: string) => string;
}

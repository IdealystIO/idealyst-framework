import { useTranslation as useI18nextTranslation } from 'react-i18next';
import type { Namespace, KeyPrefix } from 'i18next';
import type { UseTranslationOptions, UseTranslationResult } from './types';

/**
 * Hook to access translation functions
 *
 * @param ns - Namespace(s) to use for translations
 * @param options - Additional options
 * @returns Translation result with t function and metadata
 *
 * @example
 * ```tsx
 * import { useTranslation } from '@idealyst/translate';
 *
 * function MyComponent() {
 *   const { t, language, ready } = useTranslation('common');
 *
 *   if (!ready) return <Loading />;
 *
 *   return (
 *     <div>
 *       <h1>{t('welcome.title')}</h1>
 *       <p>{t('welcome.message', { name: 'World' })}</p>
 *       <span>Current: {language}</span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With key prefix
 * ```tsx
 * const { t } = useTranslation('common', { keyPrefix: 'buttons' });
 * // t('submit') is equivalent to t('buttons.submit')
 * ```
 */
export function useTranslation<TKPrefix extends KeyPrefix<Namespace> = undefined>(
  ns?: Namespace,
  options?: UseTranslationOptions<TKPrefix>
): UseTranslationResult<TKPrefix> {
  const { t, i18n, ready } = useI18nextTranslation(ns, options);

  return {
    t: t as UseTranslationResult<TKPrefix>['t'],
    language: i18n.language,
    languages: i18n.languages,
    ready,
    i18n,
  };
}

export default useTranslation;

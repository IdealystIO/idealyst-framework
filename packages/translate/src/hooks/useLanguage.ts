import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseLanguageResult } from './types';

/**
 * Hook for managing the current language
 *
 * @returns Language management utilities
 *
 * @example
 * ```tsx
 * import { useLanguage } from '@idealyst/translate';
 *
 * function LanguageSwitcher() {
 *   const { language, languages, setLanguage } = useLanguage();
 *
 *   return (
 *     <select
 *       value={language}
 *       onChange={(e) => setLanguage(e.target.value)}
 *     >
 *       {languages.map((lang) => (
 *         <option key={lang} value={lang}>
 *           {lang}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguage(): UseLanguageResult {
  const { i18n } = useTranslation();

  const setLanguage = useCallback(
    async (lang: string): Promise<void> => {
      await i18n.changeLanguage(lang);
    },
    [i18n]
  );

  const isSupported = useCallback(
    (lang: string): boolean => {
      return i18n.languages.includes(lang);
    },
    [i18n.languages]
  );

  const getDisplayName = useCallback(
    (lang: string, inLanguage?: string): string => {
      try {
        const displayNames = new Intl.DisplayNames([inLanguage ?? lang], {
          type: 'language',
        });
        return displayNames.of(lang) ?? lang;
      } catch {
        // Fallback if Intl.DisplayNames is not available
        return lang;
      }
    },
    []
  );

  return {
    language: i18n.language,
    languages: i18n.languages,
    setLanguage,
    isSupported,
    getDisplayName,
  };
}

export default useLanguage;

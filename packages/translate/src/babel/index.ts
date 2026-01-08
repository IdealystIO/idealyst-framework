// Export types
export type {
  TranslatePluginOptions,
  ExtractedKey,
  MissingTranslation,
  CoverageStats,
  TranslationsReport,
  LoadedTranslations,
} from './types';

// Export utilities
export { KeyRegistry, parseKey, extractKeysFromSource } from './extractor';
export {
  generateReport,
  writeReport,
  loadTranslations,
  printReportSummary,
} from './reporter';

// Note: The actual Babel plugin is in plugin.js (CommonJS)
// Import it via: import plugin from '@idealyst/translate/plugin'

/**
 * Options for the @idealyst/translate Babel plugin
 */
export interface TranslatePluginOptions {
  /**
   * Paths to translation JSON files
   * Supports glob patterns: ['./locales/*.json', './src/locales/**\/*.json']
   */
  translationFiles: string[];

  /**
   * Output path for the translation report
   * @default '.idealyst/translations-report.json'
   */
  reportPath?: string;

  /**
   * Languages to check against
   * If not provided, inferred from translation file names/directories
   */
  languages?: string[];

  /**
   * Default namespace used when namespace is not specified in the key
   * @default 'translation'
   */
  defaultNamespace?: string;

  /**
   * Whether to fail the build if missing translations are found
   * @default false
   */
  failOnMissing?: boolean;

  /**
   * Whether to emit console warnings for missing translations
   * @default true
   */
  emitWarnings?: boolean;

  /**
   * Whether to include source locations in the report
   * @default true
   */
  includeLocations?: boolean;

  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean;
}

/**
 * A translation key extracted from source code
 */
export interface ExtractedKey {
  /**
   * Full key path including namespace: "common.buttons.submit" or "common:buttons.submit"
   */
  key: string;

  /**
   * Namespace portion: "common"
   */
  namespace: string;

  /**
   * Key without namespace: "buttons.submit"
   */
  localKey: string;

  /**
   * Source file path
   */
  file: string;

  /**
   * Line number in source
   */
  line: number;

  /**
   * Column number in source
   */
  column: number;

  /**
   * Default value if provided in code
   */
  defaultValue?: string;

  /**
   * Whether this is a dynamic key (contains variables, cannot be statically analyzed)
   */
  isDynamic: boolean;
}

/**
 * A missing translation entry
 */
export interface MissingTranslation {
  /**
   * The missing key
   */
  key: string;

  /**
   * Namespace
   */
  namespace: string;

  /**
   * Files where this key is used
   */
  usedIn: Array<{
    file: string;
    line: number;
    column: number;
  }>;

  /**
   * Default value if provided in code
   */
  defaultValue?: string;
}

/**
 * Translation coverage statistics
 */
export interface CoverageStats {
  /**
   * Total number of unique static keys found in code
   */
  totalKeys: number;

  /**
   * Number of keys missing translation for this language
   */
  missingCount: number;

  /**
   * Percentage of keys that have translations (0-100)
   */
  coveragePercent: number;
}

/**
 * The full translations report output
 */
export interface TranslationsReport {
  /**
   * Report generation timestamp (ISO 8601)
   */
  timestamp: string;

  /**
   * Total number of unique static keys extracted
   */
  totalKeys: number;

  /**
   * Keys that couldn't be statically analyzed (dynamic keys)
   */
  dynamicKeys: ExtractedKey[];

  /**
   * All extracted static keys
   */
  extractedKeys: ExtractedKey[];

  /**
   * Languages analyzed
   */
  languages: string[];

  /**
   * Missing translations per language
   * { "es": [...], "fr": [...] }
   */
  missing: Record<string, MissingTranslation[]>;

  /**
   * Unused translations per language (keys in JSON but not in code)
   * { "en": ["legacy.oldKey"], ... }
   */
  unused: Record<string, string[]>;

  /**
   * Summary statistics
   */
  summary: {
    /**
     * Total missing translations across all languages
     */
    totalMissing: number;

    /**
     * Total unused translations across all languages
     */
    totalUnused: number;

    /**
     * Coverage percentage per language
     */
    coveragePercent: Record<string, number>;
  };
}

/**
 * Loaded translations structure
 * { [language]: { [namespace]: { nested: { key: "value" } } } }
 */
export type LoadedTranslations = Record<string, Record<string, Record<string, unknown>>>;

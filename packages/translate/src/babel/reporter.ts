import * as fs from 'fs';
import * as path from 'path';
import type {
  TranslatePluginOptions,
  ExtractedKey,
  TranslationsReport,
  MissingTranslation,
  LoadedTranslations,
} from './types';

/**
 * Check if an object has a nested key
 */
function hasNestedKey(obj: Record<string, unknown>, keyPath: string): boolean {
  const parts = keyPath.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === undefined || current === null) return false;
    if (typeof current !== 'object') return false;
    current = (current as Record<string, unknown>)[part];
  }

  return current !== undefined;
}

/**
 * Flatten an object's keys into dot-notation
 */
function flattenKeys(obj: Record<string, unknown>, prefix: string = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Parse a key into namespace and local key
 */
function parseKey(
  fullKey: string,
  defaultNamespace: string = 'translation'
): { namespace: string; localKey: string } {
  if (fullKey.includes(':')) {
    const [namespace, ...rest] = fullKey.split(':');
    return { namespace, localKey: rest.join(':') };
  }

  const segments = fullKey.split('.');
  if (segments.length > 1) {
    return { namespace: segments[0], localKey: segments.slice(1).join('.') };
  }

  return { namespace: defaultNamespace, localKey: fullKey };
}

/**
 * Extract language code from file path
 */
function extractLanguageFromPath(filePath: string): string {
  const parts = filePath.split(path.sep);
  const filename = path.basename(filePath, '.json');

  if (filename.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return filename;
  }

  const parentDir = parts[parts.length - 2];
  if (parentDir && parentDir.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return parentDir;
  }

  return filename;
}

/**
 * Extract namespace from file path
 */
function extractNamespaceFromPath(filePath: string): string {
  const filename = path.basename(filePath, '.json');

  if (filename.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return 'translation';
  }

  return filename;
}

/**
 * Load translation files from glob patterns
 */
export function loadTranslations(
  patterns: string[],
  verbose: boolean = false
): LoadedTranslations {
  const result: LoadedTranslations = {};

  // Dynamic import glob if available
  let globSync: ((pattern: string) => string[]) | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const glob = require('glob');
    globSync = glob.sync;
  } catch {
    globSync = null;
  }

  for (const pattern of patterns) {
    let files: string[] = [];

    if (globSync) {
      try {
        files = globSync(pattern);
      } catch (err) {
        if (verbose) {
          console.warn(`[@idealyst/translate] Failed to glob pattern: ${pattern}`, err);
        }
        continue;
      }
    } else if (fs.existsSync(pattern)) {
      files = [pattern];
    }

    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const lang = extractLanguageFromPath(file);
        const namespace = extractNamespaceFromPath(file);

        if (!result[lang]) result[lang] = {};
        result[lang][namespace] = content;

        if (verbose) {
          console.log(`[@idealyst/translate] Loaded: ${file} -> ${lang}/${namespace}`);
        }
      } catch (err) {
        if (verbose) {
          console.warn(`[@idealyst/translate] Failed to load: ${file}`, err);
        }
      }
    }
  }

  return result;
}

/**
 * Generate a translations report from extracted keys
 */
export function generateReport(
  extractedKeys: ExtractedKey[],
  options: TranslatePluginOptions
): TranslationsReport {
  const {
    translationFiles,
    languages: configLanguages,
    defaultNamespace = 'translation',
    verbose = false,
  } = options;

  const translations = loadTranslations(translationFiles, verbose);
  const languages = configLanguages || Object.keys(translations);

  const staticKeys = extractedKeys.filter((k) => !k.isDynamic);
  const dynamicKeys = extractedKeys.filter((k) => k.isDynamic);
  const uniqueKeys = [...new Set(staticKeys.map((k) => k.key))];

  // Find missing translations per language
  const missing: Record<string, MissingTranslation[]> = {};
  for (const lang of languages) {
    missing[lang] = [];
    const langTranslations = translations[lang] || {};

    for (const key of uniqueKeys) {
      const { namespace, localKey } = parseKey(key, defaultNamespace);
      const nsTranslations = langTranslations[namespace] || {};

      if (!hasNestedKey(nsTranslations as Record<string, unknown>, localKey)) {
        const usages = staticKeys.filter((k) => k.key === key);
        missing[lang].push({
          key,
          namespace,
          usedIn: usages.map((u) => ({
            file: u.file,
            line: u.line,
            column: u.column,
          })),
          defaultValue: usages[0]?.defaultValue,
        });
      }
    }
  }

  // Find unused translations per language
  const unused: Record<string, string[]> = {};
  for (const lang of languages) {
    unused[lang] = [];
    const langTranslations = translations[lang] || {};

    for (const namespace of Object.keys(langTranslations)) {
      const keys = flattenKeys(
        langTranslations[namespace] as Record<string, unknown>,
        namespace
      );
      for (const translationKey of keys) {
        if (!uniqueKeys.includes(translationKey)) {
          unused[lang].push(translationKey);
        }
      }
    }
  }

  // Calculate coverage
  const coveragePercent: Record<string, number> = {};
  for (const lang of languages) {
    const totalKeys = uniqueKeys.length;
    const missingCount = missing[lang].length;
    coveragePercent[lang] =
      totalKeys > 0 ? Math.round(((totalKeys - missingCount) / totalKeys) * 100) : 100;
  }

  return {
    timestamp: new Date().toISOString(),
    totalKeys: uniqueKeys.length,
    dynamicKeys,
    extractedKeys: staticKeys,
    languages,
    missing,
    unused,
    summary: {
      totalMissing: Object.values(missing).flat().length,
      totalUnused: Object.values(unused).flat().length,
      coveragePercent,
    },
  };
}

/**
 * Write a translations report to disk
 */
export function writeReport(report: TranslationsReport, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
}

/**
 * Print report summary to console
 */
export function printReportSummary(report: TranslationsReport): void {
  console.log('\n[@idealyst/translate] Translation Report Summary');
  console.log('='.repeat(50));
  console.log(`Total keys: ${report.totalKeys}`);
  console.log(`Dynamic keys: ${report.dynamicKeys.length}`);
  console.log(`Languages: ${report.languages.join(', ')}`);
  console.log('');

  for (const lang of report.languages) {
    const coverage = report.summary.coveragePercent[lang];
    const missingCount = report.missing[lang]?.length || 0;
    const unusedCount = report.unused[lang]?.length || 0;

    console.log(`${lang}: ${coverage}% coverage`);
    if (missingCount > 0) {
      console.log(`  - ${missingCount} missing translation(s)`);
    }
    if (unusedCount > 0) {
      console.log(`  - ${unusedCount} unused translation(s)`);
    }
  }

  console.log('');
  console.log(`Total missing: ${report.summary.totalMissing}`);
  console.log(`Total unused: ${report.summary.totalUnused}`);
  console.log('='.repeat(50));
}

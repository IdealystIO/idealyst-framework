/**
 * @idealyst/translate Babel plugin
 *
 * Extracts translation keys from source code and generates a report
 * of missing and unused translations.
 *
 * Usage in babel.config.js:
 * ```js
 * module.exports = {
 *   plugins: [
 *     ['@idealyst/translate/plugin', {
 *       translationFiles: ['./locales/**\/*.json'],
 *       reportPath: '.idealyst/translations-report.json',
 *       defaultNamespace: 'common',
 *       emitWarnings: true,
 *       failOnMissing: false,
 *     }],
 *   ],
 * };
 * ```
 */

const fs = require('fs');
const path = require('path');

// Try to use glob, fall back to simple matching if not available
let glob;
try {
  glob = require('glob');
} catch {
  glob = null;
}

/**
 * Global registry for collecting keys across all files
 * Persists across file visits during the build
 */
const globalRegistry = {
  keys: new Map(),
  options: null,
  initialized: false,

  addKey(key) {
    const existing = this.keys.get(key.key) || [];
    existing.push(key);
    this.keys.set(key.key, existing);
  },

  getAllKeys() {
    return Array.from(this.keys.values()).flat();
  },

  getStaticKeys() {
    return this.getAllKeys().filter((k) => !k.isDynamic);
  },

  getDynamicKeys() {
    return this.getAllKeys().filter((k) => k.isDynamic);
  },

  getUniqueKeys() {
    return Array.from(new Set(this.getStaticKeys().map((k) => k.key)));
  },

  clear() {
    this.keys.clear();
    this.initialized = false;
  },
};

/**
 * Parse a key into namespace and local key
 */
function parseKey(fullKey, defaultNamespace = 'translation') {
  // Handle namespace:key format
  if (fullKey.includes(':')) {
    const [namespace, ...rest] = fullKey.split(':');
    return { namespace, localKey: rest.join(':') };
  }

  // Handle namespace.key format (first segment is namespace)
  const segments = fullKey.split('.');
  if (segments.length > 1) {
    return { namespace: segments[0], localKey: segments.slice(1).join('.') };
  }

  return { namespace: defaultNamespace, localKey: fullKey };
}

/**
 * Check if an object has a nested key
 */
function hasNestedKey(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === undefined || current === null) return false;
    if (typeof current !== 'object') return false;
    current = current[part];
  }

  return current !== undefined;
}

/**
 * Flatten an object's keys
 */
function flattenKeys(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Extract language code from file path
 */
function extractLanguageFromPath(filePath) {
  const parts = filePath.split(path.sep);
  const filename = path.basename(filePath, '.json');

  // Check if filename is a language code (e.g., en.json, es-MX.json)
  if (filename.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return filename;
  }

  // Check parent directory (e.g., locales/en/common.json)
  const parentDir = parts[parts.length - 2];
  if (parentDir && parentDir.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return parentDir;
  }

  return filename;
}

/**
 * Extract namespace from file path
 */
function extractNamespaceFromPath(filePath) {
  const filename = path.basename(filePath, '.json');

  // If filename is a language code, use 'translation' as default namespace
  if (filename.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    return 'translation';
  }

  return filename;
}

/**
 * Load translation files
 */
function loadTranslations(patterns, verbose = false) {
  const result = {};

  for (const pattern of patterns) {
    let files = [];

    if (glob && glob.sync) {
      try {
        files = glob.sync(pattern);
      } catch (err) {
        if (verbose) {
          console.warn(`[@idealyst/translate] Failed to glob pattern: ${pattern}`, err);
        }
        continue;
      }
    } else {
      // Simple fallback: treat pattern as direct file path
      if (fs.existsSync(pattern)) {
        files = [pattern];
      }
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
 * Generate the translations report
 */
function generateReport(keys, options) {
  const {
    translationFiles = [],
    languages: configLanguages,
    defaultNamespace = 'translation',
    verbose = false,
  } = options;

  const translations = loadTranslations(translationFiles, verbose);
  const languages = configLanguages || Object.keys(translations);

  const staticKeys = keys.filter((k) => !k.isDynamic);
  const dynamicKeys = keys.filter((k) => k.isDynamic);
  const uniqueKeys = [...new Set(staticKeys.map((k) => k.key))];

  // Find missing translations per language
  const missing = {};
  for (const lang of languages) {
    missing[lang] = [];
    const langTranslations = translations[lang] || {};

    for (const key of uniqueKeys) {
      const { namespace, localKey } = parseKey(key, defaultNamespace);
      const nsTranslations = langTranslations[namespace] || {};

      if (!hasNestedKey(nsTranslations, localKey)) {
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
  const unused = {};
  for (const lang of languages) {
    unused[lang] = [];
    const langTranslations = translations[lang] || {};

    for (const namespace of Object.keys(langTranslations)) {
      const keys = flattenKeys(langTranslations[namespace], namespace);
      for (const translationKey of keys) {
        if (!uniqueKeys.includes(translationKey)) {
          unused[lang].push(translationKey);
        }
      }
    }
  }

  // Calculate coverage
  const coveragePercent = {};
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
 * Write the report to disk
 */
function writeReport(report, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
}

/**
 * The Babel plugin
 */
module.exports = function translatePlugin({ types: t }) {
  return {
    name: 'idealyst-translate',

    pre(state) {
      // Initialize extracted keys for this file
      this.extractedKeys = [];

      // Store options on first file
      if (!globalRegistry.options && this.opts) {
        globalRegistry.options = this.opts;
      }
    },

    visitor: {
      /**
       * Extract keys from t() and i18n.t() calls
       */
      CallExpression(path, state) {
        const { node } = path;
        const filename = state.file.opts.filename || 'unknown';
        const options = state.opts || {};
        const defaultNamespace = options.defaultNamespace || 'translation';

        let isTCall = false;

        // Check for t('key') calls
        if (t.isIdentifier(node.callee, { name: 't' })) {
          isTCall = true;
        }

        // Check for i18n.t('key') calls
        if (
          t.isMemberExpression(node.callee) &&
          t.isIdentifier(node.callee.property, { name: 't' })
        ) {
          isTCall = true;
        }

        if (!isTCall) return;

        const firstArg = node.arguments[0];
        if (!firstArg) return;

        // Static string literal
        if (t.isStringLiteral(firstArg)) {
          const { namespace, localKey } = parseKey(firstArg.value, defaultNamespace);

          // Try to extract defaultValue from options object
          let defaultValue;
          const secondArg = node.arguments[1];
          if (t.isObjectExpression(secondArg)) {
            const defaultProp = secondArg.properties.find(
              (p) =>
                t.isObjectProperty(p) &&
                t.isIdentifier(p.key, { name: 'defaultValue' }) &&
                t.isStringLiteral(p.value)
            );
            if (defaultProp && t.isObjectProperty(defaultProp) && t.isStringLiteral(defaultProp.value)) {
              defaultValue = defaultProp.value.value;
            }
          }

          this.extractedKeys.push({
            key: firstArg.value,
            namespace,
            localKey,
            file: filename,
            line: node.loc?.start.line ?? 0,
            column: node.loc?.start.column ?? 0,
            defaultValue,
            isDynamic: false,
          });
          return;
        }

        // Template literal with no expressions (treated as static)
        if (t.isTemplateLiteral(firstArg) && firstArg.expressions.length === 0) {
          const value = firstArg.quasis[0].value.raw;
          const { namespace, localKey } = parseKey(value, defaultNamespace);

          this.extractedKeys.push({
            key: value,
            namespace,
            localKey,
            file: filename,
            line: node.loc?.start.line ?? 0,
            column: node.loc?.start.column ?? 0,
            isDynamic: false,
          });
          return;
        }

        // Dynamic key - record but mark as such
        this.extractedKeys.push({
          key: '<dynamic>',
          namespace: defaultNamespace,
          localKey: '<dynamic>',
          file: filename,
          line: node.loc?.start.line ?? 0,
          column: node.loc?.start.column ?? 0,
          isDynamic: true,
        });
      },

      /**
       * Extract keys from <Trans i18nKey="..." /> components
       */
      JSXOpeningElement(path, state) {
        const { node } = path;
        const filename = state.file.opts.filename || 'unknown';
        const options = state.opts || {};
        const defaultNamespace = options.defaultNamespace || 'translation';

        // Check for Trans component
        if (!t.isJSXIdentifier(node.name, { name: 'Trans' })) return;

        // Find i18nKey attribute
        const i18nKeyAttr = node.attributes.find(
          (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: 'i18nKey' })
        );

        if (!i18nKeyAttr || !t.isJSXAttribute(i18nKeyAttr)) return;

        const value = i18nKeyAttr.value;

        // String literal value
        if (t.isStringLiteral(value)) {
          const { namespace, localKey } = parseKey(value.value, defaultNamespace);

          this.extractedKeys.push({
            key: value.value,
            namespace,
            localKey,
            file: filename,
            line: node.loc?.start.line ?? 0,
            column: node.loc?.start.column ?? 0,
            isDynamic: false,
          });
          return;
        }

        // JSX expression with string literal
        if (
          t.isJSXExpressionContainer(value) &&
          t.isStringLiteral(value.expression)
        ) {
          const { namespace, localKey } = parseKey(value.expression.value, defaultNamespace);

          this.extractedKeys.push({
            key: value.expression.value,
            namespace,
            localKey,
            file: filename,
            line: node.loc?.start.line ?? 0,
            column: node.loc?.start.column ?? 0,
            isDynamic: false,
          });
          return;
        }

        // Dynamic key
        this.extractedKeys.push({
          key: '<dynamic>',
          namespace: defaultNamespace,
          localKey: '<dynamic>',
          file: filename,
          line: node.loc?.start.line ?? 0,
          column: node.loc?.start.column ?? 0,
          isDynamic: true,
        });
      },
    },

    post(state) {
      // Add all extracted keys to the global registry
      for (const key of this.extractedKeys) {
        globalRegistry.addKey(key);
      }

      const options = state.opts || globalRegistry.options || {};

      // Only generate report after all files have been processed
      // We use a simple heuristic: write on every file but overwrite
      if (options.translationFiles && options.translationFiles.length > 0) {
        const reportPath = options.reportPath || '.idealyst/translations-report.json';
        const allKeys = globalRegistry.getAllKeys();

        // Generate and write report
        const report = generateReport(allKeys, options);
        writeReport(report, reportPath);

        // Emit warnings if configured
        if (options.emitWarnings !== false) {
          for (const lang of report.languages) {
            const missingCount = report.missing[lang]?.length || 0;
            if (missingCount > 0) {
              console.warn(
                `[@idealyst/translate] ${lang}: ${missingCount} missing translation(s)`
              );
              if (options.verbose) {
                for (const m of report.missing[lang]) {
                  console.warn(`  - ${m.key} (used in ${m.usedIn.length} file(s))`);
                }
              }
            }
          }
        }

        // Fail build if configured
        if (options.failOnMissing && report.summary.totalMissing > 0) {
          throw new Error(
            `[@idealyst/translate] Build failed: ${report.summary.totalMissing} missing translation(s). ` +
              `See ${reportPath} for details.`
          );
        }
      }
    },
  };
};

// Export utilities for programmatic use
module.exports.globalRegistry = globalRegistry;
module.exports.generateReport = generateReport;
module.exports.writeReport = writeReport;
module.exports.parseKey = parseKey;

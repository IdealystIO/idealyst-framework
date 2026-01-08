import type { ExtractedKey } from './types';

/**
 * Parse a full translation key into namespace and local key parts
 */
export function parseKey(
  fullKey: string,
  defaultNamespace: string = 'translation'
): { namespace: string; localKey: string } {
  // Handle namespace:key format (i18next standard)
  if (fullKey.includes(':')) {
    const [namespace, ...rest] = fullKey.split(':');
    return { namespace, localKey: rest.join(':') };
  }

  // Handle namespace.key format (first segment is namespace if multiple segments)
  const segments = fullKey.split('.');
  if (segments.length > 1) {
    return { namespace: segments[0], localKey: segments.slice(1).join('.') };
  }

  // Single key without namespace
  return { namespace: defaultNamespace, localKey: fullKey };
}

/**
 * Registry for collecting translation keys across files during build
 */
export class KeyRegistry {
  private keys: Map<string, ExtractedKey[]> = new Map();

  /**
   * Add a key to the registry
   */
  addKey(key: ExtractedKey): void {
    const existing = this.keys.get(key.key) || [];
    existing.push(key);
    this.keys.set(key.key, existing);
  }

  /**
   * Get all keys (including duplicates from different files)
   */
  getAllKeys(): ExtractedKey[] {
    return Array.from(this.keys.values()).flat();
  }

  /**
   * Get static keys only (excludes dynamic keys)
   */
  getStaticKeys(): ExtractedKey[] {
    return this.getAllKeys().filter((k) => !k.isDynamic);
  }

  /**
   * Get dynamic keys only
   */
  getDynamicKeys(): ExtractedKey[] {
    return this.getAllKeys().filter((k) => k.isDynamic);
  }

  /**
   * Get unique static key strings
   */
  getUniqueKeys(): string[] {
    return Array.from(new Set(this.getStaticKeys().map((k) => k.key)));
  }

  /**
   * Get keys grouped by namespace
   */
  getKeysByNamespace(): Record<string, ExtractedKey[]> {
    const result: Record<string, ExtractedKey[]> = {};
    for (const key of this.getAllKeys()) {
      if (!result[key.namespace]) {
        result[key.namespace] = [];
      }
      result[key.namespace].push(key);
    }
    return result;
  }

  /**
   * Check if a key exists
   */
  hasKey(key: string): boolean {
    return this.keys.has(key);
  }

  /**
   * Get usage locations for a specific key
   */
  getKeyUsages(key: string): ExtractedKey[] {
    return this.keys.get(key) || [];
  }

  /**
   * Get the count of unique keys
   */
  getKeyCount(): number {
    return this.keys.size;
  }

  /**
   * Clear all keys
   */
  clear(): void {
    this.keys.clear();
  }

  /**
   * Export keys to a plain object for serialization
   */
  toJSON(): { keys: ExtractedKey[]; uniqueCount: number } {
    return {
      keys: this.getAllKeys(),
      uniqueCount: this.getKeyCount(),
    };
  }
}

/**
 * Get line number from character index in source code
 */
export function getLineNumber(code: string, index: number): number {
  return code.slice(0, index).split('\n').length;
}

/**
 * Get column number from character index in source code
 */
export function getColumnNumber(code: string, index: number): number {
  const lastNewline = code.lastIndexOf('\n', index);
  return index - lastNewline;
}

/**
 * Simple regex-based key extraction (fallback for non-Babel usage)
 */
export function extractKeysFromSource(
  code: string,
  filename: string,
  defaultNamespace: string = 'translation'
): ExtractedKey[] {
  const keys: ExtractedKey[] = [];

  // Match t('key') or t("key")
  const tCallRegex = /\bt\s*\(\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = tCallRegex.exec(code)) !== null) {
    const { namespace, localKey } = parseKey(match[1], defaultNamespace);
    keys.push({
      key: match[1],
      namespace,
      localKey,
      file: filename,
      line: getLineNumber(code, match.index),
      column: getColumnNumber(code, match.index),
      isDynamic: false,
    });
  }

  // Match i18nKey="key" (Trans component)
  const transRegex = /i18nKey\s*=\s*['"]([^'"]+)['"]/g;
  while ((match = transRegex.exec(code)) !== null) {
    const { namespace, localKey } = parseKey(match[1], defaultNamespace);
    keys.push({
      key: match[1],
      namespace,
      localKey,
      file: filename,
      line: getLineNumber(code, match.index),
      column: getColumnNumber(code, match.index),
      isDynamic: false,
    });
  }

  return keys;
}

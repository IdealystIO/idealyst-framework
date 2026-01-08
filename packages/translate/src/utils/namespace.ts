/**
 * Parse a full translation key into namespace and local key parts
 *
 * @param fullKey - The full key (e.g., "common:buttons.submit" or "common.buttons.submit")
 * @param defaultNamespace - Default namespace to use if not specified
 * @returns Object with namespace and localKey
 *
 * @example
 * parseKey('common:buttons.submit') // { namespace: 'common', localKey: 'buttons.submit' }
 * parseKey('buttons.submit', 'common') // { namespace: 'common', localKey: 'buttons.submit' }
 * parseKey('common.buttons.submit') // { namespace: 'common', localKey: 'buttons.submit' }
 */
export function parseKey(
  fullKey: string,
  defaultNamespace: string = 'translation'
): { namespace: string; localKey: string } {
  // Handle namespace:key format (explicit namespace separator)
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
 * Check if an object has a nested key
 *
 * @param obj - The object to check
 * @param keyPath - Dot-separated key path
 * @returns Whether the key exists
 */
export function hasNestedKey(obj: Record<string, unknown>, keyPath: string): boolean {
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
 * Get a nested value from an object
 *
 * @param obj - The object to read from
 * @param keyPath - Dot-separated key path
 * @returns The value or undefined
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  keyPath: string
): unknown {
  const parts = keyPath.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Flatten a nested object into dot-notation keys
 *
 * @param obj - The object to flatten
 * @param prefix - Key prefix
 * @returns Array of flattened keys
 */
export function flattenKeys(obj: Record<string, unknown>, prefix: string = ''): string[] {
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

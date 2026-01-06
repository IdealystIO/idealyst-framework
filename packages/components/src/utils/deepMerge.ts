/**
 * Check if a value is a plain object (not an array, null, or other special object)
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

/**
 * Deep merge two objects together, with the second object taking priority.
 * Arrays and non-plain objects are replaced rather than merged.
 *
 * Special handling:
 * - Setting a value to `undefined` removes that key from the result
 * - Nested objects (like `_web`, `variants`) are recursively merged
 *
 * @param target - The base object
 * @param source - The object to merge in (takes priority)
 * @returns A new merged object
 *
 * @example
 * ```typescript
 * // Basic merge
 * deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 })
 * // => { a: 1, b: 3, c: 4 }
 *
 * // Nested _web merge
 * deepMerge(
 *   { padding: 10, _web: { cursor: 'pointer', display: 'flex' } },
 *   { _web: { cursor: 'default' } }
 * )
 * // => { padding: 10, _web: { cursor: 'default', display: 'flex' } }
 *
 * // Remove property with undefined
 * deepMerge({ a: 1, b: 2 }, { b: undefined })
 * // => { a: 1 }
 * ```
 */
export function deepMerge<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T & S {
  const result: Record<string, any> = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      // If source value is undefined, remove the key entirely
      if (sourceValue === undefined) {
        delete result[key]
      }
      // If both values are plain objects, merge them recursively
      else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        // Otherwise, source value takes priority (including arrays, primitives, null)
        result[key] = sourceValue
      }
    }
  }

  return result as T & S
}

/**
 * Deep merge multiple objects together, with later objects taking priority.
 * This is useful for merging multiple extensions in order.
 *
 * @param objects - Objects to merge (later ones have higher precedence)
 * @returns A new merged object
 *
 * @example
 * ```typescript
 * deepMergeAll(
 *   { a: 1, b: 2 },           // base
 *   { b: 3, c: 4 },           // first extension
 *   { c: 5, d: 6 }            // second extension (highest precedence)
 * )
 * // => { a: 1, b: 3, c: 5, d: 6 }
 * ```
 */
export function deepMergeAll<T extends Record<string, any>>(
  ...objects: (T | undefined | null)[]
): T {
  return objects.reduce<T>((acc, obj) => {
    if (obj == null) return acc
    return deepMerge(acc, obj) as T
  }, {} as T)
}

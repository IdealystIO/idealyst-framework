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
 * @param target - The base object
 * @param source - The object to merge in (takes priority)
 * @returns A new merged object
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

      // If both values are plain objects, merge them recursively
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        // Otherwise, source value takes priority (including arrays, primitives, null, undefined)
        result[key] = sourceValue
      }
    }
  }

  return result as T & S
}

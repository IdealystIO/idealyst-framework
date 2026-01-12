import { Theme } from '@idealyst/theme';

// Type definitions
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Helper functions
export function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

export function deepMerge<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T & S {
  const result: Record<string, any> = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue
      }
    }
  }

  return result as T & S
}

export function buildSizeVariants(
  theme: Theme,
  component: string,
  builder: (value: any) => any
): Record<Size, any> {
  const variants = {} as Record<Size, any>;
  for (const size in (theme.sizes as any)[component]) {
    variants[size as Size] = builder((theme.sizes as any)[component][size as Size]);
  }
  return variants;
}

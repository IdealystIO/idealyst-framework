/**
 * Extensions runtime for Idealyst theme.
 *
 * This module provides the runtime helper used by the Babel plugin
 * to merge extensions into component styles.
 */

export { __withExtension } from './babel/runtime';

import { StyleSheet } from 'react-native-unistyles';
import type { Theme } from './theme';

// =============================================================================
// ThemeStyleWrapper - Type utility for style definitions
// =============================================================================

// Check if T is an object we can iterate over (not array, not function, not primitive)
type IsIterableObject<T> = T extends object
  ? T extends any[]
    ? false
    : T extends (...args: any[]) => any
      ? false
      : true
  : false;

// Get value type from an object - works for both Record and named-key objects
type ObjectValue<T> = T extends { [key: string]: infer V }
  ? V
  : T[keyof T];

/**
 * Wraps a Theme type to add $iterator properties for any object types.
 *
 * For each property that is an object (dictionary-like), adds a sibling $propertyName
 * that represents the value type. This enables Babel to expand iterations
 * over theme values (like intents, typography sizes, etc.)
 *
 * Works with:
 * - Record<string, V> types
 * - Objects with named keys like { primary: V, success: V, ... }
 *
 * @example
 * ```typescript
 * import { ThemeStyleWrapper } from '@idealyst/theme/extensions';
 * import type { Theme as BaseTheme } from '@idealyst/theme';
 *
 * type Theme = ThemeStyleWrapper<BaseTheme>;
 *
 * // Now you can use $iterator properties:
 * // theme.$intents.primary -> Babel expands to all intent keys
 * // theme.sizes.$typography.fontSize -> Babel expands to all typography keys
 * ```
 */
export type ThemeStyleWrapper<T> = T extends object
  ? {
      [K in keyof T]: ThemeStyleWrapper<T[K]>
    } & {
      [K in keyof T as IsIterableObject<T[K]> extends true ? `$${K & string}` : never]:
        ThemeStyleWrapper<ObjectValue<T[K]>>
    }
  : T;

/**
 * Theme type with $iterator properties for use in style definitions.
 * Use this instead of the base Theme type when using $iterator syntax.
 */
export type IteratorTheme = ThemeStyleWrapper<Theme>;

/**
 * Style callback type that accepts IteratorTheme.
 * The variants structure is relaxed to accept $iterator patterns.
 */
export type IteratorStyleCallback<TStyles> = (theme: IteratorTheme) => TStyles;

/**
 * Creates a stylesheet with $iterator expansion support.
 *
 * This is a typed wrapper around StyleSheet.create that:
 * 1. Accepts the IteratorTheme type (with $intents, $sizes, etc.)
 * 2. Allows relaxed variant structures for $iterator patterns
 *
 * The Babel plugin will expand $iterator patterns before Unistyles processes the styles.
 *
 * @example
 * ```typescript
 * import { createIteratorStyles } from '@idealyst/theme';
 *
 * export const styles = createIteratorStyles((theme) => ({
 *   box: {
 *     borderRadius: theme.radii.md,
 *     variants: {
 *       intent: {
 *         backgroundColor: theme.$intents.light,
 *         borderColor: theme.$intents.primary,
 *       },
 *       size: {
 *         padding: theme.sizes.$button.paddingVertical,
 *       },
 *     },
 *   },
 * }));
 * ```
 */
export function createIteratorStyles<TStyles extends Record<string, any>>(
  callback: IteratorStyleCallback<TStyles>
): ReturnType<typeof StyleSheet.create> {
  // This function is transformed by Babel - it sees StyleSheet.create and processes it
  // The callback is passed through with $iterator patterns expanded
  return StyleSheet.create(callback as any);
}

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

// Detect if T has a string index signature (is Record-like)
type HasStringIndex<T> = string extends keyof T ? true : false;

// Get value type from the index signature
type IndexValue<T> = T extends { [key: string]: infer V } ? V : never;

/**
 * Wraps a Theme type to add $iterator properties for any Record/mapping types.
 *
 * For each property that is a Record<string, V>, adds a sibling $propertyName
 * that represents the value type V. This enables Babel to expand iterations
 * over theme values (like intents, typography sizes, etc.)
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
      [K in keyof T as HasStringIndex<T[K]> extends true ? `$${K & string}` : never]:
        ThemeStyleWrapper<IndexValue<T[K]>>
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

/**
 * Component Style Types Registry
 *
 * This module provides type definitions for component styles used with
 * defineStyle, extendStyle, and overrideStyle.
 *
 * Components register their style types via module augmentation:
 *
 * @example
 * ```typescript
 * // In Text.styles.tsx
 * declare module '@idealyst/theme' {
 *   interface ComponentStyleRegistry {
 *     Text: TextStyleDef;
 *   }
 * }
 * ```
 */

import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Registry interface that components augment to register their style types.
 * This enables type-safe extendStyle and overrideStyle calls.
 *
 * Style definitions must use plain style objects, not functions.
 */
export interface ComponentStyleRegistry {
  // Components augment this interface to add their style types
  // Example: Text: { text: TextStyle & { variants?: { ... } } }
}

/**
 * Get the style definition type for a component.
 * Returns the registered type or a loose Record type for unregistered components.
 */
export type ComponentStyleDef<K extends string> = K extends keyof ComponentStyleRegistry
  ? ComponentStyleRegistry[K]
  : Record<string, any>;

/**
 * Deep partial type for style objects.
 * Recursively makes all properties optional.
 * Extensions must be plain style objects — functions are not supported.
 */
export type DeepPartialStyle<T> = T extends object
  ? { [K in keyof T]?: DeepPartialStyle<T[K]> }
  : T;

/**
 * Style definition for extendStyle - plain style objects only.
 * Functions are not supported; the babel plugin merges plain objects into base styles.
 */
export type ExtendStyleDef<K extends string> = DeepPartialStyle<ComponentStyleDef<K>>;

/**
 * Style definition for overrideStyle - requires full style implementation.
 */
export type OverrideStyleDef<K extends string> = ComponentStyleDef<K>;

// =============================================================================
// Common Style Types
// =============================================================================

/**
 * Base style object with optional variants and compound variants.
 */
export interface StyleWithVariants<TVariants extends Record<string, any> = Record<string, any>> {
  variants?: {
    [K in keyof TVariants]?: {
      [V in TVariants[K] extends string | boolean ? TVariants[K] : string]?: ViewStyle | TextStyle;
    };
  };
  compoundVariants?: Array<{
    [K in keyof TVariants]?: TVariants[K];
  } & { styles: ViewStyle | TextStyle }>;
}

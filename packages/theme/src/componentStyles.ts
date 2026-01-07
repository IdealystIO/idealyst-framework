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
 */
export interface ComponentStyleRegistry {
  // Components augment this interface to add their style types
  // Example: Text: { text: (params: TextStyleParams) => TextStyleObject }
}

/**
 * Get the style definition type for a component.
 * Returns the registered type or a loose Record type for unregistered components.
 */
export type ComponentStyleDef<K extends string> = K extends keyof ComponentStyleRegistry
  ? ComponentStyleRegistry[K]
  : Record<string, any>;

/**
 * Deep partial type that works with functions.
 * For style functions, preserves the function signature but makes the return type partial.
 */
export type DeepPartialStyle<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => DeepPartialStyle<R>
  : T extends object
    ? { [K in keyof T]?: DeepPartialStyle<T[K]> }
    : T;

/**
 * Style definition for extendStyle - requires functions with same params as base.
 * All style properties must be functions to access dynamic params.
 */
export type ExtendStyleDef<K extends string> = DeepPartialStyle<ComponentStyleDef<K>>;

/**
 * Style definition for overrideStyle - requires full implementation with functions.
 */
export type OverrideStyleDef<K extends string> = ComponentStyleDef<K>;

/**
 * Helper to extract the params type from a dynamic style function.
 * Use this to type your extension functions.
 *
 * @example
 * ```typescript
 * type TextParams = StyleParams<TextStyleDef['text']>;
 * // TextParams = { color?: TextColorVariant }
 * ```
 */
export type StyleParams<T> = T extends (params: infer P) => any ? P : never;

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

/**
 * Dynamic style function type.
 */
export type DynamicStyleFn<TParams, TStyle> = (params: TParams) => TStyle;

/**
 * Theme Extension Interfaces
 *
 * These interfaces use TypeScript's declaration merging to allow users to extend
 * theme types with custom values while maintaining full type safety.
 *
 * @example Adding custom intents
 * ```typescript
 * // In your app's types file (e.g., src/theme/extensions.d.ts)
 * declare module '@idealyst/theme' {
 *   interface IntentExtensions {
 *     brand: true;
 *     accent: true;
 *   }
 * }
 * ```
 *
 * @example Extending IntentValue structure
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface IntentValueExtensions {
 *     shadowColor: string;
 *     hoverBackground: string;
 *   }
 * }
 * ```
 *
 * After declaring extensions, your custom intents will be type-safe:
 * - `<Button intent="brand" />` will autocomplete and type-check
 * - Theme objects must include values for custom intents
 * - Extended IntentValue properties must be provided for all intents
 */

/**
 * Extend this interface to add custom intent names.
 * The keys become valid Intent values.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface IntentExtensions {
 *     brand: true;
 *     accent: true;
 *     destructive: true;
 *   }
 * }
 * ```
 */
export interface IntentExtensions {}

/**
 * Extend this interface to add custom properties to IntentValue.
 * All intents (including base ones) must provide these properties.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface IntentValueExtensions {
 *     shadowColor: string;
 *     hoverBackground: string;
 *   }
 * }
 * ```
 */
export interface IntentValueExtensions {}

/**
 * Extend this interface to add custom palette color names.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface PalletExtensions {
 *     coral: true;
 *     mint: true;
 *     brand: true;
 *   }
 * }
 * ```
 */
export interface PalletExtensions {}

/**
 * Extend this interface to add custom surface types.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface SurfaceExtensions {
 *     elevated: true;
 *     sunken: true;
 *   }
 * }
 * ```
 */
export interface SurfaceExtensions {}

/**
 * Extend this interface to add custom text color types.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface TextExtensions {
 *     muted: true;
 *     accent: true;
 *   }
 * }
 * ```
 */
export interface TextExtensions {}

/**
 * Extend this interface to add custom border types.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface BorderExtensions {
 *     focus: true;
 *     error: true;
 *   }
 * }
 * ```
 */
export interface BorderExtensions {}

/**
 * Extend this interface to add custom shadow variants.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface ShadowExtensions {
 *     '2xl': true;
 *     inner: true;
 *   }
 * }
 * ```
 */
export interface ShadowExtensions {}

/**
 * Extend this interface to add custom size variants.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface SizeExtensions {
 *     '2xl': true;
 *     '3xl': true;
 *   }
 * }
 * ```
 */
export interface SizeExtensions {}

/**
 * Extend this interface to add custom border radius values.
 *
 * @example
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface RadiusExtensions {
 *     '2xl': true;
 *     full: true;
 *   }
 * }
 * ```
 */
export interface RadiusExtensions {}

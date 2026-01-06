import { IntentExtensions, IntentValueExtensions } from './extensions';

/**
 * Base intent types that are always available.
 */
type BaseIntent = 'primary' | 'success' | 'error' | 'warning' | 'neutral' | 'info';

/**
 * Custom intent types added via declaration merging.
 * When IntentExtensions is empty, this evaluates to `never` and contributes nothing to the union.
 */
type CustomIntent = keyof IntentExtensions;

/**
 * All available intent types.
 * Includes base intents plus any custom intents defined via IntentExtensions.
 *
 * @example Adding custom intents
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface IntentExtensions {
 *     brand: true;
 *     accent: true;
 *   }
 * }
 * // Intent is now: 'primary' | 'success' | 'error' | 'warning' | 'neutral' | 'info' | 'brand' | 'accent'
 * ```
 */
export type Intent = BaseIntent | CustomIntent;

/**
 * Base intent value structure.
 */
type BaseIntentValue = {
    primary: string;
    contrast: string;
    light: string;
    dark: string;
};

/**
 * Complete intent value structure.
 * Includes base properties plus any extended properties defined via IntentValueExtensions.
 *
 * @example Extending IntentValue
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface IntentValueExtensions {
 *     shadowColor: string;
 *   }
 * }
 * // IntentValue now requires: primary, contrast, light, dark, shadowColor
 * ```
 */
export type IntentValue = BaseIntentValue & IntentValueExtensions;
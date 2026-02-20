/**
 * Global component defaults.
 *
 * These values are used as fallbacks when neither the component prop
 * nor a component-specific default is set.
 * Call the setter once at app startup (e.g., in App.tsx).
 *
 * @example
 * ```typescript
 * import { setDefaultMaxFontSizeMultiplier } from '@idealyst/theme';
 *
 * setDefaultMaxFontSizeMultiplier(1.5);
 * ```
 */

let _defaultMaxFontSizeMultiplier: number | undefined = undefined;

/**
 * Set the global default `maxFontSizeMultiplier` for all text-rendering components.
 * Any component without an explicit prop or component-level default will use this value.
 * Pass `undefined` to clear (no limit).
 */
export function setDefaultMaxFontSizeMultiplier(value: number | undefined): void {
    _defaultMaxFontSizeMultiplier = value;
}

/**
 * Get the current global default `maxFontSizeMultiplier`.
 * Returns `undefined` if no default has been set.
 */
export function getDefaultMaxFontSizeMultiplier(): number | undefined {
    return _defaultMaxFontSizeMultiplier;
}

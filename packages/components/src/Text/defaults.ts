/**
 * Module-level defaults for the Text component.
 *
 * Configure once at app startup:
 *   import { setTextDefaults } from '@idealyst/components';
 *   setTextDefaults({ maxFontSizeMultiplier: 1.2 });
 */

export interface TextDefaults {
  /**
   * Default maximum font scale factor for accessibility text sizing.
   * Applied to all Text components unless overridden by the prop.
   * Set to 0 to disable scaling limits. undefined means no limit.
   */
  maxFontSizeMultiplier?: number;
}

let defaults: TextDefaults = {};

/**
 * Set default values for all Text components.
 * Call once at app startup before rendering.
 */
export function setTextDefaults(newDefaults: TextDefaults): void {
  defaults = { ...defaults, ...newDefaults };
}

/**
 * Get current Text defaults. Used internally by Text components.
 */
export function getTextDefaults(): TextDefaults {
  return defaults;
}

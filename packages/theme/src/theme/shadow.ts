import { RegisteredTheme } from './extensions';
import type { ShadowValue } from './structures';
export type { ShadowValue };

/**
 * All available shadow variant names.
 * Derived from your registered theme's shadows.
 */
export type ShadowVariant = keyof RegisteredTheme['theme']['shadows'];

/**
 * Complete shadow system structure.
 */
export type AllShadowTypes = RegisteredTheme['theme']['shadows'];

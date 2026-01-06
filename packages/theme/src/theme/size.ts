import { RegisteredTheme } from './extensions';

/**
 * All available size variants.
 * Derived from your registered theme's sizes.
 */
export type Size = keyof RegisteredTheme['theme']['sizes']['button'];

/**
 * Complete component sizes structure.
 */
export type AllComponentSizes = RegisteredTheme['theme']['sizes'];

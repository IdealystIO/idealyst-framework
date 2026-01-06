import { RegisteredTheme } from './extensions';

/**
 * All available palette color names.
 * Derived from your registered theme's color pallet.
 */
export type Pallet = keyof RegisteredTheme['theme']['colors']['pallet'] & string;

/**
 * Color reference string. Either a palette.shade combination or just a palette name.
 * @example 'blue.500', 'red.100', 'gray'
 */
export type Color = `${Pallet}.${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}` | Pallet;

/**
 * All available surface types.
 * Derived from your registered theme's surfaces.
 */
export type Surface = keyof RegisteredTheme['theme']['colors']['surface'];

/**
 * All available text color types.
 * Derived from your registered theme's text colors.
 */
export type Text = keyof RegisteredTheme['theme']['colors']['text'];

/**
 * All available border color types.
 * Derived from your registered theme's borders.
 */
export type Border = keyof RegisteredTheme['theme']['colors']['border'];

/**
 * Complete color system structure.
 */
export type AllColorTypes = RegisteredTheme['theme']['colors'];

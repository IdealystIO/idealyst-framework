import {
    PalletExtensions,
    SurfaceExtensions,
    TextExtensions,
    BorderExtensions,
} from './extensions';

/**
 * Base palette color names.
 */
type BasePallet = 'red' | 'orange' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray' | 'black' | 'white';

/**
 * Custom palette colors added via declaration merging.
 */
type CustomPallet = keyof PalletExtensions;

/**
 * All available palette color names.
 * Includes base colors plus any custom colors defined via PalletExtensions.
 *
 * @example Adding custom palette colors
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
export type Pallet = BasePallet | CustomPallet;

/**
 * Shade values for palette colors (50-900 scale).
 */
export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Color reference string. Either a palette.shade combination or just a palette name.
 * @example 'blue.500', 'red.100', 'gray'
 */
export type Color = `${Pallet}.${Shade}` | Pallet;

/**
 * A color value string (hex, rgb, rgba, etc.)
 */
export type ColorValue = string;

/**
 * Base surface types.
 */
type BaseSurface = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'inverse-secondary' | 'inverse-tertiary';

/**
 * Custom surface types added via declaration merging.
 */
type CustomSurface = keyof SurfaceExtensions;

/**
 * All available surface types.
 *
 * @example Adding custom surfaces
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface SurfaceExtensions {
 *     elevated: true;
 *     sunken: true;
 *   }
 * }
 * ```
 */
export type Surface = BaseSurface | CustomSurface;

/**
 * Base text color types.
 */
type BaseText = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'inverse-secondary' | 'inverse-tertiary';

/**
 * Custom text color types added via declaration merging.
 */
type CustomText = keyof TextExtensions;

/**
 * All available text color types.
 *
 * @example Adding custom text colors
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface TextExtensions {
 *     muted: true;
 *     accent: true;
 *   }
 * }
 * ```
 */
export type Text = BaseText | CustomText;

/**
 * Base border color types.
 */
type BaseBorder = 'primary' | 'secondary' | 'tertiary' | 'disabled';

/**
 * Custom border color types added via declaration merging.
 */
type CustomBorder = keyof BorderExtensions;

/**
 * All available border color types.
 *
 * @example Adding custom border colors
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface BorderExtensions {
 *     focus: true;
 *     error: true;
 *   }
 * }
 * ```
 */
export type Border = BaseBorder | CustomBorder;

/**
 * Complete color system structure.
 */
export type AllColorTypes = {
    surface: Record<Surface, ColorValue>;
    text: Record<Text, ColorValue>;
    border: Record<Border, ColorValue>;
    pallet: Record<Pallet, Record<Shade, ColorValue>>;
};

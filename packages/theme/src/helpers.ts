import { IntentValue, Theme, Shade, ColorValue } from './theme';

/**
 * Deep partial type for nested objects.
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Create an IntentValue with all required properties.
 * Automatically generates light and dark variants if not provided.
 *
 * @param primary - The primary color for this intent
 * @param contrast - The contrast color (typically for text on primary background)
 * @param options - Optional overrides for light, dark, and any extended properties
 * @returns A complete IntentValue object
 *
 * @example Basic usage
 * ```typescript
 * const brandIntent = createIntent('#8B5CF6', '#ffffff');
 * ```
 *
 * @example With extended properties
 * ```typescript
 * const brandIntent = createIntent('#8B5CF6', '#ffffff', {
 *   shadowColor: 'rgba(139, 92, 246, 0.3)',
 *   hoverBackground: 'rgba(139, 92, 246, 0.1)',
 * });
 * ```
 */
export function createIntent(
    primary: string,
    contrast: string,
    options?: Partial<Omit<IntentValue, 'primary' | 'contrast'>>
): IntentValue {
    return {
        primary,
        contrast,
        light: options?.light ?? lightenColor(primary, 0.3),
        dark: options?.dark ?? darkenColor(primary, 0.3),
        ...options,
    } as IntentValue;
}

/**
 * Deep merge two objects together.
 * The source object's values take priority over target.
 *
 * @param target - Base object
 * @param source - Object to merge in (takes priority)
 * @returns Merged object
 */
function deepMerge<T extends Record<string, any>>(target: T, source: DeepPartial<T>): T {
    const result: Record<string, any> = { ...target };

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (
                sourceValue !== null &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                targetValue !== null &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                result[key] = deepMerge(targetValue, sourceValue as DeepPartial<typeof targetValue>);
            } else if (sourceValue !== undefined) {
                result[key] = sourceValue;
            }
        }
    }

    return result as T;
}

/**
 * Extend a base theme with custom values.
 * Performs a deep merge where extensions override base values.
 *
 * @param base - The base theme to extend (e.g., lightTheme or darkTheme)
 * @param extensions - Partial theme object with values to override
 * @returns Complete theme with extensions applied
 *
 * @example
 * ```typescript
 * import { lightTheme, extendTheme, createIntent } from '@idealyst/theme';
 *
 * const myTheme = extendTheme(lightTheme, {
 *   intents: {
 *     brand: createIntent('#8B5CF6', '#ffffff'),
 *     accent: createIntent('#F59E0B', '#ffffff'),
 *   },
 *   colors: {
 *     surface: {
 *       elevated: '#ffffff',
 *     },
 *   },
 * });
 * ```
 */
export function extendTheme(base: Theme, extensions: DeepPartial<Theme>): Theme {
    return deepMerge(base, extensions);
}

/**
 * Generate a color palette (50-900 shades) from a base color.
 * Uses the 500 shade as the base and interpolates lighter/darker variants.
 *
 * @param baseColor - The base color (hex format, e.g., '#8B5CF6')
 * @returns Record of shade values (50-900)
 *
 * @example
 * ```typescript
 * const brandPalette = generatePalette('#8B5CF6');
 * // brandPalette[50] = light variant
 * // brandPalette[500] = base color
 * // brandPalette[900] = dark variant
 * ```
 */
export function generatePalette(baseColor: string): Record<Shade, ColorValue> {
    const palette = {} as Record<Shade, ColorValue>;
    const baseRgb = hexToRgb(baseColor);
    const white: [number, number, number] = [255, 255, 255];
    const black: [number, number, number] = [0, 0, 0];
    const shades: Shade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (const shade of shades) {
        if (shade === 500) {
            palette[shade] = baseColor;
        } else if (shade < 500) {
            // Lighter shades - interpolate towards white
            const factor = (500 - shade) / 450;
            const interpolated = interpolateColor(baseRgb, white, factor);
            palette[shade] = rgbToHex(...interpolated);
        } else {
            // Darker shades - interpolate towards black
            const factor = (shade - 500) / 400;
            const interpolated = interpolateColor(baseRgb, black, factor);
            palette[shade] = rgbToHex(...interpolated);
        }
    }

    return palette;
}

// ============================================================================
// Internal Color Utilities
// ============================================================================

/**
 * Convert hex color to RGB tuple.
 */
function hexToRgb(hex: string): [number, number, number] {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return [r, g, b];
}

/**
 * Convert RGB tuple to hex color.
 */
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Interpolate between two RGB colors.
 */
function interpolateColor(
    color1: [number, number, number],
    color2: [number, number, number],
    factor: number
): [number, number, number] {
    return [
        color1[0] + (color2[0] - color1[0]) * factor,
        color1[1] + (color2[1] - color1[1]) * factor,
        color1[2] + (color2[2] - color1[2]) * factor,
    ];
}

/**
 * Lighten a color by a given factor.
 */
function lightenColor(hex: string, factor: number): string {
    const rgb = hexToRgb(hex);
    const white: [number, number, number] = [255, 255, 255];
    const interpolated = interpolateColor(rgb, white, factor);
    return rgbToHex(...interpolated);
}

/**
 * Darken a color by a given factor.
 */
function darkenColor(hex: string, factor: number): string {
    const rgb = hexToRgb(hex);
    const black: [number, number, number] = [0, 0, 0];
    const interpolated = interpolateColor(rgb, black, factor);
    return rgbToHex(...interpolated);
}

import type { BuiltTheme } from './builder';
import type { FontScaleConfig, SizeValue, TypographyValue } from './theme/structures';

// =============================================================================
// Property Classification
// =============================================================================

/**
 * Property names that represent font metrics and are always scaled.
 */
const FONT_PROPERTIES = new Set([
    'fontSize',
    'lineHeight',
    'headerFontSize',
    'labelFontSize',
    'labelLineHeight',
    'titleFontSize',
    'titleLineHeight',
    'messageFontSize',
    'messageLineHeight',
    'circularLabelFontSize',
]);

/**
 * Property names that represent icon dimensions and are scaled when scaleIcons is true.
 */
const ICON_PROPERTIES = new Set([
    'iconSize',
    'thumbIconSize',
    'closeIconSize',
]);

/**
 * The 'icon' component's width/height represent icon glyph dimensions (not layout),
 * so they are scaled when scaleIcons is true.
 */
const ICON_COMPONENT_KEY = 'icon';

// =============================================================================
// Scaling Helpers
// =============================================================================

function scaleSizeValue(value: SizeValue, scale: number): SizeValue {
    if (typeof value === 'number') {
        return Math.round(value * scale * 100) / 100;
    }
    return value;
}

function shouldScaleProperty(
    key: string,
    componentKey: string,
    scaleIcons: boolean,
): boolean {
    if (FONT_PROPERTIES.has(key)) {
        return true;
    }
    if (scaleIcons && ICON_PROPERTIES.has(key)) {
        return true;
    }
    // Icon component's width/height are icon dimensions
    if (scaleIcons && componentKey === ICON_COMPONENT_KEY && (key === 'width' || key === 'height')) {
        return true;
    }
    return false;
}

function scaleSizeRecord(
    record: Record<string, SizeValue>,
    scale: number,
    componentKey: string,
    scaleIcons: boolean,
): Record<string, SizeValue> {
    const result: Record<string, SizeValue> = {};
    for (const [key, value] of Object.entries(record)) {
        result[key] = shouldScaleProperty(key, componentKey, scaleIcons)
            ? scaleSizeValue(value, scale)
            : value;
    }
    return result;
}

function scaleTypography(
    typography: Record<string, TypographyValue>,
    scale: number,
): Record<string, TypographyValue> {
    const result: Record<string, TypographyValue> = {};
    for (const [key, value] of Object.entries(typography)) {
        result[key] = {
            fontSize: scaleSizeValue(value.fontSize, scale),
            lineHeight: scaleSizeValue(value.lineHeight, scale),
            fontWeight: value.fontWeight,
        };
    }
    return result;
}

// =============================================================================
// Public API
// =============================================================================

export type ApplyFontScaleOptions = {
    /** Whether to scale icon sizes alongside fonts (default: true) */
    scaleIcons?: boolean;
    /** Minimum allowed scale factor (default: 0.5) */
    minScale?: number;
    /** Maximum allowed scale factor (default: 3.0) */
    maxScale?: number;
};

/**
 * Apply a font scale factor to a theme, returning a new theme with all
 * font-related size properties scaled.
 *
 * Uses `__baseSizes` (if present) as the source for scaling, making this
 * function idempotent — calling it multiple times with different scales
 * always computes from the original unscaled values.
 *
 * @param theme - The theme to scale
 * @param scale - The scale factor (1.0 = no change)
 * @param options - Configuration
 * @returns A new theme with scaled sizes, fontScaleConfig, and __baseSizes set
 *
 * @example
 * ```typescript
 * import { applyFontScale } from '@idealyst/theme';
 *
 * const scaledTheme = applyFontScale(lightTheme, 1.2);
 * // scaledTheme.sizes.button.md.fontSize === 19.2 (was 16)
 * ```
 */
export function applyFontScale<T extends BuiltTheme<any, any, any, any, any, any, any, any, any>>(
    theme: T,
    scale: number,
    options?: ApplyFontScaleOptions,
): T {
    const scaleIcons = options?.scaleIcons ?? true;
    const minScale = options?.minScale ?? 0.5;
    const maxScale = options?.maxScale ?? 3.0;
    const clampedScale = Math.min(maxScale, Math.max(minScale, scale));

    // Use __baseSizes if available (idempotent rescaling), otherwise current sizes
    const baseSizes = theme.__baseSizes ?? theme.sizes;

    const fontScaleConfig: FontScaleConfig = {
        fontScale: clampedScale,
        scaleIcons,
        minScale,
        maxScale,
    };

    if (clampedScale === 1.0) {
        return {
            ...theme,
            sizes: baseSizes,
            fontScaleConfig,
            __baseSizes: baseSizes,
        };
    }

    // Scale each component's size records
    const scaledSizes: Record<string, any> = {};
    for (const [componentKey, sizeVariants] of Object.entries(baseSizes)) {
        if (componentKey === 'typography') {
            scaledSizes.typography = scaleTypography(
                sizeVariants as Record<string, TypographyValue>,
                clampedScale,
            );
        } else {
            const scaledVariants: Record<string, any> = {};
            for (const [variantKey, variantValue] of Object.entries(sizeVariants as Record<string, Record<string, SizeValue>>)) {
                scaledVariants[variantKey] = scaleSizeRecord(
                    variantValue,
                    clampedScale,
                    componentKey,
                    scaleIcons,
                );
            }
            scaledSizes[componentKey] = scaledVariants;
        }
    }

    return {
        ...theme,
        sizes: scaledSizes as T['sizes'],
        fontScaleConfig,
        __baseSizes: baseSizes,
    };
}

// =============================================================================
// Content Size Category Mapping
// =============================================================================

/**
 * Maps iOS/Android contentSizeCategory strings to numeric font scale factors.
 *
 * iOS values are based on Apple's Dynamic Type scale ratios for the default
 * body text style. Android values use approximate equivalents.
 *
 * Returns 1.0 for unknown categories.
 *
 * @param category - The contentSizeCategory string from UnistylesRuntime
 * @returns A numeric scale factor
 *
 * @example
 * ```typescript
 * import { contentSizeCategoryToScale } from '@idealyst/theme';
 * import { UnistylesRuntime } from 'react-native-unistyles';
 *
 * const scale = contentSizeCategoryToScale(UnistylesRuntime.contentSizeCategory);
 * ```
 */
export function contentSizeCategoryToScale(category: string): number {
    const mapping: Record<string, number> = {
        // iOS categories (runtime string values from IOSContentSizeCategory enum)
        xSmall: 0.82,
        Small: 0.88,
        Medium: 0.94,
        Large: 1.0, // iOS default
        xLarge: 1.12,
        xxLarge: 1.24,
        xxxLarge: 1.35,
        accessibilityMedium: 1.6,
        accessibilityLarge: 1.9,
        accessibilityExtraLarge: 2.35,
        accessibilityExtraExtraLarge: 2.75,
        accessibilityExtraExtraExtraLarge: 3.1,
        // Android categories (runtime string values from AndroidContentSizeCategory enum)
        Default: 1.0,
        ExtraLarge: 1.24,
        Huge: 1.35,
        ExtraHuge: 1.6,
        ExtraExtraHuge: 1.9,
        // Web / unspecified
        'web-unspecified': 1.0,
        unspecified: 1.0,
    };

    return mapping[category] ?? 1.0;
}

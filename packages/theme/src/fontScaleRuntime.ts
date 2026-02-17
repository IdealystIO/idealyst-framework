import { UnistylesRuntime } from 'react-native-unistyles';
import { applyFontScale, type ApplyFontScaleOptions } from './fontScale';
import type { FontScaleConfig } from './theme/structures';

/**
 * Options for updateFontScale.
 */
export type UpdateFontScaleOptions = ApplyFontScaleOptions & {
    /** Theme names to update. Defaults to ['light', 'dark']. */
    themes?: string[];
};

/**
 * Update the font scale at runtime across registered Unistyles themes.
 *
 * Uses UnistylesRuntime.updateTheme() to recompute all font-related sizes,
 * triggering automatic re-renders of all components that reference theme
 * size values via stylesheets.
 *
 * @param scale - The new font scale factor (1.0 = no change)
 * @param options - Configuration
 *
 * @example React to OS font size changes
 * ```typescript
 * import { updateFontScale, contentSizeCategoryToScale } from '@idealyst/theme';
 * import { UnistylesRuntime } from 'react-native-unistyles';
 *
 * const osScale = contentSizeCategoryToScale(UnistylesRuntime.contentSizeCategory);
 * updateFontScale(osScale);
 * ```
 *
 * @example User preference from settings
 * ```typescript
 * function onFontScaleChange(newScale: number) {
 *     updateFontScale(newScale);
 * }
 * ```
 */
export function updateFontScale(scale: number, options?: UpdateFontScaleOptions): void {
    const { themes: themeNames = ['light', 'dark'], ...scaleOptions } = options ?? {};

    for (const themeName of themeNames) {
        try {
            UnistylesRuntime.updateTheme(themeName as any, (currentTheme: any) => {
                const existingConfig = currentTheme.fontScaleConfig as FontScaleConfig | undefined;
                return applyFontScale(currentTheme, scale, {
                    scaleIcons: scaleOptions.scaleIcons ?? existingConfig?.scaleIcons ?? true,
                    minScale: scaleOptions.minScale ?? existingConfig?.minScale,
                    maxScale: scaleOptions.maxScale ?? existingConfig?.maxScale,
                });
            });
        } catch (error) {
            // Theme may not be registered — silently skip
            if (__DEV__) {
                console.warn(`[idealyst/theme] Unable to update font scale for theme "${themeName}":`, error);
            }
        }
    }
}

/**
 * Get the current font scale from the active theme.
 * Returns 1.0 if no font scale has been applied.
 */
export function getFontScale(): number {
    try {
        const theme = UnistylesRuntime.getTheme() as any;
        return theme?.fontScaleConfig?.fontScale ?? 1.0;
    } catch {
        return 1.0;
    }
}

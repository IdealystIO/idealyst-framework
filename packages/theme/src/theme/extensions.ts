/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { IntentValue, ShadowValue, Shade, ColorValue, InteractionConfig, ButtonSizeValue, ChipSizeValue, BadgeSizeValue, IconSizeValue, InputSizeValue, RadioButtonSizeValue, SelectSizeValue, SliderSizeValue, SwitchSizeValue, TextAreaSizeValue, AvatarSizeValue, ProgressSizeValue, AccordionSizeValue, ActivityIndicatorSizeValue, AlertSizeValue, BreadcrumbSizeValue, ListSizeValue, MenuSizeValue, TextSizeValue, TabBarSizeValue, TableSizeValue, TooltipSizeValue, ViewSizeValue, Typography, TypographyValue } from './structures';

/**
 * Default fallback theme structure.
 * Used when no custom theme is registered.
 */
export interface DefaultTheme {
    intents: Record<string, IntentValue>;
    radii: Record<string, number>;
    shadows: Record<string, ShadowValue>;
    colors: {
        pallet: Record<string, Record<Shade, ColorValue>>;
        surface: Record<string, ColorValue>;
        text: Record<string, ColorValue>;
        border: Record<string, ColorValue>;
        card: Record<string, ColorValue>;
    };
    sizes: {
        button: Record<string, ButtonSizeValue>;
        chip: Record<string, ChipSizeValue>;
        badge: Record<string, BadgeSizeValue>;
        icon: Record<string, IconSizeValue>;
        iconButton: Record<string, IconSizeValue>;
        input: Record<string, InputSizeValue>;
        radioButton: Record<string, RadioButtonSizeValue>;
        select: Record<string, SelectSizeValue>;
        slider: Record<string, SliderSizeValue>;
        switch: Record<string, SwitchSizeValue>;
        textarea: Record<string, TextAreaSizeValue>;
        avatar: Record<string, AvatarSizeValue>;
        progress: Record<string, ProgressSizeValue>;
        accordion: Record<string, AccordionSizeValue>;
        activityIndicator: Record<string, ActivityIndicatorSizeValue>;
        alert: Record<string, AlertSizeValue>;
        breadcrumb: Record<string, BreadcrumbSizeValue>;
        list: Record<string, ListSizeValue>;
        menu: Record<string, MenuSizeValue>;
        text: Record<string, TextSizeValue>;
        tabBar: Record<string, TabBarSizeValue>;
        table: Record<string, TableSizeValue>;
        tooltip: Record<string, TooltipSizeValue>;
        view: Record<string, ViewSizeValue>;
        typography: Record<Typography, TypographyValue>;
    };
    interaction: InteractionConfig;
    /**
     * Responsive breakpoints for width-based styling.
     * First breakpoint MUST have value 0.
     */
    breakpoints: Record<string, number>;
    /**
     * Component style extensions.
     * Populated by the extension system when extendComponent is called.
     * Used by the Babel plugin to merge extensions into component styles.
     * @internal
     */
    __extensions?: Record<string, Record<string, any>>;
}

/**
 * CustomThemeRegistry - Augment this interface to register your custom theme.
 *
 * All derived types (Intent, Radius, Size, etc.) come from this interface.
 * Build your theme, then register it via module augmentation:
 *
 * @example
 * ```typescript
 * import { createTheme, fromTheme, lightTheme } from '@idealyst/theme';
 *
 * const myTheme = fromTheme(lightTheme)
 *   .addIntent('brand', { ... })
 *   .addRadius('2xl', 24)
 *   .build();
 *
 * // Register your theme to get type inference
 * declare module '@idealyst/theme' {
 *   interface CustomThemeRegistry {
 *     theme: typeof myTheme;
 *   }
 * }
 *
 * // Now all components get: Intent = 'primary' | 'brand' | ..., Radius = 'none' | ... | '2xl', etc.
 * ```
 */
export interface CustomThemeRegistry {
    // Empty by default - users augment to add 'theme' property
}

/**
 * Helper to extract theme type from registry, falling back to DefaultTheme.
 */
type ResolveCustomTheme = CustomThemeRegistry extends { theme: infer T } ? T : DefaultTheme;

/**
 * RegisteredTheme - Contains the resolved theme type.
 * DO NOT augment this directly - augment CustomThemeRegistry instead.
 */
export interface RegisteredTheme {
    theme: ResolveCustomTheme;
}

/**
 * Extend this interface to add custom properties to IntentValue.
 */
export interface IntentValueExtensions {}

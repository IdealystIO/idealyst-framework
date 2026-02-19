import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import type { UnistylesThemes } from 'react-native-unistyles';
import type { BuiltTheme } from './builder';

/**
 * Color scheme preference type.
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Any theme produced by the builder system (fromTheme().build() or createTheme().build()).
 */
type AnyBuiltTheme = BuiltTheme<string, string, string, string, string, string, string, string, string>;

/**
 * Options for configureThemes().
 */
export interface ConfigureThemesOptions {
    /**
     * Theme instances keyed by name. Must include at least `light` and `dark`.
     *
     * @example
     * ```typescript
     * { light: customLightTheme, dark: customDarkTheme }
     * ```
     */
    themes: { light: AnyBuiltTheme; dark: AnyBuiltTheme } & Record<string, AnyBuiltTheme>;

    /**
     * Which theme to activate on startup (default: 'light').
     */
    initialTheme?: string;
}

/**
 * Configure the theme system. Call this **once** at app startup,
 * before any component renders.
 *
 * This replaces the need to import `StyleSheet` from `react-native-unistyles` directly.
 *
 * @example
 * ```typescript
 * import { configureThemes, lightTheme, darkTheme, fromTheme } from '@idealyst/theme';
 *
 * const light = fromTheme(lightTheme).build();
 * const dark  = fromTheme(darkTheme).build();
 *
 * configureThemes({ themes: { light, dark } });
 * ```
 *
 * @example
 * ```typescript
 * // With a custom initial theme
 * configureThemes({
 *   themes: { light, dark, midnight },
 *   initialTheme: 'midnight',
 * });
 * ```
 */
export function configureThemes(options: ConfigureThemesOptions): void {
    StyleSheet.configure({
        themes: options.themes as Record<string, object> as UnistylesThemes,
        settings: {
            initialTheme: (options.initialTheme ?? 'light') as keyof UnistylesThemes,
        },
    });
}

/**
 * Get the current system/device color scheme preference.
 *
 * @returns 'light', 'dark', or null if not available
 *
 * @example
 * ```typescript
 * const scheme = getColorScheme();
 * if (scheme) {
 *   console.log(scheme); // 'dark'
 * }
 * ```
 */
export function getColorScheme(): ColorScheme | null {
    const scheme = UnistylesRuntime.colorScheme;
    if (scheme === 'light' || scheme === 'dark') {
        return scheme;
    }
    return null;
}

/**
 * Theme settings controller — wraps Unistyles runtime for theme management.
 *
 * Use this instead of importing `UnistylesRuntime` directly.
 */
export const ThemeSettings = {
    /**
     * Set the active theme by name with content color scheme.
     *
     * @param themeName - The theme name to activate (e.g. 'light', 'dark')
     * @param contentColor - The content color scheme ('light' or 'dark')
     * @param animated - Whether to animate the status bar transition (default: false)
     *
     * @example
     * ```typescript
     * ThemeSettings.setTheme('dark', 'dark');
     * ThemeSettings.setTheme('light', 'light', true); // animated
     * ```
     */
    setTheme(themeName: string, contentColor: ColorScheme, animated: boolean = false): void {
        UnistylesRuntime.setTheme(themeName as any);
        UnistylesRuntime.setRootViewBackgroundColor(
            contentColor === 'dark' ? '#000000' : '#ffffff'
        );
        UnistylesRuntime.statusBar.setStyle((contentColor === 'dark' ? 'light' : 'dark') as any, animated);
    },

    /**
     * Get the name of the currently active theme.
     *
     * @returns The current theme name (e.g. 'light', 'dark')
     *
     * @example
     * ```typescript
     * const current = ThemeSettings.getThemeName(); // 'dark'
     * ```
     */
    getThemeName(): string {
        return String(UnistylesRuntime.themeName);
    },

    /**
     * Enable or disable adaptive (system-following) themes.
     *
     * When enabled, the theme automatically switches to match the device's
     * light/dark mode setting.
     *
     * @param enabled - Whether to follow the system theme
     *
     * @example
     * ```typescript
     * ThemeSettings.setAdaptiveThemes(true);  // follow system
     * ThemeSettings.setAdaptiveThemes(false); // manual control
     * ```
     */
    setAdaptiveThemes(enabled: boolean): void {
        UnistylesRuntime.setAdaptiveThemes(enabled);
    },
};

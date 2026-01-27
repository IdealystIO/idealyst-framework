import { UnistylesRuntime } from 'react-native-unistyles';

/**
 * Color scheme preference type.
 */
export type ColorScheme = 'light' | 'dark';

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
 * Theme settings controller - wraps Unistyles runtime for theme management.
 */
export const ThemeSettings = {
    /**
     * Set the active theme by name with content color scheme.
     *
     * @param themeName - The theme name to activate
     * @param contentColor - The content color scheme ('light' or 'dark')
     * @param animated - Whether to animate the status bar transition (default: false)
     *
     * @example
     * ```typescript
     * ThemeSettings.setTheme('darkBlue', 'dark');
     * ThemeSettings.setTheme('light', 'light', true); // animated
     * ```
     */
    setTheme(themeName: string, contentColor: ColorScheme, animated: boolean = false): void {
        UnistylesRuntime.setTheme(themeName as any);
        UnistylesRuntime.setRootViewBackgroundColor(
            contentColor === 'dark' ? '#000000' : '#ffffff'
        );
        UnistylesRuntime.statusBar.setStyle(contentColor === 'dark' ? 'light' : 'dark', animated);
    },
};

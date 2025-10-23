import { StyleSheet } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { defaultLightTheme as lightTheme, defaultDarkTheme as darkTheme } from './defaultThemes';
import { newTheme } from './newTheme';

// Create augmented themes with newTheme structure
const lightThemeWithSizes = { ...lightTheme, newTheme };
const darkThemeWithSizes = { ...darkTheme, newTheme };

// Export enhanced theme types
export type AppTheme = typeof lightThemeWithSizes;
export type AppIntents = typeof lightTheme.intents;
export type AppColors = typeof lightTheme.colors;
export type AppPalettes = typeof lightTheme.palettes;

// Utility types to extract keys from theme
export type ThemeIntentKeys = keyof AppIntents;
export type ThemeColorKeys = keyof AppColors;

// Unistyles v3 themes declaration
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof lightThemeWithSizes;
    dark: typeof darkThemeWithSizes;
  }

  export interface UnistylesBreakpoints {
    xs: typeof breakpoints.xs;
    sm: typeof breakpoints.sm;
    md: typeof breakpoints.md;
    lg: typeof breakpoints.lg;
    xl: typeof breakpoints.xl;
  }
}


StyleSheet.configure({
    settings: {
        initialTheme: 'light',
    },
    breakpoints,
    themes: {
      light: lightThemeWithSizes,
      dark: darkThemeWithSizes,
    }
})
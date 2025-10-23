import { StyleSheet } from 'react-native-unistyles';
import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';

// Export enhanced theme types
export type AppTheme = typeof lightTheme;
export type AppIntents = typeof lightTheme.intents;
export type AppColors = typeof lightTheme.colors;

// Utility types to extract keys from theme
export type ThemeIntentKeys = keyof AppIntents;
export type ThemeColorKeys = keyof AppColors;

// Unistyles v3 themes declaration
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof lightTheme;
    dark: typeof darkTheme;
  }
}


StyleSheet.configure({
    settings: {
        initialTheme: 'light',
    },
    themes: {
      light: lightTheme,
      dark: darkTheme,
    }
})
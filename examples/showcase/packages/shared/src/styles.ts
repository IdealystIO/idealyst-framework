import { lightTheme, darkTheme, fromTheme } from '@idealyst/theme';
import { StyleSheet } from 'react-native-unistyles';

// Build themes using fromTheme() for proper babel plugin analysis
export const customLightTheme = fromTheme(lightTheme).build();

// Define AppTheme type based on customLightTheme (dark theme should conform)
type AppTheme = typeof customLightTheme

export const customDarkTheme: AppTheme = fromTheme(darkTheme).build();

// Register theme in Idealyst Theme Registry for type safety
declare module '@idealyst/theme' {
  interface CustomThemeRegistry {
    theme: AppTheme;
  }
}

// Extend UnistylesThemes type declaration
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
}

// Configure Unistyles with standard Idealyst themes
StyleSheet.configure({
  themes: {
    light: customLightTheme,
    dark: customDarkTheme,
  },
  settings: {
    initialTheme: 'light',
  },
});

// Export theme names for easy reference
export const availableThemes = ['light', 'dark'] as const;
export type AvailableTheme = (typeof availableThemes)[number];

// Helper function to toggle theme
export function toggleTheme(currentTheme: string): AvailableTheme {
  return currentTheme === 'light' ? 'dark' : 'light';
}
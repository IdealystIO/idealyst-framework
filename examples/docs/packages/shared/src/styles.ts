import { lightTheme, darkTheme, fromTheme } from '@idealyst/theme';
import { StyleSheet } from 'react-native-unistyles';

// Build custom themes with type-safe additions using fromTheme()
export const customLightTheme = fromTheme(lightTheme).build();

// Build dark theme with same additions
export const customDarkTheme = fromTheme(darkTheme).build()

// CRITICAL: Configure Unistyles BEFORE any StyleSheet.create calls
StyleSheet.configure({
  themes: {
    light: customLightTheme,
    dark: customDarkTheme,
  },
  breakpoints: lightTheme.breakpoints,
  settings: {
    initialTheme: 'light',
  },
});

// Export theme names for easy reference
export const availableThemes = [
'light',
  'dark', 
  'lightHighContrast',
  'darkHighContrast'
] as const;

export type AvailableTheme = typeof availableThemes[number];
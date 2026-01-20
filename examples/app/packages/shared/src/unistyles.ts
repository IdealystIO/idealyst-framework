import { lightTheme, darkTheme, fromTheme } from '@idealyst/theme';
import { StyleSheet } from 'react-native-unistyles';

// Build custom themes with type-safe additions using fromTheme()
export const customLightTheme = fromTheme(lightTheme)
  .addIntent('brand', {
    primary: '#6366f1',
    contrast: '#ffffff',
    light: '#818cf8',
    dark: '#4f46e5',
  })
  .addIntent('accent', {
    primary: '#f59e0b',
    contrast: '#000000',
    light: '#fbbf24',
    dark: '#d97706',
  })
  .addSurfaceColor('highlight', '#FF0000')

  .addRadius('2xl', 24)
  .addRadius('full', 9999)
  .build();

// Build dark theme with same additions
export const customDarkTheme = fromTheme(darkTheme)
  .addIntent('brand', {
    primary: '#818cf8',
    contrast: '#000000',
    light: '#6366f1',
    dark: '#4f46e5',
  })
  .addIntent('accent', {
    primary: '#fbbf24',
    contrast: '#000000',
    light: '#f59e0b',
    dark: '#d97706',
  })
  .addSurfaceColor('highlight', '#FF0000')
  .addRadius('full', 9999)
  .build();

// CRITICAL: Configure Unistyles BEFORE any StyleSheet.create calls
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
export const availableThemes = [
  'light',
  'dark', 
  'lightHighContrast',
  'darkHighContrast'
] as const;

export type AvailableTheme = typeof availableThemes[number];

// Helper function to get next theme in rotation
export function getNextTheme(currentTheme: string): AvailableTheme {
  const currentIndex = availableThemes.indexOf(currentTheme as AvailableTheme);
  const nextIndex = (currentIndex + 1) % availableThemes.length;
  return availableThemes[nextIndex];
}

// Helper function to get theme display name
export function getThemeDisplayName(theme: string): string {
  switch (theme) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'lightHighContrast':
      return 'Light High Contrast';
    case 'darkHighContrast':
      return 'Dark High Contrast';
    default:
      return theme;
  }
}

// Helper function to check if theme is high contrast
export function isHighContrastTheme(theme: string): boolean {
  return theme.includes('HighContrast');
}

// Helper function to get matching theme mode
export function getThemeMode(theme: string): 'light' | 'dark' {
  return theme.includes('dark') ? 'dark' : 'light';
}

// Helper function to get high contrast variant of current theme
export function getHighContrastVariant(theme: string): AvailableTheme {
  const mode = getThemeMode(theme);
  return mode === 'dark' ? 'darkHighContrast' : 'lightHighContrast';
}

// Helper function to get standard variant of current theme
export function getStandardVariant(theme: string): AvailableTheme {
  const mode = getThemeMode(theme);
  return mode === 'dark' ? 'dark' : 'light';
}
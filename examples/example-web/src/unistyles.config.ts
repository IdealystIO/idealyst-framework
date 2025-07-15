// Local Unistyles configuration for testing npm packages
// This avoids the circular dependency issue in the published @idealyst/theme@1.0.12
import { StyleSheet } from 'react-native-unistyles';
import { breakpoints, defaultLightTheme, defaultDarkTheme } from '@idealyst/theme';

// Note: Module declarations are already handled by the navigation package

// Configure Unistyles with the themes
StyleSheet.configure({
  settings: {
    initialTheme: 'light',
  },
  breakpoints,
  themes: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
    lightHighContrast: defaultLightTheme, // Placeholder for now
    darkHighContrast: defaultDarkTheme, // Placeholder for now
  }
});

// Export for reference
export { breakpoints, defaultLightTheme, defaultDarkTheme }; 
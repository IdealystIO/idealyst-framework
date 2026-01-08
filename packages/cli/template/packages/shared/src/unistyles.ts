/**
 * Theme configuration for Unistyles.
 *
 * This file must be imported BEFORE any @idealyst/components to ensure
 * the theme is registered before stylesheets are created.
 *
 * Customize your themes here by extending the base Idealyst themes.
 */
import { StyleSheet } from 'react-native-unistyles';
import { fromTheme, lightTheme, darkTheme } from '@idealyst/theme';

// Create custom themes by extending the base themes
// You can use .addIntent(), .addRadius(), .addShadow(), .setSizes() to customize
const customLightTheme = fromTheme(lightTheme)
  // Example: Add custom intents
  // .addIntent('brand', {
  //   primary: '#6366f1',
  //   secondary: '#8b5cf6',
  //   contrast: '#ffffff',
  // })
  .build();

const customDarkTheme = fromTheme(darkTheme)
  // Example: Add custom intents (should match light theme)
  // .addIntent('brand', {
  //   primary: '#818cf8',
  //   secondary: '#a78bfa',
  //   contrast: '#000000',
  // })
  .build();

// Register custom theme type for TypeScript inference
declare module '@idealyst/theme' {
  interface CustomThemeRegistry {
    theme: typeof customLightTheme;
  }
}

// Configure Unistyles with your themes
StyleSheet.configure({
  settings: {
    initialTheme: 'light',
    // Enable adaptive themes to follow system preference
    // adaptiveThemes: true,
  },
  themes: {
    light: customLightTheme,
    dark: customDarkTheme,
  },
});

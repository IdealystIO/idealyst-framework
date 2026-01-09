import { Theme } from './theme';

// Extract breakpoints type from theme
type ThemeBreakpoints = Theme extends { breakpoints: infer B } ? B : Record<string, number>;

// Unistyles v3 themes declaration
// Apps should configure their own themes via StyleSheet.configure()
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: Theme;
    dark: Theme;
    // Apps can add more themes via module augmentation
    [key: string]: Theme;
  }

  // Breakpoints declaration - derives from theme breakpoints
  export interface UnistylesBreakpoints extends ThemeBreakpoints {}
}

// Export for type checking
export const THEME_TYPES_DECLARED = true;
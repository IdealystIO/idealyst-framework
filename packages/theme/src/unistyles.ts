import { Theme } from './theme';

// Unistyles v3 themes declaration
// Apps should configure their own themes via StyleSheet.configure()
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: Theme;
    dark: Theme;
    // Apps can add more themes via module augmentation
    [key: string]: Theme;
  }
}

// Export for type checking
export const THEME_TYPES_DECLARED = true;
/**
 * Global type declarations for the components package.
 * Sets up Unistyles theme types.
 */
import { Theme } from '@idealyst/theme';

// Declare UnistylesThemes to match @idealyst/theme
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: Theme;
    dark: Theme;
  }
}

// Force this module to be included
export {};

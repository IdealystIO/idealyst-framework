import { StyleSheet } from 'react-native-unistyles';
import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';
import { Theme } from './theme';

// Unistyles v3 themes declaration
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: Theme;
    dark: Theme;
  }
}

// Export something to ensure this module is included in compilation
export const unistylesConfigured = true;

StyleSheet.configure({
    settings: {
        initialTheme: 'light',
    },
    themes: {
      light: lightTheme,
      dark: darkTheme,
    }
})
import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';

function generateBackgroundVariants(theme: Theme) {
  return {
    primary: { backgroundColor: theme.colors.surface.primary },
    secondary: { backgroundColor: theme.colors.surface.secondary },
    tertiary: { backgroundColor: theme.colors.surface.tertiary },
    inverse: { backgroundColor: theme.colors.surface.inverse },
    'inverse-secondary': { backgroundColor: theme.colors.surface['inverse-secondary'] },
    'inverse-tertiary': { backgroundColor: theme.colors.surface['inverse-tertiary'] },
    transparent: { backgroundColor: 'transparent' },
  }
}

function generatePaddingVariants() {
  return {
    none: { padding: 0 },
    sm: { padding: 8 },
    md: { padding: 16 },
    lg: { padding: 24 },
    xl: { padding: 32 },
  }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const screenStyles = StyleSheet.create((theme: Theme) => {
  return {
    screen: {
      flex: 1,
      backgroundColor: theme.colors.surface.primary,
      variants: {
        background: generateBackgroundVariants(theme),
        padding: generatePaddingVariants(),
      },
      _web: {
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        boxSizing: 'border-box',
      },
    },
  };
});

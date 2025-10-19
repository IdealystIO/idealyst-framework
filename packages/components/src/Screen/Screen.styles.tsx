import { StyleSheet } from 'react-native-unistyles';

export const screenStyles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    // Default background color as fallback
    backgroundColor: theme.colors.surface.primary,
    variants: {
      background: {
        transparent: {
          backgroundColor: 'transparent',
        },
        primary: {
          backgroundColor: theme.colors.surface.primary,
        },
        secondary: {
          backgroundColor: theme.colors.surface.secondary,
        },
        tertiary: {
          backgroundColor: theme.colors.surface.tertiary,
        },
        elevated: {
          backgroundColor: theme.colors.surface.elevated,
        },
        overlay: {
          backgroundColor: theme.colors.surface.overlay,
        },
        inverse: {
          backgroundColor: theme.colors.surface.inverse,
        },
        'inverse-secondary': {
          backgroundColor: theme.colors.surface.inverse,
          opacity: 0.9,
        },
        'inverse-tertiary': {
          backgroundColor: theme.colors.surface.inverse,
          opacity: 0.7,
        },
      },
      padding: {
        none: {
          padding: 0,
        },
        sm: {
          padding: theme.spacing.sm,
        },
        md: {
          padding: theme.spacing.md,
        },
        lg: {
          padding: theme.spacing.lg,
        },
        xl: {
          padding: theme.spacing.xl,
        },
      },
      safeArea: {
        true: {
          paddingTop: theme.spacing.lg, // Safe area top
          paddingBottom: theme.spacing.lg, // Safe area bottom
        },
        false: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    // Web-specific styles
    _web: {
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      boxSizing: 'border-box',
    },
  },
})); 
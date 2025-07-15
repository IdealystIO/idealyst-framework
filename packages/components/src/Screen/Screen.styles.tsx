import { StyleSheet } from 'react-native-unistyles';

export const screenStyles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    // Default background color as fallback
    backgroundColor: theme.colors.surface.primary,
    variants: {
      background: {
        primary: {
          backgroundColor: theme.colors.surface.primary,
        },
        secondary: {
          backgroundColor: theme.colors.surface.secondary,
        },
        tertiary: {
          backgroundColor: theme.colors.surface.tertiary,
        },
        inverse: {
          backgroundColor: theme.colors.surface.inverse,
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
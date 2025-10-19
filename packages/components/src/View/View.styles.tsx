import { StyleSheet } from "react-native-unistyles";

const viewStyles = StyleSheet.create((theme) => ({
  view: {
    variants: {
      spacing: {
        none: {
          padding: 0,
        },
        xs: {
          padding: theme.spacing.xs,
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
      margin: {
        none: {
          margin: 0,
        },
        xs: {
          margin: theme.spacing.xs,
        },
        sm: {
          margin: theme.spacing.sm,
        },
        md: {
          margin: theme.spacing.md,
        },
        lg: {
          margin: theme.spacing.lg,
        },
        xl: {
          margin: theme.spacing.xl,
        },
      },
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
      radius: {
        none: {
          borderRadius: 0,
        },
        xs: {
          borderRadius: theme.borderRadius.xs,
        },
        sm: {
          borderRadius: theme.borderRadius.sm,
        },
        md: {
          borderRadius: theme.borderRadius.md,
        },
        lg: {
          borderRadius: theme.borderRadius.lg,
        },
        xl: {
          borderRadius: theme.borderRadius.xl,
        },
      },
      border: {
        none: {
          borderWidth: 0,
        },
        thin: {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        thick: {
          borderWidth: 2,
          borderColor: theme.colors.border,
        },
      },
    },
    // Web-specific styles
    _web: {
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
  },
}));

export default viewStyles; 
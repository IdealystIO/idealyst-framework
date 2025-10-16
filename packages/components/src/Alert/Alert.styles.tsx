import { StyleSheet } from 'react-native-unistyles';

export const alertStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderStyle: 'solid',

    variants: {
      variant: {
        filled: {},
        outlined: {},
        soft: {},
      },
      intent: {
        success: {},
        error: {},
        warning: {},
        info: {},
        neutral: {},
      },
    },

    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.main,
          borderColor: theme.intents.success.main,
        },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.main,
          borderColor: theme.intents.error.main,
        },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.main,
          borderColor: theme.intents.warning.main,
        },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: {
          backgroundColor: theme.intents.primary.main,
          borderColor: theme.intents.primary.main,
        },
      },
      {
        variant: 'filled',
        intent: 'neutral',
        styles: {
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.border.primary,
        },
      },
      // Outlined variants
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          backgroundColor: 'transparent',
          borderColor: theme.intents.success.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          backgroundColor: 'transparent',
          borderColor: theme.intents.error.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          backgroundColor: 'transparent',
          borderColor: theme.intents.warning.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: {
          backgroundColor: 'transparent',
          borderColor: theme.intents.primary.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
      },
      // Soft variants
      {
        variant: 'soft',
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.container,
          borderColor: theme.intents.success.container,
        },
      },
      {
        variant: 'soft',
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.container,
          borderColor: theme.intents.error.container,
        },
      },
      {
        variant: 'soft',
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.container,
          borderColor: theme.intents.warning.container,
        },
      },
      {
        variant: 'soft',
        intent: 'info',
        styles: {
          backgroundColor: theme.intents.primary.container,
          borderColor: theme.intents.primary.container,
        },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        styles: {
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.surface.secondary,
        },
      },
    ],
  },

  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 24,
    height: 24,

    variants: {
      variant: {
        filled: {},
        outlined: {},
        soft: {},
      },
      intent: {
        success: {},
        error: {},
        warning: {},
        info: {},
        neutral: {},
      },
    },

    compoundVariants: [
      // Filled variant colors
      {
        variant: 'filled',
        intent: 'success',
        styles: { color: theme.intents.success.onMain },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: { color: theme.intents.error.onMain },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: { color: theme.intents.warning.onMain },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: { color: theme.intents.primary.onMain },
      },
      {
        variant: 'filled',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      // Outlined and soft variants
      {
        variant: 'outlined',
        intent: 'success',
        styles: { color: theme.intents.success.main },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: { color: theme.intents.error.main },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: { color: theme.intents.warning.main },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: { color: theme.intents.primary.main },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'success',
        styles: { color: theme.intents.success.main },
      },
      {
        variant: 'soft',
        intent: 'error',
        styles: { color: theme.intents.error.main },
      },
      {
        variant: 'soft',
        intent: 'warning',
        styles: { color: theme.intents.warning.main },
      },
      {
        variant: 'soft',
        intent: 'info',
        styles: { color: theme.intents.primary.main },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
    ],
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: theme.typography.fontWeight.semibold,

    variants: {
      variant: {
        filled: {},
        outlined: {},
        soft: {},
      },
      intent: {
        success: {},
        error: {},
        warning: {},
        info: {},
        neutral: {},
      },
    },

    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        intent: 'success',
        styles: { color: theme.intents.success.onMain },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: { color: theme.intents.error.onMain },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: { color: theme.intents.warning.onMain },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: { color: theme.intents.primary.onMain },
      },
      {
        variant: 'filled',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      // Outlined and soft variants
      {
        variant: 'outlined',
        intent: 'success',
        styles: { color: theme.intents.success.main },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: { color: theme.intents.error.main },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: { color: theme.intents.warning.main },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: { color: theme.intents.primary.main },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'success',
        styles: { color: theme.intents.success.main },
      },
      {
        variant: 'soft',
        intent: 'error',
        styles: { color: theme.intents.error.main },
      },
      {
        variant: 'soft',
        intent: 'warning',
        styles: { color: theme.intents.warning.main },
      },
      {
        variant: 'soft',
        intent: 'info',
        styles: { color: theme.intents.primary.main },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
    ],
  },

  message: {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: 14,
    lineHeight: 20,

    variants: {
      variant: {
        filled: {},
        outlined: {},
        soft: {},
      },
      intent: {
        success: {},
        error: {},
        warning: {},
        info: {},
        neutral: {},
      },
    },

    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        intent: 'success',
        styles: { color: theme.intents.success.onMain },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: { color: theme.intents.error.onMain },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: { color: theme.intents.warning.onMain },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: { color: theme.intents.primary.onMain },
      },
      {
        variant: 'filled',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      // Outlined and soft variants
      {
        variant: 'outlined',
        intent: 'success',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'success',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'error',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'warning',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'info',
        styles: { color: theme.colors.text.primary },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        styles: { color: theme.colors.text.primary },
      },
    ],
  },

  actions: {
    marginTop: theme.spacing.xs,
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  closeButton: {
    padding: 4,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: theme.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    flexShrink: 0,

    _web: {
      _hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },

  closeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
}));

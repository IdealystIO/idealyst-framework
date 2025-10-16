import { StyleSheet } from 'react-native-unistyles';

export const chipStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    gap: 4,

    variants: {
      size: {
        small: {
          paddingHorizontal: 8,
          paddingVertical: 2,
          minHeight: 20,
          borderRadius: 999,
        },
        medium: {
          paddingHorizontal: 10,
          paddingVertical: 2,
          minHeight: 24,
          borderRadius: 999,
        },
        large: {
          paddingHorizontal: 12,
          paddingVertical: 3,
          minHeight: 28,
          borderRadius: 999,
        },
      },
      variant: {
        filled: {},
        outlined: {
          borderWidth: 1,
          backgroundColor: 'transparent',
        },
        soft: {},
      },
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
      selected: {
        true: {},
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {},
      },
    },

    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        intent: 'primary',
        selected: false,
        styles: {
          backgroundColor: theme.intents.primary.main,
        },
      },
      {
        variant: 'filled',
        intent: 'neutral',
        selected: false,
        styles: {
          backgroundColor: theme.colors.surface.secondary,
        },
      },
      {
        variant: 'filled',
        intent: 'success',
        selected: false,
        styles: {
          backgroundColor: theme.intents.success.main,
        },
      },
      {
        variant: 'filled',
        intent: 'error',
        selected: false,
        styles: {
          backgroundColor: theme.intents.error.main,
        },
      },
      {
        variant: 'filled',
        intent: 'warning',
        selected: false,
        styles: {
          backgroundColor: theme.intents.warning.main,
        },
      },

      // Outlined variants
      {
        variant: 'outlined',
        intent: 'primary',
        selected: false,
        styles: {
          borderColor: theme.intents.primary.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        selected: false,
        styles: {
          borderColor: theme.colors.border.primary,
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        selected: false,
        styles: {
          borderColor: theme.intents.success.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        selected: false,
        styles: {
          borderColor: theme.intents.error.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        selected: false,
        styles: {
          borderColor: theme.intents.warning.main,
        },
      },

      // Soft variants
      {
        variant: 'soft',
        intent: 'primary',
        selected: false,
        styles: {
          backgroundColor: theme.intents.primary.container,
        },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        selected: false,
        styles: {
          backgroundColor: theme.colors.surface.secondary,
        },
      },
      {
        variant: 'soft',
        intent: 'success',
        selected: false,
        styles: {
          backgroundColor: theme.intents.success.container,
        },
      },
      {
        variant: 'soft',
        intent: 'error',
        selected: false,
        styles: {
          backgroundColor: theme.intents.error.container,
        },
      },
      {
        variant: 'soft',
        intent: 'warning',
        selected: false,
        styles: {
          backgroundColor: theme.intents.warning.container,
        },
      },

      // Selected states
      {
        selected: true,
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents.primary.main,
          borderColor: theme.intents.primary.main,
        },
      },
      {
        selected: true,
        intent: 'neutral',
        styles: {
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.border.primary,
        },
      },
      {
        selected: true,
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.main,
          borderColor: theme.intents.success.main,
        },
      },
      {
        selected: true,
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.main,
          borderColor: theme.intents.error.main,
        },
      },
      {
        selected: true,
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.main,
          borderColor: theme.intents.warning.main,
        },
      },
    ],
  },

  label: {
    fontFamily: theme.typography.fontFamily.medium,

    variants: {
      size: {
        small: {
          fontSize: 11,
          lineHeight: 14,
        },
        medium: {
          fontSize: 12,
          lineHeight: 16,
        },
        large: {
          fontSize: 14,
          lineHeight: 18,
        },
      },
      variant: {
        filled: {
          color: theme.colors.text.inverse,
        },
        outlined: {},
        soft: {},
      },
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
      selected: {
        true: {
          color: theme.colors.text.inverse,
        },
        false: {},
      },
    },

    compoundVariants: [
      // Outlined text colors
      {
        variant: 'outlined',
        intent: 'primary',
        selected: false,
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        selected: false,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        selected: false,
        styles: {
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        selected: false,
        styles: {
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        selected: false,
        styles: {
          color: theme.intents.warning.main,
        },
      },

      // Soft text colors
      {
        variant: 'soft',
        intent: 'primary',
        selected: false,
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        selected: false,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      {
        variant: 'soft',
        intent: 'success',
        selected: false,
        styles: {
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'soft',
        intent: 'error',
        selected: false,
        styles: {
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'soft',
        intent: 'warning',
        selected: false,
        styles: {
          color: theme.intents.warning.main,
        },
      },
    ],
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      size: {
        small: {
          width: 12,
          height: 12,
        },
        medium: {
          width: 14,
          height: 14,
        },
        large: {
          width: 16,
          height: 16,
        },
      },
      variant: {
        filled: {
          color: theme.colors.text.inverse,
        },
        outlined: {},
        soft: {},
      },
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
      selected: {
        true: {
          color: theme.colors.text.inverse,
        },
        false: {},
      },
    },

    compoundVariants: [
      // Outlined icon colors
      {
        variant: 'outlined',
        intent: 'primary',
        selected: false,
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        selected: false,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        selected: false,
        styles: {
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        selected: false,
        styles: {
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        selected: false,
        styles: {
          color: theme.intents.warning.main,
        },
      },

      // Soft icon colors
      {
        variant: 'soft',
        intent: 'primary',
        selected: false,
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'soft',
        intent: 'neutral',
        selected: false,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      {
        variant: 'soft',
        intent: 'success',
        selected: false,
        styles: {
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'soft',
        intent: 'error',
        selected: false,
        styles: {
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'soft',
        intent: 'warning',
        selected: false,
        styles: {
          color: theme.intents.warning.main,
        },
      },
    ],
  },

  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginLeft: 4,
    borderRadius: 12,

    variants: {
      size: {
        small: {
          width: 12,
          height: 12,
        },
        medium: {
          width: 14,
          height: 14,
        },
        large: {
          width: 16,
          height: 16,
        },
      },
    },
  },

  deleteIcon: {
    variants: {
      size: {
        small: {
          fontSize: 10,
        },
        medium: {
          fontSize: 11,
        },
        large: {
          fontSize: 12,
        },
      },
    },
  },
}));

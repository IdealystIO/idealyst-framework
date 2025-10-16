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
          paddingHorizontal: 10,
          paddingVertical: 2,
          minHeight: 24,
          borderRadius: 999,
        },
        medium: {
          paddingHorizontal: 14,
          paddingVertical: 4,
          minHeight: 32,
          borderRadius: 999,
        },
        large: {
          paddingHorizontal: 18,
          paddingVertical: 6,
          minHeight: 40,
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
          fontSize: 12,
          lineHeight: 16,
        },
        medium: {
          fontSize: 14,
          lineHeight: 20,
        },
        large: {
          fontSize: 16,
          lineHeight: 24,
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
          fontSize: 14,
        },
        medium: {
          fontSize: 16,
        },
        large: {
          fontSize: 18,
        },
      },
    },
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
          width: 14,
          height: 14,
        },
        medium: {
          width: 16,
          height: 16,
        },
        large: {
          width: 18,
          height: 18,
        },
      },
    },
  },

  deleteIcon: {
    variants: {
      size: {
        small: {
          fontSize: 12,
        },
        medium: {
          fontSize: 14,
        },
        large: {
          fontSize: 16,
        },
      },
    },
  },
}));

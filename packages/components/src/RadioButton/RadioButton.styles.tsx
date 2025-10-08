import { StyleSheet } from 'react-native-unistyles';

export const radioButtonStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },

  radio: {
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.primary,
    transition: 'all 0.2s ease',

    variants: {
      size: {
        small: {
          width: 14,
          height: 14,
        },
        medium: {
          width: 18,
          height: 18,
        },
        large: {
          width: 22,
          height: 22,
        },
      },
      checked: {
        true: {},
        false: {},
      },
      intent: {
        primary: {},
        success: {},
        error: {},
        warning: {},
        neutral: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          backgroundColor: theme.colors.surface.disabled,
        },
        false: {
          opacity: 1,
          backgroundColor: theme.colors.surface.primary,
        },
      },
    },

    compoundVariants: [
      // Unchecked states - lighter border for unselected state
      {
        checked: false,
        intent: 'primary',
        styles: {
          borderColor: theme.palettes.gray[400],
        },
      },
      {
        checked: false,
        intent: 'success',
        styles: {
          borderColor: theme.palettes.gray[400],
        },
      },
      {
        checked: false,
        intent: 'error',
        styles: {
          borderColor: theme.palettes.gray[400],
        },
      },
      {
        checked: false,
        intent: 'warning',
        styles: {
          borderColor: theme.palettes.gray[400],
        },
      },
      {
        checked: false,
        intent: 'neutral',
        styles: {
          borderColor: theme.palettes.gray[400],
        },
      },
      // Checked states
      {
        checked: true,
        intent: 'primary',
        styles: {
          borderColor: theme.intents.primary.main,
        },
      },
      {
        checked: true,
        intent: 'success',
        styles: {
          borderColor: theme.intents.success.main,
        },
      },
      {
        checked: true,
        intent: 'error',
        styles: {
          borderColor: theme.intents.error.main,
        },
      },
      {
        checked: true,
        intent: 'warning',
        styles: {
          borderColor: theme.intents.warning.main,
        },
      },
      {
        checked: true,
        intent: 'neutral',
        styles: {
          borderColor: theme.intents.neutral.main,
        },
      },
    ],
  },

  radioDot: {
    borderRadius: theme.borderRadius.full,

    variants: {
      size: {
        small: {
          width: 10,
          height: 10,
        },
        medium: {
          width: 12,
          height: 12,
        },
        large: {
          width: 16,
          height: 16,
        },
      },
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
        },
        success: {
          backgroundColor: theme.intents.success.main,
        },
        error: {
          backgroundColor: theme.intents.error.main,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
        },
        neutral: {
          backgroundColor: theme.intents.neutral.main,
        },
      },
    },
  },

  label: {
    fontSize: 14,
    color: theme.colors.text.primary,

    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {
          opacity: 1,
        },
      },
    },
  },

  groupContainer: {
    gap: theme.spacing.xs,

    variants: {
      orientation: {
        horizontal: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing.md,
        },
        vertical: {
          flexDirection: 'column',
        },
      },
    },
  },
}));
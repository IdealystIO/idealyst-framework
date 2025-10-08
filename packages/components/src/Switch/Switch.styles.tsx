import { StyleSheet } from 'react-native-unistyles';

export const switchStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  switchContainer: {
    justifyContent: 'center',
  },
  switchTrack: {
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    transition: 'background-color 0.2s ease',

    variants: {
      size: {
        small: {
          width: 36,
          height: 20,
        },
        medium: {
          width: 44,
          height: 24,
        },
        large: {
          width: 52,
          height: 28,
        },
      },
      checked: {
        true: {},
        false: {
          backgroundColor: theme.palettes.gray[300],
        },
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
        },
        false: {
          opacity: 1,
        },
      },
    },

    compoundVariants: [
      {
        checked: true,
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents.primary.main,
        },
      },
      {
        checked: true,
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.main,
        },
      },
      {
        checked: true,
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.main,
        },
      },
      {
        checked: true,
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.main,
        },
      },
      {
        checked: true,
        intent: 'neutral',
        styles: {
          backgroundColor: theme.intents.neutral.main,
        },
      },
    ],
  },

  switchThumb: {
    position: 'absolute',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.full,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease',
    top: '50%',
    transform: 'translateY(-50%)',

    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
          left: 2,
        },
        medium: {
          width: 20,
          height: 20,
          left: 2,
        },
        large: {
          width: 24,
          height: 24,
          left: 2,
        },
      },
      checked: {
        true: {},
        false: {},
      },
    },

    compoundVariants: [
      {
        size: 'small',
        checked: true,
        styles: {
          transform: 'translateY(-50%) translateX(16px)',
        },
      },
      {
        size: 'small',
        checked: false,
        styles: {
          transform: 'translateY(-50%) translateX(0)',
        },
      },
      {
        size: 'medium',
        checked: true,
        styles: {
          transform: 'translateY(-50%) translateX(20px)',
        },
      },
      {
        size: 'medium',
        checked: false,
        styles: {
          transform: 'translateY(-50%) translateX(0)',
        },
      },
      {
        size: 'large',
        checked: true,
        styles: {
          transform: 'translateY(-50%) translateX(24px)',
        },
      },
      {
        size: 'large',
        checked: false,
        styles: {
          transform: 'translateY(-50%) translateX(0)',
        },
      },
    ],
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
      position: {
        left: {
          marginRight: theme.spacing.sm,
        },
        right: {
          marginLeft: theme.spacing.sm,
        },
      },
    },
  },
}));
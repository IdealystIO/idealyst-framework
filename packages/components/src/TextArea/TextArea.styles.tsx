import { StyleSheet } from 'react-native-unistyles';

export const textAreaStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },

  label: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,

    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {},
      },
    },
  },

  textareaContainer: {
    position: 'relative',
  },

  textarea: {
    width: '100%',
    fontFamily: 'inherit',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    lineHeight: 'normal',
    boxSizing: 'border-box',
    overflowY: 'hidden',

    variants: {
      size: {
        small: {
          fontSize: 14,
          padding: 8,
          lineHeight: 20,
        },
        medium: {
          fontSize: 16,
          padding: 12,
          lineHeight: 24,
        },
        large: {
          fontSize: 18,
          padding: 16,
          lineHeight: 28,
        },
      },
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
          backgroundColor: theme.colors.surface.secondary,
        },
        false: {},
      },
      hasError: {
        true: {
          borderColor: theme.intents.error.main,
        },
        false: {},
      },
      resize: {
        none: {
          resize: 'none',
        },
        vertical: {
          resize: 'vertical',
        },
        horizontal: {
          resize: 'horizontal',
        },
        both: {
          resize: 'both',
        },
      },
    },

    compoundVariants: [
      {
        disabled: false,
        hasError: false,
        intent: 'primary',
        styles: {
          ':focus': {
            borderColor: theme.intents.primary.main,
            boxShadow: `0 0 0 2px ${theme.intents.primary.main}33`,
          },
        },
      },
      {
        disabled: false,
        hasError: false,
        intent: 'success',
        styles: {
          borderColor: theme.intents.success.main,
          ':focus': {
            boxShadow: `0 0 0 2px ${theme.intents.success.main}33`,
          },
        },
      },
      {
        disabled: false,
        hasError: false,
        intent: 'warning',
        styles: {
          borderColor: theme.intents.warning.main,
          ':focus': {
            boxShadow: `0 0 0 2px ${theme.intents.warning.main}33`,
          },
        },
      },
      {
        disabled: false,
        hasError: false,
        intent: 'neutral',
        styles: {
          ':focus': {
            borderColor: theme.intents.neutral.main,
            boxShadow: `0 0 0 2px ${theme.intents.neutral.main}33`,
          },
        },
      },
    ],
  },

  helperText: {
    fontSize: 12,
    color: theme.colors.text.secondary,

    variants: {
      hasError: {
        true: {
          color: theme.intents.error.main,
        },
        false: {},
      },
    },
  },

  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  characterCount: {
    fontSize: 12,
    color: theme.colors.text.secondary,

    variants: {
      isNearLimit: {
        true: {
          color: theme.intents.warning.main,
        },
        false: {},
      },
      isAtLimit: {
        true: {
          color: theme.intents.error.main,
        },
        false: {},
      },
    },
  },
}));

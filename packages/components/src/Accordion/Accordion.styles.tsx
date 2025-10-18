import { StyleSheet } from 'react-native-unistyles';

export const accordionStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',

    variants: {
      variant: {
        default: {
          gap: 0,
        },
        separated: {
          gap: theme.spacing.sm,
        },
        bordered: {
          gap: 0,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
        },
      },
    },
  },

  item: {
    display: 'flex',
    flexDirection: 'column',

    variants: {
      variant: {
        default: {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
        },
        separated: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
        },
        bordered: {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
        },
      },
      isLast: {
        true: {},
        false: {},
      },
    },

    compoundVariants: [
      {
        variant: 'default',
        isLast: true,
        styles: {
          borderBottomWidth: 0,
        },
      },
      {
        variant: 'bordered',
        isLast: true,
        styles: {
          borderBottomWidth: 0,
        },
      },
    ],
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s ease',
    fontFamily: theme.typography.fontFamily.sans,
    color: theme.colors.text.primary,
    textAlign: 'left',

    variants: {
      size: {
        small: {
          fontSize: 14,
          padding: 10,
        },
        medium: {
          fontSize: 16,
          padding: 14,
        },
        large: {
          fontSize: 18,
          padding: 18,
        },
      },
      expanded: {
        true: {
          fontWeight: theme.typography.fontWeight.semibold,
        },
        false: {
          fontWeight: theme.typography.fontWeight.medium,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {
          ':hover': {
            backgroundColor: theme.colors.surface.secondary,
          },
        },
      },
    },
  },

  title: {
    flex: 1,
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
    marginLeft: theme.spacing.sm,

    variants: {
      expanded: {
        true: {
          transform: 'rotate(180deg)',
        },
        false: {
          transform: 'rotate(0deg)',
        },
      },
      intent: {
        primary: {
          color: theme.intents.primary.main,
        },
        neutral: {
          color: theme.intents.neutral.main,
        },
        success: {
          color: theme.intents.success.main,
        },
        error: {
          color: theme.intents.error.main,
        },
        warning: {
          color: theme.intents.warning.main,
        },
      },
    },
  },

  content: {
    overflow: 'hidden',
    transition: 'height 0.15s ease, padding 0.3s ease',

    variants: {
      expanded: {
        true: {
          maxHeight: 2000,
        },
        false: {
          maxHeight: 0,
        },
      },
    },
  },

  contentInner: {
    color: theme.colors.text.secondary,

    variants: {
      size: {
        small: {
          fontSize: 14,
          padding: 10,
          paddingTop: 0,
        },
        medium: {
          fontSize: 16,
          padding: 14,
          paddingTop: 0,
        },
        large: {
          fontSize: 18,
          padding: 18,
          paddingTop: 0,
        },
      },
    },
  },
}));

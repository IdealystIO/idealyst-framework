import { StyleSheet } from 'react-native-unistyles';

export const menuStyles = StyleSheet.create((theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },

  menu: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: 120,
    maxWidth: 400,
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },

  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: theme.borderRadius.sm,
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
          padding: 8,
        },
        medium: {
          fontSize: 16,
          padding: 10,
        },
        large: {
          fontSize: 18,
          padding: 12,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {
          _web: {
            ':hover': {
              backgroundColor: theme.colors.surface.secondary,
            },
          },
        },
      },
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
    },

    compoundVariants: [
      {
        disabled: false,
        intent: 'primary',
        styles: {
          _web: {
            ':hover': {
              backgroundColor: theme.intents.primary.container,
              color: theme.intents.primary.main,
            },
          },
        },
      },
      {
        disabled: false,
        intent: 'success',
        styles: {
          _web: {
            ':hover': {
              backgroundColor: theme.intents.success.container,
              color: theme.intents.success.main,
            },
          },
        },
      },
      {
        disabled: false,
        intent: 'error',
        styles: {
          _web: {
            ':hover': {
              backgroundColor: theme.intents.error.container,
              color: theme.intents.error.main,
            },
          },
        },
      },
      {
        disabled: false,
        intent: 'warning',
        styles: {
          _web: {
            ':hover': {
              backgroundColor: theme.intents.warning.container,
              color: theme.intents.warning.main,
            },
          },
        },
      },
    ],
  },

  menuItemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      intent: {
        primary: {
          color: theme.intents.primary.main,
        },
        neutral: {
          color: theme.colors.text.secondary,
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

  menuItemLabel: {
    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: theme.colors.border.primary,
    marginTop: 4,
    marginBottom: 4,
  },
}));

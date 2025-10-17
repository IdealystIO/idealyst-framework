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

    _web: {
      _hover: {
        backgroundColor: theme.colors.surface.secondary,
      },
    },

    variants: {
      size: {
        small: {
          fontSize: 14,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 8,
          paddingRight: 8,
        },
        medium: {
          fontSize: 16,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 12,
          paddingRight: 12,
        },
        large: {
          fontSize: 18,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {},
      },
      intent: {
        primary: {
          _web: {
            _hover: {
              backgroundColor: theme.intents.primary.container,
              color: theme.intents.primary.main,
            },
          },
        },
        neutral: {},
        success: {
          _web: {
            _hover: {
              backgroundColor: theme.intents.success.container,
              color: theme.intents.success.main,
            },
          },
        },
        error: {
          _web: {
            _hover: {
              backgroundColor: theme.intents.error.container,
              color: theme.intents.error.main,
            },
          },
        },
        warning: {
          _web: {
            _hover: {
              backgroundColor: theme.intents.warning.container,
              color: theme.intents.warning.main,
            },
          },
        },
      },
    },

    compoundVariants: [
      {
        disabled: true,
        styles: {
          _web: {
            _hover: {
              backgroundColor: 'transparent',
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
    flexShrink: 0,

    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
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

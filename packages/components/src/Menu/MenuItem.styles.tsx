import { StyleSheet } from 'react-native-unistyles';

export const menuItemStyles = StyleSheet.create((theme) => ({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.sm,
    minHeight: 44,

    _web: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      transition: 'background-color 0.2s ease',
      textAlign: 'left',

      _hover: {
        backgroundColor: theme.colors.surface.secondary,
      },
    },

    variants: {
      size: {
        sm: {
          paddingVertical: 6,
          paddingHorizontal: 8,
        },
        md: {
          paddingVertical: 10,
          paddingHorizontal: 12,
        },
        lg: {
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          _web: {
            cursor: 'not-allowed',
          },
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

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 12,

    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
          fontSize: 16,
        },
        md: {
          width: 20,
          height: 20,
          fontSize: 20,
        },
        lg: {
          width: 24,
          height: 24,
          fontSize: 24,
        },
      },
    },
  },

  label: {
    flex: 1,
    color: theme.colors.text.primary,

    variants: {
      size: {
        sm: {
          fontSize: 14,
        },
        md: {
          fontSize: 16,
        },
        lg: {
          fontSize: 18,
        },
      },
    },
  },
}));

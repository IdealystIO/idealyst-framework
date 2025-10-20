import { StyleSheet } from 'react-native-unistyles';

export const inputStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: theme.borderRadius.md,
    variants: {
      variant: {
        default: {
          backgroundColor: theme.colors.surface.primary,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          borderStyle: 'solid',
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.intents.primary.main,
          borderStyle: 'solid',
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
          },
        },
        filled: {
          backgroundColor: theme.colors.surface.secondary,
          borderWidth: 0,
          _web: {
            border: 'none',
          },
        },
        bare: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          _web: {
            border: 'none',
          },
        },
      },
      size: {
        small: {
          height: 36,
          paddingHorizontal: theme.spacing.xs,
        },
        medium: {
          height: 44,
          paddingHorizontal: theme.spacing.sm,
        },
        large: {
          height: 52,
          paddingHorizontal: theme.spacing.md,
        },
      },
      focused: {
        true: {},
        false: {},
      },
      hasError: {
        true: {
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
          },
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.6,
          backgroundColor: theme.colors.surface.secondary,
          _web: {
            cursor: 'not-allowed',
          },
        },
        false: {},
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        focused: true,
        styles: {
          borderColor: theme.intents.primary.main,
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
            boxShadow: `0 0 0 2px ${theme.intents.primary.main}20`,
          },
        },
      },
      {
        variant: 'outlined',
        focused: true,
        styles: {
          borderColor: theme.intents.primary.main,
          _web: {
            border: `2px solid ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'filled',
        focused: true,
        styles: {
          _web: {
            boxShadow: `0 0 0 2px ${theme.intents.primary.main}20`,
          },
        },
      },
      {
        hasError: true,
        focused: true,
        styles: {
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
            boxShadow: `0 0 0 2px ${theme.intents.error.main}20`,
          },
        },
      },
    ],
    _web: {
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      _hover: {
        borderColor: theme.intents.primary.main,
      },
    },
  },
  leftIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    variants: {
      size: {
        small: {
          marginRight: theme.spacing.xs,
        },
        medium: {
          marginRight: theme.spacing.xs,
        },
        large: {
          marginRight: theme.spacing.sm,
        },
      },
    },
  },
  rightIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    variants: {
      size: {
        small: {
          marginLeft: theme.spacing.xs,
        },
        medium: {
          marginLeft: theme.spacing.xs,
        },
        large: {
          marginLeft: theme.spacing.sm,
        },
      },
    },
  },
  leftIcon: {
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          fontSize: 16,
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          fontSize: 20,
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          fontSize: 24,
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  rightIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          fontSize: 16,
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          fontSize: 20,
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          fontSize: 24,
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  passwordToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    variants: {
      size: {
        small: {
          marginLeft: theme.spacing.xs,
        },
        medium: {
          marginLeft: theme.spacing.xs,
        },
        large: {
          marginLeft: theme.spacing.sm,
        },
      },
    },
    _web: {
      _hover: {
        opacity: 0.7,
      },
    },
  },
  passwordToggleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          fontSize: 16,
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          fontSize: 20,
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          fontSize: 24,
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.regular,
    variants: {
      size: {
        small: {
          fontSize: theme.typography.fontSize.sm,
        },
        medium: {
          fontSize: theme.typography.fontSize.md,
        },
        large: {
          fontSize: theme.typography.fontSize.lg,
        },
      },
    },
    _web: {
      outline: 'none',
      fontFamily: 'inherit',
    },
  },
})); 
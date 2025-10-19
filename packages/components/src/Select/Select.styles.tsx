import { StyleSheet } from 'react-native-unistyles';

export const selectStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',
  },

  label: {
    fontSize: theme.typography.sm.fontSize,
    fontWeight: theme.typography.sm.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  trigger: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    minHeight: 44,
    cursor: 'pointer',

    variants: {
      variant: {
        outlined: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        filled: {
          backgroundColor: theme.colors.surface.secondary,
          borderColor: 'transparent',
          _web: {
            border: '1px solid transparent',
          },
        },
      },
      size: {
        small: {
          paddingHorizontal: theme.spacing.xs,
          minHeight: 36,
        },
        medium: {
          paddingHorizontal: theme.spacing.sm,
          minHeight: 44,
        },
        large: {
          paddingHorizontal: theme.spacing.md,
          minHeight: 52,
        },
      },
      intent: {
        neutral: {},
        primary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
      disabled: {
        true: {
          opacity: 0.6,
          cursor: 'not-allowed',
          _web: {
            _hover: {
              borderColor: theme.colors.border.primary,
            },
          },
        },
        false: {},
      },
      error: {
        true: {
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
          },
        },
        false: {},
      },
      focused: {
        true: {
          borderColor: theme.intents.primary.main,
          _web: {
            border: `2px solid ${theme.intents.primary.main}`,
            outline: 'none',
          },
        },
        false: {},
      },
    },

    compoundVariants: [
      {
        variant: 'outlined',
        intent: 'primary',
        styles: {
          borderColor: theme.intents.primary.main,
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          borderColor: theme.intents.success.main,
          _web: {
            border: `1px solid ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          borderColor: theme.intents.warning.main,
          _web: {
            border: `1px solid ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: {
          borderColor: theme.intents.info.main,
          _web: {
            border: `1px solid ${theme.intents.info.main}`,
          },
        },
      },
    ],

    _web: {
      display: 'flex',
      boxSizing: 'border-box',
      _focus: {
        outline: 'none',
      },
      _hover: {
        borderColor: theme.intents.primary.main,
      },
    },
  },

  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  triggerText: {
    fontSize: theme.typography.base.fontSize,
    color: theme.colors.text.primary,
    flex: 1,
  },

  placeholder: {
    fontSize: theme.typography.base.fontSize,
    color: theme.colors.text.disabled,
  },

  icon: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },

  chevron: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
    color: theme.colors.text.secondary,
    transition: 'transform 0.2s ease',
    width: 20,
    height: 20,
  },

  chevronOpen: {
    transform: 'rotate(180deg)',
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors?.surface?.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    shadowColor: theme.shadows.lg.shadowColor,
    shadowOffset: theme.shadows.lg.shadowOffset,
    shadowOpacity: theme.shadows.lg.shadowOpacity,
    shadowRadius: theme.shadows.lg.shadowRadius,
    elevation: theme.shadows.lg.elevation,
    zIndex: 9999, // Higher z-index to float above other content
    maxHeight: 240,
    minWidth: 200,
    overflow: 'hidden',

    _web: {
      border: `1px solid ${theme.colors.border.primary}`,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
      overflowY: 'auto',
    },
  },

  searchContainer: {
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,

    _web: {
      borderBottom: `1px solid ${theme.colors.border.primary}`,
    },
  },

  searchInput: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    fontSize: theme.typography.sm.fontSize,
    backgroundColor: theme.colors?.surface?.primary,

    _web: {
      border: `1px solid ${theme.colors.border.primary}`,
      outline: 'none',
      _focus: {
        borderColor: theme.intents.primary.main,
      },
    },
  },

  optionsList: {
    paddingVertical: theme.spacing.xs,
  },

  option: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    minHeight: 36,

    variants: {
      selected: {
        true: {
          backgroundColor: theme.intents.primary.container,
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
          _web: {
            _hover: {
              backgroundColor: 'transparent',
            },
          },
        },
        false: {},
      },
    },

    _web: {
      display: 'flex',
      _hover: {
        backgroundColor: theme.colors.surface.secondary,
      },
    },
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionIcon: {
    marginRight: theme.spacing.xs,
  },

  optionText: {
    fontSize: theme.typography.base.fontSize,
    color: theme.colors.text.primary,
    flex: 1,
  },

  optionTextDisabled: {
    color: theme.colors.text.disabled,
  },

  helperText: {
    fontSize: theme.typography.xs.fontSize,
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,

    variants: {
      error: {
        true: {
          color: theme.intents.error.main,
        },
        false: {},
      },
    },
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,

    _web: {
      position: 'fixed',
    },
  },
}));
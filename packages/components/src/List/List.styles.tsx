import { StyleSheet } from 'react-native-unistyles';

export const listStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    variants: {
      variant: {
        default: {
          backgroundColor: 'transparent',
        },
        bordered: {
          backgroundColor: theme.colors.surface.primary,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        divided: {
          backgroundColor: 'transparent',
        },
      },
      scrollable: {
        true: {
          overflow: 'auto',
          _web: {
            overflowY: 'auto',
          },
        },
        false: {},
      },
    },
  },

  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    textAlign: 'left',
    _web: {
      _hover: {
        backgroundColor: theme.colors.interactive.hover,
        borderRadius: theme.borderRadius.sm,
      },
    },

    variants: {
      size: {
        sm: {
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm,
          minHeight: 32,
        },
        md: {
          padding: theme.spacing.md,
          minHeight: 44,
        },
        lg: {
          padding: theme.spacing.lg,
          minHeight: 52,
        },
      },
      variant: {
        default: {},
        bordered: {},
        divided: {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
          _web: {
            borderBottom: `1px solid ${theme.colors.border.primary}`,
          },
        },
      },
      active: {
        true: {
          backgroundColor: theme.colors.surface.secondary,
        },
        false: {},
      },
      selected: {
        true: {
          backgroundColor: theme.intents.primary.container,
          borderLeftWidth: 3,
          borderLeftColor: theme.intents.primary.main,
          _web: {
            borderLeft: `3px solid ${theme.intents.primary.main}`,
          },
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {},
      },
      clickable: {
        true: {},
        false: {
          cursor: 'default',
        },
      },
    },

    compoundVariants: [
      // Remove bottom border from last divided item
      {
        variant: 'divided',
        styles: {
          _web: {
            ':last-child': {
              borderBottom: 'none',
            },
          },
        },
      },
      // Disable hover when disabled
      {
        disabled: true,
        styles: {
          _web: {
            _hover: {
              backgroundColor: 'transparent',
              borderRadius: 0,
            },
          },
        },
      },
      // Disable hover when not clickable
      {
        clickable: false,
        styles: {
          _web: {
            _hover: {
              backgroundColor: 'transparent',
              borderRadius: 0,
            },
          },
        },
      },
    ],
  },

  itemContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },

  leading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    color: theme.colors.text.secondary,

    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
        },
        md: {
          width: 20,
          height: 20,
        },
        lg: {
          width: 24,
          height: 24,
        },
      },
    },
  },

  labelContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,

    variants: {
      size: {
        sm: {
          fontSize: 14,
          lineHeight: 20,
        },
        md: {
          fontSize: 16,
          lineHeight: 24,
        },
        lg: {
          fontSize: 18,
          lineHeight: 28,
        },
      },
      disabled: {
        true: {
          color: theme.colors.text.disabled,
        },
        false: {},
      },
      selected: {
        true: {
          color: theme.intents.primary.main,
          fontWeight: theme.typography.fontWeight.semibold,
        },
        false: {},
      },
    },
  },

  trailing: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    flexShrink: 0,
  },

  trailingIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
        },
        md: {
          width: 20,
          height: 20,
        },
        lg: {
          width: 24,
          height: 24,
        },
      },
    },
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
  },

  sectionTitle: {
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: theme.colors.text.secondary,
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },

  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

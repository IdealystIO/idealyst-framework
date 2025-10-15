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
    },
  },

  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    textAlign: 'left',

    variants: {
      size: {
        small: {
          padding: theme.spacing.sm,
          minHeight: 36,
        },
        medium: {
          padding: theme.spacing.md,
          minHeight: 44,
        },
        large: {
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
        false: {
          _web: {
            ':hover': {
              backgroundColor: theme.colors.surface.secondary,
            },
          },
        },
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
            ':hover': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      // Disable hover when not clickable
      {
        clickable: false,
        styles: {
          _web: {
            ':hover': {
              backgroundColor: 'transparent',
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
        small: {
          fontSize: 14,
          lineHeight: 20,
        },
        medium: {
          fontSize: 16,
          lineHeight: 24,
        },
        large: {
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

import { StyleSheet } from 'react-native-unistyles';

export const tableStyles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
    overflow: 'auto',

    variants: {
      variant: {
        default: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        bordered: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        striped: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
      },
    },
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.typography.fontFamily.sans,
  },

  thead: {
    backgroundColor: theme.colors.surface.secondary,

    variants: {
      sticky: {
        true: {
          position: 'sticky',
          top: 0,
          zIndex: 10,
        },
        false: {},
      },
    },
  },

  tbody: {},

  row: {
    transition: 'background-color 0.2s ease',

    variants: {
      variant: {
        default: {},
        bordered: {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
          _web: {
            borderBottom: `1px solid ${theme.colors.border.primary}`,
          },
        },
        striped: {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
          _web: {
            borderBottom: `1px solid ${theme.colors.border.primary}`,
            ':nth-child(even)': {
              backgroundColor: theme.colors.surface.secondary,
            },
          },
        },
      },
      clickable: {
        true: {
          cursor: 'pointer',
          _web: {
            ':hover': {
              backgroundColor: theme.colors.surface.secondary,
            },
          },
        },
        false: {},
      },
    },

    compoundVariants: [
      {
        variant: 'striped',
        clickable: true,
        styles: {
          _web: {
            ':hover': {
              backgroundColor: theme.colors.surface.tertiary,
            },
          },
        },
      },
    ],
  },

  headerCell: {
    textAlign: 'left',
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colors.border.primary,
    _web: {
      borderBottom: `2px solid ${theme.colors.border.primary}`,
    },

    variants: {
      size: {
        sm: {
          padding: theme.spacing.sm,
          fontSize: 13,
          lineHeight: 18,
        },
        md: {
          padding: theme.spacing.md,
          fontSize: 14,
          lineHeight: 20,
        },
        lg: {
          padding: theme.spacing.lg,
          fontSize: 15,
          lineHeight: 22,
        },
      },
      align: {
        left: {
          textAlign: 'left',
        },
        center: {
          textAlign: 'center',
        },
        right: {
          textAlign: 'right',
        },
      },
      variant: {
        default: {},
        bordered: {
          borderRightWidth: 1,
          borderRightStyle: 'solid',
          borderRightColor: theme.colors.border.primary,
          _web: {
            borderRight: `1px solid ${theme.colors.border.primary}`,
            ':last-child': {
              borderRight: 'none',
            },
          },
        },
        striped: {},
      },
    },
  },

  cell: {
    textAlign: 'left',
    color: theme.colors.text.primary,

    variants: {
      size: {
        sm: {
          padding: theme.spacing.sm,
          fontSize: 13,
          lineHeight: 18,
        },
        md: {
          padding: theme.spacing.md,
          fontSize: 14,
          lineHeight: 20,
        },
        lg: {
          padding: theme.spacing.lg,
          fontSize: 15,
          lineHeight: 22,
        },
      },
      align: {
        left: {
          textAlign: 'left',
        },
        center: {
          textAlign: 'center',
        },
        right: {
          textAlign: 'right',
        },
      },
      variant: {
        default: {},
        bordered: {
          borderRightWidth: 1,
          borderRightStyle: 'solid',
          borderRightColor: theme.colors.border.primary,
          _web: {
            borderRight: `1px solid ${theme.colors.border.primary}`,
            ':last-child': {
              borderRight: 'none',
            },
          },
        },
        striped: {},
      },
    },
  },
}));

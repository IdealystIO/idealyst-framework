import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles } from '@idealyst/theme';

type CellAlignment = 'left' | 'center' | 'right';

type DataGridVariants = {
  stickyHeader: boolean;
  virtualized: boolean;
  selected: boolean;
  clickable: boolean;
  alignment: CellAlignment;
};

export type ExpandedDataGridStyles = StylesheetStyles<keyof DataGridVariants>;

export type DataGridStylesheet = {
  container: ExpandedDataGridStyles;
  scrollView: ExpandedDataGridStyles;
  scrollViewContent: ExpandedDataGridStyles;
  table: ExpandedDataGridStyles;
  header: ExpandedDataGridStyles;
  headerRow: ExpandedDataGridStyles;
  headerCell: ExpandedDataGridStyles;
  headerText: ExpandedDataGridStyles;
  stickyHeaderWrapper: ExpandedDataGridStyles;
  row: ExpandedDataGridStyles;
  cell: ExpandedDataGridStyles;
  spacerRow: ExpandedDataGridStyles;
  spacerCell: ExpandedDataGridStyles;
};

/**
 * Generate DataGrid styles
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataGridStyles = StyleSheet.create(((theme: Theme) => {
  return {
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderStyle: 'solid',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      _web: {
        boxSizing: 'border-box',
      },
    },

    scrollView: {
      flex: 1,
    },

    scrollViewContent: {
      // Dynamic width set in component based on column widths
    },

    table: {
      // Dynamic width and height set in component
    },

    header: ({ stickyHeader }: DataGridVariants) => ({
      variants: {
        stickyHeader: {
          true: {
            _web: {
              position: 'sticky',
              top: 0,
              zIndex: 100,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            _native: {
              elevation: 4,
              zIndex: 100,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          },
          false: {},
        },
      },
    }),

    headerRow: ({ stickyHeader }: DataGridVariants) => ({
      backgroundColor: stickyHeader ? theme.colors.surface.primary : theme.colors.surface.secondary,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.border.secondary,
      borderStyle: 'solid',
      flexDirection: 'row',
      variants: {
        stickyHeader: {
          true: {
            backgroundColor: theme.colors.surface.primary,
          },
          false: {
            backgroundColor: theme.colors.surface.secondary,
          },
        },
      },
    }),

    headerCell: {
      padding: theme.sizes.view.md.spacing,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border.secondary,
      borderStyle: 'solid',
      _web: {
        boxSizing: 'border-box',
      },
    },

    headerText: ({ clickable }: DataGridVariants) => ({
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      variants: {
        clickable: {
          true: {
            _web: {
              cursor: 'pointer',
            },
          },
          false: {
            _web: {
              cursor: 'default',
            },
          },
        },
      },
    }),

    stickyHeaderWrapper: ({ stickyHeader }: DataGridVariants) => ({
      backgroundColor: theme.colors.surface.primary,
      variants: {
        stickyHeader: {
          true: {
            _web: {
              position: 'sticky',
              top: 0,
              zIndex: 100,
              backgroundColor: theme.colors.surface.primary,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            _native: {
              // Native doesn't support sticky positioning in the same way
              // We'd need a different implementation for RN
              zIndex: 100,
            },
          },
          false: {},
        },
      },
    }),

    row: ({ selected }: DataGridVariants) => ({
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      borderStyle: 'solid',
      backgroundColor: theme.colors.surface.primary,
      flexDirection: 'row',
      _web: {
        transition: 'background-color 0.2s ease',
      },
      variants: {
        selected: {
          true: {
            backgroundColor: theme.intents.primary.light,
          },
          false: {
            backgroundColor: theme.colors.surface.primary,
          },
        },
      },
    }),

    cell: ({ alignment }: DataGridVariants) => ({
      padding: theme.sizes.view.md.spacing,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border.primary,
      borderStyle: 'solid',
      _web: {
        boxSizing: 'border-box',
      },
      variants: {
        alignment: {
          left: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          },
          center: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          right: {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          },
        },
      },
    }),

    spacerRow: {
      // Dynamic height set in component
    },

    spacerCell: {
      padding: 0,
      borderWidth: 0,
    },
  };
}) as any);

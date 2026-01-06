import { StyleSheet } from 'react-native-unistyles';
import type { Theme } from '@idealyst/theme';

export type DatePickerVariants = {
  disabled: boolean;
};

export type InputContainerVariants = {
  disabled: boolean;
  error: boolean;
};

export const datePickerStyles = StyleSheet.create((theme: Theme) => {
  return {
    // Calendar container - compact
    calendar: {
      padding: 8,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: 6,
      width: 220,
      variants: {
        disabled: {
          true: { opacity: 0.6 },
          false: { opacity: 1 },
        },
      },
    },

    // Calendar header with month/year and navigation
    calendarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
      paddingHorizontal: 2,
      _web: {
        display: 'flex',
      },
    },

    calendarTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      _web: {
        display: 'flex',
      },
    },

    // Weekday header row
    weekdayRow: {
      flexDirection: 'row',
      marginBottom: 2,
      _web: {
        display: 'flex',
      },
    },

    weekdayCell: {
      width: 28,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      _web: {
        display: 'flex',
      },
    },

    // Calendar grid
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      _web: {
        display: 'flex',
      },
    },

    // Month selector grid (3x4)
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 8,
      _web: {
        display: 'flex',
      },
    },

    // Year selector grid
    yearGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 8,
      _web: {
        display: 'flex',
      },
    },

    // Individual day cell - compact
    dayCell: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      _web: {
        display: 'flex',
      },
    },

    // Time picker container
    timePicker: {
      padding: 12,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: 6,
      variants: {
        disabled: {
          true: { opacity: 0.6 },
          false: { opacity: 1 },
        },
      },
    },

    // Time columns container
    timeColumns: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      _web: {
        display: 'flex',
      },
    },

    // Individual time column (hours, minutes, period)
    timeColumn: {
      alignItems: 'center',
      gap: 2,
      _web: {
        display: 'flex',
      },
    },

    // Time separator (colon)
    timeSeparator: {
      paddingHorizontal: 2,
    },

    // Input row for datetime picker
    inputRow: {
      flexDirection: 'row',
      gap: 8,
      _web: {
        display: 'flex',
      },
    },

    // Popover content wrapper
    popoverContent: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: 6,
      ...theme.shadows.lg,
      overflow: 'hidden',
    },

    // Input container for DateInput/TimeInput
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 6,
      overflow: 'hidden',
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
      variants: {
        disabled: {
          true: {
            backgroundColor: theme.colors.surface.secondary,
          },
          false: {},
        },
        error: {
          true: {
            borderColor: theme.intents.error.primary,
          },
          false: {},
        },
      },
      _web: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: `1px solid ${theme.colors.border.primary}`,
      },
    },

    // Text input inside the input container
    textInput: {
      flex: 1,
      padding: 8,
      paddingHorizontal: 12,
      fontSize: 14,
      backgroundColor: 'transparent',
      color: theme.colors.text.primary,
      variants: {
        disabled: {
          true: {
            color: theme.colors.text.tertiary,
          },
          false: {},
        },
      },
      _web: {
        outline: 'none',
        border: 'none',
      },
    },

    // Error text below input
    errorText: {
      marginTop: 4,
      color: theme.intents.error.primary,
    },

    // Label text above input
    labelText: {
      marginBottom: 4,
    },

    // Modal backdrop
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },

    // Selected day styling
    selectedDay: {
      backgroundColor: theme.intents.primary.primary,
      borderRadius: 14,
    },

    selectedDayText: {
      color: theme.intents.primary.contrast,
    },

    // Today styling
    todayDay: {
      borderWidth: 1,
      borderColor: theme.intents.primary.primary,
      borderRadius: 14,
    },
  } as const;
});

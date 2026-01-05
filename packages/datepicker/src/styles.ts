import { StyleSheet } from 'react-native-unistyles';
import type { Theme } from '@idealyst/theme';

export type DatePickerVariants = {
  disabled: boolean;
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
    },

    calendarTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },

    // Weekday header row
    weekdayRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },

    weekdayCell: {
      width: 28,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Calendar grid
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    // Month selector grid (3x4)
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 8,
    },

    // Year selector grid
    yearGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 8,
    },

    // Individual day cell - compact
    dayCell: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
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
    },

    // Individual time column (hours, minutes, period)
    timeColumn: {
      alignItems: 'center',
      gap: 2,
    },

    // Time separator (colon)
    timeSeparator: {
      paddingHorizontal: 2,
    },

    // Input row for datetime picker
    inputRow: {
      flexDirection: 'row',
      gap: 8,
    },

    // Popover content wrapper
    popoverContent: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: 6,
      ...theme.shadows.lg,
      overflow: 'hidden',
    },
  } as const;
});

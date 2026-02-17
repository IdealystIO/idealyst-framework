/**
 * DatePicker (calendar) styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type DatePickerDynamicProps = {
  disabled?: boolean;
};

/**
 * DatePicker calendar styles with theme reactivity.
 */
export const datePickerCalendarStyles = defineStyle('DatePickerCalendar', (theme: Theme) => ({
  // Calendar container - compact
  calendar: (_props: DatePickerDynamicProps) => ({
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
  }),

  // Calendar header with month/year and navigation
  calendarHeader: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
    paddingHorizontal: 2,
    _web: {
      display: 'flex',
    },
  }),

  calendarTitle: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2,
    _web: {
      display: 'flex',
    },
  }),

  // Weekday header row
  weekdayRow: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    marginBottom: 2,
    _web: {
      display: 'flex',
    },
  }),

  weekdayCell: (_props: DatePickerDynamicProps) => ({
    width: 28,
    height: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    _web: {
      display: 'flex',
    },
  }),

  // Calendar grid
  calendarGrid: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    _web: {
      display: 'flex',
    },
  }),

  // Month selector grid (3x4)
  monthGrid: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    _web: {
      display: 'flex',
    },
  }),

  // Year selector grid
  yearGrid: (_props: DatePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    _web: {
      display: 'flex',
    },
  }),

  // Individual day cell - compact
  dayCell: (_props: DatePickerDynamicProps) => ({
    width: 28,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    _web: {
      display: 'flex',
    },
  }),

  // Navigation button
  navButton: (_props: DatePickerDynamicProps) => ({
    width: 28,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    _web: {
      display: 'flex',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  // Title button (month/year selector)
  titleButton: (_props: DatePickerDynamicProps) => ({
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    _web: {
      background: 'none',
      border: 'none',
    },
    variants: {
      disabled: {
        true: { opacity: 0.6, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  titleText: (_props: DatePickerDynamicProps) => ({
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  }),

  // Day button - fills entire cell for better click handling
  dayButton: (_props: DatePickerDynamicProps) => ({
    width: 28,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    _web: {
      display: 'flex',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  dayText: (_props: DatePickerDynamicProps) => ({
    fontSize: 12,
    color: theme.colors.text.primary,
    _web: {
      pointerEvents: 'none',
    },
  }),

  weekdayText: (_props: DatePickerDynamicProps) => ({
    fontSize: 11,
    color: theme.colors.text.secondary,
  }),

  // Month/Year selector item
  selectorItem: (_props: DatePickerDynamicProps) => ({
    minWidth: 48,
    paddingVertical: 6,
    paddingHorizontal: 8,
    margin: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    _web: {
      display: 'flex',
      background: 'none',
      border: 'none',
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  selectorItemSelected: (_props: DatePickerDynamicProps) => ({
    backgroundColor: theme.intents.primary.primary,
    _web: {
      background: theme.intents.primary.primary,
    },
  }),

  selectorItemText: (_props: DatePickerDynamicProps) => ({
    fontSize: 12,
    color: theme.colors.text.primary,
    _web: {
      pointerEvents: 'none',
    },
  }),

  selectorItemTextSelected: (_props: DatePickerDynamicProps) => ({
    color: theme.intents.primary.contrast,
    _web: {
      pointerEvents: 'none',
    },
  }),

  // Selected day styling
  selectedDay: (_props: DatePickerDynamicProps) => ({
    backgroundColor: theme.intents.primary.primary,
    borderRadius: 6,
    _web: {
      background: theme.intents.primary.primary,
    },
  }),

  selectedDayText: (_props: DatePickerDynamicProps) => ({
    color: theme.intents.primary.contrast,
    _web: {
      pointerEvents: 'none',
    },
  }),

  // Today styling - subtle background highlight
  todayDay: (_props: DatePickerDynamicProps) => ({
    backgroundColor: theme.intents.primary.light,
    borderRadius: 6,
    _web: {
      background: theme.intents.primary.light,
    },
  }),

  // Icon color helper
  iconColor: (_props: DatePickerDynamicProps) => ({
    color: theme.colors.text.primary,
  }),
}));

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
  calendar: ({ disabled = false }: DatePickerDynamicProps) => ({
    padding: 8,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 6,
    width: 220,
    opacity: disabled ? 0.6 : 1,
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
  navButton: ({ disabled = false }: DatePickerDynamicProps) => ({
    width: 28,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    opacity: disabled ? 0.4 : 1,
    _web: {
      display: 'flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  // Title button (month/year selector)
  titleButton: ({ disabled = false }: DatePickerDynamicProps) => ({
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: disabled ? 0.6 : 1,
    _web: {
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  titleText: (_props: DatePickerDynamicProps) => ({
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  }),

  // Day button
  dayButton: ({ disabled = false }: DatePickerDynamicProps) => ({
    width: 24,
    height: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 12,
    opacity: disabled ? 0.4 : 1,
    _web: {
      display: 'flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  dayText: (_props: DatePickerDynamicProps) => ({
    fontSize: 12,
    color: theme.colors.text.primary,
  }),

  weekdayText: (_props: DatePickerDynamicProps) => ({
    fontSize: 11,
    color: theme.colors.text.secondary,
  }),

  // Month/Year selector item
  selectorItem: ({ disabled = false }: DatePickerDynamicProps) => ({
    minWidth: 48,
    paddingVertical: 6,
    paddingHorizontal: 8,
    margin: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    opacity: disabled ? 0.4 : 1,
    _web: {
      display: 'flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  selectorItemSelected: (_props: DatePickerDynamicProps) => ({
    backgroundColor: theme.intents.primary.primary,
  }),

  selectorItemText: (_props: DatePickerDynamicProps) => ({
    fontSize: 12,
    color: theme.colors.text.primary,
  }),

  selectorItemTextSelected: (_props: DatePickerDynamicProps) => ({
    color: theme.intents.primary.contrast,
  }),

  // Selected day styling
  selectedDay: (_props: DatePickerDynamicProps) => ({
    backgroundColor: theme.intents.primary.primary,
    borderRadius: 14,
  }),

  selectedDayText: (_props: DatePickerDynamicProps) => ({
    color: theme.intents.primary.contrast,
  }),

  // Today styling
  todayDay: (_props: DatePickerDynamicProps) => ({
    borderWidth: 1,
    borderColor: theme.intents.primary.primary,
    borderRadius: 14,
  }),

  // Icon color helper
  iconColor: (_props: DatePickerDynamicProps) => ({
    color: theme.colors.text.primary,
  }),
}));

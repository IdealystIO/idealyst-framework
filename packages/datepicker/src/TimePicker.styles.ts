/**
 * TimePicker styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TimePickerDynamicProps = {
  disabled?: boolean;
};

/**
 * TimePicker styles with theme reactivity.
 */
export const timePickerStyles = defineStyle('TimePicker', (theme: Theme) => ({
  // Time picker container
  timePicker: (_props: TimePickerDynamicProps) => ({
    padding: 12,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 6,
    variants: {
      disabled: {
        true: { opacity: 0.6 },
        false: { opacity: 1 },
      },
    },
  }),

  // Time columns container
  timeColumns: (_props: TimePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    gap: 8,
    alignItems: 'center' as const,
    _web: {
      display: 'flex',
    },
  }),

  // Individual time column (hours, minutes, period)
  timeColumn: (_props: TimePickerDynamicProps) => ({
    alignItems: 'center' as const,
    gap: 2,
    _web: {
      display: 'flex',
    },
  }),

  // Time separator (colon)
  timeSeparator: (_props: TimePickerDynamicProps) => ({
    paddingHorizontal: 2,
  }),

  separatorText: (_props: TimePickerDynamicProps) => ({
    fontSize: 24,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  }),

  // Time value display
  timeValue: (_props: TimePickerDynamicProps) => ({
    fontSize: 24,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    _web: {
      pointerEvents: 'none',
    },
  }),

  // Arrow button (up/down)
  arrowButton: (_props: TimePickerDynamicProps) => ({
    width: 32,
    height: 32,
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

  // Period toggle button (AM/PM)
  periodButton: (_props: TimePickerDynamicProps) => ({
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderStyle: 'solid' as const,
    borderColor: theme.colors.border.primary,
    borderRadius: 4,
    backgroundColor: 'transparent',
    _web: {
      background: 'none',
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  periodButtonText: (_props: TimePickerDynamicProps) => ({
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
    _web: {
      pointerEvents: 'none',
    },
  }),

  // Icon color helper
  iconColor: (_props: TimePickerDynamicProps) => ({
    color: theme.colors.text.primary,
  }),
}));

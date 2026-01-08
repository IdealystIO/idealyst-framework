/**
 * DateTimePicker styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type DateTimePickerDynamicProps = {
  disabled?: boolean;
};

/**
 * DateTimePicker styles with theme reactivity.
 */
export const dateTimePickerStyles = defineStyle('DateTimePicker', (theme: Theme) => ({
  // Input row for datetime picker (contains date and time inputs side by side)
  inputRow: (_props: DateTimePickerDynamicProps) => ({
    flexDirection: 'row' as const,
    gap: 8,
    _web: {
      display: 'flex',
    },
  }),

  // Label text
  labelText: (_props: DateTimePickerDynamicProps) => ({
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
  }),

  // Input column wrapper
  inputColumn: (_props: DateTimePickerDynamicProps) => ({
    flex: 1,
  }),
}));

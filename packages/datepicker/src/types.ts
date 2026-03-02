import type { ViewStyle } from 'react-native';
import type { Size } from '@idealyst/theme';

export interface DayIndicator {
  color: string;
  key?: string;
}

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** Indicators to render below specific dates. Key format: "YYYY-MM-DD" */
  indicators?: Record<string, DayIndicator[]>;
  style?: ViewStyle;
}

export interface TimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  mode?: '12h' | '24h';
  minuteStep?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface DateInputProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** When true, the entire input area is pressable to open the calendar instead of being a text input. */
  pressable?: boolean;
  error?: string;
  size?: Size;
  style?: ViewStyle;
}

export interface TimeInputProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  mode?: '12h' | '24h';
  minuteStep?: number;
  disabled?: boolean;
  /** When true, the entire input area is pressable to open the time picker instead of being a text input. */
  pressable?: boolean;
  error?: string;
  size?: Size;
  style?: ViewStyle;
}

export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  timeMode?: '12h' | '24h';
  minuteStep?: number;
  disabled?: boolean;
  /** When true, both input areas are pressable to open their pickers instead of being text inputs. */
  pressable?: boolean;
  error?: string;
  size?: Size;
  style?: ViewStyle;
}

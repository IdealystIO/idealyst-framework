import type { ViewStyle } from 'react-native';
import type { Size } from '@idealyst/theme';

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
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
  error?: string;
  size?: Size;
  style?: ViewStyle;
}

import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface DatePickerProps {
  /** Current selected date */
  value?: Date;
  
  /** Called when date changes */
  onChange: (date: Date | null) => void;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Placeholder text when no date is selected */
  placeholder?: string;
  
  /** Label for the picker */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Date format for display (default: 'MM/dd/yyyy') */
  format?: string;
  
  /** Locale for date formatting */
  locale?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'outlined' | 'filled';
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}

export interface CalendarProps {
  /** Current selected date */
  value?: Date;
  
  /** Called when date is selected */
  onChange: (date: Date) => void;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Current month being viewed */
  currentMonth?: Date;
  
  /** Called when month changes */
  onMonthChange?: (month: Date) => void;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}
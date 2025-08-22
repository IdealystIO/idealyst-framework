import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface DateRange {
  /** Start date of the range */
  startDate?: Date;
  
  /** End date of the range */
  endDate?: Date;
}

export interface DateRangePickerProps {
  /** Current selected date range */
  value?: DateRange;
  
  /** Called when date range changes */
  onChange: (range: DateRange | null) => void;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Placeholder text when no range is selected */
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
  size?: 'small' | 'medium' | 'large';
  
  /** Visual variant */
  variant?: 'outlined' | 'filled';
  
  /** Allow same day selection for start and end */
  allowSameDay?: boolean;
  
  /** Maximum number of days in range */
  maxDays?: number;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}

export interface RangeCalendarProps {
  /** Current selected date range */
  value?: DateRange;
  
  /** Called when range is selected */
  onChange: (range: DateRange) => void;
  
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
  
  /** Allow same day selection */
  allowSameDay?: boolean;
  
  /** Maximum number of days in range */
  maxDays?: number;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}
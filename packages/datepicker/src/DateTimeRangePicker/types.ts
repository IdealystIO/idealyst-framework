import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface DateTimeRange {
  /** Start date and time of the range */
  startDate?: Date;
  
  /** End date and time of the range */
  endDate?: Date;
}

export interface DateTimeRangePickerProps {
  /** Current selected date/time range */
  value?: DateTimeRange;
  
  /** Called when date/time range changes */
  onChange: (range: DateTimeRange | null) => void;
  
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
  
  /** Date format for display (default: 'MM/dd/yyyy HH:mm') */
  format?: string;
  
  /** Locale for date formatting */
  locale?: string;
  
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  
  /** Visual variant */
  variant?: 'outlined' | 'filled';
  
  /** Time picker mode */
  timeMode?: '12h' | '24h';
  
  
  /** Time step in minutes */
  timeStep?: number;
  
  /** Allow same day selection for start and end */
  allowSameDay?: boolean;
  
  /** Maximum number of days in range */
  maxDays?: number;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface DateTimePickerProps {
  /** Current selected date and time */
  value?: Date;
  
  /** Called when date/time changes */
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
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}

export interface TimePickerProps {
  /** Current selected time */
  value?: Date;
  
  /** Called when time is selected */
  onChange: (time: Date) => void;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Time picker mode */
  mode?: '12h' | '24h';
  
  
  /** Time step in minutes */
  step?: number;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}
import { ViewStyle, TextStyle } from 'react-native';

export interface DateInputProps {
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
  
  /** Label for the input */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Date format for display when not focused (default: 'MMMM d, yyyy') */
  displayFormat?: string;
  
  /** Accepted input formats for parsing (default includes common formats) */
  inputFormats?: string[];
  
  /** Locale for date formatting */
  locale?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'outlined' | 'filled';
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Custom text input styles */
  inputStyle?: TextStyle;
  
  /** Test ID for testing */
  testID?: string;
  
  /** Called when input is focused */
  onFocus?: () => void;
  
  /** Called when input is blurred */
  onBlur?: () => void;
}
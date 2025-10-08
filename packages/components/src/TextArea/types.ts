import type { ViewStyle, TextStyle } from 'react-native';

export interface TextAreaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  minHeight?: number;
  maxHeight?: number;
  autoGrow?: boolean;
  maxLength?: number;
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharacterCount?: boolean;
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textareaStyle?: TextStyle;
  testID?: string;
}

import type { ViewStyle, TextStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TextAreaIntentVariant = IntentVariant;
export type TextAreaSizeVariant = ButtonSize;
export type TextAreaResizeVariant = 'none' | 'vertical' | 'horizontal' | 'both';

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
  resize?: TextAreaResizeVariant;
  showCharacterCount?: boolean;
  intent?: TextAreaIntentVariant;
  size?: TextAreaSizeVariant;
  style?: ViewStyle;
  textareaStyle?: TextStyle;
  testID?: string;
}

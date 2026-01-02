import { Intent, Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FormInputStyleProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type TextAreaIntentVariant = Intent;
export type TextAreaSizeVariant = Size;
export type TextAreaResizeVariant = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextAreaProps extends FormInputStyleProps {
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
  style?: StyleProp<ViewStyle>;
  textareaStyle?: StyleProp<TextStyle>;
  testID?: string;
}

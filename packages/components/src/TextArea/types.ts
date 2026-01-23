import { Intent, Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { FormAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TextAreaIntentVariant = Intent;
export type TextAreaSizeVariant = Size;
export type TextAreaResizeVariant = 'none' | 'vertical' | 'horizontal' | 'both';
export type TextAreaType = 'outlined' | 'filled' | 'bare';

export interface TextAreaProps extends FormInputStyleProps, FormAccessibilityProps {
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
  /**
   * Visual style type of the textarea
   * @default 'outlined'
   */
  type?: TextAreaType;
  style?: StyleProp<ViewStyle>;
  textareaStyle?: StyleProp<TextStyle>;
  testID?: string;
}

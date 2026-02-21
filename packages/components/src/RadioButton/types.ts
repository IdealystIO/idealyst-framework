import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { Intent, Size } from '@idealyst/theme';
import { FormInputStyleProps, BaseProps } from '../utils/viewStyleProps';
import { SelectionAccessibilityProps, AccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type RadioButtonIntentVariant = Intent;
export type RadioButtonSizeVariant = Size;

export interface RadioButtonProps extends FormInputStyleProps, SelectionAccessibilityProps {
  value: string;
  checked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
  size?: RadioButtonSizeVariant;
  intent?: RadioButtonIntentVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface RadioGroupProps extends BaseProps, AccessibilityProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;

  /**
   * Error message to display below the radio group. When set, shows error styling.
   */
  error?: string;

  /**
   * Helper text to display below the radio group. Hidden when error is set.
   */
  helperText?: string;

  /**
   * Label text to display above the radio group
   */
  label?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
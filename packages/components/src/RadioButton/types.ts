import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { IntentVariant, ButtonSize } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type RadioButtonIntentVariant = IntentVariant;
export type RadioButtonSizeVariant = ButtonSize;

export interface RadioButtonProps {
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

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
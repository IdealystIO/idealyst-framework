import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface RadioButtonProps {
  value: string;
  checked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  intent?: 'primary' | 'success' | 'error' | 'warning' | 'neutral';
  style?: ViewStyle;
  testID?: string;
}

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  style?: ViewStyle;
  testID?: string;
}
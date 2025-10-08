import type { ViewStyle } from 'react-native';

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?: 'linear' | 'circular';
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  rounded?: boolean;
  style?: ViewStyle;
  testID?: string;
}
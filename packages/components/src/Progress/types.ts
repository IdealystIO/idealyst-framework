import type { StyleProp, ViewStyle } from 'react-native';
import type { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type ProgressIntentVariant = Intent;
export type ProgressSizeVariant = Size;
export type ProgressVariant = 'linear' | 'circular';

export interface ProgressProps extends BaseProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  intent?: ProgressIntentVariant;
  size?: ProgressSizeVariant;
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
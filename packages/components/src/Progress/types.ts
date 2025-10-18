import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type ProgressIntentVariant = IntentVariant;
export type ProgressSizeVariant = ButtonSize;
export type ProgressVariant = 'linear' | 'circular';

export interface ProgressProps {
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
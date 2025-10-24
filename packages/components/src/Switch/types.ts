import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type SwitchIntentVariant = Intent;
export type SwitchSizeVariant = Size;

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  intent?: SwitchIntentVariant;
  size?: SwitchSizeVariant;
  enabledIcon?: IconName | React.ReactNode;
  disabledIcon?: IconName | React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
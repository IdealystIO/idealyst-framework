import type { ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type SwitchIntentVariant = IntentVariant;
export type SwitchSizeVariant = ButtonSize;

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
  style?: ViewStyle;
  testID?: string;
}
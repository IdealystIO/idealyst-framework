import type { ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  enabledIcon?: IconName | React.ReactNode;
  disabledIcon?: IconName | React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}
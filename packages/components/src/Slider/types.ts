import type { ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  marks?: SliderMark[];
  intent?: 'primary' | 'success' | 'error' | 'warning' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  icon?: IconName | React.ReactNode;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  style?: ViewStyle;
  testID?: string;
}

export interface SliderMark {
  value: number;
  label?: string;
}

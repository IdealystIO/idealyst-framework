import type { ViewStyle } from 'react-native';

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
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  style?: ViewStyle;
  testID?: string;
}

export interface SliderMark {
  value: number;
  label?: string;
}

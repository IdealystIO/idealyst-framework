import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { RangeAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type SliderIntentVariant = Intent;
export type SliderSizeVariant = Size;

export interface SliderProps extends FormInputStyleProps, RangeAccessibilityProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  marks?: SliderMark[];
  intent?: SliderIntentVariant;
  size?: SliderSizeVariant;
  icon?: IconName | React.ReactNode;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface SliderMark {
  value: number;
  label?: string;
}

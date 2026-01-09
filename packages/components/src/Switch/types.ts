import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { SelectionAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type SwitchIntentVariant = Intent;
export type SwitchSizeVariant = Size;

/**
 * Toggle switch component for binary on/off states.
 * Supports custom icons for enabled/disabled states and optional label positioning.
 */
export interface SwitchProps extends FormInputStyleProps, SelectionAccessibilityProps {
  /**
   * Whether the switch is on
   */
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
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
 * Supports custom icons for on/off states and optional label positioning.
 */
export interface SwitchProps extends FormInputStyleProps, SelectionAccessibilityProps {
  /**
   * Whether the switch is on
   */
  checked?: boolean;

  /**
   * Called when the switch state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;

  /**
   * Error message to display below the switch. When set, shows error styling.
   */
  error?: string;

  /**
   * Helper text to display below the switch. Hidden when error is set.
   */
  helperText?: string;

  /**
   * Label text to display next to the switch
   */
  label?: string;

  /**
   * Position of the label relative to the switch
   */
  labelPosition?: 'left' | 'right';

  /**
   * The intent/color scheme of the switch
   */
  intent?: SwitchIntentVariant;

  /**
   * Size of the switch
   */
  size?: SwitchSizeVariant;

  /**
   * Icon to display in the thumb when the switch is ON
   */
  onIcon?: IconName | React.ReactNode;

  /**
   * Icon to display in the thumb when the switch is OFF
   */
  offIcon?: IconName | React.ReactNode;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
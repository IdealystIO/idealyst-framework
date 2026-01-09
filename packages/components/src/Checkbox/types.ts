import { Intent, Size } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { SelectionAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type CheckboxIntentVariant = Intent;
export type CheckboxSizeVariant = Size;
export type CheckboxVariant = 'default' | 'outlined';

/**
 * Checkbox component for multiple selection inputs.
 * Supports checked, unchecked, and indeterminate states with optional labels.
 */
export interface CheckboxProps extends FormInputStyleProps, SelectionAccessibilityProps {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean;

  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;

  /**
   * Called when the checkbox state changes
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * The size of the checkbox
   */
  size?: CheckboxSizeVariant;

  /**
   * The intent/color scheme of the checkbox
   */
  intent?: CheckboxIntentVariant;

  /**
   * The visual style variant of the checkbox
   */
  variant?: CheckboxVariant;

  /**
   * Label text to display next to the checkbox
   */
  label?: string;

  /**
   * Custom label content (ReactNode)
   */
  children?: ReactNode;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Whether the checkbox is required
   */
  required?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display
   */
  helperText?: string;
} 
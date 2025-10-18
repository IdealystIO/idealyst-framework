import { ReactNode } from 'react';
import type { IntentVariant, ButtonSize } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type CheckboxIntentVariant = IntentVariant;
export type CheckboxSizeVariant = ButtonSize;
export type CheckboxVariant = 'default' | 'outlined';

export interface CheckboxProps {
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
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

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
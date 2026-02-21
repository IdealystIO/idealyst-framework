import { Intent, Size } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { FormAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type SelectIntentVariant = Intent;
export type SelectSizeVariant = Size;
export type SelectType = 'outlined' | 'filled';

export interface SelectOption {
  /**
   * The unique value for this option
   */
  value: string;

  /**
   * The display label for this option
   */
  label: string;

  /**
   * Whether this option is disabled
   */
  disabled?: boolean;

  /**
   * Optional icon or custom content to display before the label
   */
  icon?: ReactNode;
}

/**
 * Dropdown selection component for choosing from a list of options.
 * Supports searchable filtering on web and native presentation modes on iOS.
 */
export interface SelectProps extends FormInputStyleProps, FormAccessibilityProps {
  /**
   * Array of options to display in the select
   */
  options: SelectOption[];

  /**
   * The currently selected value
   */
  value?: string;

  /**
   * Called when the selected value changes
   */
  onChange?: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Error state or error message. When a string is provided, it displays as error text.
   * When boolean true, shows error styling without text.
   * @deprecated Using boolean is deprecated. Prefer passing an error message string.
   */
  error?: string | boolean;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Label text to display above the select
   */
  label?: string;

  /**
   * The visual type of the select
   */
  type?: SelectType,

  /**
   * The intent/color scheme of the select
   */
  intent?: SelectIntentVariant;

  /**
   * The size of the select
   */
  size?: SelectSizeVariant;

  /**
   * Whether to show a search/filter input (web only)
   */
  searchable?: boolean;

  /**
   * Custom search filter function (used with searchable)
   */
  filterOption?: (option: SelectOption, searchTerm: string) => boolean;

  /**
   * Native iOS presentation mode (native only)
   * 'dropdown' uses a standard dropdown overlay
   * 'actionSheet' uses iOS ActionSheet for selection
   */
  presentationMode?: 'dropdown' | 'actionSheet';

  /**
   * Maximum height for the dropdown content
   */
  maxHeight?: number;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
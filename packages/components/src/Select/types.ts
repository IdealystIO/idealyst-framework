import { ReactNode } from 'react';
import type { IntentVariant, ButtonSize } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type SelectIntentVariant = IntentVariant;
export type SelectSizeVariant = ButtonSize;
export type SelectVariant = 'outlined' | 'filled';

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

export interface SelectProps {
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
  onValueChange?: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Whether the select shows an error state
   */
  error?: boolean;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Label text to display above the select
   */
  label?: string;

  /**
   * The visual variant of the select
   */
  variant?: SelectVariant;

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
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}
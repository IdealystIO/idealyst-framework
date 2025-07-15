import { ReactNode } from 'react';
import type { IntentVariant } from '../theme/variants';

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
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The intent/color scheme of the checkbox
   */
  intent?: IntentVariant;
  
  /**
   * The visual style variant of the checkbox
   */
  variant?: 'default' | 'outlined';
  
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
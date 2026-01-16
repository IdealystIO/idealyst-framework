import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { FormAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type InputIntent = Intent;
export type InputSize = Size;
export type InputType = 'outlined' | 'filled' | 'bare';
export type InputInputType = 'text' | 'email' | 'password' | 'number';

/**
 * Text input field with support for icons, validation states, and multiple visual styles.
 * Includes built-in password visibility toggle and platform-specific keyboard handling.
 */
export interface InputProps extends FormInputStyleProps, FormAccessibilityProps {
  /**
   * The current value of the input
   */
  value?: string;

  /**
   * Called when the text changes
   */
  onChangeText?: (text: string) => void;

  /**
   * Called when the input receives focus
   */
  onFocus?: () => void;

  /**
   * Called when the input loses focus
   */
  onBlur?: () => void;

  /**
   * Called when the input is pressed (for web compatibility)
   * @returns 
   */
  onPress?: () => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * The type of input (affects keyboard type on mobile)
   */
  inputType?: InputInputType;

  /**
   * Whether to show the password
   */
  secureTextEntry?: boolean;

  /**
   * Icon to display on the left side of the input
   */
  leftIcon?: IconName | React.ReactNode;

  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: IconName | React.ReactNode;

  /**
   * Show password visibility toggle for password inputs (defaults to true for password type)
   */
  showPasswordToggle?: boolean;

  /**
   * Auto-capitalization behavior
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Size variant of the input
   */
  size?: InputSize;

  /**
   * Style variant of the input
   */
  type?: InputType;

  /**
   * The intent/color scheme of the input (for focus states, validation, etc.)
   */
  intent?: InputIntent;

  /**
   * Whether the input has an error state
   * @deprecated Use intent="danger" instead
   */
  hasError?: boolean;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
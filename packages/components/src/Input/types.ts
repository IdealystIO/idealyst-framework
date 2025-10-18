import type { IntentVariant, ButtonSize } from '../theme/variants';
import type { IconName } from '../Icon/icon-types';

// Component-specific type aliases for future extensibility
export type InputIntentVariant = IntentVariant;
export type InputSizeVariant = ButtonSize;
export type InputVariant = 'default' | 'outlined' | 'filled' | 'bare';
export type InputTypeVariant = 'text' | 'email' | 'password' | 'number';

export interface InputProps {
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
  inputType?: InputTypeVariant;

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
  size?: InputSizeVariant;

  /**
   * Style variant of the input
   */
  variant?: InputVariant;

  /**
   * The intent/color scheme of the input (for focus states, validation, etc.)
   */
  intent?: InputIntentVariant;

  /**
   * Whether the input has an error state
   * @deprecated Use intent="error" instead
   */
  hasError?: boolean;

  /**
   * Additional styles (platform-specific)
   */
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { FormAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TextInputIntent = Intent;
export type TextInputSize = Size;
export type TextInputType = 'outlined' | 'filled' | 'bare';

/**
 * Input mode for keyboard type on mobile platforms.
 * This prop only affects React Native - on web, browser handles keyboard automatically.
 * @platform native
 */
export type TextInputMode = 'text' | 'email' | 'password' | 'number';

/**
 * Single-line text input field with support for icons, validation states, and multiple visual styles.
 * Includes built-in password visibility toggle and platform-specific keyboard handling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter email"
 *   inputMode="email"
 * />
 *
 * // Password with toggle
 * <TextInput
 *   value={password}
 *   onChangeText={setPassword}
 *   inputMode="password"
 *   secureTextEntry
 * />
 *
 * // With icons and validation
 * <TextInput
 *   value={search}
 *   onChangeText={setSearch}
 *   leftIcon="magnify"
 *   intent="danger"
 * />
 * ```
 */
export interface TextInputProps extends FormInputStyleProps, FormAccessibilityProps {
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
   * Called when the input is pressed
   */
  onPress?: () => void;

  /**
   * Placeholder text shown when the input is empty
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * The type of input keyboard to show on mobile platforms.
   * This prop only affects React Native - on web, browser handles keyboard automatically.
   * @platform native
   */
  inputMode?: TextInputMode;

  /**
   * Whether to hide the text (for passwords)
   */
  secureTextEntry?: boolean;

  /**
   * Icon to display on the left side of the input.
   * Can be an icon name string or a custom React node.
   */
  leftIcon?: IconName | React.ReactNode;

  /**
   * Icon to display on the right side of the input.
   * Can be an icon name string or a custom React node.
   */
  rightIcon?: IconName | React.ReactNode;

  /**
   * Show password visibility toggle for password inputs.
   * Defaults to true when inputMode="password" or secureTextEntry is true.
   */
  showPasswordToggle?: boolean;

  /**
   * Auto-capitalization behavior
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Size variant of the input
   */
  size?: TextInputSize;

  /**
   * Visual style type of the input
   */
  type?: TextInputType;

  /**
   * The intent/color scheme of the input (for focus states, validation, etc.)
   */
  intent?: TextInputIntent;

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

// Legacy type aliases for backwards compatibility
/** @deprecated Use TextInputIntent instead */
export type InputIntent = TextInputIntent;
/** @deprecated Use TextInputSize instead */
export type InputSize = TextInputSize;
/** @deprecated Use TextInputType instead */
export type InputType = TextInputType;
/** @deprecated Use TextInputMode instead */
export type InputInputType = TextInputMode;
/** @deprecated Use TextInputProps instead */
export type InputProps = TextInputProps;

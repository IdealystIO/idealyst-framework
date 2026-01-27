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
 * Return key type for mobile keyboard.
 * Controls what the return/submit button on the keyboard displays.
 * @platform native
 */
export type ReturnKeyType = 'done' | 'go' | 'next' | 'search' | 'send' | 'default';

/**
 * Text content type for iOS AutoFill.
 * Helps iOS identify the purpose of the field for password/credential autofill.
 * @platform ios
 */
export type TextContentType =
  | 'none'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | 'emailAddress'
  | 'name'
  | 'givenName'
  | 'familyName'
  | 'telephoneNumber'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'addressCity'
  | 'addressState'
  | 'addressCityAndState'
  | 'postalCode'
  | 'countryName'
  | 'creditCardNumber';

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
   * Called when the user submits the input (presses Enter on web, or the return key on mobile).
   * Use this for form submission or moving to the next field.
   */
  onSubmitEditing?: () => void;

  /**
   * Determines how the return key on mobile keyboard should look.
   * Has no effect on web.
   * @platform native
   * @default 'default'
   */
  returnKeyType?: ReturnKeyType;

  /**
   * iOS AutoFill content type. Helps iOS identify the field purpose for
   * password/credential autofill. Set to 'none' to disable autofill suggestions.
   * For password fields, use 'password' for existing passwords or 'newPassword' for signup.
   * Pair with a username field using 'username' or 'emailAddress' for best results.
   * @platform ios
   */
  textContentType?: TextContentType;

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

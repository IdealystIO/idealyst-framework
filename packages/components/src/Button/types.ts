import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme/variants';
import type { IconName } from '../Icon/icon-types';

// Component-specific type aliases for future extensibility
export type ButtonType = 'contained' | 'outlined' | 'text';
export type ButtonIntentVariant = IntentVariant;
export type ButtonSizeVariant = ButtonSize;

export interface ButtonProps {
  /**
   * The text or content to display inside the button
   */
  children?: ReactNode;

  /**
   * The text title to display inside the button (for web)
   */
  title?: string;

  /**
   * Called when the button is pressed
   */
  onPress?: () => void;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * The visual style type of the button
   */
  type?: ButtonType;

  /**
   * The intent/color scheme of the button
   */
  intent?: ButtonIntentVariant;

  /**
   * The size of the button
   */
  size?: ButtonSizeVariant;

  /**
   * Icon to display on the left side. Can be an icon name or custom component (ReactNode)
   */
  leftIcon?: IconName | ReactNode;

  /**
   * Icon to display on the right side. Can be an icon name or custom component (ReactNode)
   */
  rightIcon?: IconName | ReactNode;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
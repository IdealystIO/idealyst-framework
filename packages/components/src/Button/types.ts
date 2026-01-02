import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type ButtonType = 'contained' | 'outlined' | 'text';
export type ButtonIntentVariant = Intent;
export type ButtonSizeVariant = Size;

/**
 * Gradient overlay options for buttons.
 * Applies a transparent gradient over the intent background color.
 * - 'darken': Transparent to semi-transparent black (darkens one corner)
 * - 'lighten': Transparent to semi-transparent white (lightens one corner)
 */
export type ButtonGradient = 'darken' | 'lighten';

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
   * Apply a gradient background enhancement.
   * Only applies to 'contained' button type.
   * Options: 'color-to-dark', 'color-to-light', 'light-to-color', 'dark-to-color'
   */
  gradient?: ButtonGradient;

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
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

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

/**
 * Interactive button component with multiple visual variants, sizes, and icon support.
 * Supports contained, outlined, and text styles with customizable intent colors.
 */
export interface ButtonProps extends BaseProps, InteractiveAccessibilityProps {
  /**
   * The content to display inside the button
   */
  children?: ReactNode;

  /**
   * Called when the button is pressed
   */
  onPress?: () => void;

  /**
   * @deprecated Use `onPress` instead. This prop exists for web compatibility only.
   * Using onClick will log a deprecation warning in development.
   */
  onClick?: () => void;

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
   * Whether the button is in a loading state.
   * When true, shows a spinner and disables interaction.
   * The spinner color matches the button text color.
   */
  loading?: boolean;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
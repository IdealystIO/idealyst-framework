import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type IconButtonType = 'contained' | 'outlined' | 'text';
export type IconButtonIntentVariant = Intent;
export type IconButtonSizeVariant = Size;

/**
 * Gradient overlay options for icon buttons.
 * Applies a transparent gradient over the intent background color.
 * - 'darken': Transparent to semi-transparent black (darkens one corner)
 * - 'lighten': Transparent to semi-transparent white (lightens one corner)
 */
export type IconButtonGradient = 'darken' | 'lighten';

/**
 * Circular icon button component with multiple visual variants, sizes, and a single icon.
 * Supports contained, outlined, and text styles with customizable intent colors.
 */
export interface IconButtonProps extends BaseProps, InteractiveAccessibilityProps {
  /**
   * The icon to display. Can be an icon name string or a custom ReactNode.
   */
  icon: IconName | ReactNode;

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
  type?: IconButtonType;

  /**
   * The intent/color scheme of the button
   */
  intent?: IconButtonIntentVariant;

  /**
   * The size of the button
   */
  size?: IconButtonSizeVariant;

  /**
   * Apply a gradient background enhancement.
   * Only applies to 'contained' button type.
   */
  gradient?: IconButtonGradient;

  /**
   * Whether the button is in a loading state.
   * When true, shows a spinner and disables interaction.
   * The spinner color matches the icon color.
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

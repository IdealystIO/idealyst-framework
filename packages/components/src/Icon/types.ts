import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from "./icon-types";
import type { Size, Text } from '@idealyst/theme';
import { Color, Intent } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Re-export IconName for external consumers
export type { IconName } from './icon-types';

export type IconSizeVariant = Size | number;

/**
 * Base props shared by all Icon variants
 */
interface IconBaseProps extends BaseProps {
  /**
   * The name of the icon to display
   */
  name: IconName | `mdi:${IconName}`;

  /**
   * The size variant of the icon
   */
  size?: IconSizeVariant;

  /**
   * Intent variant for the icon
   */
  intent?: Intent;

  /**
   * Additional styles (platform-specific)
   */
  style?: React.CSSProperties | StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Icon props with palette color (e.g., 'blue.500', 'red.100')
 */
interface IconWithColor extends IconBaseProps {
  /**
   * Predefined color variant based on theme palette
   */
  color?: Color;
  textColor?: never;
}

/**
 * Icon props with text color (e.g., 'primary', 'secondary')
 */
interface IconWithTextColor extends IconBaseProps {
  color?: never;
  /**
   * Text color variant from theme (e.g., 'primary', 'secondary')
   * Cannot be used together with `color` prop
   */
  textColor?: Text;
}

/**
 * Icon component props - accepts either `color` (palette) or `textColor` (text colors), but not both.
 *
 * Color priority: intent > color > textColor > default (textColor="primary")
 * When no color prop is specified, the icon defaults to the theme's primary text color.
 */
export type IconProps = IconWithColor | IconWithTextColor;
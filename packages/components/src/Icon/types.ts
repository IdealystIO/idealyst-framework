import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from "./icon-types";
import type { Size } from '@idealyst/theme';
import { Color, Intent } from '@idealyst/theme';

export type IconSizeVariant = Size | number;

export interface IconProps {
  /**
   * The name of the icon to display
   */
  name: IconName | `mdi:${IconName}`;

  /**
   * The size variant of the icon
   */
  size?: IconSizeVariant;

  /**
   * Predefined color variant based on theme
   */
  color?: Color;
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
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { DisplayColorVariant, BadgeSize } from '../theme/variants';
import type { IconName } from '../Icon/icon-types';

// Component-specific type aliases for future extensibility
export type BadgeColorVariant = DisplayColorVariant;
export type BadgeSizeVariant = BadgeSize;
export type BadgeVariant = 'filled' | 'outlined' | 'dot';

export interface BadgeProps {
  /**
   * The content to display inside the badge
   */
  children?: ReactNode;

  /**
   * The size of the badge
   */
  size?: BadgeSizeVariant;

  /**
   * The visual style variant of the badge
   */
  variant?: BadgeVariant;

  /**
   * The color scheme of the badge
   */
  color?: BadgeColorVariant;

  /**
   * Icon to display. Can be an icon name or custom component (ReactNode)
   */
  icon?: IconName | ReactNode;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
import type { CSSProperties, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Color, Size } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type BadgeColorVariant = Color;
export type BadgeSizeVariant = Size;
export type BadgeType = 'filled' | 'outlined' | 'dot';

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
  type?: BadgeType;

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
  style?: CSSProperties | StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
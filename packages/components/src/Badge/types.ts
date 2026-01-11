import type { CSSProperties, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Color, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type BadgeColorVariant = Color;
export type BadgeSizeVariant = Size;
export type BadgeType = 'filled' | 'outlined' | 'dot';

/**
 * Small status indicator component for counts, labels, or status dots.
 * Supports filled, outlined, and dot variants with customizable colors.
 */
export interface BadgeProps extends BaseProps {
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
   * Alias for type - the visual style variant of the badge
   */
  variant?: BadgeType;

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
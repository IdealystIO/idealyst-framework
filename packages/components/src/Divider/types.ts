import { Intent, Size } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type DividerIntentVariant = Intent;
export type DividerSizeVariant = Size;
export type DividerOrientationVariant = 'horizontal' | 'vertical';
export type DividerType = 'solid' | 'dashed' | 'dotted';
export type DividerLengthVariant = 'full' | 'auto' | number;
export type DividerSpacingVariant = 'none' | Size;

/**
 * Visual separator for grouping or dividing content sections.
 * Supports horizontal and vertical orientations with optional centered content.
 */
export interface DividerProps extends BaseProps {
  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientationVariant;

  /**
   * The visual style type of the divider
   */
  type?: DividerType;

  /**
   * The size (thickness) of the divider
   */
  size?: DividerSizeVariant;

  /**
   * The color intent of the divider
   */
  intent?: DividerIntentVariant;

  /**
   * The length of the divider (percentage or fixed)
   */
  length?: DividerLengthVariant;

  /**
   * Spacing around the divider
   */
  spacing?: DividerSpacingVariant;

  /**
   * Content to display in the center of the divider (for horizontal dividers)
   */
  children?: ReactNode;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
} 
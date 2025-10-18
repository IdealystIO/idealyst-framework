import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type DividerIntentVariant = IntentVariant;
export type DividerOrientationVariant = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerThicknessVariant = 'thin' | 'md' | 'thick';
export type DividerLengthVariant = 'full' | 'auto' | number;
export type DividerSpacingVariant = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps {
  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientationVariant;

  /**
   * The visual style variant of the divider
   */
  variant?: DividerVariant;

  /**
   * The thickness of the divider
   */
  thickness?: DividerThicknessVariant;

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
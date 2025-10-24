import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { DisplayColorVariant } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type TextColorVariant = DisplayColorVariant;
export type TextSizeVariant = 'sm' | 'md' | 'lg' | 'xl';  // Using sm/md/lg/xl for consistency
export type TextWeightVariant = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlignVariant = 'left' | 'center' | 'right';

export interface TextProps {
  /**
   * The text content to display
   */
  children: ReactNode;

  /**
   * The size variant of the text
   */
  size?: TextSizeVariant;

  /**
   * The weight of the text
   */
  weight?: TextWeightVariant;

  /**
   * The color of the text
   */
  color?: TextColorVariant;

  /**
   * Text alignment
   */
  align?: TextAlignVariant;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<TextStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
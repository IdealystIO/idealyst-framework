import { ReactNode } from 'react';
import type { DisplayColorVariant } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type TextColorVariant = DisplayColorVariant;
export type TextSizeVariant = 'sm' | 'md' | 'lg' | 'xl';
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
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
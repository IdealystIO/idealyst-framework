import { Text, Typography } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { TextSpacingStyleProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type TextColorVariant = Text;
export type TextWeightVariant = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlignVariant = 'left' | 'center' | 'right';
export type TextTypographyVariant = Typography;

export interface TextProps extends TextSpacingStyleProps {
  /**
   * The text content to display
   */
  children: ReactNode;

  /**
   * Typography variant for semantic text styling.
   * Automatically sets fontSize, lineHeight, and fontWeight.
   */
  typography?: TextTypographyVariant;

  /**
   * The weight of the text.
   * Overrides the weight from typography if both are set.
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

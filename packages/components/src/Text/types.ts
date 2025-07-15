import { ReactNode } from 'react';
import type { DisplayColorVariant } from '../theme/variants';

export interface TextProps {
  /**
   * The text content to display
   */
  children: ReactNode;
  
  /**
   * The size variant of the text
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  
  /**
   * The weight of the text
   */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  
  /**
   * The color of the text
   */
  color?: DisplayColorVariant;
  
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
} 
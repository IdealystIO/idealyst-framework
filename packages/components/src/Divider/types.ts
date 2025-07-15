import { ReactNode } from 'react';
import type { IntentVariant } from '../theme/variants';

export interface DividerProps {
  /**
   * The orientation of the divider
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * The visual style variant of the divider
   */
  variant?: 'solid' | 'dashed' | 'dotted';
  
  /**
   * The thickness of the divider
   */
  thickness?: 'thin' | 'medium' | 'thick';
  
  /**
   * The color intent of the divider
   */
  intent?: IntentVariant;
  
  /**
   * The length of the divider (percentage or fixed)
   */
  length?: 'full' | 'auto' | number;
  
  /**
   * Spacing around the divider
   */
  spacing?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * Content to display in the center of the divider (for horizontal dividers)
   */
  children?: ReactNode;
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
} 
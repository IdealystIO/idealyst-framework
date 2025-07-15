import { ReactNode } from 'react';
import type { DisplayColorVariant } from '../theme/variants';

export interface BadgeProps {
  /**
   * The content to display inside the badge
   */
  children?: ReactNode;
  
  /**
   * The size of the badge
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual style variant of the badge
   */
  variant?: 'filled' | 'outlined' | 'dot';
  
  /**
   * The color scheme of the badge
   */
  color?: DisplayColorVariant;
  
  /**
   * Additional styles
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
} 
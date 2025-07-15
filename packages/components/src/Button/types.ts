import { ReactNode } from 'react';
import type { IntentVariant } from '../theme/variants';

export interface ButtonProps {
  /**
   * The text or content to display inside the button
   */
  children?: ReactNode;
  
  /**
   * The text title to display inside the button (for web)
   */
  title?: string;
  
  /**
   * Called when the button is pressed
   */
  onPress?: () => void;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  
  /**
   * The visual style variant of the button
   */
  variant?: 'contained' | 'outlined' | 'text';
  
  /**
   * The intent/color scheme of the button
   */
  intent?: IntentVariant;
  
  /**
   * The size of the button
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
} 
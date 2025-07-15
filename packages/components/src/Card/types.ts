import { ReactNode } from 'react';
import type { IntentVariant } from '../theme/variants';

export interface CardProps {
  /**
   * The content to display inside the card
   */
  children?: ReactNode;
  
  /**
   * The visual style variant of the card
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  
  /**
   * The padding size inside the card
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * The border radius of the card
   */
  radius?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * The intent/color scheme of the card
   */
  intent?: IntentVariant;
  
  /**
   * Whether the card is clickable
   */
  clickable?: boolean;
  
  /**
   * Called when the card is pressed (if clickable)
   */
  onPress?: () => void;
  
  /**
   * Whether the card is disabled
   */
  disabled?: boolean;
  
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
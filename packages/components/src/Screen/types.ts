import { ReactNode } from 'react';

export interface ScreenProps {
  /**
   * The content to display inside the screen
   */
  children?: ReactNode;
  
  /**
   * Background variant - controls the background color
   */
  background?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
  
  /**
   * Screen padding variant
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Safe area padding for mobile devices
   */
  safeArea?: boolean;
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Scrollable content
   */
  scrollable?: boolean;
} 
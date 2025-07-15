import type { ColorVariant } from '../theme/variants';

export interface AvatarProps {
  /**
   * Image source (URL or require())
   */
  src?: string | any;
  
  /**
   * Alt text for the image
   */
  alt?: string;
  
  /**
   * Fallback text (usually initials)
   */
  fallback?: string;
  
  /**
   * Size of the avatar
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  
  /**
   * Shape of the avatar
   */
  shape?: 'circle' | 'square';
  
  /**
   * The color scheme of the avatar (for background when no image)
   */
  color?: ColorVariant;
  
  /**
   * Additional styles
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
} 
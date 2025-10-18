import type { ColorVariant } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type AvatarColorVariant = ColorVariant;
export type AvatarSizeVariant = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShapeVariant = 'circle' | 'square';

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
  size?: AvatarSizeVariant;

  /**
   * Shape of the avatar
   */
  shape?: AvatarShapeVariant;

  /**
   * The color scheme of the avatar (for background when no image)
   */
  color?: AvatarColorVariant;

  /**
   * Additional styles
   */
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
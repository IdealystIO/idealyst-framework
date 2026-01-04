import { Color } from '@idealyst/theme';
import type { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type AvatarColorVariant = Color;
export type AvatarSizeVariant = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShapeVariant = 'circle' | 'square';

export interface AvatarProps extends BaseProps {
  /**
   * Image source (URL or require())
   */
  src?: string | ImageSourcePropType;

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
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
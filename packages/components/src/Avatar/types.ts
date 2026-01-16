import { Color } from '@idealyst/theme';
import type { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';
import { AccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type AvatarColorVariant = Color;
export type AvatarSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShapeVariant = 'circle' | 'square';

/**
 * User or entity representation with image, initials fallback, or icon.
 * Supports circular and square shapes with multiple size options.
 */
export interface AvatarProps extends BaseProps, AccessibilityProps {
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
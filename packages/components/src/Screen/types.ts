import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Surface } from '@idealyst/theme';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import type { LayoutChangeEvent } from '../hooks/useWebLayout';

/**
 * Full-screen container component with safe area support.
 * Provides consistent page-level layout with optional scrolling and safe area insets.
 */
export interface ScreenProps extends ContainerStyleProps {
  /**
   * The content to display inside the screen
   */
  children?: ReactNode;

  /**
   * Background variant - controls the background color
   */
  background?: Surface | 'transparent';

  /**
   * Safe area padding for mobile devices
   */
  safeArea?: boolean;

  /**
   * Content inset padding for scrollable content (mobile only)
   * Adds padding to the scroll view's content container
   * Useful for adding safe area insets or additional spacing
   */
  contentInset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Scrollable content
   */
  scrollable?: boolean;

  /**
   * Whether to avoid the keyboard on native platforms (iOS/Android).
   * When enabled, content will shift up when the keyboard appears.
   * @default true
   * @platform native
   */
  avoidKeyboard?: boolean;

  /**
   * Called when the layout of the screen changes.
   * Provides the new width, height, x, and y coordinates.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
}

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { BackgroundVariant, SpacingVariant } from '../theme';

// Component-specific type aliases for future extensibility
export type ScreenBackgroundVariant = BackgroundVariant;
export type ScreenPaddingVariant = SpacingVariant;

export interface ScreenProps {
  /**
   * The content to display inside the screen
   */
  children?: ReactNode;

  /**
   * Background variant - controls the background color
   */
  background?: ScreenBackgroundVariant;

  /**
   * Screen padding variant
   */
  padding?: ScreenPaddingVariant;

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
} 
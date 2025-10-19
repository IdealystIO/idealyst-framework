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
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

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
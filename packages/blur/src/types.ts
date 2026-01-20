import type { ReactNode, CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

/**
 * Blur type for controlling the blur effect style
 * - 'light': Light blur effect (suitable for light backgrounds)
 * - 'dark': Dark blur effect (suitable for dark backgrounds)
 * - 'default': Standard blur without tint
 */
export type BlurType = 'light' | 'dark' | 'default';

/**
 * Common props shared between web and native BlurView implementations
 */
export interface BlurViewProps {
  /**
   * The intensity of the blur effect (0-100)
   * @default 50
   */
  intensity?: number;

  /**
   * The type of blur effect to apply
   * @default 'default'
   */
  blurType?: BlurType;

  /**
   * Content to render inside the blur view
   */
  children?: ReactNode;

  /**
   * Style to apply to the blur container
   */
  style?: ViewStyle | CSSProperties;

  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * Web-specific props for BlurView
 */
export interface BlurViewWebProps extends BlurViewProps {
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Native-specific props for BlurView
 * Extends the base props with react-native-community/blur specific options
 */
export interface BlurViewNativeProps extends BlurViewProps {
  /**
   * Reduce the intensity of the blur effect when set to true
   * Only applicable on iOS
   */
  reducedTransparencyFallbackColor?: string;
}

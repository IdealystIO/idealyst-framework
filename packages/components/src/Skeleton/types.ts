import type { StyleProp, ViewStyle } from 'react-native';

export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps {
  /**
   * Width of the skeleton (number in pixels or string with units)
   * @default '100%'
   */
  width?: number | string;

  /**
   * Height of the skeleton (number in pixels or string with units)
   * @default 20
   */
  height?: number | string;

  /**
   * Shape of the skeleton
   * @default 'rectangle'
   */
  shape?: SkeletonShape;

  /**
   * Border radius for 'rounded' shape (in pixels)
   * @default 8
   */
  borderRadius?: number;

  /**
   * Animation type
   * @default 'pulse'
   */
  animation?: SkeletonAnimation;

  /**
   * Additional custom styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

export interface SkeletonGroupProps {
  /**
   * Number of skeleton items to render
   * @default 3
   */
  count?: number;

  /**
   * Spacing between skeleton items (in pixels)
   * @default 12
   */
  spacing?: number;

  /**
   * Props to pass to each skeleton item
   */
  skeletonProps?: Omit<SkeletonProps, 'testID'>;

  /**
   * Additional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

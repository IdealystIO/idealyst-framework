import { Size, Surface } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type ViewBackgroundVariant = Surface | 'transparent';
export type ViewRadiusVariant = Size | 'none';
export type ViewBorderVariant = 'none' | 'thin' | 'thick';

export interface ViewProps extends ContainerStyleProps {
  /**
   * The content to display inside the view
   */
  children?: ReactNode;

  /**
   * Background variant
   */
  background?: ViewBackgroundVariant;

  /**
   * Border radius variant
   */
  radius?: ViewRadiusVariant;

  /**
   * Border variant
   */
  border?: ViewBorderVariant;

  /**
   * Custom background color (overrides background variant)
   */
  backgroundColor?: string;

  /**
   * Custom border radius (overrides radius variant)
   */
  borderRadius?: number;

  /**
   * Custom border width (overrides border variant)
   */
  borderWidth?: number;

  /**
   * Custom border color
   */
  borderColor?: string;

  /**
   * Additional styles (platform-specific)
   */
  style?: React.CSSProperties | StyleProp<ViewStyle>;

  /**
   * Enable scrollable content (uses ScrollView on native, overflow:auto on web)
   */
  scrollable?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}

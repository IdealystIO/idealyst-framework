import { Size, Surface, ResponsiveStyle } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';

/**
 * Style prop type that accepts both regular styles and responsive styles.
 * Responsive styles allow breakpoint-based values:
 * @example
 * ```tsx
 * // Regular style
 * <View style={{ flexDirection: 'column' }} />
 *
 * // Responsive style
 * <View style={{ flexDirection: { xs: 'column', md: 'row' } }} />
 *
 * // Style array (native only)
 * <View style={[styles.container, { padding: 10 }]} />
 *
 * // Web-only CSS properties
 * <View style={{ display: 'inline-block' }} />
 * ```
 */
export type ViewStyleProp = StyleProp<ViewStyle> | ResponsiveStyle | React.CSSProperties;

// Component-specific type aliases for future extensibility
export type ViewBackgroundVariant = Surface | 'transparent';
export type ViewRadiusVariant = Size | 'none';
export type ViewBorderVariant = 'none' | 'thin' | 'thick';

/**
 * Fundamental layout building block with responsive styling support.
 * Supports theme-aware backgrounds, borders, and breakpoint-based style values.
 */
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
   * Additional styles. Supports responsive values for any property.
   * @example
   * ```tsx
   * // Responsive flexDirection
   * <View style={{ flexDirection: { xs: 'column', md: 'row' } }} />
   *
   * // Mix responsive and static values
   * <View style={{ padding: { xs: 8, lg: 16 }, backgroundColor: '#fff' }} />
   * ```
   */
  style?: ViewStyleProp;

  /**
   * Enable scrollable content (uses ScrollView on native, overflow:auto on web)
   */
  scrollable?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}

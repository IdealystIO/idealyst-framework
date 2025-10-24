import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { BackgroundVariant, SpacingVariant, RadiusVariant } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type ViewBackgroundVariant = BackgroundVariant;
export type ViewSpacingVariant = SpacingVariant;
export type ViewRadiusVariant = RadiusVariant;
export type ViewBorderVariant = 'none' | 'thin' | 'thick';

export interface ViewProps {
  /**
   * The content to display inside the view
   */
  children?: ReactNode;

  /**
   * Padding/spacing variant
   */
  spacing?: ViewSpacingVariant;

  /**
   * Margin variant
   */
  marginVariant?: ViewSpacingVariant;

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
   * Custom padding (overrides spacing variant)
   */
  padding?: number;

  /**
   * Custom margin (overrides marginVariant)
   */
  margin?: number;

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
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
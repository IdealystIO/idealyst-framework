import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ViewProps {
  /**
   * The content to display inside the view
   */
  children?: ReactNode;

  /**
   * Padding variant
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Margin variant
   */
  marginVariant?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Background variant
   */
  background?: 'transparent' | 'surface' | 'primary' | 'secondary';

  /**
   * Border radius variant
   */
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Border variant
   */
  border?: 'none' | 'thin' | 'thick';

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
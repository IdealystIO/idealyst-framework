import { Intent, Size, Surface } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';
import type { LayoutChangeEvent } from '../hooks/useWebLayout';

// Component-specific type aliases for future extensibility
export type CardIntentVariant = Intent;
export type CardType = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardRadiusVariant = 'none' | Size;
export type CardBackgroundVariant = Surface;

/**
 * Container component for grouping related content with visual separation.
 * Supports multiple visual styles including outlined, elevated, and filled variants.
 */
export interface CardProps extends ContainerStyleProps, InteractiveAccessibilityProps {
  /**
   * The content to display inside the card
   */
  children?: ReactNode;

  /**
   * The visual style variant of the card
   */
  type?: CardType;

  /**
   * Alias for type - the visual style variant of the card
   */
  variant?: CardType;

  /**
   * The border radius of the card
   */
  radius?: CardRadiusVariant;

  /**
   * The intent/color scheme of the card
   */
  intent?: CardIntentVariant;

  /**
   * The background color from the surface palette (screen, primary, secondary, tertiary, inverse, etc.)
   */
  background?: CardBackgroundVariant;

  /**
   * Called when the card is pressed.
   * Providing this prop automatically makes the card pressable with hover effects.
   */
  onPress?: () => void;

  /**
   * Whether the card is disabled
   */
  disabled?: boolean;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Called when the layout of the card changes.
   * Provides the new width, height, x, and y coordinates.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
}

import { Intent, Size } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type CardIntentVariant = Intent;
export type CardType = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardRadiusVariant = 'none' | Size;

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
   * Whether the card is clickable
   */
  clickable?: boolean;

  /**
   * Called when the card is pressed (if clickable)
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
}

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant } from '../theme/variants';

// Component-specific type aliases for future extensibility
export type CardIntentVariant = IntentVariant;
export type CardType = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardPaddingVariant = 'none' | 'sm' | 'md' | 'lg';
export type CardRadiusVariant = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  /**
   * The content to display inside the card
   */
  children?: ReactNode;

  /**
   * The visual style variant of the card
   */
  type?: CardType;

  /**
   * The padding size inside the card
   */
  padding?: CardPaddingVariant;

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

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
} 
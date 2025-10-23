import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant, SizeVariant } from '../theme';

// Component-specific type aliases for future extensibility
export type ActivityIndicatorIntentVariant = IntentVariant;
export type ActivityIndicatorSizeVariant = SizeVariant | number;

export interface ActivityIndicatorProps {
  /**
   * Whether the indicator is animating (visible)
   * @default true
   */
  animating?: boolean;

  /**
   * The size of the indicator
   * @default "medium"
   */
  size?: ActivityIndicatorSizeVariant;

  /**
   * The color/intent of the indicator
   * @default "primary"
   */
  intent?: ActivityIndicatorIntentVariant;

  /**
   * Custom color to override intent
   */
  color?: string;

  /**
   * Additional styles to apply to the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier for testing
   */
  testID?: string;

  /**
   * Whether to hide the indicator when not animating
   * @default true
   */
  hidesWhenStopped?: boolean;
}
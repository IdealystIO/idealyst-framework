import { ViewStyle } from 'react-native';

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
  size?: 'small' | 'medium' | 'large' | number;
  
  /**
   * The color/intent of the indicator
   * @default "primary"
   */
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  
  /**
   * Custom color to override intent
   */
  color?: string;
  
  /**
   * Additional styles to apply to the container
   */
  style?: ViewStyle;
  
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
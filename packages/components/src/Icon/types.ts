import { IconName } from "./icon-types";
import type { DisplayColorVariant } from '../theme/variants';

export type IconSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /**
   * The name of the icon to display
   */
  name: IconName;
  
  /**
   * The size variant of the icon
   */
  size?: IconSizeVariant;

  /**
   * Predefined color variant based on theme
   */
  color?: DisplayColorVariant;
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
}
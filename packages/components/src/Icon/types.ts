import { IconName } from "./icon-types";
import type { DisplayColorVariant, IconSize } from '../theme/variants';

/**
 * @deprecated Use IconSize from theme instead
 */
export type IconSizeVariant = IconSize;

export interface IconProps {
  /**
   * The name of the icon to display
   */
  name: IconName;

  /**
   * The size variant of the icon
   */
  size?: IconSize | number;

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
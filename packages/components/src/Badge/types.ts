import { ReactNode } from 'react';
import type { DisplayColorVariant } from '../theme/variants';
import type { IconName } from '../Icon/icon-types';

export interface BadgeProps {
  /**
   * The content to display inside the badge
   */
  children?: ReactNode;

  /**
   * The size of the badge
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The visual style variant of the badge
   */
  variant?: 'filled' | 'outlined' | 'dot';

  /**
   * The color scheme of the badge
   */
  color?: DisplayColorVariant;

  /**
   * Icon to display. Can be an icon name or custom component (ReactNode)
   */
  icon?: IconName | ReactNode;

  /**
   * Additional styles
   */
  style?: any;

  /**
   * Test ID for testing
   */
  testID?: string;
} 
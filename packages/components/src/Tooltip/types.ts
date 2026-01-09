import { Intent, Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';
import { AccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TooltipIntentVariant = Intent;
export type TooltipSizeVariant = Size;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Contextual popup that displays helpful information on hover or focus.
 * Supports configurable placement and delay timing.
 */
export interface TooltipProps extends BaseProps, AccessibilityProps {
  /**
   * Content to display in the tooltip
   */
  content: string | React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  intent?: TooltipIntentVariant;
  size?: TooltipSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

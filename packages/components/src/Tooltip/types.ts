import { Intent, Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type TooltipIntentVariant = Intent;
export type TooltipSizeVariant = Size;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends BaseProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  intent?: TooltipIntentVariant;
  size?: TooltipSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TooltipIntentVariant = IntentVariant;
export type TooltipSizeVariant = ButtonSize;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  intent?: TooltipIntentVariant;
  size?: TooltipSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

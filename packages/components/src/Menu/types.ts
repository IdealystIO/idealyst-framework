import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type MenuIntentVariant = IntentVariant;
export type MenuSizeVariant = ButtonSize;
export type MenuPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

export interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconName | React.ReactNode;
  intent?: MenuIntentVariant;
  separator?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor: React.RefObject<HTMLElement>;
  placement?: MenuPlacement;
  closeOnSelection?: boolean;
  size?: MenuSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

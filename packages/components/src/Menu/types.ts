import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type MenuIntentVariant = Intent;
export type MenuSizeVariant = Size;
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

export interface MenuProps extends BaseProps, InteractiveAccessibilityProps {
  children: React.ReactNode;
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: MenuPlacement;
  closeOnSelection?: boolean;
  size?: MenuSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

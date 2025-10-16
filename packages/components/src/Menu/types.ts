import type { ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';

export interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconName | React.ReactNode;
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  separator?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor: React.RefObject<HTMLElement>;
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
  closeOnSelection?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}

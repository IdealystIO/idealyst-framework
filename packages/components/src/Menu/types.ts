import type { ViewStyle } from 'react-native';

export interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
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

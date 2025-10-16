import type { ViewStyle } from 'react-native';

export type AlertIntent = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type AlertVariant = 'filled' | 'outlined' | 'soft';

export interface AlertProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
  intent?: AlertIntent;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

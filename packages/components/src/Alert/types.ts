import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant } from '../theme';

// Component-specific type aliases for future extensibility
export type AlertIntentVariant = IntentVariant;
export type AlertVariant = 'filled' | 'outlined' | 'soft';

export interface AlertProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
  intent?: AlertIntentVariant;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

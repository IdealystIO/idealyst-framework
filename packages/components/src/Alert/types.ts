import type { StyleProp, ViewStyle } from 'react-native';
import type { Intent } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type AlertIntentVariant = Intent;
export type AlertType= 'filled' | 'outlined' | 'soft';

/**
 * Feedback message component for displaying important information to users.
 * Supports multiple intent colors, dismissible behavior, and custom actions.
 */
export interface AlertProps extends BaseProps {
  /**
   * The title of the alert
   */
  title?: string;
  message?: string;
  children?: React.ReactNode;
  intent?: AlertIntentVariant;
  type?: AlertType;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

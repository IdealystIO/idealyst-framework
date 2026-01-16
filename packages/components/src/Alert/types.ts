import type { StyleProp, ViewStyle } from 'react-native';
import type { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type AlertIntentVariant = Intent;
export type AlertSizeVariant = Size;
export type AlertType = 'filled' | 'outlined' | 'soft';

/**
 * Feedback message component for displaying important information to users.
 * Supports multiple intent colors, sizes, dismissible behavior, and custom actions.
 */
export interface AlertProps extends BaseProps {
  /**
   * The title of the alert
   */
  title?: string;

  /**
   * The message content of the alert
   */
  message?: string;

  /**
   * Custom content to display in the alert
   */
  children?: React.ReactNode;

  /**
   * The intent/color scheme of the alert
   */
  intent?: AlertIntentVariant;

  /**
   * The visual style type of the alert
   */
  type?: AlertType;

  /**
   * The size of the alert
   */
  size?: AlertSizeVariant;

  /**
   * Custom icon to display. Pass `null` to hide icon.
   */
  icon?: React.ReactNode;

  /**
   * Whether to show the default intent icon
   */
  showIcon?: boolean;

  /**
   * Whether the alert can be dismissed
   */
  dismissible?: boolean;

  /**
   * Called when the alert is dismissed
   */
  onDismiss?: () => void;

  /**
   * Action buttons to display at the bottom of the alert
   */
  actions?: React.ReactNode;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

export interface LinkProps extends BaseProps {
  /** The destination path to navigate to */
  to: string;
  /** Variables to substitute in the path (e.g., { id: '123' } for '/user/:id') */
  vars?: Record<string, string>;
  /** Content to render inside the link */
  children?: ReactNode;
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Style to apply to the link container */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Callback fired when the link is pressed */
  onPress?: () => void;
}

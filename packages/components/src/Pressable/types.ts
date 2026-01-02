import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { PressableSpacingStyleProps } from '../utils/viewStyleProps';

export interface PressableProps extends PressableSpacingStyleProps {
  /**
   * Content to render inside the pressable area
   */
  children?: ReactNode;

  /**
   * Called when the press gesture is activated
   */
  onPress?: () => void;

  /**
   * Called when the press gesture starts
   */
  onPressIn?: () => void;

  /**
   * Called when the press gesture ends
   */
  onPressOut?: () => void;

  /**
   * Whether the pressable is disabled
   */
  disabled?: boolean;

  /**
   * Additional styles to apply
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Accessibility role (web)
   */
  accessibilityRole?: string;
}

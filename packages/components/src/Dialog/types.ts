import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type DialogSizeVariant = 'sm' | 'md' | 'lg' | 'fullscreen';
export type DialogType = 'default' | 'alert' | 'confirmation';
export type DialogAnimationType = 'slide' | 'fade' | 'none';

/**
 * Modal dialog component for focused interactions requiring user attention.
 * Supports multiple sizes, animation types, and configurable close behaviors.
 */
export interface DialogProps extends BaseProps, InteractiveAccessibilityProps {
  /**
   * Whether the dialog is open/visible
   */
  open: boolean;

  /**
   * Called when the dialog should be closed
   */
  onClose: () => void;

  /**
   * Optional title for the dialog
   */
  title?: string;

  /**
   * The content to display inside the dialog
   */
  children: ReactNode;

  /**
   * The size of the dialog
   */
  size?: DialogSizeVariant;

  /**
   * The visual style variant of the dialog
   */
  type?: DialogType,

  /**
   * Whether to show the close button in the header
   */
  showCloseButton?: boolean;

  /**
   * Whether clicking the backdrop should close the dialog
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing escape key should close the dialog (web only)
   */
  closeOnEscapeKey?: boolean;

  /**
   * Animation type for the dialog (native only)
   */
  animationType?: DialogAnimationType;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type DialogSizeVariant = 'sm' | 'md' | 'lg' | 'fullscreen';
export type DialogType = 'standard' | 'alert' | 'confirmation';
export type DialogAnimationType = 'slide' | 'fade' | 'none';

export interface DialogProps extends BaseProps {
  /**
   * Whether the dialog is open/visible
   */
  open: boolean;

  /**
   * Called when the dialog should be opened or closed
   */
  onOpenChange: (open: boolean) => void;

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
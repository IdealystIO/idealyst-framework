import type { ReactNode, ComponentType } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type DialogSizeVariant = 'sm' | 'md' | 'lg' | 'fullscreen';
export type DialogType = 'default' | 'alert' | 'confirmation';
export type DialogAnimationType = 'slide' | 'fade' | 'none';

/**
 * Props passed to custom backdrop components
 */
export interface BackdropComponentProps {
  /**
   * Whether the dialog is visible (for animation purposes)
   */
  isVisible: boolean;
}

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
   * Maximum height for the dialog content area (native only)
   */
  maxContentHeight?: number;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Custom backdrop component that replaces the default backdrop.
   * The component will be rendered as a full-screen overlay behind the dialog.
   * It receives isVisible for animation coordination.
   */
  BackdropComponent?: ComponentType<BackdropComponentProps>;

  /**
   * Whether the dialog should avoid the keyboard on mobile (native only).
   * When true, the dialog content will shift up when the keyboard is shown.
   * @default false
   */
  avoidKeyboard?: boolean;

  /**
   * Fixed height for the dialog container.
   * Can be a number (pixels) or a string (e.g., '50%', '400px').
   * When set, children can use flex: 1 to fill the available space.
   */
  height?: number | string;

  /**
   * Padding for the dialog content area.
   * Set to 0 to disable padding for custom layouts.
   * @default 24
   */
  contentPadding?: number;

  /**
   * Style for the content wrapper.
   * Use { flex: 1 } to make content fill available space.
   * By default, content wraps to its implicit height.
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Padding around the dialog container
   * @default 20
   */
  padding?: number;
}
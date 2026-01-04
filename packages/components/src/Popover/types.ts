import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface PopoverProps extends BaseProps {
  /**
   * Whether the popover is open/visible
   */
  open: boolean;

  /**
   * Called when the popover should be opened or closed
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The anchor element to position the popover relative to
   * Can be a React element or a ref to a DOM element
   */
  anchor: ReactNode | React.RefObject<Element>;

  /**
   * The content to display inside the popover
   */
  children: ReactNode;

  /**
   * Preferred placement of the popover relative to anchor
   */
  placement?: PopoverPlacement;

  /**
   * Distance from the anchor element in pixels
   */
  offset?: number;

  /**
   * Whether clicking outside should close the popover
   */
  closeOnClickOutside?: boolean;

  /**
   * Whether pressing escape key should close the popover (web only)
   */
  closeOnEscapeKey?: boolean;

  /**
   * Whether to show an arrow pointing to the anchor
   */
  showArrow?: boolean;

  /**
   * Additional styles (platform-specific)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
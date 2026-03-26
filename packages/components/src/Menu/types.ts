import type { RefObject } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';
import { InteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

// Component-specific type aliases for future extensibility
export type MenuIntentVariant = Intent;
export type MenuSizeVariant = Size;
export type MenuPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

export interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconName | React.ReactNode;
  intent?: MenuIntentVariant;
  separator?: boolean;
}

export interface MenuProps extends BaseProps, InteractiveAccessibilityProps {
  /**
   * Trigger element that opens the menu on press/click.
   * Either `children` or `anchor` must be provided.
   */
  children?: React.ReactNode;

  /**
   * External anchor ref to position the menu relative to.
   * When provided, no trigger wrapper is rendered — the consumer controls open/close.
   *
   * @example
   * ```tsx
   * const ref = useRef<IdealystElement>(null);
   * <Button ref={ref} onPress={() => setOpen(true)}>Actions</Button>
   * <Menu anchor={ref} open={open} onOpenChange={setOpen} items={items} />
   * ```
   */
  anchor?: RefObject<IdealystElement>;

  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: MenuPlacement;
  closeOnSelection?: boolean;
  size?: MenuSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { IconName } from '../Icon/icon-types';
import { Size, Color, Intent } from '@idealyst/theme';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { AccessibilityProps, SelectableAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type ListSizeVariant = Size;
export type ListType = 'default' | 'bordered' | 'divided';

export interface ListItemProps extends SelectableAccessibilityProps {
  id?: string;
  label?: string;
  children?: ReactNode;
  leading?: IconName | ReactNode;
  trailing?: IconName | ReactNode;
  /** Color for leading and trailing icons. Accepts intent names (primary, success, error, warning) or palette colors (blue.500, red.300) */
  iconColor?: Intent | Color;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
  indent?: number;
  size?: ListSizeVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Container for organizing related items in a vertical list format.
 * Supports bordered, divided, and default visual styles with optional scrolling.
 */
export interface ListProps extends ContainerStyleProps, AccessibilityProps {
  /**
   * List items to display
   */
  children: ReactNode;
  type?: ListType;
  size?: ListSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  scrollable?: boolean;
  maxHeight?: number | string;
}

export interface ListSectionProps {
  title?: string;
  children: ReactNode;
  collapsed?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

// Component-specific type aliases for future extensibility
export type BreadcrumbIntentVariant = 'primary' | 'neutral';
export type BreadcrumbSizeVariant = Size;

export interface BreadcrumbItem {
  /** Label text for the breadcrumb item */
  label: string;

  /** Optional icon to display before the label - can be an IconName or custom component */
  icon?: IconName | React.ReactNode;

  /** Click handler for the breadcrumb item */
  onPress?: () => void;

  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface BreadcrumbProps extends BaseProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];

  /** Custom separator between items (default: '/') */
  separator?: React.ReactNode;

  /** Maximum number of items to show before truncating */
  maxItems?: number;

  /** Intent color for links */
  intent?: BreadcrumbIntentVariant;

  /** Size of the breadcrumb text */
  size?: BreadcrumbSizeVariant;

  /** Custom container style */
  style?: StyleProp<ViewStyle>;

  /** Custom item style */
  itemStyle?: StyleProp<ViewStyle>;

  /** Custom separator style */
  separatorStyle?: StyleProp<TextStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Enable responsive collapsing on narrow screens */
  responsive?: boolean;

  /** Minimum number of items to show before collapsing (default: 3) */
  minVisibleItems?: number;
}

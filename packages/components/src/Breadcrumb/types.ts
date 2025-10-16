import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';

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

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];

  /** Custom separator between items (default: '/') */
  separator?: React.ReactNode;

  /** Maximum number of items to show before truncating */
  maxItems?: number;

  /** Intent color for links */
  intent?: 'primary' | 'neutral';

  /** Size of the breadcrumb text */
  size?: 'small' | 'medium' | 'large';

  /** Custom container style */
  style?: StyleProp<ViewStyle>;

  /** Custom item style */
  itemStyle?: StyleProp<ViewStyle>;

  /** Custom separator style */
  separatorStyle?: StyleProp<TextStyle>;

  /** Test ID for testing */
  testID?: string;
}

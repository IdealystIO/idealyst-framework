import type { StyleProp, ViewStyle } from 'react-native';
import type { ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TabBarSizeVariant = ButtonSize;
export type TabBarVariant = 'default' | 'pills' | 'underline';
export type TabBarPillMode = 'light' | 'dark';

export interface TabBarItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabBarProps {
  items: TabBarItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabBarVariant;
  size?: TabBarSizeVariant;
  /** Mode for pills variant: 'light' for light backgrounds (dark pill), 'dark' for dark backgrounds (light pill) */
  pillMode?: TabBarPillMode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

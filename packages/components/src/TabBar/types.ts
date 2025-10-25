import { Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle } from 'react-native';

// Component-specific type aliases for future extensibility
export type TabBarSizeVariant = Size;
export type TabBarType = 'standard' | 'pills' | 'underline';
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
  type?: TabBarType;
  size?: TabBarSizeVariant;
  /** Mode for pills variant: 'light' for light backgrounds (dark pill), 'dark' for dark backgrounds (light pill) */
  pillMode?: TabBarPillMode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

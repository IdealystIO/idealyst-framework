import type { StyleProp, ViewStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TabBarIntentVariant = IntentVariant;
export type TabBarSizeVariant = ButtonSize;
export type TabBarVariant = 'default' | 'pills' | 'underline';

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
  intent?: TabBarIntentVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

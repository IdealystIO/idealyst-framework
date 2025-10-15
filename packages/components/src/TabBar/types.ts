import type { ViewStyle } from 'react-native';

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
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  style?: ViewStyle;
  testID?: string;
}

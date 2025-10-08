import type { ViewStyle } from 'react-native';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  style?: ViewStyle;
  testID?: string;
}

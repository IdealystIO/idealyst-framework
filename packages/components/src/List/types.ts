import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface ListItemProps {
  id?: string;
  label?: string;
  children?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
  indent?: number;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface ListProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'divided';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}

export interface ListSectionProps {
  title?: string;
  children: ReactNode;
  collapsed?: boolean;
  style?: ViewStyle;
  testID?: string;
}

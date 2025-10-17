import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { IconName } from '../Icon/icon-types';

export interface ListItemProps {
  id?: string;
  label?: string;
  children?: ReactNode;
  leading?: IconName | ReactNode;
  trailing?: IconName | ReactNode;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
  indent?: number;
  size?: 'small' | 'medium' | 'large';
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

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { IconName } from '../Icon/icon-types';
import { Size } from '@idealyst/theme';

// Component-specific type aliases for future extensibility
export type ListSizeVariant = Size;
export type ListType = 'default' | 'bordered' | 'divided';

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
  size?: ListSizeVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface ListProps {
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

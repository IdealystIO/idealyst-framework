import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TableSizeVariant = ButtonSize;
export type TableVariant = 'default' | 'bordered' | 'striped';
export type TableAlignVariant = 'left' | 'center' | 'right';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: number | string;
  align?: TableAlignVariant;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  variant?: TableVariant;
  size?: TableSizeVariant;
  stickyHeader?: boolean;
  onRowPress?: (row: T, index: number) => void;
  style?: ViewStyle;
  testID?: string;
}

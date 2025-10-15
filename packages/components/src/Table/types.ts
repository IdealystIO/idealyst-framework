import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  variant?: 'default' | 'bordered' | 'striped';
  size?: 'small' | 'medium' | 'large';
  stickyHeader?: boolean;
  onRowPress?: (row: T, index: number) => void;
  style?: ViewStyle;
  testID?: string;
}

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import { Size } from '@idealyst/theme';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { AccessibilityProps, SortableAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TableSizeVariant = Size;
export type TableType = 'standard' | 'bordered' | 'striped';
export type TableAlignVariant = 'left' | 'center' | 'right';

export interface TableColumn<T = any> extends SortableAccessibilityProps {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: number | string;
  align?: TableAlignVariant;
}

export interface TableProps<T = any> extends ContainerStyleProps, AccessibilityProps {
  columns: TableColumn<T>[];
  data: T[];
  type?: TableType;
  size?: TableSizeVariant;
  stickyHeader?: boolean;
  onRowPress?: (row: T, index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

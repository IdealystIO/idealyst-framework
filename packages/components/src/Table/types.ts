import type { StyleProp, ViewStyle } from 'react-native';
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
  title: ReactNode;
  dataIndex?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  footer?: ReactNode | ((data: T[]) => ReactNode);
  width?: number | string;
  align?: TableAlignVariant;
  /**
   * Makes this column sticky (pinned) when scrolling horizontally.
   * `true` or `'left'` pins to the left, `'right'` pins to the right.
   * On web uses CSS `position: sticky`, on native renders outside the ScrollView.
   */
  sticky?: boolean | 'left' | 'right';
  /**
   * Allows the column to be resized by dragging the right edge of the header.
   * Web only.
   */
  resizable?: boolean;
  /**
   * Minimum width when resizing (default: 50).
   */
  minWidth?: number;
}

/**
 * Data display component for rendering tabular information with columns and rows.
 * Supports sticky headers, row selection, and custom cell rendering.
 */
export interface TableProps<T = any> extends ContainerStyleProps, AccessibilityProps {
  /**
   * Column definitions for the table
   */
  columns: TableColumn<T>[];
  data: T[];
  type?: TableType;
  size?: TableSizeVariant;
  stickyHeader?: boolean;
  onRowPress?: (row: T, index: number) => void;
  /**
   * Called when a column is resized via drag handle.
   * Receives the column key and the new width in pixels.
   */
  onColumnResize?: (key: string, width: number) => void;
  /**
   * Content to display when `data` is empty.
   * Renders in place of the table body.
   */
  emptyState?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

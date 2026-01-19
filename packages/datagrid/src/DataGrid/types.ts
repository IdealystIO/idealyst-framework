import { ViewStyle, TextStyle } from 'react-native';

export interface Column<T = any> {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  accessor?: (row: T) => any;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  /** Custom header renderer - if provided, renders instead of header string */
  renderHeader?: () => React.ReactNode;
  headerStyle?: ViewStyle;
  cellStyle?: ViewStyle | ((value: any, row: T) => ViewStyle);
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (column: Column<T>, direction: 'asc' | 'desc') => void;
  /** Callback when a column is resized. Receives the column key and the new width. Only called on mouse release. */
  onColumnResize?: (columnKey: string, width: number) => void;
  /** Resize mode: 'indicator' shows a line during drag (default), 'live' updates column width during drag */
  columnResizeMode?: 'indicator' | 'live';
  virtualized?: boolean;
  height?: number | string;
  width?: number | string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  rowStyle?: ViewStyle | ((row: T, index: number) => ViewStyle);
  selectedRows?: number[];
  onSelectionChange?: (selectedRows: number[]) => void;
  multiSelect?: boolean;
  stickyHeader?: boolean;
}

export interface CellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  onPress?: () => void;
}

export interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  selected?: boolean;
}

export interface HeaderCellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  resizable?: boolean;
  onResize?: (width: number) => void;
}
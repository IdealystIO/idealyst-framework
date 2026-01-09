import React, { useMemo, ReactNode } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn, TableType, TableSizeVariant, TableAlignVariant } from './types';
import { getWebAriaProps } from '../utils/accessibility';

// ============================================================================
// Sub-component Props
// ============================================================================

interface TRProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  clickable?: boolean;
  onClick?: () => void;
  testID?: string;
}

interface THProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
  accessibilitySort?: 'ascending' | 'descending' | 'none' | 'other';
}

interface TDProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
}

// ============================================================================
// TR Component
// ============================================================================

function TR({
  children,
  size = 'md',
  type = 'standard',
  clickable = false,
  onClick,
  testID,
}: TRProps) {
  tableStyles.useVariants({
    size,
    type,
    clickable,
  });

  const rowProps = getWebProps([(tableStyles.row as any)({})]);

  return (
    <tr
      {...rowProps}
      onClick={onClick}
      data-testid={testID}
    >
      {children}
    </tr>
  );
}

// ============================================================================
// TH Component
// ============================================================================

function TH({
  children,
  size = 'md',
  type = 'standard',
  align = 'left',
  width,
  accessibilitySort,
}: THProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const headerCellProps = getWebProps([(tableStyles.headerCell as any)({})]);

  return (
    <th
      {...headerCellProps}
      scope="col"
      aria-sort={accessibilitySort}
      style={{ width }}
    >
      {children}
    </th>
  );
}

// ============================================================================
// TD Component
// ============================================================================

function TD({
  children,
  size = 'md',
  type = 'standard',
  align = 'left',
  width,
}: TDProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const cellProps = getWebProps([(tableStyles.cell as any)({})]);

  return (
    <td
      {...cellProps}
      style={{ width }}
    >
      {children}
    </td>
  );
}

// ============================================================================
// Main Table Component
// ============================================================================

function Table<T = any>({
  columns,
  data,
  type = 'standard',
  size = 'md',
  stickyHeader = false,
  onRowPress,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
}: TableProps<T>) {
  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'table',
      accessibilityHidden,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityRole, accessibilityHidden]);

  // Apply variants for container
  tableStyles.useVariants({
    type,
    size,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const containerProps = getWebProps([(tableStyles.container as any)({}), style as any]);
  const tableProps = getWebProps([(tableStyles.table as any)({})]);

  // Helper to get cell value
  const getCellValue = (column: TableColumn<T>, row: T, rowIndex: number) => {
    if (column.render) {
      const value = column.dataIndex ? (row as any)[column.dataIndex] : row;
      return column.render(value, row, rowIndex);
    }
    return column.dataIndex ? (row as any)[column.dataIndex] : '';
  };

  const isClickable = !!onRowPress;

  return (
    <div {...containerProps} {...ariaProps} id={id} data-testid={testID}>
      <table {...tableProps} role="table">
        <thead {...getWebProps([(tableStyles.thead as any)({})])}>
          <tr>
            {columns.map((column) => (
              <TH
                key={column.key}
                size={size}
                type={type}
                align={column.align}
                width={column.width}
                accessibilitySort={column.accessibilitySort}
              >
                {column.title}
              </TH>
            ))}
          </tr>
        </thead>
        <tbody {...getWebProps([(tableStyles.tbody as any)({})])}>
          {data.map((row, rowIndex) => (
            <TR
              key={rowIndex}
              size={size}
              type={type}
              clickable={isClickable}
              onClick={() => onRowPress?.(row, rowIndex)}
              testID={testID ? `${testID}-row-${rowIndex}` : undefined}
            >
              {columns.map((column) => (
                <TD
                  key={column.key}
                  size={size}
                  type={type}
                  align={column.align}
                  width={column.width}
                >
                  {getCellValue(column, row, rowIndex)}
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default Table;

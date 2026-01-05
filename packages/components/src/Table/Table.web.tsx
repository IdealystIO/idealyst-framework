import React, { useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn } from './types';
import { getWebAriaProps } from '../utils/accessibility';

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
  // Apply variants
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

  const containerProps = getWebProps([tableStyles.container, style as any]);
  const tableProps = getWebProps([tableStyles.table]);

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
        <thead {...getWebProps([tableStyles.thead])}>
          <tr>
            {columns.map((column) => {
              tableStyles.useVariants({
                size,
                align: column.align || 'left',
                type,
              });

              const headerCellProps = getWebProps([tableStyles.headerCell]);

              return (
                <th
                  key={column.key}
                  {...headerCellProps}
                  scope="col"
                  aria-sort={column.accessibilitySort}
                  style={{
                    width: column.width,
                  }}
                >
                  {column.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody {...getWebProps([tableStyles.tbody])}>
          {data.map((row, rowIndex) => {
            tableStyles.useVariants({
              size,
              align: 'left',
              type,
              clickable: isClickable,
            });

            const rowProps = getWebProps([tableStyles.row]);

            return (
              <tr
                key={rowIndex}
                {...rowProps}
                onClick={() => onRowPress?.(row, rowIndex)}
                data-testid={`${testID}-row-${rowIndex}`}
              >
                {columns.map((column) => {
                  tableStyles.useVariants({
                    size,
                    align: column.align || 'left',
                    type,
                  });

                  const cellProps = getWebProps([tableStyles.cell]);

                  return (
                    <td
                      key={column.key}
                      {...cellProps}
                      style={{
                        width: column.width,
                      }}
                    >
                      {getCellValue(column, row, rowIndex)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

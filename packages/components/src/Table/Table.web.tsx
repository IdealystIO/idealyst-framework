import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn } from './types';

function Table<T = any>({
  columns,
  data,
  variant = 'default',
  size = 'medium',
  stickyHeader = false,
  onRowPress,
  style,
  testID,
}: TableProps<T>) {
  // Apply variants
  tableStyles.useVariants({
    variant,
    size,
  });

  const containerProps = getWebProps([tableStyles.container, style]);
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
    <div {...containerProps} data-testid={testID}>
      <table {...tableProps}>
        <thead {...getWebProps([tableStyles.thead])}>
          <tr>
            {columns.map((column) => {
              tableStyles.useVariants({
                size,
                align: column.align || 'left',
                variant,
              });

              const headerCellProps = getWebProps([tableStyles.headerCell]);

              return (
                <th
                  key={column.key}
                  {...headerCellProps}
                  style={{
                    ...headerCellProps.style,
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
              variant,
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
                    variant,
                  });

                  const cellProps = getWebProps([tableStyles.cell]);

                  return (
                    <td
                      key={column.key}
                      {...cellProps}
                      style={{
                        ...cellProps.style,
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

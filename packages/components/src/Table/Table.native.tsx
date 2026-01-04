import React, { forwardRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn } from './types';

function TableInner<T = any>({
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
}: TableProps<T>, ref: React.Ref<ScrollView>) {
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

  // Helper to get cell value
  const getCellValue = (column: TableColumn<T>, row: T, rowIndex: number) => {
    if (column.render) {
      const value = column.dataIndex ? (row as any)[column.dataIndex] : row;
      return column.render(value, row, rowIndex);
    }
    const value = column.dataIndex ? (row as any)[column.dataIndex] : '';
    return <Text style={tableStyles.cell}>{String(value)}</Text>;
  };

  const isClickable = !!onRowPress;

  return (
    <ScrollView
      ref={ref}
      nativeID={id}
      horizontal
      style={[tableStyles.container, style]}
      testID={testID}
    >
      <View style={tableStyles.table}>
        {/* Header */}
        <View style={tableStyles.thead}>
          <View style={{ flexDirection: 'row' }}>
            {columns.map((column) => {
              tableStyles.useVariants({
                size,
                align: column.align || 'left',
                type,
              });

              return (
                <View
                  key={column.key}
                  style={[
                    tableStyles.headerCell,
                    { width: column.width, flex: column.width ? undefined : 1 },
                  ]}
                >
                  <Text style={tableStyles.headerCell}>
                    {column.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Body */}
        <View style={tableStyles.tbody}>
          {data.map((row, rowIndex) => {
            tableStyles.useVariants({
              type,
              clickable: isClickable,
            });

            const RowComponent = isClickable ? TouchableOpacity : View;

            return (
              <RowComponent
                key={rowIndex}
                style={tableStyles.row}
                onPress={isClickable ? () => onRowPress?.(row, rowIndex) : undefined}
                testID={`${testID}-row-${rowIndex}`}
              >
                <View style={{ flexDirection: 'row' }}>
                  {columns.map((column) => {
                    tableStyles.useVariants({
                      size,
                      align: column.align || 'left',
                      type,
                    });

                    return (
                      <View
                        key={column.key}
                        style={[
                          tableStyles.cell,
                          { width: column.width, flex: column.width ? undefined : 1 },
                        ]}
                      >
                        {getCellValue(column, row, rowIndex)}
                      </View>
                    );
                  })}
                </View>
              </RowComponent>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const Table = forwardRef(TableInner) as <T = any>(
  props: TableProps<T> & { ref?: React.Ref<ScrollView> }
) => React.ReactElement;

(Table as any).displayName = 'Table';

export default Table;

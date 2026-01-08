import React, { forwardRef, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';

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
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
}: TableProps<T>, ref: React.Ref<ScrollView>) {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'grid',
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

  // Call styles as functions to get theme-reactive styles
  const containerStyle = (tableStyles.container as any)({});
  const tableStyle = (tableStyles.table as any)({});
  const theadStyle = (tableStyles.thead as any)({});
  const tbodyStyle = (tableStyles.tbody as any)({});
  const rowStyle = (tableStyles.row as any)({});
  const headerCellStyle = (tableStyles.headerCell as any)({});
  const cellStyle = (tableStyles.cell as any)({});

  // Helper to get cell value
  const getCellValue = (column: TableColumn<T>, row: T, rowIndex: number) => {
    if (column.render) {
      const value = column.dataIndex ? (row as any)[column.dataIndex] : row;
      return column.render(value, row, rowIndex);
    }
    const value = column.dataIndex ? (row as any)[column.dataIndex] : '';
    return <Text style={cellStyle}>{String(value)}</Text>;
  };

  const isClickable = !!onRowPress;

  return (
    <ScrollView
      ref={ref}
      nativeID={id}
      horizontal
      style={[containerStyle, style]}
      testID={testID}
      {...nativeA11yProps}
    >
      <View style={tableStyle}>
        {/* Header */}
        <View style={theadStyle}>
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
                    headerCellStyle,
                    { width: column.width, flex: column.width ? undefined : 1 },
                  ]}
                >
                  <Text style={headerCellStyle}>
                    {column.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Body */}
        <View style={tbodyStyle}>
          {data.map((row, rowIndex) => {
            tableStyles.useVariants({
              type,
              clickable: isClickable,
            });

            const RowComponent = isClickable ? TouchableOpacity : View;

            return (
              <RowComponent
                key={rowIndex}
                style={rowStyle}
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
                          cellStyle,
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

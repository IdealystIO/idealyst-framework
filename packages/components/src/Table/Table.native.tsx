import React, { forwardRef, useMemo, ReactNode } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn, TableType, TableSizeVariant, TableAlignVariant } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';

// ============================================================================
// Sub-component Props
// ============================================================================

interface TRProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  clickable?: boolean;
  onPress?: () => void;
  testID?: string;
}

interface THProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
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
  onPress,
  testID,
}: TRProps) {
  tableStyles.useVariants({
    size,
    type,
    clickable,
  });

  const rowStyle = (tableStyles.row as any)({});
  const RowComponent = clickable ? TouchableOpacity : View;

  return (
    <RowComponent
      style={rowStyle}
      onPress={clickable ? onPress : undefined}
      testID={testID}
    >
      <View style={{ flexDirection: 'row' }}>
        {children}
      </View>
    </RowComponent>
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
}: THProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const headerCellStyle = (tableStyles.headerCell as any)({});

  return (
    <View
      style={[
        headerCellStyle,
        { width, flex: width ? undefined : 1 },
      ]}
    >
      <Text style={headerCellStyle}>
        {children}
      </Text>
    </View>
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

  const cellStyle = (tableStyles.cell as any)({});

  return (
    <View
      style={[
        cellStyle,
        { width, flex: width ? undefined : 1 },
      ]}
    >
      {children}
    </View>
  );
}

// ============================================================================
// Main Table Component
// ============================================================================

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

  // Call styles as functions to get theme-reactive styles
  const containerStyle = (tableStyles.container as any)({});
  const tableStyle = (tableStyles.table as any)({});
  const theadStyle = (tableStyles.thead as any)({});
  const tbodyStyle = (tableStyles.tbody as any)({});
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
            {columns.map((column) => (
              <TH
                key={column.key}
                size={size}
                type={type}
                align={column.align}
                width={column.width}
              >
                {column.title}
              </TH>
            ))}
          </View>
        </View>

        {/* Body */}
        <View style={tbodyStyle}>
          {data.map((row, rowIndex) => (
            <TR
              key={rowIndex}
              size={size}
              type={type}
              clickable={isClickable}
              onPress={() => onRowPress?.(row, rowIndex)}
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

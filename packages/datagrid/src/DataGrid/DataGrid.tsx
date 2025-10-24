import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from '@idealyst/components';
import { ScrollView } from '../primitives/ScrollView';
import { Table, TableRow, TableCell, TableHeader, TableBody } from '../primitives/Table';
import type { DataGridProps, Column } from './types';
import { dataGridStyles } from './DataGrid.styles';

export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 48,
  headerHeight = 56,
  onRowClick,
  onSort,
  virtualized = true,
  height = 400,
  width = '100%',
  style,
  headerStyle,
  rowStyle,
  selectedRows = [],
  onSelectionChange,
  multiSelect = false,
  stickyHeader = true,
}: DataGridProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [scrollTop, setScrollTop] = useState(0);

  // Virtualization calculations
  const visibleRange = useMemo(() => {
    if (!virtualized || typeof height !== 'number') {
      return { start: 0, end: data.length - 1, offsetY: 0 };
    }

    const containerHeight = height - headerHeight;
    const startIndex = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(containerHeight / rowHeight) + 2; // Add buffer
    const endIndex = Math.min(startIndex + visibleCount, data.length - 1);
    const offsetY = startIndex * rowHeight;

    return { start: startIndex, end: endIndex, offsetY };
  }, [scrollTop, height, headerHeight, rowHeight, data.length, virtualized]);

  const totalHeight = useMemo(() => {
    return virtualized ? data.length * rowHeight : 'auto';
  }, [data.length, rowHeight, virtualized]);

  const visibleData = useMemo(() => {
    if (!virtualized) return data;
    return data.slice(visibleRange.start, visibleRange.end + 1);
  }, [data, visibleRange.start, visibleRange.end, virtualized]);

  // Calculate minimum table width for horizontal scrolling
  const minTableWidth = useMemo(() => {
    return columns.reduce((total, column) => {
      return total + (column.width ? (typeof column.width === 'number' ? column.width : 120) : 120);
    }, 0);
  }, [columns]);

  const handleScroll = useCallback((e: any) => {
    if (virtualized) {
      // Handle both web and React Native scroll events
      const scrollY = e.currentTarget?.scrollTop ?? e.nativeEvent?.contentOffset?.y ?? 0;
      setScrollTop(scrollY);
    }
  }, [virtualized]);

  // Helper function to get consistent column styles
  const getColumnStyle = (column: Column<T>) => {
    const baseStyle = {
      boxSizing: 'border-box' as const,
      flexShrink: 0,
    };

    if (column.width) {
      return {
        ...baseStyle,
        width: column.width,
        flexGrow: 0,
        flexBasis: column.width,
      };
    } else {
      return {
        ...baseStyle,
        flexGrow: 1,
        flexBasis: 0,
        minWidth: column.minWidth || 120,
        ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
      };
    }
  };

  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.key);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  const handleRowClick = useCallback((row: T, index: number) => {
    if (onSelectionChange) {
      let newSelection: number[];
      if (multiSelect) {
        if (selectedRows.includes(index)) {
          newSelection = selectedRows.filter(i => i !== index);
        } else {
          newSelection = [...selectedRows, index];
        }
      } else {
        newSelection = selectedRows.includes(index) ? [] : [index];
      }
      onSelectionChange(newSelection);
    }
    onRowClick?.(row, index);
  }, [selectedRows, onSelectionChange, multiSelect, onRowClick]);

  const renderHeader = () => (
    <TableRow style={{
      ...dataGridStyles.headerRow({ stickyHeader }),
      minHeight: headerHeight,
      ...headerStyle,
    }}>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          width={column.width}
          style={{
            ...dataGridStyles.headerCell,
            ...getColumnStyle(column),
          }}
          onPress={column.sortable ? () => handleSort(column) : undefined}
        >
          <Text
            weight="bold"
            style={dataGridStyles.headerText({ clickable: column.sortable || false })}
          >
            {column.header}
            {column.sortable && (
              <Text style={{ marginLeft: 4 }}>
                {sortColumn === column.key ? ` ${sortDirection === 'asc' ? '▲' : '▼'}` : ''}
              </Text>
            )}
          </Text>
        </TableCell>
      ))}
    </TableRow>
  );

  const renderRow = (item: T, virtualIndex: number) => {
    const actualIndex = virtualized ? visibleRange.start + virtualIndex : virtualIndex;
    const isSelected = selectedRows.includes(actualIndex);
    const computedRowStyle = typeof rowStyle === 'function' ? rowStyle(item, actualIndex) : rowStyle;

    return (
      <TableRow
        key={actualIndex}
        style={{
          ...dataGridStyles.row({ selected: isSelected }),
          minHeight: rowHeight,
          ...computedRowStyle,
        }}
        onPress={() => handleRowClick(item, actualIndex)}
      >
        {columns.map((column) => {
          const value = column.accessor ? column.accessor(item) : item[column.key];
          const cellContent = column.render ? column.render(value, item, actualIndex) : value;
          const computedCellStyle = typeof column.cellStyle === 'function'
            ? column.cellStyle(value, item)
            : column.cellStyle;

          return (
            <TableCell
              key={column.key}
              width={column.width}
              style={{
                ...dataGridStyles.cell({ alignment: column.align || 'left' }),
                ...getColumnStyle(column),
                ...computedCellStyle,
              }}
            >
              {typeof cellContent === 'string' || typeof cellContent === 'number' ? (
                <Text>{cellContent}</Text>
              ) : (
                cellContent
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const containerHeight = typeof height === 'number' ? height : undefined;

  return (
    <View style={{
      ...dataGridStyles.container,
      width,
      height,
      ...style,
    }}>
      <ScrollView
        style={{
          ...dataGridStyles.scrollView,
          ...(containerHeight ? { maxHeight: containerHeight } : {})
        }}
        contentContainerStyle={{
          ...dataGridStyles.scrollViewContent,
          width: minTableWidth,
        }}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Table style={{
          ...dataGridStyles.table,
          width: minTableWidth,
          ...(virtualized ? { height: totalHeight } : {})
        }}>
          <TableHeader style={dataGridStyles.header({ stickyHeader })}>
            {renderHeader()}
          </TableHeader>
          <TableBody>
            {virtualized && visibleRange.offsetY > 0 && (
              <TableRow style={{ ...dataGridStyles.spacerRow, height: visibleRange.offsetY }}>
                <TableCell
                  style={{ ...dataGridStyles.spacerCell, height: visibleRange.offsetY }}
                  colSpan={columns.length}
                >
                  <View />
                </TableCell>
              </TableRow>
            )}
            {visibleData.map((item, index) => renderRow(item, index))}
            {virtualized && (data.length - visibleRange.end - 1) > 0 && (
              <TableRow style={{ ...dataGridStyles.spacerRow, height: (data.length - visibleRange.end - 1) * rowHeight }}>
                <TableCell
                  style={{ ...dataGridStyles.spacerCell, height: (data.length - visibleRange.end - 1) * rowHeight }}
                  colSpan={columns.length}
                >
                  <View />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}


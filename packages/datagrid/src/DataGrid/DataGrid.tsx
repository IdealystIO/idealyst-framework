import React, { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
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
  cellStyle,
  selectedRows = [],
  onSelectionChange,
  multiSelect = false,
  stickyHeader = true,
}: DataGridProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate minimum table width for horizontal scrolling
  const minTableWidth = useMemo(() => {
    return columns.reduce((total, column) => {
      return total + (column.width ? (typeof column.width === 'number' ? column.width : 120) : 120);
    }, 0);
  }, [columns]);

  // Virtualization calculations
  const visibleRange = useMemo(() => {
    if (!virtualized || typeof height !== 'number') {
      return { start: 0, end: data.length - 1, offsetY: 0 };
    }

    const containerHeight = height - headerHeight;
    const overscan = 3; // Render extra rows above and below visible area to prevent flickering

    // Calculate the raw start index based on scroll position
    const rawStartIndex = Math.floor(scrollTop / rowHeight);

    // Apply overscan to start (but don't go below 0)
    const startIndex = Math.max(0, rawStartIndex - overscan);

    // Calculate visible count plus overscan on both ends
    const visibleCount = Math.ceil(containerHeight / rowHeight) + (overscan * 2);
    const endIndex = Math.min(startIndex + visibleCount, data.length - 1);

    // Offset should be based on the actual start index (with overscan applied)
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

  const handleScroll = useCallback((e: any) => {
    if (virtualized) {
      // Handle both web and React Native scroll events
      const scrollY = e.currentTarget?.scrollTop ?? e.nativeEvent?.contentOffset?.y ?? 0;
      setScrollTop(scrollY);
    }
  }, [virtualized]);

  // Helper function to get consistent column styles
  // Always use fixed widths to ensure header and body tables stay aligned
  const getColumnStyle = (column: Column<T>) => {
    const width = column.width || column.minWidth || 120;
    return {
      boxSizing: 'border-box' as const,
      flexShrink: 0,
      flexGrow: 0,
      width,
      minWidth: width,
      maxWidth: column.maxWidth || width,
    };
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
            ...cellStyle,
          }}
          onPress={column.sortable ? () => handleSort(column) : undefined}
        >
          {column.renderHeader ? (
            column.renderHeader()
          ) : (
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
          )}
        </TableCell>
      ))}
    </TableRow>
  );

  // Render colgroup to define fixed column widths for table-layout: fixed
  const renderColGroup = () => (
    <colgroup>
      {columns.map((column) => {
        const width = column.width || column.minWidth || 120;
        return <col key={column.key} style={{ width, minWidth: width, maxWidth: width }} />;
      })}
    </colgroup>
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


          const styles = {
            ...getColumnStyle(column),
            ...computedCellStyle,
            ...cellStyle,
          }

          return (
            <TableCell
              key={column.key}
              width={column.width}
              style={styles}
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
  const isWeb = Platform.OS === 'web';

  // For web with sticky header, use a single table with sticky thead
  if (isWeb && stickyHeader) {
    return (
      <View style={{
        ...dataGridStyles.container,
        width,
        height,
        ...style,
      }}>
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            maxHeight: containerHeight,
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
          onScroll={handleScroll as any}
        >
          <Table style={{ width: minTableWidth, minWidth: minTableWidth }}>
            {renderColGroup()}
            <TableHeader style={{
              ...dataGridStyles.header({ stickyHeader: true }),
              position: 'sticky',
              top: 0,
              zIndex: 100,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
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
        </div>
      </View>
    );
  }

  // Native or non-sticky: use ScrollView abstraction
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
          ...(containerHeight ? { maxHeight: containerHeight } : {}),
        }}
        contentContainerStyle={{
          minWidth: minTableWidth,
        }}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ minWidth: minTableWidth }}>
          <Table style={{ width: minTableWidth, ...(virtualized ? { height: totalHeight } : {}) }}>
            {renderColGroup()}
            <TableHeader style={dataGridStyles.header({ stickyHeader: false })}>
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
        </View>
      </ScrollView>
    </View>
  );
}

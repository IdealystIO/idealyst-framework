import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text } from '@idealyst/components';
import { ScrollView } from '../primitives/ScrollView';
import { Table, TableRow, TableCell, TableHeader, TableBody } from '../primitives/Table';
import type { DataGridProps, Column } from './types';

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
  const scrollRef = useRef<any>(null);

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

  // Helper function for consistent cell base styles  
  const getCellBaseStyle = (theme: any) => ({
    padding: theme.spacing.sm,
    borderRightWidth: 1,
  });

  // Helper function for platform-specific header styles
  const getStickyHeaderStyle = (theme: any) => {
    if (!stickyHeader) return {};
    
    // Platform detection - check if we're on web or native
    const isWeb = typeof document !== 'undefined';
    
    if (isWeb) {
      return {
        position: 'sticky' as const,
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      };
    } else {
      // React Native - use elevation instead of boxShadow
      return {
        elevation: 4,
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    <TableRow style={(theme) => ({
      backgroundColor: stickyHeader ? '#ffffff' : theme.colors.neutral[50],
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.neutral[200],
      minHeight: headerHeight,
      flexDirection: 'row',
      ...getStickyHeaderStyle(theme),
      ...headerStyle,
    })}>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          width={column.width}
          style={(theme) => ({
            ...getCellBaseStyle(theme),
            borderRightColor: theme.colors.neutral[200],
            backgroundColor: stickyHeader ? '#ffffff' : theme.colors.neutral[50],
            ...column.headerStyle,
          })}
        >
          <Text weight="bold" style={(theme) => ({
            fontSize: 14,
            color: theme.colors.neutral[700],
          })}>
            {column.header}
            {column.sortable && (
              <Text as="span" style={(theme) => ({
                fontSize: 10,
                marginLeft: theme.spacing.xs,
                color: theme.colors.primary[500],
              })}>
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
        style={(theme) => ({
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral[100],
          backgroundColor: isSelected ? theme.colors.primary[50] : theme.colors.background,
          minHeight: rowHeight,
          flexDirection: 'row',
          ...computedRowStyle,
        })}
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
              style={(theme) => ({
                ...getCellBaseStyle(theme),
                borderRightColor: theme.colors.neutral[100],
                ...computedCellStyle,
              })}
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
    <View style={(theme) => ({
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.neutral[200],
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    })}>
      <ScrollView
        style={{ 
          flex: 1,
          ...(containerHeight ? { maxHeight: containerHeight } : {})
        }}
        contentContainerStyle={{
          width: minTableWidth,
        }}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        bounces={false}
        directionalLockEnabled={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Table style={{
          width: minTableWidth,
          ...(virtualized ? { height: totalHeight } : {})
        }}>
          <TableHeader>
            {renderHeader()}
          </TableHeader>
          <TableBody>
            {virtualized && visibleRange.offsetY > 0 && (
              <TableRow style={{ height: visibleRange.offsetY }}>
                <TableCell 
                  style={{ padding: 0, borderWidth: 0, height: visibleRange.offsetY }} 
                  colSpan={columns.length}
                >
                </TableCell>
              </TableRow>
            )}
            {visibleData.map((item, index) => renderRow(item, index))}
            {virtualized && (data.length - visibleRange.end - 1) > 0 && (
              <TableRow style={{ height: (data.length - visibleRange.end - 1) * rowHeight }}>
                <TableCell 
                  style={{ padding: 0, borderWidth: 0, height: (data.length - visibleRange.end - 1) * rowHeight }} 
                  colSpan={columns.length}
                >
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}


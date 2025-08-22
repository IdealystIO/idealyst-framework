import React, { useState, useCallback, useMemo, memo } from 'react';
import { FlatList, FlatListProps, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '@idealyst/components';
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

  // Calculate column widths and total width
  const { columnWidths, totalWidth } = useMemo(() => {
    const widths = columns.map(col => col.width || 120);
    const total = widths.reduce((sum, width) => sum + (typeof width === 'number' ? width : 120), 0);
    return { columnWidths: widths, totalWidth: total };
  }, [columns]);

  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.key);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  const handleRowPress = useCallback((item: T, index: number) => {
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
    onRowClick?.(item, index);
  }, [selectedRows, onSelectionChange, multiSelect, onRowClick]);

  const renderHeader = useMemo(() => (
    <View style={[
      {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        height: headerHeight,
        width: totalWidth,
        elevation: stickyHeader ? 4 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerStyle
    ]}>
      {columns.map((column, colIndex) => {
        const width = columnWidths[colIndex];
        const isLastColumn = colIndex === columns.length - 1;
        
        return (
          <View
            key={column.key}
            style={[
              {
                width: typeof width === 'number' ? width : 120,
                height: '100%',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRightWidth: isLastColumn ? 0 : 1,
                borderRightColor: '#ddd',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              },
              column.headerStyle
            ]}
          >
            <Text 
              weight="bold" 
              size="small"
              onPress={column.sortable ? () => handleSort(column) : undefined}
              style={{ 
                color: '#374151',
                ...(column.sortable ? { textDecorationLine: 'underline' } : {})
              }}
            >
              {column.header}
              {column.sortable && sortColumn === column.key && (
                <Text style={{ fontSize: 10, color: '#6366f1' }}>
                  {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                </Text>
              )}
            </Text>
          </View>
        );
      })}
    </View>
  ), [columns, columnWidths, headerHeight, stickyHeader, headerStyle, sortColumn, sortDirection, handleSort]);

  // Memoized row component to prevent unnecessary re-renders
  const MemoizedRow = memo<{ item: T; index: number; isSelected: boolean; onPress: () => void }>(
    ({ item, index, isSelected, onPress }) => {
      const computedRowStyle = typeof rowStyle === 'function' ? rowStyle(item, index) : rowStyle;
      
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[
            {
              flexDirection: 'row',
              backgroundColor: isSelected ? '#e0e7ff' : (index % 2 === 0 ? '#fafafa' : '#ffffff'),
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
              height: rowHeight,
              width: totalWidth,
            },
            computedRowStyle
          ]}
        >
          {columns.map((column, colIndex) => {
            const value = column.accessor ? column.accessor(item) : item[column.key];
            const cellContent = column.render ? column.render(value, item, index) : value;
            const computedCellStyle = typeof column.cellStyle === 'function' 
              ? column.cellStyle(value, item) 
              : column.cellStyle;
            const width = columnWidths[colIndex];
            const isLastColumn = colIndex === columns.length - 1;

            return (
              <View
                key={column.key}
                style={[
                  {
                    width: typeof width === 'number' ? width : 120,
                    height: '100%',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRightWidth: isLastColumn ? 0 : 1,
                    borderRightColor: '#e5e7eb',
                    justifyContent: 'center',
                  },
                  computedCellStyle
                ]}
              >
                {typeof cellContent === 'string' || typeof cellContent === 'number' ? (
                  <Text size="small" numberOfLines={1}>
                    {cellContent}
                  </Text>
                ) : (
                  cellContent
                )}
              </View>
            );
          })}
        </TouchableOpacity>
      );
    },
    // Custom comparison function to prevent unnecessary re-renders
    (prevProps, nextProps) => {
      // Only re-render if the item, selection state, or index changes
      return (
        prevProps.item === nextProps.item &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.index === nextProps.index
      );
    }
  );

  const renderRow = useCallback(({ item, index }: { item: T; index: number }) => {
    const isSelected = selectedRows.includes(index);
    
    return (
      <MemoizedRow
        item={item}
        index={index}
        isSelected={isSelected}
        onPress={() => handleRowPress(item, index)}
      />
    );
  }, [selectedRows, handleRowPress]);

  // Memoize the key extractor
  const keyExtractor = useCallback((item: T, index: number) => {
    // Use a unique key based on item data if available, otherwise use index
    return item.id ? `row-${item.id}` : `row-${index}`;
  }, []);

  const flatListProps: Partial<FlatListProps<T>> = {
    data,
    renderItem: renderRow,
    keyExtractor,
    getItemLayout: virtualized ? (data, index) => ({
      length: rowHeight,
      offset: rowHeight * index,
      index,
    }) : undefined,
    removeClippedSubviews: virtualized,
    maxToRenderPerBatch: virtualized ? 15 : data.length,
    windowSize: virtualized ? 15 : 21,
    initialNumToRender: virtualized ? 10 : data.length,
    updateCellsBatchingPeriod: 100,
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    horizontal: false,
    style: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    ListHeaderComponent: stickyHeader ? renderHeader : undefined,
    stickyHeaderIndices: stickyHeader ? [0] : undefined,
  };

  return (
    <View style={[
      {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
        width,
        height,
      },
      style
    ]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ minWidth: totalWidth }}
      >
        <View style={{ width: totalWidth, flex: 1 }}>
          {!stickyHeader && renderHeader()}
          <FlatList 
            {...flatListProps}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            ListHeaderComponent={stickyHeader ? renderHeader : undefined}
            stickyHeaderIndices={stickyHeader ? [0] : undefined}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
    </View>
  );
}
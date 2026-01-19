import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  onColumnResize,
  columnResizeMode = 'indicator',
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

  // Column resize state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {};
    columns.forEach(col => {
      widths[col.key] = col.width || col.minWidth || 120;
    });
    return widths;
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ columnKey: string; startX: number; startWidth: number } | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const columnWidthsRef = useRef(columnWidths);

  // Keep ref in sync with state
  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);

  // Sync column widths when columns prop changes
  useEffect(() => {
    setColumnWidths(prev => {
      const widths: Record<string, number> = {};
      columns.forEach(col => {
        // Keep existing width if we have one, otherwise use column definition
        widths[col.key] = prev[col.key] ?? col.width ?? col.minWidth ?? 120;
      });
      return widths;
    });
  }, [columns]);

  // Calculate indicator position without triggering re-render
  const calculateIndicatorPosition = useCallback((currentX: number) => {
    if (!resizeRef.current) return 0;
    const { columnKey, startX, startWidth } = resizeRef.current;
    const column = columns.find(c => c.key === columnKey);
    const minW = column?.minWidth || 50;
    const maxW = column?.maxWidth || Infinity;
    const delta = currentX - startX;
    const newWidth = Math.min(maxW, Math.max(minW, startWidth + delta));

    // Calculate X position: sum of widths of columns before this one + new width
    let xPos = 0;
    for (const col of columns) {
      if (col.key === columnKey) {
        xPos += newWidth;
        break;
      }
      xPos += columnWidthsRef.current[col.key] || col.width || 120;
    }
    return xPos;
  }, [columns]);

  // Handle resize mouse events - uses DOM manipulation for indicator mode, state for live mode
  const handleResizeStart = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startWidth = columnWidthsRef.current[columnKey] || 120;
    resizeRef.current = { columnKey, startX: e.clientX, startWidth };
    setIsResizing(true);

    // Set initial indicator position (indicator mode only)
    if (columnResizeMode === 'indicator' && indicatorRef.current) {
      indicatorRef.current.style.left = `${calculateIndicatorPosition(e.clientX)}px`;
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current) return;

      if (columnResizeMode === 'live') {
        // Live mode: update column width state during drag
        const { columnKey: key, startX, startWidth: sw } = resizeRef.current;
        const column = columns.find(c => c.key === key);
        const minW = column?.minWidth || 50;
        const maxW = column?.maxWidth || Infinity;
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.min(maxW, Math.max(minW, sw + delta));
        setColumnWidths(prev => ({ ...prev, [key]: newWidth }));
      } else {
        // Indicator mode: update indicator position directly in DOM - no React re-render
        if (indicatorRef.current) {
          indicatorRef.current.style.left = `${calculateIndicatorPosition(moveEvent.clientX)}px`;
        }
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (resizeRef.current) {
        const { columnKey: key, startX, startWidth: sw } = resizeRef.current;
        const column = columns.find(c => c.key === key);
        const minW = column?.minWidth || 50;
        const maxW = column?.maxWidth || Infinity;
        const delta = upEvent.clientX - startX;
        const newWidth = Math.min(maxW, Math.max(minW, sw + delta));

        // Apply the new width on mouse up (indicator mode) or just finalize (live mode)
        if (columnResizeMode === 'indicator') {
          setColumnWidths(prev => ({ ...prev, [key]: newWidth }));
        }
        // onColumnResize is always called on release, regardless of mode
        onColumnResize?.(key, newWidth);
      }
      resizeRef.current = null;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columns, onColumnResize, calculateIndicatorPosition, columnResizeMode]);

  // Calculate minimum table width for horizontal scrolling
  const minTableWidth = useMemo(() => {
    return columns.reduce((total, column) => {
      return total + (columnWidths[column.key] || column.width || 120);
    }, 0);
  }, [columns, columnWidths]);

  // Virtualization calculations
  const visibleRange = useMemo(() => {
    if (!virtualized || typeof height !== 'number') {
      return { start: 0, end: data.length - 1, offsetY: 0 };
    }

    const containerHeight = height - headerHeight;
    const overscan = 5; // Render extra rows above and below visible area to prevent flickering

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
  const getColumnStyle = useCallback((column: Column<T>) => {
    const width = columnWidths[column.key] || column.width || column.minWidth || 120;
    return {
      boxSizing: 'border-box' as const,
      flexShrink: 0,
      flexGrow: 0,
      width,
      minWidth: width,
      maxWidth: column.maxWidth || width,
    };
  }, [columnWidths]);

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

  const isWeb = Platform.OS === 'web';

  const renderHeader = () => (
    <TableRow style={{
      ...(dataGridStyles.headerRow as any)({ stickyHeader }),
      minHeight: headerHeight,
      ...headerStyle,
    }}>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          width={columnWidths[column.key] || column.width}
          style={{
            ...dataGridStyles.headerCell,
            ...getColumnStyle(column),
            ...cellStyle,
            ...column.headerStyle,
            position: 'relative' as const,
          }}
          onPress={column.sortable ? () => handleSort(column) : undefined}
        >
          {column.renderHeader ? (
            column.renderHeader()
          ) : (
            <Text
              weight="bold"
              style={(dataGridStyles.headerText as any)({ clickable: column.sortable || false })}
            >
              {column.header}
              {column.sortable && (
                <Text style={{ marginLeft: 4 }}>
                  {sortColumn === column.key ? ` ${sortDirection === 'asc' ? '▲' : '▼'}` : ''}
                </Text>
              )}
            </Text>
          )}
          {/* Resize handle */}
          {isWeb && column.resizable && (
            <div
              onMouseDown={(e) => handleResizeStart(e, column.key)}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 8,
                cursor: 'col-resize',
                backgroundColor: 'transparent',
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  );

  // Render colgroup to define fixed column widths for table-layout: fixed
  const renderColGroup = useCallback(() => (
    <colgroup>
      {columns.map((column) => {
        const width = columnWidths[column.key] || column.width || column.minWidth || 120;
        return <col key={column.key} style={{ width, minWidth: width, maxWidth: width }} />;
      })}
    </colgroup>
  ), [columns, columnWidths]);

  const renderRow = (item: T, virtualIndex: number) => {
    const actualIndex = virtualized ? visibleRange.start + virtualIndex : virtualIndex;
    const isSelected = selectedRows.includes(actualIndex);
    const computedRowStyle = typeof rowStyle === 'function' ? rowStyle(item, actualIndex) : rowStyle;

    return (
      <TableRow
        key={actualIndex}
        style={{
          ...(dataGridStyles.row as any)({ selected: isSelected }),
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

  // For web with sticky header, use a single table with sticky thead
  if (isWeb && stickyHeader) {
    return (
      <View style={{
        ...dataGridStyles.container,
        width,
        height,
        ...style,
        position: 'relative' as const,
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
          {/* Resize indicator line - only shown in indicator mode, positioned via ref for performance */}
          {columnResizeMode === 'indicator' && (
            <div
              ref={indicatorRef}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 2,
                backgroundColor: '#3b82f6',
                zIndex: 1000,
                pointerEvents: 'none',
                display: isResizing ? 'block' : 'none',
              }}
            />
          )}
          <Table style={{ width: minTableWidth, minWidth: minTableWidth }}>
            {renderColGroup()}
            <TableHeader style={{
              ...(dataGridStyles.header as any)({ stickyHeader: true }),
              position: 'sticky',
              top: 0,
              zIndex: 100,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {renderHeader()}
            </TableHeader>
            {virtualized ? (
              <TableBody style={{ position: 'relative' } as any}>
                <tr style={{ height: 0, padding: 0, margin: 0, border: 'none' }}>
                  <td
                    colSpan={columns.length}
                    style={{
                      height: data.length * rowHeight,
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${visibleRange.offsetY}px)`,
                        willChange: 'transform',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        {renderColGroup()}
                        <tbody>
                          {visibleData.map((item, index) => renderRow(item, index))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </TableBody>
            ) : (
              <TableBody>
                {visibleData.map((item, index) => renderRow(item, index))}
              </TableBody>
            )}
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
      position: 'relative' as const,
    }}>
      {/* Resize indicator line (web only, indicator mode) - positioned via ref for performance */}
      {isWeb && columnResizeMode === 'indicator' && (
        <div
          ref={indicatorRef}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 2,
            backgroundColor: '#3b82f6',
            zIndex: 1000,
            pointerEvents: 'none',
            display: isResizing ? 'block' : 'none',
          }}
        />
      )}
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
            <TableHeader style={(dataGridStyles.header as any)({ stickyHeader: false })}>
              {renderHeader()}
            </TableHeader>
            {virtualized ? (
              <TableBody style={{ position: 'relative' } as any}>
                <tr style={{ height: 0, padding: 0, margin: 0, border: 'none' }}>
                  <td
                    colSpan={columns.length}
                    style={{
                      height: data.length * rowHeight,
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${visibleRange.offsetY}px)`,
                        willChange: 'transform',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        {renderColGroup()}
                        <tbody>
                          {visibleData.map((item, index) => renderRow(item, index))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </TableBody>
            ) : (
              <TableBody>
                {visibleData.map((item, index) => renderRow(item, index))}
              </TableBody>
            )}
          </Table>
        </View>
      </ScrollView>
    </View>
  );
}

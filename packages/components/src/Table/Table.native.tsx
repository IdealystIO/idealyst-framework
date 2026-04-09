import React, { forwardRef, useMemo, useState, useCallback, ReactNode } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Pressable } from 'react-native';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn, TableType, TableSizeVariant, TableAlignVariant, SortDirection } from './types';
import type { MenuItem } from '../Menu/types';
import { getNativeAccessibilityProps } from '../utils/accessibility';
import Icon from '../Icon/Icon.native';
import Menu from '../Menu/Menu.native';

// ============================================================================
// Sub-component Props
// ============================================================================

interface TRProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  clickable?: boolean;
  dividers?: boolean;
  even?: boolean;
  onPress?: () => void;
  testID?: string;
}

interface THProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  options?: MenuItem[];
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
  dividers = false,
  even = false,
  onPress,
  testID,
}: TRProps) {
  tableStyles.useVariants({
    size,
    type,
    clickable,
    dividers,
    even,
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
  sortable,
  sortDirection,
  onSort,
  options,
}: THProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  tableStyles.useVariants({
    size,
    type,
    align,
    sortable: !!sortable,
    sortActive: sortDirection != null,
  });

  const headerCellStyle = (tableStyles.headerCell as any)({});
  const sortIndicatorStyle = (tableStyles.sortIndicator as any)({ sortActive: sortDirection != null });
  const optionsButtonStyle = (tableStyles.optionsButton as any)({});

  const sortIconName = sortDirection === 'asc' ? 'arrow-up' :
    sortDirection === 'desc' ? 'arrow-down' : 'arrow-up-down';

  const content = (
    <View
      style={[
        headerCellStyle,
        { width, flex: width ? undefined : 1 },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 2 }}>
        {typeof children === 'string' ? (
          <Text style={headerCellStyle}>{children}</Text>
        ) : (
          children
        )}
        {sortable && (
          <View style={sortIndicatorStyle}>
            <Icon name={sortIconName} size={size} />
          </View>
        )}
      </View>
      {options && options.length > 0 && (
        <Menu
          items={options}
          open={menuOpen}
          onOpenChange={setMenuOpen}
          placement="bottom-start"
          size={size}
        >
          <Pressable style={optionsButtonStyle}>
            <Icon name="dots-vertical" size={size} />
          </Pressable>
        </Menu>
      )}
    </View>
  );

  if (sortable) {
    return (
      <Pressable onPress={onSort}>
        {content}
      </Pressable>
    );
  }

  return content;
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
// TF Component (Footer Cell)
// ============================================================================

interface TFProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
}

function TF({
  children,
  size = 'md',
  type = 'standard',
  align = 'left',
  width,
}: TFProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const footerCellStyle = (tableStyles.footerCell as any)({});

  return (
    <View
      style={[
        footerCellStyle,
        { width, flex: width ? undefined : 1 },
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={footerCellStyle}>{children}</Text>
      ) : (
        children
      )}
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
  stickyHeader: _stickyHeader = false,
  onRowPress,
  onSort,
  dividers = false,
  emptyState,
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
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback((columnKey: string) => {
    let newDir: SortDirection;
    if (sortColumn !== columnKey) {
      newDir = 'asc';
    } else if (sortDirection === 'asc') {
      newDir = 'desc';
    } else {
      setSortColumn(null);
      setSortDirection(null);
      onSort?.(columnKey, null);
      return;
    }
    setSortColumn(columnKey);
    setSortDirection(newDir);
    onSort?.(columnKey, newDir);
  }, [sortColumn, sortDirection, onSort]);
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
  const hasFooter = columns.some((col) => col.footer !== undefined);

  // Helper to resolve footer content
  const getFooterContent = (column: TableColumn<T>) => {
    if (typeof column.footer === 'function') {
      return column.footer(data);
    }
    return column.footer;
  };

  // Split columns into sticky left, scrollable, and sticky right
  const leftCols = useMemo(() => columns.filter((c) => c.sticky === true || c.sticky === 'left'), [columns]);
  const rightCols = useMemo(() => columns.filter((c) => c.sticky === 'right'), [columns]);
  const scrollCols = useMemo(() => columns.filter((c) => !c.sticky), [columns]);
  const hasStickyColumns = leftCols.length > 0 || rightCols.length > 0;

  // Renders a column group (header + body + footer) for a set of columns
  const renderColumnGroup = (cols: TableColumn<T>[]) => (
    <View>
      {/* Header */}
      <View style={theadStyle}>
        <View style={{ flexDirection: 'row' }}>
          {cols.map((column) => (
            <TH
              key={column.key}
              size={size}
              type={type}
              align={column.align}
              width={column.width}
              sortable={column.sortable}
              sortDirection={sortColumn === column.key ? sortDirection : undefined}
              onSort={column.sortable ? () => handleSort(column.key) : undefined}
              options={column.options}
            >
              {column.title}
            </TH>
          ))}
        </View>
      </View>

      {/* Body */}
      <View style={tbodyStyle}>
        {data.length === 0 && emptyState ? (
          <View style={{ alignItems: 'center', padding: 16 }}>
            {emptyState}
          </View>
        ) : (
          data.map((row, rowIndex) => (
            <TR
              key={rowIndex}
              size={size}
              type={type}
              clickable={isClickable}
              dividers={dividers && rowIndex < data.length - 1}
              even={rowIndex % 2 === 1}
              onPress={() => onRowPress?.(row, rowIndex)}
              testID={testID ? `${testID}-row-${rowIndex}` : undefined}
            >
              {cols.map((column) => (
                <TD key={column.key} size={size} type={type} align={column.align} width={column.width}>
                  {getCellValue(column, row, rowIndex)}
                </TD>
              ))}
            </TR>
          ))
        )}
      </View>

      {/* Footer */}
      {hasFooter && (
        <View style={(tableStyles.tfoot as any)({})}>
          <View style={{ flexDirection: 'row' }}>
            {cols.map((column) => (
              <TF key={column.key} size={size} type={type} align={column.align} width={column.width}>
                {getFooterContent(column) ?? null}
              </TF>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  // When there are sticky columns, render as: [left sticky] [scrollable] [right sticky]
  if (hasStickyColumns) {
    return (
      <View
        nativeID={id}
        style={[containerStyle, { flexDirection: 'row' }, style]}
        testID={testID}
        {...nativeA11yProps}
      >
        {leftCols.length > 0 && (
          <View style={{ zIndex: 1, backgroundColor: theadStyle.backgroundColor || containerStyle.backgroundColor }}>
            {renderColumnGroup(leftCols)}
          </View>
        )}
        <ScrollView ref={ref} horizontal style={{ flex: 1 }}>
          <View style={tableStyle}>
            {renderColumnGroup(scrollCols)}
          </View>
        </ScrollView>
        {rightCols.length > 0 && (
          <View style={{ zIndex: 1, backgroundColor: theadStyle.backgroundColor || containerStyle.backgroundColor }}>
            {renderColumnGroup(rightCols)}
          </View>
        )}
      </View>
    );
  }

  // No sticky columns — original simple layout
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
        {renderColumnGroup(columns)}
      </View>
    </ScrollView>
  );
}

const Table = forwardRef(TableInner) as <T = any>(
  props: TableProps<T> & { ref?: React.Ref<ScrollView> }
) => React.ReactElement;

(Table as any).displayName = 'Table';

export default Table;

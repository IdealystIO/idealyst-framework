import { useMemo, useRef, useCallback, ReactNode } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tableStyles } from './Table.styles';
import type { TableProps, TableColumn, TableType, TableSizeVariant, TableAlignVariant } from './types';
import { getWebAriaProps } from '../utils/accessibility';

// ============================================================================
// Helpers
// ============================================================================

function getStickyStyle(
  sticky: boolean | 'left' | 'right' | undefined,
  offset: number | string | undefined,
  zIndex: number,
): React.CSSProperties | undefined {
  if (!sticky) return undefined;
  const side = sticky === 'right' ? 'right' : 'left';
  return {
    position: 'sticky',
    [side]: offset ?? 0,
    zIndex,
    backgroundColor: 'inherit',
  };
}

// ============================================================================
// Sub-component Props
// ============================================================================

interface TRProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  clickable?: boolean;
  dividers?: boolean;
  onClick?: () => void;
  testID?: string;
}

interface THProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
  sticky?: boolean | 'left' | 'right';
  stickyOffset?: number | string;
  resizable?: boolean;
  onResize?: (width: number) => void;
  minWidth?: number;
  accessibilitySort?: 'ascending' | 'descending' | 'none' | 'other';
}

interface TDProps {
  children: ReactNode;
  size?: TableSizeVariant;
  type?: TableType;
  align?: TableAlignVariant;
  width?: number | string;
  sticky?: boolean | 'left' | 'right';
  stickyOffset?: number | string;
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
  onClick,
  testID,
}: TRProps) {
  tableStyles.useVariants({
    size,
    type,
    clickable,
    dividers,
  });

  const rowProps = getWebProps([(tableStyles.row as any)({})]);

  return (
    <tr
      {...rowProps}
      onClick={onClick}
      data-testid={testID}
    >
      {children}
    </tr>
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
  sticky,
  stickyOffset,
  resizable,
  onResize,
  minWidth = 50,
  accessibilitySort,
}: THProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const headerCellProps = getWebProps([(tableStyles.headerCell as any)({})]);
  const thRef = useRef<HTMLTableCellElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const th = thRef.current;
    if (!th) return;

    const startX = e.clientX;
    const startWidth = th.getBoundingClientRect().width;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      th.style.width = `${newWidth}px`;
    };

    const handlePointerUp = (_upEvent: PointerEvent) => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      const finalWidth = th.getBoundingClientRect().width;
      onResize?.(finalWidth);
      // Remove inline cursor override
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Prevent text selection and set resize cursor globally during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [minWidth, onResize]);

  return (
    <th
      {...headerCellProps}
      ref={thRef}
      scope="col"
      aria-sort={accessibilitySort}
      style={{ width, ...getStickyStyle(sticky, stickyOffset, 11) }}
    >
      {children}
      {resizable && (
        <span
          onPointerDown={handlePointerDown}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 4,
            cursor: 'col-resize',
            userSelect: 'none',
          }}
        />
      )}
    </th>
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
  sticky,
  stickyOffset,
}: TDProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const cellProps = getWebProps([(tableStyles.cell as any)({})]);

  return (
    <td
      {...cellProps}
      style={{ width, ...getStickyStyle(sticky, stickyOffset, 1) }}
    >
      {children}
    </td>
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
  sticky?: boolean | 'left' | 'right';
  stickyOffset?: number | string;
}

function TF({
  children,
  size = 'md',
  type = 'standard',
  align = 'left',
  width,
  sticky,
  stickyOffset,
}: TFProps) {
  tableStyles.useVariants({
    size,
    type,
    align,
  });

  const footerCellProps = getWebProps([(tableStyles.footerCell as any)({})]);

  return (
    <td
      {...footerCellProps}
      style={{ width, ...getStickyStyle(sticky, stickyOffset, 1) }}
    >
      {children}
    </td>
  );
}

// ============================================================================
// Main Table Component
// ============================================================================

/**
 * Data display component for structured tabular content with columns and rows.
 * Supports custom cell rendering, sticky headers, and row click handling.
 */
function Table<T = any>({
  columns,
  data,
  type = 'standard',
  size = 'md',
  stickyHeader = false,
  onRowPress,
  onColumnResize,
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
}: TableProps<T>) {
  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'table',
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

  const containerProps = getWebProps([(tableStyles.container as any)({}), style as any]);
  const tableProps = getWebProps([(tableStyles.table as any)({})]);

  // Helper to get cell value
  const getCellValue = (column: TableColumn<T>, row: T, rowIndex: number) => {
    if (column.render) {
      const value = column.dataIndex ? (row as any)[column.dataIndex] : row;
      return column.render(value, row, rowIndex);
    }
    return column.dataIndex ? (row as any)[column.dataIndex] : '';
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

  // Compute cumulative offsets for sticky columns (left and right independently)
  const stickyOffsetMap = useMemo(() => {
    const map = new Map<string, number>();

    // Left sticky: accumulate left-to-right
    let cumulativeLeft = 0;
    for (const col of columns) {
      const side = col.sticky === 'right' ? 'right' : col.sticky ? 'left' : null;
      if (side !== 'left') continue;
      map.set(col.key, cumulativeLeft);
      if (typeof col.width === 'number') {
        cumulativeLeft += col.width;
      }
    }

    // Right sticky: accumulate right-to-left
    let cumulativeRight = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (col.sticky !== 'right') continue;
      map.set(col.key, cumulativeRight);
      if (typeof col.width === 'number') {
        cumulativeRight += col.width;
      }
    }

    return map;
  }, [columns]);

  return (
    <div {...containerProps} {...ariaProps} id={id} data-testid={testID}>
      <table {...tableProps} role="table">
        <thead {...getWebProps([(tableStyles.thead as any)({ sticky: stickyHeader })])}>
          <tr>
            {columns.map((column) => (
              <TH
                key={column.key}
                size={size}
                type={type}
                align={column.align}
                width={column.width}
                sticky={column.sticky}
                stickyOffset={stickyOffsetMap.get(column.key)}
                resizable={column.resizable}
                minWidth={column.minWidth}
                onResize={onColumnResize ? (w) => onColumnResize(column.key, w) : undefined}
                accessibilitySort={column.accessibilitySort}
              >
                {column.title}
              </TH>
            ))}
          </tr>
        </thead>
        <tbody {...getWebProps([(tableStyles.tbody as any)({})])}>
          {data.length === 0 && emptyState ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <TR
                key={rowIndex}
                size={size}
                type={type}
                clickable={isClickable}
                dividers={dividers && rowIndex < data.length - 1}
                onClick={() => onRowPress?.(row, rowIndex)}
                testID={testID ? `${testID}-row-${rowIndex}` : undefined}
              >
                {columns.map((column) => (
                  <TD
                    key={column.key}
                    size={size}
                    type={type}
                    align={column.align}
                    width={column.width}
                    sticky={column.sticky}
                    stickyOffset={stickyOffsetMap.get(column.key)}
                  >
                    {getCellValue(column, row, rowIndex)}
                  </TD>
                ))}
              </TR>
            ))
          )}
        </tbody>
        {hasFooter && (
          <tfoot {...getWebProps([(tableStyles.tfoot as any)({})])}>
            <tr>
              {columns.map((column) => (
                <TF
                  key={column.key}
                  size={size}
                  type={type}
                  align={column.align}
                  width={column.width}
                  sticky={column.sticky}
                  stickyOffset={stickyOffsetMap.get(column.key)}
                >
                  {getFooterContent(column) ?? null}
                </TF>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}



export default Table;

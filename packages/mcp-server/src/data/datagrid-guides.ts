/**
 * DataGrid Package Guides
 *
 * Comprehensive documentation for @idealyst/datagrid.
 * Virtualized data grid for tabular data display.
 */

export const datagridGuides: Record<string, string> = {
  "idealyst://datagrid/overview": `# @idealyst/datagrid

High-performance, virtualized data grid for displaying tabular data.

> **Note:** DataGrid is for structured tabular data with columns. For general lists, use the \`List\` component from \`@idealyst/components\` with \`children\`.

## Installation

\`\`\`bash
yarn add @idealyst/datagrid
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ Virtualized scrolling |
| iOS      | ✅ Virtualized scrolling |
| Android  | ✅ Virtualized scrolling |

## Key Exports

\`\`\`typescript
import { DataGrid } from '@idealyst/datagrid';
import type { Column, DataGridProps } from '@idealyst/datagrid';
\`\`\`

## Quick Start

\`\`\`tsx
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', width: 200 },
  { key: 'email', header: 'Email', width: 250 },
  { key: 'role', header: 'Role', width: 120 },
];

function UserTable({ users }: { users: User[] }) {
  return (
    <DataGrid
      data={users}
      columns={columns}
      rowHeight={48}
      headerHeight={52}
      virtualized
      stickyHeader
    />
  );
}
\`\`\`
`,

  "idealyst://datagrid/api": `# @idealyst/datagrid — API Reference

## DataGrid<T>

The main data grid component.

### DataGridProps<T>

\`\`\`typescript
interface DataGridProps<T = any> {
  /** Array of data objects */
  data: T[];

  /** Column definitions */
  columns: Column<T>[];

  /** Row height in pixels (default varies by platform) */
  rowHeight?: number;

  /** Header row height in pixels */
  headerHeight?: number;

  /** Callback when a row is clicked/pressed */
  onRowClick?: (row: T, index: number) => void;

  /** Callback when a column header is clicked for sorting */
  onSort?: (column: Column<T>, direction: 'asc' | 'desc') => void;

  /** Callback when a column is resized */
  onColumnResize?: (columnKey: string, width: number) => void;

  /** Resize mode: 'indicator' (default) or 'live' */
  columnResizeMode?: 'indicator' | 'live';

  /** Enable virtualized scrolling for large datasets */
  virtualized?: boolean;

  /** Grid height (required for virtualization) */
  height?: number | string;

  /** Grid width */
  width?: number | string;

  /** Container style */
  style?: ViewStyle;

  /** Header row style */
  headerStyle?: ViewStyle;

  /** Default cell style */
  cellStyle?: ViewStyle;

  /** Row style — static or dynamic based on row data */
  rowStyle?: ViewStyle | ((row: T, index: number) => ViewStyle);

  /** Indices of selected rows */
  selectedRows?: number[];

  /** Callback when selection changes */
  onSelectionChange?: (selectedRows: number[]) => void;

  /** Enable multi-row selection */
  multiSelect?: boolean;

  /** Stick header to top when scrolling */
  stickyHeader?: boolean;
}
\`\`\`

### Column<T>

\`\`\`typescript
interface Column<T = any> {
  /** Unique column key (also used as data accessor if no accessor fn) */
  key: string;

  /** Column header text */
  header: string;

  /** Fixed column width in pixels */
  width?: number;

  /** Minimum column width */
  minWidth?: number;

  /** Maximum column width */
  maxWidth?: number;

  /** Allow column resizing */
  resizable?: boolean;

  /** Allow sorting by this column */
  sortable?: boolean;

  /** Text alignment */
  align?: 'left' | 'center' | 'right';

  /** Custom data accessor function */
  accessor?: (row: T) => any;

  /** Custom cell renderer */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /** Custom header renderer (overrides header string) */
  renderHeader?: () => React.ReactNode;

  /** Header cell style */
  headerStyle?: ViewStyle;

  /** Cell style — static or dynamic */
  cellStyle?: ViewStyle | ((value: any, row: T) => ViewStyle);
}
\`\`\`

### Sub-components

\`\`\`typescript
interface CellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  onPress?: () => void;
}

interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  selected?: boolean;
}

interface HeaderCellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  resizable?: boolean;
  onResize?: (width: number) => void;
}
\`\`\`
`,

  "idealyst://datagrid/examples": `# @idealyst/datagrid — Examples

## Basic Table

\`\`\`tsx
import React from 'react';
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const columns: Column<Product>[] = [
  { key: 'name', header: 'Product Name', width: 200 },
  { key: 'category', header: 'Category', width: 150 },
  {
    key: 'price',
    header: 'Price',
    width: 100,
    align: 'right',
    render: (value) => \`$\${value.toFixed(2)}\`,
  },
  {
    key: 'stock',
    header: 'Stock',
    width: 80,
    align: 'center',
    cellStyle: (value) => ({
      color: value < 10 ? 'red' : 'green',
    }),
  },
];

function ProductTable({ products }: { products: Product[] }) {
  return <DataGrid data={products} columns={columns} />;
}
\`\`\`

## Sortable with Selection

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
}

function EmployeeGrid({ employees }: { employees: Employee[] }) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortColumn) return employees;
    return [...employees].sort((a, b) => {
      const aVal = a[sortColumn as keyof Employee];
      const bVal = b[sortColumn as keyof Employee];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [employees, sortColumn, sortDirection]);

  const columns: Column<Employee>[] = [
    { key: 'name', header: 'Name', width: 200, sortable: true },
    { key: 'department', header: 'Department', width: 150, sortable: true },
    {
      key: 'salary',
      header: 'Salary',
      width: 120,
      align: 'right',
      sortable: true,
      render: (value) => \`$\${value.toLocaleString()}\`,
    },
  ];

  return (
    <View gap="md">
      <DataGrid
        data={sortedData}
        columns={columns}
        rowHeight={48}
        headerHeight={52}
        virtualized
        height={400}
        stickyHeader
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        multiSelect
        onSort={(col, dir) => {
          setSortColumn(col.key);
          setSortDirection(dir);
        }}
        onRowClick={(row) => console.log('Clicked:', row.name)}
      />
      <Text>{selectedRows.length} rows selected</Text>
    </View>
  );
}
\`\`\`

## Custom Cell Rendering

\`\`\`tsx
import React from 'react';
import { View, Text, Badge, Avatar } from '@idealyst/components';
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface User {
  id: number;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastSeen: string;
}

const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'User',
    width: 250,
    render: (_, row) => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }} gap="sm">
        <Avatar src={row.avatar} size="sm" fallback={row.name.charAt(0)} />
        <Text>{row.name}</Text>
      </View>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 120,
    render: (value) => (
      <Badge
        type={value === 'active' ? 'filled' : 'outlined'}
        intent={value === 'active' ? 'success' : 'secondary'}
      >
        {value}
      </Badge>
    ),
  },
  { key: 'lastSeen', header: 'Last Seen', width: 180 },
];
\`\`\`

## Resizable Columns

\`\`\`tsx
import React, { useState } from 'react';
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

function ResizableGrid({ data }: { data: any[] }) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'col1', header: 'Column 1', width: 200, resizable: true, minWidth: 100 },
    { key: 'col2', header: 'Column 2', width: 300, resizable: true, minWidth: 150 },
    { key: 'col3', header: 'Column 3', width: 200, resizable: true },
  ]);

  const handleResize = (columnKey: string, width: number) => {
    setColumns(prev =>
      prev.map(col => (col.key === columnKey ? { ...col, width } : col))
    );
  };

  return (
    <DataGrid
      data={data}
      columns={columns}
      onColumnResize={handleResize}
      columnResizeMode="live"
    />
  );
}
\`\`\`
`,
};

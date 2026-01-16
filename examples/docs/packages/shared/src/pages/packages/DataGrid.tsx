import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function DataGridPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          DataGrid
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          High-performance virtualized data table component for displaying large datasets.
          Supports sorting, row selection, custom cell rendering, and column resizing.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

const columns: Column<User>[] = [
  { key: 'id', header: 'ID', width: 60 },
  { key: 'name', header: 'Name', width: 150 },
  { key: 'email', header: 'Email', width: 200 },
  { key: 'role', header: 'Role', width: 100 },
];

function UserTable() {
  return (
    <DataGrid
      data={data}
      columns={columns}
      height={400}
    />
  );
}`}
          language="tsx"
          title="Basic DataGrid"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Column Configuration
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="key" type="string" description="Unique identifier and data field accessor." required />
          <PropRow name="header" type="string" description="Column header text." required />
          <PropRow name="width" type="number" description="Fixed column width in pixels." />
          <PropRow name="minWidth" type="number" description="Minimum column width." />
          <PropRow name="maxWidth" type="number" description="Maximum column width." />
          <PropRow name="resizable" type="boolean" description="Enable column resizing." />
          <PropRow name="sortable" type="boolean" description="Enable column sorting." />
          <PropRow name="align" type="'left' | 'center' | 'right'" description="Text alignment in cells." />
          <PropRow name="accessor" type="(row: T) => any" description="Custom function to extract cell value." />
          <PropRow name="render" type="(value, row, index) => ReactNode" description="Custom cell renderer." />
          <PropRow name="renderHeader" type="() => ReactNode" description="Custom header renderer." />
          <PropRow name="headerStyle" type="ViewStyle" description="Custom header cell styles." />
          <PropRow name="cellStyle" type="ViewStyle | ((value, row) => ViewStyle)" description="Custom cell styles." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Custom Cell Rendering
        </Text>

        <CodeBlock
          code={`const columns: Column<User>[] = [
  { key: 'id', header: 'ID', width: 60 },
  { key: 'name', header: 'Name', width: 150 },
  {
    key: 'status',
    header: 'Status',
    width: 100,
    render: (value) => (
      <Text
        weight="medium"
        style={{ color: value === 'active' ? '#22c55e' : '#ef4444' }}
      >
        {value}
      </Text>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    width: 100,
    render: (value) => (
      <View style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 4
      }}>
        <Text size="sm">{value}</Text>
      </View>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    width: 120,
    render: (_, row) => (
      <Button size="sm" onPress={() => console.log('Edit', row.id)}>
        Edit
      </Button>
    ),
  },
];`}
          language="tsx"
          title="Custom Renderers"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Sorting
        </Text>

        <CodeBlock
          code={`function SortableTable() {
  const [data, setData] = useState(initialData);

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', width: 60, sortable: true },
    { key: 'name', header: 'Name', width: 150, sortable: true },
    { key: 'email', header: 'Email', width: 200 },
    { key: 'joinDate', header: 'Join Date', width: 120, sortable: true },
  ];

  const handleSort = (column: Column<User>, direction: 'asc' | 'desc') => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[column.key as keyof User];
      const bVal = b[column.key as keyof User];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    setData(sorted);
  };

  return (
    <DataGrid
      data={data}
      columns={columns}
      height={400}
      onSort={handleSort}
    />
  );
}`}
          language="tsx"
          title="Sortable Columns"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Row Selection
        </Text>

        <CodeBlock
          code={`function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <View>
      <Text>Selected: {selectedRows.length} rows</Text>

      <DataGrid
        data={data}
        columns={columns}
        height={400}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        multiSelect={true}
        onRowClick={(row, index) => {
          console.log('Clicked row:', row, 'at index:', index);
        }}
      />

      <Button onPress={() => setSelectedRows([])}>
        Clear Selection
      </Button>
    </View>
  );
}`}
          language="tsx"
          title="Row Selection"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Virtualization
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          For large datasets, enable virtualization to only render visible rows:
        </Text>

        <CodeBlock
          code={`// Generate 10,000 rows
const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: 'User',
}));

<DataGrid
  data={largeDataset}
  columns={columns}
  height={500}
  virtualized={true}
  rowHeight={48}
/>`}
          language="tsx"
          title="Virtualized Grid"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Row Styling
        </Text>

        <CodeBlock
          code={`<DataGrid
  data={data}
  columns={columns}
  height={400}
  rowStyle={(row, index) => ({
    // Alternating row colors
    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
  })}
  cellStyle={{
    padding: 12,
  }}
  headerStyle={{
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  }}
/>`}
          language="tsx"
          title="Custom Styling"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          DataGrid Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="data" type="T[]" description="Array of data items to display." required />
          <PropRow name="columns" type="Column<T>[]" description="Column configuration array." required />
          <PropRow name="height" type="number | string" description="Grid height. Required for virtualization." />
          <PropRow name="width" type="number | string" description="Grid width." />
          <PropRow name="rowHeight" type="number" description="Height of each row in pixels." />
          <PropRow name="headerHeight" type="number" description="Height of the header row." />
          <PropRow name="virtualized" type="boolean" description="Enable virtualized rendering." />
          <PropRow name="stickyHeader" type="boolean" description="Keep header visible while scrolling." />
          <PropRow name="onRowClick" type="(row: T, index: number) => void" description="Callback when row is clicked." />
          <PropRow name="onSort" type="(column, direction) => void" description="Callback when column is sorted." />
          <PropRow name="selectedRows" type="number[]" description="Indices of selected rows." />
          <PropRow name="onSelectionChange" type="(selectedRows: number[]) => void" description="Callback when selection changes." />
          <PropRow name="multiSelect" type="boolean" description="Allow multiple row selection." />
          <PropRow name="style" type="ViewStyle" description="Container style." />
          <PropRow name="headerStyle" type="ViewStyle" description="Header row style." />
          <PropRow name="cellStyle" type="ViewStyle" description="Default cell style." />
          <PropRow name="rowStyle" type="ViewStyle | ((row, index) => ViewStyle)" description="Row style or style function." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Complete Example
        </Text>

        <CodeBlock
          code={`import React, { useState } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { DataGrid } from '@idealyst/datagrid';
import type { Column } from '@idealyst/datagrid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    // ... more users
  ]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', width: 60, sortable: true },
    { key: 'name', header: 'Name', width: 150, sortable: true },
    { key: 'email', header: 'Email', width: 200 },
    {
      key: 'status',
      header: 'Status',
      width: 100,
      render: (value) => (
        <Text style={{ color: value === 'active' ? '#22c55e' : '#ef4444' }}>
          {value}
        </Text>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 80,
      render: (_, row) => (
        <Button size="sm" type="outlined" onPress={() => handleEdit(row)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleSort = (column: Column<User>, direction: 'asc' | 'desc') => {
    const sorted = [...users].sort((a, b) => {
      const aVal = a[column.key as keyof User];
      const bVal = b[column.key as keyof User];
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    setUsers(sorted);
  };

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDelete = () => {
    const newUsers = users.filter((_, index) => !selectedRows.includes(index));
    setUsers(newUsers);
    setSelectedRows([]);
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text typography="h3" weight="bold">Users</Text>
        {selectedRows.length > 0 && (
          <Button intent="danger" onPress={handleDelete}>
            Delete Selected ({selectedRows.length})
          </Button>
        )}
      </View>

      <DataGrid
        data={users}
        columns={columns}
        height={500}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        multiSelect={true}
        onSort={handleSort}
        stickyHeader={true}
        rowStyle={(_, index) => ({
          backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
        })}
      />
    </View>
  );
}`}
          language="tsx"
          title="User Management Table"
        />
      </View>
    </Screen>
  );
}

function PropRow({
  name,
  type,
  description,
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 160 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace' }}>
          {name}
          {required && <Text color="danger">*</Text>}
        </Text>
      </View>
      <View style={{ width: 220 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}

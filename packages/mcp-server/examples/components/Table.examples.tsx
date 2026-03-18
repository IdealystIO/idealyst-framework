/**
 * Table Component Examples
 *
 * These examples are type-checked against the actual TableProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Table, View, Text, Badge, Icon, type TableColumn } from '@idealyst/components';

// ============================================================================
// Example 1: Basic Table
// ============================================================================

interface User {
  name: string;
  role: string;
  status: string;
}

const users: User[] = [
  { name: 'Alice', role: 'Admin', status: 'Active' },
  { name: 'Bob', role: 'Editor', status: 'Inactive' },
  { name: 'Carol', role: 'Viewer', status: 'Active' },
];

export function BasicTable() {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  return <Table columns={columns} data={users} />;
}

// ============================================================================
// Example 2: Custom Cell Rendering
// ============================================================================

export function CustomCellRendering() {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value: string) => (
        <Badge intent={value === 'Active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      ),
    },
  ];

  return <Table columns={columns} data={users} />;
}

// ============================================================================
// Example 3: Custom Column Titles (ReactNode)
// ============================================================================

export function CustomColumnTitles() {
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      title: (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="account" size="sm" />
          <Text weight="semibold">Name</Text>
        </View>
      ),
      dataIndex: 'name',
    },
    {
      key: 'role',
      title: (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="shield" size="sm" />
          <Text weight="semibold">Role</Text>
        </View>
      ),
      dataIndex: 'role',
    },
    {
      key: 'status',
      title: (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="circle" size="sm" />
          <Text weight="semibold">Status</Text>
        </View>
      ),
      dataIndex: 'status',
    },
  ];

  return <Table columns={columns} data={users} />;
}

// ============================================================================
// Example 4: Footer with Static Content
// ============================================================================

interface Product {
  name: string;
  quantity: number;
  price: number;
}

const products: Product[] = [
  { name: 'Widget A', quantity: 10, price: 29.99 },
  { name: 'Widget B', quantity: 5, price: 49.99 },
  { name: 'Widget C', quantity: 20, price: 9.99 },
];

export function FooterStatic() {
  const columns: TableColumn<Product>[] = [
    { key: 'name', title: 'Product', dataIndex: 'name', footer: 'Total' },
    {
      key: 'quantity',
      title: 'Qty',
      dataIndex: 'quantity',
      align: 'right',
      footer: (data) => {
        const total = data.reduce((sum, row) => sum + row.quantity, 0);
        return <Text weight="bold">{String(total)}</Text>;
      },
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      render: (value: number) => `$${value.toFixed(2)}`,
      footer: (data) => {
        const total = data.reduce((sum, row) => sum + row.price * row.quantity, 0);
        return <Text weight="bold">${total.toFixed(2)}</Text>;
      },
    },
  ];

  return <Table columns={columns} data={products} type="bordered" />;
}

// ============================================================================
// Example 5: Footer with Computed Callback
// ============================================================================

export function FooterComputed() {
  const columns: TableColumn<Product>[] = [
    { key: 'name', title: 'Item', dataIndex: 'name', footer: `${products.length} items` },
    {
      key: 'quantity',
      title: 'Stock',
      dataIndex: 'quantity',
      align: 'right',
      footer: (data) => {
        const avg = data.reduce((sum, r) => sum + r.quantity, 0) / data.length;
        return `Avg: ${avg.toFixed(1)}`;
      },
    },
    {
      key: 'price',
      title: 'Unit Price',
      dataIndex: 'price',
      align: 'right',
      render: (value: number) => `$${value.toFixed(2)}`,
      footer: (data) => {
        const avg = data.reduce((sum, r) => sum + r.price, 0) / data.length;
        return `Avg: $${avg.toFixed(2)}`;
      },
    },
  ];

  return <Table columns={columns} data={products} type="striped" />;
}

// ============================================================================
// Example 6: Table Variants
// ============================================================================

export function TableVariants() {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
  ];

  return (
    <View gap="lg">
      <Table columns={columns} data={users} type="standard" />
      <Table columns={columns} data={users} type="bordered" />
      <Table columns={columns} data={users} type="striped" />
    </View>
  );
}

// ============================================================================
// Example 7: Clickable Rows
// ============================================================================

export function ClickableRows() {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      onRowPress={(row, index) => console.log('Pressed row', index, row)}
    />
  );
}

// ============================================================================
// Example 8: Column Alignment
// ============================================================================

export function ColumnAlignment() {
  const columns: TableColumn<Product>[] = [
    { key: 'name', title: 'Product', dataIndex: 'name', align: 'left' },
    { key: 'quantity', title: 'Qty', dataIndex: 'quantity', align: 'center' },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
  ];

  return <Table columns={columns} data={products} type="bordered" />;
}

import React from 'react';
import { Screen, View, Text, Badge, Button } from '@idealyst/components';
import Table from '../Table';
import type { TableColumn } from '../Table/types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export const TableExamples: React.FC = () => {
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'active' },
  ];

  const products: Product[] = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15 },
    { id: 2, name: 'Mouse', category: 'Electronics', price: 29.99, stock: 150 },
    { id: 3, name: 'Keyboard', category: 'Electronics', price: 79.99, stock: 75 },
    { id: 4, name: 'Monitor', category: 'Electronics', price: 299.99, stock: 30 },
    { id: 5, name: 'Desk', category: 'Furniture', price: 399.99, stock: 10 },
  ];

  const userColumns: TableColumn<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      width: '200px',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      width: '120px',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '100px',
      render: (status: string) => (
        <Badge
          variant="filled"
          color={status === 'active' ? 'success' : 'neutral'}
        >
          {status}
        </Badge>
      ),
    },
  ];

  const productColumns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Product',
      dataIndex: 'name',
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      width: '150px',
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      width: '120px',
      align: 'right',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      key: 'stock',
      title: 'Stock',
      dataIndex: 'stock',
      width: '100px',
      align: 'center',
      render: (stock: number) => (
        <Badge
          variant="filled"
          color={stock > 50 ? 'success' : stock > 20 ? 'warning' : 'error'}
        >
          {stock}
        </Badge>
      ),
    },
  ];

  const actionColumns: TableColumn<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '200px',
      render: (_, user) => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button size="sm" variant="outlined" onPress={() => console.log('Edit', user.id)}>
            Edit
          </Button>
          <Button size="sm" variant="outlined" intent="error" onPress={() => console.log('Delete', user.id)}>
            Delete
          </Button>
        </View>
      ),
    },
  ];

  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Table Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Table</Text>
        <Table columns={userColumns} data={users} />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Variants</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="sm" weight="medium">Default</Text>
            <Table
              columns={userColumns}
              data={users}
              variant="default"
            />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Bordered</Text>
            <Table
              columns={userColumns}
              data={users}
              variant="bordered"
            />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Striped</Text>
            <Table
              columns={userColumns}
              data={users}
              variant="striped"
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="sm" weight="medium">Small</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="sm"
              variant="bordered"
            />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Medium (default)</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="md"
              variant="bordered"
            />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Large</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="lg"
              variant="bordered"
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Custom Rendering</Text>
        <Table columns={productColumns} data={products} variant="striped" />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Clickable Rows</Text>
        <Table
          columns={userColumns}
          data={users}
          variant="bordered"
          onRowPress={(user) => console.log('Clicked user:', user)}
        />
        <Text size="sm" color="secondary">
          Click any row to see console output
        </Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Actions</Text>
        <Table
          columns={actionColumns}
          data={users}
          variant="bordered"
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Column Alignment</Text>
        <Table
          columns={[
            { key: 'name', title: 'Product', dataIndex: 'name', align: 'left' },
            { key: 'category', title: 'Category', dataIndex: 'category', align: 'center', width: '150px' },
            { key: 'price', title: 'Price', dataIndex: 'price', align: 'right', width: '120px', render: (price: number) => `$${price.toFixed(2)}` },
          ]}
          data={products.slice(0, 3)}
          variant="bordered"
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Fixed Column Widths</Text>
        <Table
          columns={[
            { key: 'id', title: 'ID', dataIndex: 'id', width: '60px' },
            { key: 'name', title: 'Name', dataIndex: 'name', width: '200px' },
            { key: 'email', title: 'Email', dataIndex: 'email' },
            { key: 'role', title: 'Role', dataIndex: 'role', width: '120px' },
          ]}
          data={users}
          variant="bordered"
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Empty Table</Text>
        <Table
          columns={userColumns}
          data={[]}
          variant="bordered"
        />
        <Text size="sm" color="secondary">
          No data to display
        </Text>
      </View>
    </View>
    </Screen>
  );
};

export default TableExamples;

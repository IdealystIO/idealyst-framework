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
          type="filled"
          color={status === 'active' ? 'green' : 'gray'}
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
          type="filled"
          color={stock > 50 ? 'green' : stock > 20 ? 'yellow' : 'red'}
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
          <Button size="sm" type="outlined" onPress={() => console.log('Edit', user.id)}>
            Edit
          </Button>
          <Button size="sm" type="outlined" intent="danger" onPress={() => console.log('Delete', user.id)}>
            Delete
          </Button>
        </View>
      ),
    },
  ];

  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">Table Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic Table</Text>
        <Table columns={userColumns} data={users} />
      </View>

      <View gap="md">
        <Text typography="h5">Variants</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Default</Text>
            <Table
              columns={userColumns}
              data={users}
              type="standard"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Bordered</Text>
            <Table
              columns={userColumns}
              data={users}
              type="bordered"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Striped</Text>
            <Table
              columns={userColumns}
              data={users}
              type="striped"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Small</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="sm"
              type="bordered"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Medium (default)</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="md"
              type="bordered"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Large</Text>
            <Table
              columns={userColumns}
              data={users.slice(0, 2)}
              size="lg"
              type="bordered"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Custom Rendering</Text>
        <Table columns={productColumns} data={products} type="striped" />
      </View>

      <View gap="md">
        <Text typography="h5">Clickable Rows</Text>
        <Table
          columns={userColumns}
          data={users}
          type="bordered"
          onRowPress={(user) => console.log('Clicked user:', user)}
        />
        <Text typography="caption" color="secondary">
          Click any row to see console output
        </Text>
      </View>

      <View gap="md">
        <Text typography="h5">With Actions</Text>
        <Table
          columns={actionColumns}
          data={users}
          type="bordered"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Column Alignment</Text>
        <Table
          columns={[
            { key: 'name', title: 'Product', dataIndex: 'name', align: 'left' },
            { key: 'category', title: 'Category', dataIndex: 'category', align: 'center', width: '150px' },
            { key: 'price', title: 'Price', dataIndex: 'price', align: 'right', width: '120px', render: (price: number) => `$${price.toFixed(2)}` },
          ]}
          data={products.slice(0, 3)}
          type="bordered"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Fixed Column Widths</Text>
        <Table
          columns={[
            { key: 'id', title: 'ID', dataIndex: 'id', width: '60px' },
            { key: 'name', title: 'Name', dataIndex: 'name', width: '200px' },
            { key: 'email', title: 'Email', dataIndex: 'email' },
            { key: 'role', title: 'Role', dataIndex: 'role', width: '120px' },
          ]}
          data={users}
          type="bordered"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Empty Table</Text>
        <Table
          columns={userColumns}
          data={[]}
          type="bordered"
        />
        <Text typography="caption" color="secondary">
          No data to display
        </Text>
      </View>
    </View>
    </Screen>
  );
};

export default TableExamples;

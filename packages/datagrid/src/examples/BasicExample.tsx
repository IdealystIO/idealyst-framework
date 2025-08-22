import React, { useState } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { DataGrid } from '../DataGrid';
import type { Column } from '../DataGrid/types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'inactive', joinDate: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', joinDate: '2023-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'active', joinDate: '2023-05-12' },
  // Add more sample data for testing virtualization
  ...Array.from({ length: 95 }, (_, i) => ({
    id: i + 6,
    name: `User ${i + 6}`,
    email: `user${i + 6}@example.com`,
    role: 'User',
    status: (i % 2 === 0 ? 'active' : 'inactive') as 'active' | 'inactive',
    joinDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  })),
];

export function BasicExample() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [data, setData] = useState(sampleData);

  const columns: Column<User>[] = [
    { 
      key: 'id', 
      header: 'ID', 
      width: 60,
      sortable: true,
    },
    { 
      key: 'name', 
      header: 'Name', 
      width: 150,
      sortable: true,
    },
    { 
      key: 'email', 
      header: 'Email', 
      width: 200,
    },
    { 
      key: 'role', 
      header: 'Role', 
      width: 100,
      render: (value) => (
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <Text size="small">{value}</Text>
        </View>
      ),
    },
    { 
      key: 'status', 
      header: 'Status', 
      width: 100,
      render: (value) => (
        <Text 
          size="small" 
          weight="medium"
          style={{ color: value === 'active' ? '#22c55e' : '#ef4444' }}
        >
          {value}
        </Text>
      ),
    },
    { 
      key: 'joinDate', 
      header: 'Join Date', 
      width: 120,
      sortable: true,
    },
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
    <View spacing="lg" style={{ padding: 20 }}>
      <Text size="xlarge" weight="bold">DataGrid Example</Text>
      
      <View spacing="sm">
        <Text>Selected rows: {selectedRows.length}</Text>
        {selectedRows.length > 0 && (
          <Button 
            size="small" 
            variant="outlined"
            onPress={() => setSelectedRows([])}
          >
            Clear Selection
          </Button>
        )}
      </View>

      <DataGrid
        data={data}
        columns={columns}
        height={500}
        virtualized={false}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        multiSelect={true}
        onSort={handleSort}
        rowStyle={(row, index) => ({
          backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
        })}
      />
    </View>
  );
}
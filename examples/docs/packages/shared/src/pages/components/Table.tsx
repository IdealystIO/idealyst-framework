import React from 'react';
import { View, Text, Table, Screen } from '@idealyst/components';
import { ComponentPlayground, tablePropConfig } from '../../components/ComponentPlayground';

// Demo wrapper with sample data
function DemoTable(props: any) {
  const columns = [
    { key: 'name', title: 'Name', width: 120 },
    { key: 'role', title: 'Role', width: 100 },
    { key: 'status', title: 'Status', width: 80 },
  ];
  const data = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Bob Wilson', role: 'Manager', status: 'Away' },
  ];
  return <Table {...props} columns={columns} data={data} />;
}

export function TablePage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Table
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Data display component for structured tabular content.
          Supports sticky headers, row selection, and custom cell rendering.
        </Text>

        <ComponentPlayground
          component={DemoTable}
          componentName="Table"
          propConfig={tablePropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
